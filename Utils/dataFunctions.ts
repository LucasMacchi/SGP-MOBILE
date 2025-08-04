import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { IClient, IInsumo, IResponseInsumo, IServicio } from "./interfaces";
import { authReturner } from "./userFunctions";

const SERVER = "http://192.168.2.105:4200"

export async function getCcoFn(): Promise<IServicio[]> {
    const auth = await authReturner()
    try {
        const ccos: IServicio[] = (await axios.get(SERVER + "/data/cco",auth)).data;
        return ccos
    } catch (error) {
        console.log(error)
        return []
    }
}

export async function getInsumosFn(): Promise<IResponseInsumo[]> {
    const auth = await authReturner()
    try {
        const ins: IResponseInsumo[] = (await axios.get(SERVER + "/data/insumos",auth)).data;
        return ins
    } catch (error) {
        console.log(error)
        return []
    }
}

export function getClientes(services: IServicio[]): IClient[] {
    const arrD = services.map((s) => {
        const data: IClient = {
        client_des: s.client_des,
        client_id: s.client_id
        }
        return data
    })
    let aux = 0
    const arr = arrD.filter((s) => {
        if(aux === 0 ){
            aux = s.client_id
            return s
        }
        if(s.client_id !== aux) {
            aux = s.client_id
            return s
        }
    })
    return arr
}

export function serviceReturner (serviceId: number, services: IServicio[]): string {
    let srv = ""
    services.forEach(s => {
        if(s.service_id === serviceId) {
            srv = s.service_des
            return 0
        }
    });
    return srv
}
export function clientReturner (clientID: number, services: IServicio[]): string {
    let clnt = ""
    services.forEach(s => {
        if(s.client_id === clientID) {
            clnt = s.client_des
            return 0
        }
    });
    return clnt
}