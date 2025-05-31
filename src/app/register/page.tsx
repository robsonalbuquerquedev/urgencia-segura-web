'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<'SAMU' | 'Defesa Civil'>('SAMU');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    register({
      id: Date.now().toString(),
      name: email,
      role: role,
    });

    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D5EAF7]">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-[#264D73]">Cadastro</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-4 border rounded"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'SAMU' | 'Defesa Civil')}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="SAMU">SAMU</option>
          <option value="Defesa Civil">Defesa Civil</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 cursor-pointer"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
