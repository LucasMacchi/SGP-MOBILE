import AsyncStorage from "@react-native-async-storage/async-storage";
import { IFilter, IPedido, ITokenC } from "./interfaces";
import { authReturner } from "./userFunctions";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const SERVER = "http://192.168.2.105:4200"

export async function getPedidosFn (filter: IFilter): Promise<IPedido[]> {
    try {
        console.log(filter)
        const token = await AsyncStorage.getItem("jwToken");
        const auth = await authReturner()
        if(token && auth) {
            const dataUser: ITokenC = jwtDecode(token);
            filter.user_id = dataUser.usuario_id
            filter.dateStart = filter.dateStart.split("T")[0]
            filter.dateEnd = filter.dateEnd.split("T")[0]
            const res: IPedido[] = (await axios.post(SERVER+"/pedido/all",filter, auth)).data
            await AsyncStorage.setItem("storedPedidos", JSON.stringify(res));
            return res
        }
        else return []
    } catch (error) {
        console.log(error)
        return []
    }

}

export async function getStoredPedidos(): Promise<IPedido[]> {
    const pedidos = await AsyncStorage.getItem("storedPedidos");
    if(pedidos) return JSON.parse(pedidos)
    else return []

}

export async function getUniqPedidoFn(order_id:number): Promise<IPedido> {
    try {
        const pedido: IPedido[] = await (await axios.get(SERVER + "/pedido/detail/" + order_id)).data
        return pedido[0]
    } catch (error) {
        console.log(error)
        return {} as IPedido
    }
}

export async function deliverOrderFn(order_id:number): Promise<boolean> {
    const auth = await authReturner()
    try {
        const data = {comment: " "};
        await axios.patch(SERVER + "/pedido/delivered/" + order_id,data,auth);
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function cancelOrderFn(order_id:number): Promise<boolean> {
    const auth = await authReturner()
    try {
        await axios.patch(SERVER + "/pedido/cancel/" + order_id,{},auth);
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}