'use client';

import { useEffect, useState } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import {
  FaUser,
  FaBirthdayCake,
  FaStickyNote,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';

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
  const [carregado, setCarregado] = useState(false);
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
      setCarregado(true); // só marca como carregado depois que terminar
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

    const tipoValido = filtroTipo
      ? item.tipoUrgencia === filtroTipo
      : true;

    return dataValida && tipoValido;
  });

  return (
    <div className="p-6 bg-[#D5EAF7] rounded-lg shadow-lg max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-8 text-[#000000] text-center">
        Solicitações de Urgência
      </h1>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
        <input
          type="date"
          className="p-2 border border-[#264D73] rounded text-[#000000] font-semibold"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />

        <select
          className="p-2 border border-[#264D73] rounded text-[#000000] font-semibold"
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

        {filtroOrgao && (
          <select
            className="p-2 border rounded text-[#000000]"
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
