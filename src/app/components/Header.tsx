'use client';

import Image from 'next/image';
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
            <div className="flex items-center gap-2">
                <Image
                    src="/urgenciasegura.png"
                    alt="Logo Urgência Segura"
                    width={40}
                    height={40}
                    className="rounded"
                />
                <h1 className="text-xl font-bold">Urgência Segura</h1>
            </div>
            <button
                onClick={handleClick}
                className="bg-white/10 text-white px-4 py-2 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/30 shadow-sm backdrop-blur-sm cursor-pointer"
            >
                {isPainel ? '🚪 Sair' : '🏠 Home'}
            </button>
        </header>
    );
}
