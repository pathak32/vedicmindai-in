import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useVedicAuth } from '@/lib/VedicAuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useVedicAuth();

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

  return <Outlet />;
}