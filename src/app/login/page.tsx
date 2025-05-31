'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
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
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 cursor-pointer"
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
