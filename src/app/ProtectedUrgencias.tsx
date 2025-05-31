'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import UrgenciasList from './components/UrgenciasList';

export default function ProtectedUrgencias() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#D5EAF7FF] p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-10 text-[#264D73FF]">
        Portal Urgência Segura
      </h1>
      <UrgenciasList />
    </main>
  );
}
