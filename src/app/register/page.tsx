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
  const [name, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<'Guarda Municipal' | 'Defesa Civil'>('Guarda Municipal');
  // Se quiser capturar o nome real, descomente e adicione campo no formulário:
  // const [name, setName] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Passando email, senha, nome (usando email como nome provisório) e role
      await register(email, senha, name, role);
      router.push('/login');
    } catch (error) {
      alert('Erro ao registrar. Tente novamente.');
      console.error('Erro no registro:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D5EAF7]">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-[#264D73]">Cadastro</h2>

        {/* Campo Email com ícone */}
        <div className="flex items-center border border-gray-300 rounded p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
          <FaEnvelope className="text-gray-500 mr-2" />
          <input
            type="email"
            placeholder="Digite seu email"
            className="w-full bg-white text-black placeholder:text-black placeholder:font-normal font-medium outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Campo Nome */}
        <div className="flex items-center border border-gray-300 rounded p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
          <FaUserShield className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Digite seu nome"
            className="w-full bg-white text-black placeholder:text-black placeholder:font-normal font-medium outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Campo Senha com ícone e mostrar/ocultar */}
        <div className="flex items-center border border-gray-300 rounded p-2 mb-4 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
          <FaLock className="text-gray-500 mr-2" />
          <input
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Digite sua senha"
            className="w-full bg-white text-black placeholder:text-black placeholder:font-normal font-medium outline-none"
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
            onChange={(e) => setRole(e.target.value as 'Guarda Municipal' | 'Defesa Civil')}
            className="w-full outline-none text-gray-700 font-medium"
          >
            <option value="Guarda Municipal">Guarda Municipal</option>
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
