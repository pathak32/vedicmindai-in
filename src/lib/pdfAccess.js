import { getSupabase } from '@/lib/supabaseClient';
import { getUserPlan } from '@/lib/planEngine';

// Plans that download the level PDFs directly. Everyone else asks the admin, who approves
// or rejects each request per student and level (table: pdf_download_requests).
export const PDF_DIRECT_PLANS = ['pro', 'family'];

export function hasDirectPdfAccess(user) {
  if (user?.app_metadata?.role === 'admin') return true;
  return PDF_DIRECT_PLANS.includes(getUserPlan());
}

// Returns { status: 'none' | 'pending' | 'approved' | 'rejected' }, or { status: 'unavailable' }
// when the requests table has not been created yet.
export async function getPdfRequestStatus(userId, level) {
  try {
    const sb = await getSupabase();
    const { data, error } = await sb.from('pdf_download_requests')
      .select('status').eq('user_id', userId).eq('level', level).maybeSingle();
    if (error) return { status: 'unavailable' };
    return { status: data?.status || 'none' };
  } catch {
    return { status: 'unavailable' };
  }
}

// Creates the request, or re-opens a rejected one. Returns the new status.
export async function requestPdfAccess(userId, level, currentStatus) {
  const sb = await getSupabase();
  const { error } = currentStatus === 'rejected'
    ? await sb.from('pdf_download_requests').update({ status: 'pending', decided_at: null }).eq('user_id', userId).eq('level', level)
    : await sb.from('pdf_download_requests').insert({ user_id: userId, level, status: 'pending' });
  if (error) throw error;
  return 'pending';
}
