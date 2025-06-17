import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Urgencia } from '../../types/urgencia';

type RelatorioModalProps = {
    urgencias: Urgencia[];
    filtroDataInicio: string;
    filtroDataFim: string;
};

export default function RelatorioModal({
    urgencias,
    filtroDataInicio,
    filtroDataFim,
}: RelatorioModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [contagem, setContagem] = useState({
        novo: 0,
        pendente: 0,
        em_andamento: 0,
        concluido: 0,
    });

    const gerarRelatorio = () => {
        const inicio = filtroDataInicio ? new Date(filtroDataInicio + 'T00:00:00') : null;
        const fim = filtroDataFim ? new Date(filtroDataFim + 'T23:59:59') : null;

        const novoResumo: Record<'novo' | 'pendente' | 'em_andamento' | 'concluido', number> = {
            novo: 0,
            pendente: 0,
            em_andamento: 0,
            concluido: 0,
        };

        const statusValidos = ['novo', 'pendente', 'em_andamento', 'concluido'] as const;

        urgencias.forEach((item: Urgencia) => {
            const [data, hora] = item.dataHoraInicio.split(' '); // "17/06/2025", "11:50"
            const [dia, mes, ano] = data.split('/'); // "17", "06", "2025"
            const dataItem = new Date(`${ano}-${mes}-${dia}T${hora || '00:00'}`); // "2025-06-17T11:50"

            const dentroDoPeriodo = (!inicio || dataItem >= inicio) && (!fim || dataItem <= fim);

            if (dentroDoPeriodo && item.status && statusValidos.includes(item.status)) {
                novoResumo[item.status] += 1;
            }
        });

        setContagem(novoResumo);
        setIsOpen(true);
    };

    const exportarCSV = () => {
        const linhas = [
            ['Status', 'Quantidade'],
            ['Novo', contagem.novo],
            ['Pendente', contagem.pendente],
            ['Em Andamento', contagem.em_andamento],
            ['Concluído', contagem.concluido],
        ];

        const csvContent = '\uFEFF' + linhas.map((linha) => linha.join(',')).join('\n');
        // Adicionamos '\uFEFF' no início para garantir que o Excel interprete como UTF-8

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'relatorio_urgencias.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        doc.text('Relatório de Ocorrências', 14, 20);

        autoTable(doc, {
            head: [['Status', 'Quantidade']],
            body: [
                ['Novo', contagem.novo],
                ['Pendente', contagem.pendente],
                ['Em Andamento', contagem.em_andamento],
                ['Concluído', contagem.concluido],
            ],
            startY: 30,
        });

        doc.save('relatorio_urgencias.pdf');
    };

    return (
        <div>
            <button
                onClick={gerarRelatorio}
                className="px-4 py-2 bg-[#264D73] text-white font-semibold rounded-lg shadow-sm hover:bg-[#1d3a59] hover:shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#264D73] cursor-pointer"
            >
                📄 Gerar Relatório
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Dialog.Panel className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
                        <Dialog.Title className="text-lg font-bold text-[#264D73] mb-4">
                            Resumo de Ocorrências
                        </Dialog.Title>

                        <p className="mb-2">
                            📅 De <strong>{filtroDataInicio || '...'}</strong> até <strong>{filtroDataFim || '...'}</strong>
                        </p>

                        <ul className="space-y-1 mb-4">
                            <li>🆕 <strong>Novas:</strong> {contagem.novo}</li>
                            <li>🟠 <strong>Pendentes:</strong> {contagem.pendente}</li>
                            <li>🔵 <strong>Em Andamento:</strong> {contagem.em_andamento}</li>
                            <li>✅ <strong>Concluídas:</strong> {contagem.concluido}</li>
                        </ul>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={exportarCSV}
                                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                            >
                                <FaFileCsv /> CSV
                            </button>
                            <button
                                onClick={exportarPDF}
                                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                            >
                                <FaFilePdf /> PDF
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                            >
                                Fechar
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
