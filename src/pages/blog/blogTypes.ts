export interface Anexo {
  id: number;
  arquivo: string;        // URL do PDF
  nome_original: string;
  uploaded_at: string;
}

// Item da listagem — sem `content`, que só vem no detalhe.
export interface PublicPostListItem {
  id: number;
  slug: string;
  title: string;
  resumo: string | null;
  imagem_destaque: string | null;
  created_at: string;
  instituicao_id: number;
  instituicao_nome: string;
  autor_nome: string;
}

// Detalhe — com o HTML e os anexos.
export interface PublicPostDetail extends PublicPostListItem {
  content: string;
  anexos: Anexo[];
}

// Resposta paginada do DRF (PageNumberPagination).
export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface InstituicaoParaFiltro {
  id: number;
  nome: string;
  marcador_logo: string | null;
}