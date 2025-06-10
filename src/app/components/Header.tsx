'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    const isPainel = pathname === '/painel';

    const handleClick = () => {
        if (isPainel) {
            logout();
            router.push('/login');
        } else {
            router.push('/');
        }
    };

    return (
        <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Urgência Segura</h1>
            <button
                onClick={handleClick}
                className="bg-white text-blue-700 px-3 py-1 rounded font-semibold hover:bg-gray-100 cursor-pointer transition-colors"
            >
                {isPainel ? '🚪 Sair' : '🏠 Home'}
            </button>
        </header>
    );
}
