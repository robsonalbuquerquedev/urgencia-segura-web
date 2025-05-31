'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  role: 'SAMU' | 'Defesa Civil';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  const login = async (email: string, senha: string) => {
    // Simula autenticação verificando se o usuário foi registrado
    const foundUser = registeredUsers.find((u) => u.name === email);

    if (foundUser && senha === '123456') { // senha fixa só para exemplo
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (newUser: User) => {
    setRegisteredUsers([...registeredUsers, newUser]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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
