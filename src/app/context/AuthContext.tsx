'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';
import { auth, database } from '../lib/firebase';
import { get, set, ref as dbRef } from 'firebase/database';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  register: (email: string, senha: string, nome: string, role: string) => Promise<boolean>; // <-- Adiciona aqui
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const sendPasswordReset = async (email: string) => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail de redefinição:', error);
    return false;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snapshot = await get(dbRef(database, `usuarios_web/${firebaseUser.uid}`));
          const userData = snapshot.val();

          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email || '',
            email: firebaseUser.email || '',
            role: userData?.role || '', // <- pega o role
          });
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, senha: string, nome: string, role: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const firebaseUser = userCredential.user;

      // Atualiza o nome no perfil do Firebase Auth
      await updateProfile(firebaseUser, { displayName: nome });

      // Salva dados adicionais no Realtime Database
      await set(dbRef(database, `usuarios_web/${firebaseUser.uid}`), {
        email,
        name: nome,
        role,
        uid: firebaseUser.uid,
      });

      // Define o usuário localmente com o role incluído
      setUser({
        id: firebaseUser.uid,
        name: nome,
        email,
        role,
      });

      return true;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return false;
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      return true;
    } catch (error) {
      console.error('Erro ao logar:', error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, sendPasswordResetEmail: sendPasswordReset, register,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
