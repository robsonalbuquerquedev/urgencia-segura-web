'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function RegisterPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
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

        {/* Campo Email com ícone */}
        <div className="flex items-center border rounded p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
          <FaEnvelope className="text-gray-400 mr-2" />
          <input
            type="email"
            placeholder="Digite seu email"
            className="w-full outline-none placeholder:text-gray-400 placeholder:font-medium"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo Senha com ícone e mostrar/ocultar */}
        <div className="flex items-center border rounded p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
          <FaLock className="text-gray-400 mr-2" />
          <input
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Digite sua senha"
            className="w-full outline-none placeholder:text-gray-400 placeholder:font-medium"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="ml-2 focus:outline-none"
          >
            {mostrarSenha ? (
              <AiFillEyeInvisible className="text-gray-500" />
            ) : (
              <AiFillEye className="text-gray-500" />
            )}
          </button>
        </div>

        {/* Campo Role com ícone */}
        <div className="flex items-center border rounded p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500">
          <FaUserShield className="text-gray-400 mr-2" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'SAMU' | 'Defesa Civil')}
            className="w-full outline-none text-gray-700 font-medium"
          >
            <option value="SAMU">SAMU</option>
            <option value="Defesa Civil">Defesa Civil</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 cursor-pointer transition-colors"
        >
          Cadastrar
        </button>

        {/* Link para Login */}
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-blue-700 underline text-sm cursor-pointer"
            onClick={() => router.push('/login')}
          >
            Já tem conta? Faça login
          </button>
        </div>
      </form>
    </div>
  );
}
