// Página protegida para administradores
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:4000/api/verify-admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('No tienes permisos para acceder a esta página.');
        }

        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (err: any) {
        setError(err.message);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200">
        <p className="text-3xl animate-pulse-light">Verificando permisos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-red-500">
        <p className="text-3xl animate-pulse-fade">Error: {error}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Redirigido si no es admin
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-200">
      <h1 className="text-center text-4xl font-bold text-white py-8">Panel de Administración</h1>
      <p className="text-center text-gray-400">Bienvenido, administrador.</p>
    </div>
  );
}
