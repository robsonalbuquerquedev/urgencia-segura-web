'use client';

import { useEffect, useState } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

interface Urgencia {
  nome: string;
  idade: string;
  observacao: string;
  tipoUrgencia: string;
  dataHora: string;
  localizacao: string;
  celular: string;
}

export default function UrgenciasList() {
  const [urgencias, setUrgencias] = useState<Urgencia[]>([]);
  const [filtroOrgao, setFiltroOrgao] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [filtroData, setFiltroData] = useState<string>('');

  const tiposSamu = ["Acidente", "Mal-estar", "Desmaio", "Queimadura", "Sangramento", "Mal súbito"];
  const tiposDefesaCivil = ["Deslizamento", "Alagamento", "Incêndio Florestal", "Desabamento", "Vazamento de Gás", "Risco Estrutural"];

  useEffect(() => {
    const urgenciasRef = ref(database, 'urgencias/usuario');
    onValue(urgenciasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista: Urgencia[] = Object.values(data);
        setUrgencias(lista);
      } else {
        setUrgencias([]);
      }
    });
  }, []);

  function formatarDataParaInput(dataHora: string) {
    const [dia, mes, anoHora] = dataHora.split('/');
    const [ano] = anoHora.split(' ');
    return `${ano}-${mes}-${dia}`;
  }

  const tiposDisponiveis = filtroOrgao === 'SAMU' ? tiposSamu : filtroOrgao === 'Defesa Civil' ? tiposDefesaCivil : [];

  const urgenciasFiltradas = urgencias.filter((item) => {
    const dataValida = filtroData
      ? formatarDataParaInput(item.dataHora) === filtroData
      : true;

    const orgaoValido = filtroOrgao
      ? tiposDisponiveis.includes(item.tipoUrgencia)
      : true;

    const tipoValido = filtroTipo
      ? item.tipoUrgencia === filtroTipo
      : true;

    return dataValida && orgaoValido && tipoValido;
  });

  return (
    <div className="p-6 bg-[#D5EAF7FF] rounded-lg shadow-lg max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-[#264D73FF] text-center">
        Solicitações de Urgência
      </h1>

      {/* Filtros */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
        <input
          type="date"
          className="p-2 border rounded"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />

        <select
          className="p-2 border rounded"
          value={filtroOrgao}
          onChange={(e) => {
            setFiltroOrgao(e.target.value);
            setFiltroTipo(''); // Limpa o tipo ao mudar o órgão
          }}
        >
          <option value="">Todos os Órgãos</option>
          <option value="SAMU">SAMU</option>
          <option value="Defesa Civil">Defesa Civil</option>
        </select>

        {filtroOrgao && (
          <select
            className="p-2 border rounded"
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
        )}
      </div>

      {/* Lista filtrada */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {urgenciasFiltradas.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#49A6E9FF] flex flex-col"
          >
            <div className="flex justify-between mb-3">
              <span className="font-semibold text-[#264D73FF]">Nome:</span>
              <span>{item.nome}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="font-semibold text-[#264D73FF]">Idade:</span>
              <span>{item.idade}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="font-semibold text-[#264D73FF]">Celular:</span>
              <span>{item.celular}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="font-semibold text-[#264D73FF]">Observação:</span>
              <span>{item.observacao}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="font-semibold text-[#264D73FF]">Tipo de Urgência:</span>
              <span>{item.tipoUrgencia}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="font-semibold text-[#264D73FF]">Data e Hora:</span>
              <span>{item.dataHora}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-[#264D73FF]">Localização:</span>
              <span>{item.localizacao}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
