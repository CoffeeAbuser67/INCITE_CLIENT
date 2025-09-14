

export interface User {
    pkid: number; // Geralmente pkid é number
    email: string;
    first_name: string;
    last_name: string;
    instituicoes_count: number;
    user_group: number; // number para o choice do Django
}


