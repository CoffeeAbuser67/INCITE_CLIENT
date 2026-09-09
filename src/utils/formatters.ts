/** 03/09/2026 — para tabelas e cards compactos */
export const formatarDataCurta = (timestamp?: string): string => {
    if (!timestamp) return 'Data indisponível';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(timestamp));
};

/** 3 de setembro de 2026 — para leitura */
export const formatarDataLonga = (timestamp?: string): string => {
    if (!timestamp) return 'Data indisponível';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(timestamp));
};

/**
 * DateField do Django chega como "YYYY-MM-DD". Passar isso pro
 * construtor Date interpreta como UTC e, em fuso negativo, volta um
 * dia — por isso o split manual.
 */
export const formatarDataBR = (dataString?: string): string => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
};