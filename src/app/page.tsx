'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-8 text-center">
      <motion.h1
        className="text-black text-2xl md:text-4xl font-bold text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Bem-vindo ao Portal Urgência Segura
      </motion.h1>

      <motion.p
        className="text-black text-base md:text-lg mt-4 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Este portal é exclusivo para agentes da Guarda Municipal e da Defesa Civil.
        Acesse seu painel para visualizar e responder às ocorrências de urgência.
      </motion.p>
      
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/login')}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg cursor-pointer transition-colors"
        >
          Entrar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/register')}
          className="bg-white border border-blue-700 text-blue-700 hover:bg-blue-100 font-semibold py-3 px-6 rounded-2xl shadow-lg cursor-pointer transition-colors"
        >
          Cadastrar-se
        </motion.button>
      </motion.div>
    </main>
  );
}
