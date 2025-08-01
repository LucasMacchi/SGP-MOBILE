import { Keyboard, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
const logo = require('../assets/logo_big.png');
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginFn, logoutFn } from '../Utils/userFunctions';
import { Link, useRouter } from 'expo-router';
import { useNavigationContainerRef } from 'expo-router'

const Login = () => {

    const navigator = useNavigationContainerRef()

    const usrReturner = async (): Promise<string> => {
        const usr = await AsyncStorage.getItem("savesr")
        if(usr) return usr
        else return ""
    }

    const [save, setSave] = useState(false)
    const [usr, setUsr] = useState("")
    const [lgnERR, setLgnERR] = useState("")

    useEffect(() => {
        usrReturner().then(u => {
            if(u.length > 0) {
                setUsr(u)
                setSave(true)
            }
        })
        logoutFn()
    },[])

    const saveUsername = async (status: boolean) => {
        if(status) {
            setSave(true)
            await AsyncStorage.setItem("savesr",usr)
        }
        else {
            setSave(false)
            await AsyncStorage.removeItem("savesr")
        }
    }

    const loginPress = async () => {
        console.log("Login...")
        if(usr.length > 3){
            const res = await loginFn(usr)
            if(res) window.location.reload()
            else setLgnERR("No se pudo iniciar la sesion")
        }
        else {
            console.log("Error usuario")
            setLgnERR("Ingrese un usuario valido")
        }
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
            <Image style={styles.logo} source={logo}/>
            <View style={styles.view}>
                <Text style={styles.title}>Ingrese el Nombre de usuario</Text>
                <TextInput style={styles.input} secureTextEntry={true} onChangeText={setUsr} value={usr}/>
                <Text style={styles.errTxt}>{lgnERR}</Text>
                <View style={styles.view2}>
                    <Text style={styles.subtitle}>Recordar usuario</Text>
                    <Checkbox value={save} onValueChange={saveUsername} color={save ? "#3399ff" : ""}/>
                </View>
                <View style={styles.btn}>
                    <Button title='Ingresar' onPress={loginPress}/>
                </View>
            </View>
        </View>
    </TouchableWithoutFeedback>

  )
}

export default Login

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "500",
        color: "#3399ff"
    },
    input: {
        width: 300,
        borderWidth: 1,
        marginTop: 15,
        borderRadius: 5,
        borderColor: "#3399ff"
    },
    view: {
        alignItems: "center",
        marginTop: 20
    },
    view2: {
        flexDirection: "row",
        marginTop: 20
    },
    subtitle: {
        fontWeight: "500",
        color: "#3399ff",
        marginRight: 5
    },
    errTxt: {
        fontWeight: "500",
        color: "#ff0000ff",
        marginRight: 5
    },
    logo: {
        width: 350,
        resizeMode: "contain"
    },
    btn: {
        width: 150,
        marginTop: 25
    }
})