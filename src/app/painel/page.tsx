'use client';

import { useEffect, useState } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue, update, ref as dbRef } from 'firebase/database';
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
    FaListUl,
    FaClock
} from 'react-icons/fa';
import { Urgencia } from '../../types/urgencia';
import ReportModalExport from '../components/ReportModalExport';

export default function PainelPage() {
    const [urgencias, setUrgencias] = useState<Urgencia[]>([]);
    const [carregado, setCarregado] = useState(false);
    const [filtroOrgao, setFiltroOrgao] = useState<string>('');
    const [filtroTipo, setFiltroTipo] = useState<string>('');
    const [filtroDataInicio, setFiltroDataInicio] = useState('');
    const [filtroDataFim, setFiltroDataFim] = useState('');
    const [filtroNome, setFiltroNome] = useState<string>('');
    const [filtroStatus, setFiltroStatus] = useState<string>(''); // 👈 novo estado

    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        setFiltroOrgao(user.role);

        const urgenciasRef = dbRef(database, 'urgencias');

        const unsubscribe = onValue(urgenciasRef, (snapshot) => {
            const data = snapshot.val();
            const urgenciasDoOrgao: Urgencia[] = [];

            if (data) {
                Object.entries(data).forEach(([uid, urgenciasPorUsuario]) => {
                    if (typeof urgenciasPorUsuario === 'object' && urgenciasPorUsuario !== null) {
                        Object.entries(urgenciasPorUsuario as Record<string, Urgencia>).forEach(
                            ([id, urgencia]) => {
                                if (
                                    urgencia &&
                                    urgencia.nome &&
                                    urgencia.dataHoraInicio &&
                                    urgencia.tipoUrgencia &&
                                    urgencia.orgao === user.role // <- aqui filtramos pelo órgão
                                ) {
                                    urgenciasDoOrgao.push({
                                        ...urgencia,
                                        dataHoraInicio: urgencia.dataHoraInicio,
                                        uid,
                                        id
                                    });
                                }
                            }
                        );
                    }
                });
            }

            console.log(`Urgências carregadas para ${user.role}:`, urgenciasDoOrgao);
            setUrgencias(urgenciasDoOrgao);
            setCarregado(true);
        });

        return () => {
            unsubscribe();
        };
    }, [user, router]);

    const formatarDataParaInput = (dataHoraInicio: string | undefined) => {
        if (!dataHoraInicio || typeof dataHoraInicio !== 'string' || !dataHoraInicio.includes('/')) return '';
        const [data] = dataHoraInicio.split(' ');
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
        const dataItem = formatarDataParaInput(item.dataHoraInicio);

        const dataValida =
            (!filtroDataInicio || dataItem >= filtroDataInicio) &&
            (!filtroDataFim || dataItem <= filtroDataFim);

        const tipoValido = filtroTipo
            ? item.tipoUrgencia === filtroTipo
            : true;

        const orgaoValido = filtroOrgao
            ? item.orgao === filtroOrgao
            : true;

        const nomeValido = filtroNome
            ? item.nome.toLowerCase().includes(filtroNome.toLowerCase())
            : true;

        const statusValido = filtroStatus
            ? item.status === filtroStatus
            : true;

        return dataValida && tipoValido && orgaoValido && nomeValido && statusValido;
    });

    const atualizarStatus = async (
        uid: string | undefined,
        id: string | undefined,
        novoStatus: string
    ) => {
        if (!uid || !id) return;

        const caminho = `urgencias/${uid}/${id}`;
        const updates: Record<string, unknown> = {
            status: novoStatus,
        };

        if (novoStatus === "concluido") {
            const agora = new Date();
            const dataHoraFim = agora.toLocaleString("pt-BR", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
            updates.dataHoraFim = dataHoraFim;
        } else {
            updates.dataHoraFim = null;
        }

        try {
            await update(ref(database, caminho), updates);
            console.log("Status atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar o status:", error);
        }
    };

    return (
        <div className="p-6 bg-[#D5EAF7] rounded-lg shadow-lg max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-8 text-[#000000] text-center">
                Solicitações de Urgência
            </h1>

            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center flex-wrap">

                {/* Campo de data de início */}
                <div className="flex flex-col w-64">
                    <label className="mb-1 text-[#264D73] font-semibold">Data Início</label>
                    <div className="flex items-center border border-[#264D73] rounded p-2 bg-white relative focus-within:ring-2 focus-within:ring-blue-500">
                        <FaCalendarAlt className="text-gray-500 mr-2 z-10" />
                        {!filtroDataInicio && (
                            <span className="absolute left-9 text-gray-400 font-medium pointer-events-none z-10" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                                dd/mm/aaaa
                            </span>
                        )}
                        <input
                            type="date"
                            className="w-full outline-none text-[#000000] font-semibold bg-transparent relative z-20"
                            value={filtroDataInicio}
                            onChange={(e) => setFiltroDataInicio(e.target.value)}
                            style={{ color: filtroDataInicio ? "#000000" : "transparent", caretColor: "#000000" }}
                        />
                    </div>
                </div>

                {/* Campo de data de fim */}
                <div className="flex flex-col w-64">
                    <label className="mb-1 text-[#264D73] font-semibold">Data Fim</label>
                    <div className="flex items-center border border-[#264D73] rounded p-2 bg-white relative focus-within:ring-2 focus-within:ring-blue-500">
                        <FaCalendarAlt className="text-gray-500 mr-2 z-10" />
                        {!filtroDataFim && (
                            <span className="absolute left-9 text-gray-400 font-medium pointer-events-none z-10" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                                dd/mm/aaaa
                            </span>
                        )}
                        <input
                            type="date"
                            className="w-full outline-none text-[#000000] font-semibold bg-transparent relative z-20"
                            value={filtroDataFim}
                            onChange={(e) => setFiltroDataFim(e.target.value)}
                            style={{ color: filtroDataFim ? "#000000" : "transparent", caretColor: "#000000" }}
                        />
                    </div>
                </div>

                <div className="flex flex-col w-64">
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

                {/* Campo de filtro por tipo de urgência */}
                <div className="flex flex-col w-64">
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
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Campo de filtro por status */}
                <div className="flex flex-col w-64">
                    <label className="mb-1 text-[#264D73] font-semibold">Status da Solicitação</label>
                    <div className="flex items-center border border-[#264D73] rounded p-2 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                        <FaListUl className="text-gray-500 mr-2" />
                        <select
                            className="w-full outline-none text-[#000000] font-semibold bg-transparent"
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                        >
                            <option value="">Todos os Status</option>
                            <option value="novo">Novo</option>
                            <option value="pendente">Pendente</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                        </select>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 items-center justify-center w-full md:mt-auto">
                    <button
                        onClick={() => {
                            setFiltroDataInicio('');
                            setFiltroDataFim('');
                            setFiltroTipo('');
                            setFiltroOrgao('');
                            setFiltroNome('');
                            setFiltroStatus('');
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg shadow-sm hover:bg-gray-200 hover:shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-40 cursor-pointer"
                    >
                        🧹 Limpar Filtros
                    </button>

                    <ReportModalExport
                        urgencias={urgencias}
                        filtroDataInicio={filtroDataInicio}
                        filtroDataFim={filtroDataFim}
                    />
                </div>
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
                                    <span className="text-[#000000]">{item.dataHoraInicio}</span>
                                </div>
                                {item.dataHoraFim && (
                                    <div className="flex justify-between mb-3 items-center">
                                        <span className="font-semibold text-[#264D73] flex items-center gap-1">
                                            <FaCalendarAlt /> Finalizado em:
                                        </span>
                                        <span className="text-[#000000]">{item.dataHoraFim}</span>
                                    </div>
                                )}
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
                                <div className="flex justify-between mb-3 items-center">
                                    <span className="font-semibold text-[#264D73] flex items-center gap-1">
                                        <FaClock /> Status:
                                    </span>
                                    <span className={`text-white font-semibold px-2 py-1 rounded ${item.status === "novo" ? "bg-yellow-400" :
                                        item.status === "pendente" ? "bg-orange-400" :
                                            item.status === "em_andamento" ? "bg-blue-500" :
                                                item.status === "concluido" ? "bg-green-600" :
                                                    "bg-gray-400 transition duration-300 cursor-pointer"
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        disabled={item.status === "pendente"}
                                        onClick={() => atualizarStatus(item.uid, item.id, "pendente")}
                                        className={`px-3 py-1 rounded text-white ${item.status === "pendente" ? "bg-orange-300 cursor-not-allowed" : "bg-orange-400 hover:bg-orange-500 transition duration-300 cursor-pointer"
                                            }`}
                                    >
                                        Marcar como Pendente
                                    </button>
                                    <button
                                        disabled={item.status === "em_andamento"}
                                        onClick={() => atualizarStatus(item.uid, item.id, "em_andamento")}
                                        className={`px-3 py-1 rounded text-white ${item.status === "em_andamento" ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 transition duration-300 cursor-pointer"}`}
                                    >
                                        Em Andamento
                                    </button>

                                    <button
                                        disabled={item.status === "concluido"}
                                        onClick={() => atualizarStatus(item.uid, item.id, "concluido")}
                                        className={`px-3 py-1 rounded text-white ${item.status === "concluido" ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 transition duration-300 cursor-pointer"}`}
                                    >
                                        Concluir
                                    </button>
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
