'use client';

import { useEffect, useState } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    FaUser,
    FaBirthdayCake,
    FaStickyNote,
    FaExclamationTriangle,
    FaCalendarAlt,
    FaWhatsapp,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaBuilding,
    FaListUl
} from 'react-icons/fa';

interface Urgencia {
    nome: string;
    idade: string;
    observacao: string;
    tipoUrgencia: string;
    dataHora: string;
    localizacao: string;
    celular: string;
    orgao: string;
    uid?: string;
}

export default function PainelPage() {
    const [urgencias, setUrgencias] = useState<Urgencia[]>([]);
    const [carregado, setCarregado] = useState(false);
    const [filtroOrgao, setFiltroOrgao] = useState<string>('');
    const [filtroTipo, setFiltroTipo] = useState<string>('');
    const [filtroData, setFiltroData] = useState<string>('');
    const [filtroNome, setFiltroNome] = useState<string>('');

    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        const urgenciasRef = ref(database, 'urgencias');

        const unsubscribe = onValue(urgenciasRef, (snapshot) => {
            const data = snapshot.val();
            const todasUrgencias: Urgencia[] = [];

            if (data) {
                Object.entries(data).forEach(([uid, urgenciasPorUsuario]) => {
                    if (typeof urgenciasPorUsuario === 'object' && urgenciasPorUsuario !== null) {
                        Object.entries(urgenciasPorUsuario as Record<string, Urgencia>).forEach(
                            ([, urgencia]) => {
                                if (
                                    urgencia &&
                                    urgencia.nome &&
                                    urgencia.dataHora &&
                                    urgencia.tipoUrgencia
                                ) {
                                    todasUrgencias.push({ ...urgencia, uid });
                                }
                            }
                        );
                    }
                });
            }

            console.log("Urgências carregadas:", todasUrgencias);
            setUrgencias(todasUrgencias);
            setCarregado(true);
        });

        return () => {
            // remove o listener para evitar vazamento de memória
            unsubscribe();
        };
    }, [user, router]);

    const formatarDataParaInput = (dataHora: string | undefined) => {
        if (!dataHora || typeof dataHora !== 'string' || !dataHora.includes('/')) return '';
        const [data] = dataHora.split(' ');
        const [dia, mes, ano] = data.split('/');
        if (!dia || !mes || !ano) return '';
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    };

    const tiposDisponiveis = [
        ...new Set(
            urgencias
                .filter((u) => !filtroOrgao || u.orgao === filtroOrgao)
                .map((u) => u.tipoUrgencia)
        ),
    ];

    const urgenciasFiltradas = urgencias.filter((item) => {
        const dataValida = filtroData
            ? formatarDataParaInput(item.dataHora) === filtroData
            : true;

        const tipoValido = filtroTipo
            ? item.tipoUrgencia === filtroTipo
            : true;

        const orgaoValido = filtroOrgao
            ? item.orgao === filtroOrgao
            : true;

        const nomeValido = filtroNome
            ? item.nome.toLowerCase().includes(filtroNome.toLowerCase())
            : true;

        return dataValida && tipoValido && orgaoValido && nomeValido;
    });

    return (
        <div className="p-6 bg-[#D5EAF7] rounded-lg shadow-lg max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-8 text-[#000000] text-center">
                Solicitações de Urgência
            </h1>

            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">

                <div className="flex flex-col">
                    <label className="mb-1 text-[#264D73] font-semibold">Selecione a Data</label>
                    <div className="flex items-center border border-[#264D73] rounded p-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white relative">

                        {/* Ícone */}
                        <FaCalendarAlt className="text-gray-500 mr-2 z-10" />

                        {/* Placeholder visual em formato brasileiro */}
                        {!filtroData && (
                            <span
                                className="absolute left-9 text-gray-400 font-medium pointer-events-none z-10"
                                style={{ top: '50%', transform: 'translateY(-50%)' }}
                            >
                                dd/mm/aaaa
                            </span>
                        )}

                        {/* Campo de data */}
                        <input
                            type="date"
                            className="w-full outline-none text-[#000000] font-semibold bg-transparent relative z-20"
                            value={filtroData}
                            onChange={(e) => setFiltroData(e.target.value)}
                            style={{
                                // Força transparência total para manter o span visível
                                color: filtroData ? "#000000" : "transparent",
                                caretColor: "#000000",
                            }}
                        />
                    </div>
                </div>

                {/* Campo Nome com Label e Ícone */}
                <div className="flex flex-col">
                    <label className="mb-1 text-[#264D73] font-semibold">Buscar por Nome</label>
                    <div className="flex items-center border border-[#264D73] rounded p-2 bg-white">
                        <FaUser className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            className="w-full outline-none text-[#000000] font-semibold bg-transparent"
                            placeholder="Digite o nome"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                </div>

                {/* Campo Órgão com Label e Ícone */}
                <div className="flex flex-col">
                    <label className="mb-1 text-[#264D73] font-semibold">Selecione o Órgão</label>
                    <div className="flex items-center border border-[#264D73] rounded p-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                        <FaBuilding className="text-gray-500 mr-2" />
                        <select
                            className="w-full outline-none text-[#000000] font-semibold bg-transparent"
                            value={filtroOrgao}
                            onChange={(e) => {
                                setFiltroOrgao(e.target.value);
                                setFiltroTipo('');
                            }}
                        >
                            <option value="">Todos os Órgãos</option>
                            <option value="SAMU">SAMU</option>
                            <option value="Defesa Civil">Defesa Civil</option>
                        </select>
                    </div>
                </div>

                {/* Campo Tipo (condicional) com Label e Ícone */}
                {filtroOrgao && (
                    <div className="flex flex-col">
                        <label className="mb-1 text-[#264D73] font-semibold">Selecione o Tipo</label>
                        <div className="flex items-center border border-[#264D73] rounded p-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                            <FaListUl className="text-gray-500 mr-2" />
                            <select
                                className="w-full outline-none text-[#000000] font-semibold bg-transparent"
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                            >
                                <option value="">Todos os Tipos</option>
                                {tiposDisponiveis.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                        {tipo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {carregado ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {urgenciasFiltradas.length > 0 ? (
                        urgenciasFiltradas.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#49A6E9] flex flex-col"
                            >
                                <div className="flex justify-between mb-3 items-center">
                                    <span className="font-semibold text-[#264D73] flex items-center gap-1">
                                        <FaUser /> Nome:
                                    </span>
                                    <span className="text-[#000000]">{item.nome}</span>
                                </div>
                                <div className="flex justify-between mb-3 items-center">
                                    <span className="font-semibold text-[#264D73] flex items-center gap-1">
                                        <FaBirthdayCake /> Idade:
                                    </span>
                                    <span className="text-[#000000]">{item.idade}</span>
                                </div>
                                <div className="flex justify-between mb-3 items-center">
                                    <span className="font-semibold text-[#264D73]">Celular:</span>
                                    <div className="flex gap-4 items-center">
                                        <a
                                            href={`https://wa.me/55${item.celular.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 font-semibold hover:underline flex items-center gap-1"
                                            aria-label="Enviar mensagem no WhatsApp"
                                            title={item.celular}
                                        >
                                            <FaWhatsapp size={18} />
                                            WhatsApp
                                        </a>
                                        <a
                                            href={`tel:+55${item.celular.replace(/\D/g, '')}`}
                                            className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                                            aria-label="Ligar para o número"
                                            title={item.celular}
                                        >
                                            <FaPhoneAlt size={18} />
                                            Ligar
                                        </a>
                                    </div>
                                </div>
                                <div className="flex justify-between mb-3 items-center">
                                    <span className="font-semibold text-[#264D73] flex items-center gap-1">
                                        <FaStickyNote /> Observação:
                                    </span>
                                    <span className="text-[#000000]">{item.observacao}</span>
                                </div>
                                <div className="flex justify-between mb-3 items-center">
                                    <span className="font-semibold text-[#264D73] flex items-center gap-1">
                                        <FaExclamationTriangle /> Tipo de Urgência:
                                    </span>
                                    <span className="text-[#000000]">{item.tipoUrgencia}</span>
                                </div>
                                <div className="flex justify-between mb-3 items-center">
                                    <span className="font-semibold text-[#264D73] flex items-center gap-1">
                                        <FaCalendarAlt /> Data e Hora:
                                    </span>
                                    <span className="text-[#000000]">{item.dataHora}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-[#264D73] flex items-center gap-1">
                                        <FaMapMarkerAlt />
                                        Localização:
                                    </span>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${item.localizacao}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                        title="Abrir localização no Google Maps"
                                    >
                                        {item.localizacao}
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-[#264D73]">Nenhuma urgência encontrada.</p>
                    )}
                </div>
            ) : (
                <p className="text-center text-[#264D73]">Carregando urgências...</p>
            )}
        </div>
    );
}
