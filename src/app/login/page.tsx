'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function LoginPage() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const sucesso = await login(email, senha);
    if (sucesso) {
      router.push('/');
    } else {
      alert('Login inválido!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D5EAF7]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-[#264D73]">Login</h2>

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

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 cursor-pointer transition-colors"
        >
          Entrar
        </button>

        {/* Links abaixo do botão */}
        <div className="flex justify-between mt-4 text-sm text-blue-700">
          <button
            type="button"
            className="underline cursor-pointer"
            onClick={() => router.push('/register')}
          >
            Cadastre-se
          </button>
          <button
            type="button"
            className="underline cursor-pointer"
            onClick={() => alert('Função de recuperação de senha ainda não implementada')}
          >
            Esqueci a senha
          </button>
        </div>
      </form>
    </div>
  );
}
