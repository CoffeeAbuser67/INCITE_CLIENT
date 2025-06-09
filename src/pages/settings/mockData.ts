// src/mockData.ts

// --- Tipos para cada modelo ---
export type Postagem = { id: number; title: string; content: string; createdAt: string };
export type Pesquisador = { id: number; nome: string; area_atuacao: string; desligado: boolean; bolsista: boolean };
export type Pesquisa = { id: number; nome: string; info: string; ano_inicio: number; ano_fim?: number };
export type AcaoExtensionista = { id: number; nome: string; info: string; ano_inicio: number; tipo_comunidade: string };
export type ProdutoInovacao = { id: number; nome: string; info: string; ano_inicio: number };


// --- Interface principal atualizada ---
export interface Instituicao {
  id: number;
  nome: string;
  cidade: string;
  coordenador_responsavel: string;
  email: string;
  telefone: string;
  informacoes_adicionais?: string;
  postagens: Postagem[];
  pesquisadores: Pesquisador[];
  pesquisas: Pesquisa[];
  acoes_extensionistas: AcaoExtensionista[];
  produtos: ProdutoInovacao[];
}

export const instituicoesMock: Instituicao[] = [
  {
    id: 1,
    nome: 'Universidade Federal do Sul da Bahia (UFSB)',
    cidade: 'Itabuna',
    coordenador_responsavel: 'Dr. João Pimenta',
    email: 'joao.pimenta@ufsb.edu.br',
    telefone: '(73) 99999-1111',
    informacoes_adicionais: 'Foco em agricultura sustentável.', // dado adicionado
    postagens: [
      { id: 101, title: 'Nova pesquisa sobre cacau cabruca', content: '<p>O conteúdo da postagem sobre cacau...</p>', createdAt: '2025-06-01' },
      { id: 102, title: 'Abertas as inscrições para o simpósio', content: '<p>Detalhes sobre o simpósio...</p>', createdAt: '2025-05-20' },
    ],
    pesquisadores: [
      { id: 201, nome: 'Ana Carolina', area_atuacao: 'Agronomia', desligado: false, bolsista: true },
      { id: 202, nome: 'Marcos Vinicius', area_atuacao: 'Biotecnologia', desligado: true, bolsista: false },
    ],
    pesquisas: [
      { id: 301, nome: 'Genoma do Cacaueiro', info: 'Mapeamento genético da variedade Theobroma Cacao.', ano_inicio: 2023 }
    ],
    acoes_extensionistas: [
        { id: 401, nome: 'Dia de Campo: Adubação Verde', info: 'Evento para agricultores locais.', ano_inicio: 2024, tipo_comunidade: 'Tradicionais' }
    ],
    produtos: [
        { id: 501, nome: 'Biofertilizante à base de algas', info: 'Produto em fase de testes de campo.', ano_inicio: 2024 }
    ]
  },
  // ... (outras instituições)
];