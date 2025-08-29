"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProductDescriptionGenerator from '@/components/ProductDescriptionGenerator';

export default function DashboardPage() {
  const { isAuthenticated, user, logout, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    // Render nothing or a loading spinner while redirecting
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 font-bold text-white bg-red-500 rounded-md"
          >
            Logout
          </button>
        </div>
        <div className="text-center">
          <p>Welcome, {user?.email || 'User'}!</p>
          <p className="font-bold text-lg">Credits: {user?.credits ?? '...'}</p>
        </div>
        <ProductDescriptionGenerator onGenerationSuccess={refreshUser} />
      </div>
    </div>
  );
}
