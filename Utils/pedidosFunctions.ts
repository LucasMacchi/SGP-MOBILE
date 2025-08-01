import AsyncStorage from "@react-native-async-storage/async-storage";
import { IFilter, IPedido, IToken, ITokenC } from "./interfaces";
import { authReturner } from "./userFunctions";
import axios, { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";

const SERVER = "http://192.168.2.105:4200"

export async function getPedidosFn (filter: IFilter): Promise<IPedido[]> {
    try {
        const token = await AsyncStorage.getItem("jwToken");
        const auth = await authReturner()
        if(token && auth) {
            const dataUser: ITokenC = jwtDecode(token);
            filter.user_id = dataUser.usuario_id
            filter.dateStart = filter.dateStart.split("T")[0]
            filter.dateEnd = filter.dateEnd.split("T")[0]
            console.log(filter)
            const res: IPedido[] = (await axios.post(SERVER+"/pedido/all",filter, auth)).data
            return res
        }
        else return []
    } catch (error) {
        console.log(error)
        return []
    }

}