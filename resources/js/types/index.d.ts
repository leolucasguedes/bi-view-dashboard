export interface User {
    id: number;
    name: string;
    email: string;
    bairro: string;
    cidade: string;
    whatsapp: string;
    idade: number;
    nascimento: string;
    sexo: string;
    zona_eleitoral: string;
    email_verified_at: string;
    created_at: string;
    is_admin: number;
    indications: number;
    rede: number;
    leaders: number;
}
export interface UserData {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    idade: number;
    nascimento: string;
    sexo: string;
    bairro: string;
    cidade: string;
    zona_eleitoral: string;
    created_at: string;
}

export interface RankUserDataFull extends UserData {
    user_id: number;
    rede: number;
    indications: number;
}

export interface UserProfile extends UserData {
    user_id: number;
}

export interface UserDataFull extends UserProfile {
    indications: number;
    rede: number;
}

export interface Count {
    name: string;
    count: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
