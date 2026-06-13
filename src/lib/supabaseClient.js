import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export const getSupabase = async () => {
  if (supabaseInstance) return supabaseInstance;
  const supabaseUrl = 'https://xlyfyqjmzwyyoqurvuzx.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhseWZ5cWptend5eW9xdXJ2dXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MjgxOTQsImV4cCI6MjA5NjMwNDE5NH0.4CXU3ksfCGfIA77-sFXebWi-hjDVjCsT-UdrMXYFLEM';
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'vedicmind-auth',
      storage: window.localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    }
  });
  return supabaseInstance;
};