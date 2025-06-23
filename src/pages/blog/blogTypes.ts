

export interface PublicPost {
  id: number;
  title: string;
  resumo: string | null;
  content: string;
  imagem_destaque: string | null; // DRF serializa ImageField para uma URL (string)
  created_at: string; // ISO 8601 timestamp string
  instituicao_nome: string; // Vem do StringRelatedField, pode ser ""
  autor_nome: string | null;
}

export interface InstituicaoParaFiltro {
  id: number;
  nome: string;
}
