import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useVedicAuth } from '@/lib/VedicAuthContext';

export default function ProtectedRoute() {
  const { user, loading, profile } = useVedicAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-[#F0F4FF] border-t-[#0A1628] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Accounts of users under 18 stay on the consent page until a parent confirms.
  if (profile?.consent_required && !profile?.parental_consent_at && location.pathname !== '/consent') {
    return <Navigate to="/consent" replace />;
  }

  return <Outlet />;
}