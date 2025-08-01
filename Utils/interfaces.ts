export interface IToken {
    token: string
};

export interface IServicio {
    service_id: number,
    client_id: number,
    service_des: string,
    client_des: string,
    localidad: string
}

export interface ITokenC {
    user: string,
    rol: number,
    first_name: string,
    last_name: string,
    exp: number,
    iat: number,
    usuario_id: number,
    email: string
}

export interface IFilter {
    limit: number,
    client: number,
    service: number,
    numero: string,
    state: string,
    dateStart: string,
    dateEnd: string,
    user_id: number
}

export interface IPedido {
    state: 'Listo' | 'Pendiente' | 'Aprobado' | 'Cancelado' | 'Rechazado' | 'Entregado' | 'Problemas' | string,
    order_id: number,
    numero: string,
    date_aproved?: string | null,
    date_requested: string ,
    date_delivered?: string | null,
    requester: string,
    service_id: number,
    usuario_id: number,
    client_id: number,
    archive: boolean | number,
    insumos: IInsumo[],
    first_name: string,
    last_name: string,
    email: string,
    prov?: boolean,
    prov_des?: string,
    legajo?: number,
    service_des: string
}

export interface IInsumo {
    detail_id?: number,
    amount: number,
    insumo_id?: number,
    ins_cod1?: number,
    ins_cod2?: number,
    ins_cod3?: number,
    order_id?: number,
    insumo_des: string,
    categoria?: string
}

export interface IResponseInsumo {
    insumo: string
}

export interface IClient {
    client_id: number,
    client_des: string
}


