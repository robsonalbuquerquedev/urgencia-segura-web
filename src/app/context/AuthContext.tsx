'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../lib/firebase';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'SAMU' | 'Defesa Civil';
};

type AuthContextType = {
  user: User | null;
  loading: boolean; // << ADICIONADO AQUI
  login: (email: string, senha: string) => Promise<boolean>;
  register: (
    email: string,
    senha: string,
    name: string,
    role: 'SAMU' | 'Defesa Civil'
  ) => Promise<void>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // << AQUI

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snapshot = await get(ref(database, `usuarios_web/${firebaseUser.uid}`));
        const userData = snapshot.val();

        if (userData) {
          setUser({
            id: firebaseUser.uid,
            name: userData.name,
            email: firebaseUser.email || '',
            role: userData.role
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false); // << GARANTE QUE SÓ PARA DE CARREGAR DEPOIS DO ESTADO DEFINIDO
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (
    email: string,
    senha: string,
    name: string,
    role: 'SAMU' | 'Defesa Civil'
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const firebaseUser = userCredential.user;

    const userData: User = {
      id: firebaseUser.uid,
      name,
      email,
      role
    };

    await set(ref(database, `usuarios_web/${firebaseUser.uid}`), userData);
    setUser(userData);
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Erro ao enviar email de redefinição de senha:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, sendPasswordResetEmail }}
    >
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
