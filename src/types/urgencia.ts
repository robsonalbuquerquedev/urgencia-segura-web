export interface Urgencia {
    nome: string;
    idade: string;
    observacao: string;
    tipoUrgencia: string;
    dataHoraInicio: string;
    localizacao: string;
    celular: string;
    orgao: string;
    status?: 'novo' | 'pendente' | 'em_andamento' | 'concluido';
    dataHoraFim?: string;
    uid?: string;
    id?: string;
    fotoUrl?: string;
}
