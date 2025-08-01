import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";

const SERVER = "http://192.168.2.105:4200"


export async function loginFn(usrname:string): Promise<boolean> {
    try {
        const token: AxiosResponse = await axios.post(SERVER + "/user/login", {username: usrname});
        await AsyncStorage.setItem("jwToken",token.data)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function sessionChFn():Promise<boolean> {
    const tkn = await AsyncStorage.getItem("jwToken")
    if(tkn) {
        const currentDateTime = Math.floor(Date.now() / 1000)
        const data = jwtDecode(tkn)
        if(data['exp'] && data['exp'] < currentDateTime){
          await AsyncStorage.removeItem('jwToken')
          return true
        }
        else return false
    }
    else return true
}

export async function logoutFn() {
    await AsyncStorage.removeItem('jwToken')
}

export async function authReturner () {
    const token = await  AsyncStorage.getItem('jwToken')
    return {headers:{'Authorization': `Bearer ${token}`}}
}