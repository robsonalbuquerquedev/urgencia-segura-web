'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

export default function LoginPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [emailRedefinir, setEmailRedefinir] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const router = useRouter();
  const { login, sendPasswordResetEmail } = useAuth();

  const abrirModal = () => {
    setEmailRedefinir('');
    setMensagemSucesso('');
    setMensagemErro('');
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const enviarRedefinicaoSenha = async () => {
    if (!emailRedefinir) {
      setMensagemErro('Por favor, insira um e-mail.');
      setMensagemSucesso('');
      return;
    }

    try {
      await sendPasswordResetEmail(emailRedefinir);
      setMensagemSucesso('E-mail enviado! Verifique sua caixa de entrada.');
      setMensagemErro('');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error); // Aqui você usa o error
      setMensagemErro('Erro ao enviar o e-mail. Verifique o endereço e tente novamente.');
      setMensagemSucesso('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const sucesso = await login(email, senha);

      if (sucesso) {
        router.push('/painel');
      } else {
        setErro('Email ou senha inválidos!');
      }
    } catch (error) {
      setErro('Erro ao tentar fazer login. Tente novamente.');
      console.error('Erro no login:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D5EAF7]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-[#264D73]">Login</h2>

        {/* Mensagem de erro */}
        {erro && <p className="text-red-600 font-medium mb-4">{erro}</p>}

        {/* Campo Email */}
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

        {/* Campo Senha com mostrar/ocultar */}
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
            aria-label={mostrarSenha ? 'Esconder senha' : 'Mostrar senha'}
          >
            {mostrarSenha ? (
              <AiFillEyeInvisible className="text-gray-500" />
            ) : (
              <AiFillEye className="text-gray-500" />
            )}
          </button>
        </div>

        {/* Botão de login */}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 cursor-pointer transition-colors"
        >
          Entrar
        </button>

        {/* Links de cadastro e recuperação de senha */}
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
            onClick={abrirModal}
          >
            Esqueci a senha
          </button>
        </div>
      </form>

      {/* Modal de redefinição de senha */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h3 className="text-lg font-bold mb-4 text-[#264D73]">Redefinir senha</h3>

            <input
              type="email"
              placeholder="Digite seu email"
              className="w-full border rounded p-2 mb-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={emailRedefinir}
              onChange={(e) => setEmailRedefinir(e.target.value)}
            />

            {mensagemErro && <p className="text-red-600 mb-2">{mensagemErro}</p>}
            {mensagemSucesso && <p className="text-green-600 mb-2">{mensagemSucesso}</p>}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={fecharModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={enviarRedefinicaoSenha}
                className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 cursor-pointer transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
