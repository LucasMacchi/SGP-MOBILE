import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Divider from './Componets/Divider'
import { IPedido, IServicio } from '../Utils/interfaces'
import { useRoute } from "@react-navigation/native";
import { deliverOrderFn, getUniqPedidoFn } from '../Utils/pedidosFunctions'
import { clientReturner, getCcoFn, serviceReturner } from '../Utils/dataFunctions'
import { useFocusEffect, useNavigation } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import orColors from "../Utils/ordersColors.json"
import { sessionChFn } from '../Utils/userFunctions'


interface IOrderId {orderId: number}

const Novedad = () => {
    const route = useRoute()
    const nav = useNavigation()
    const [servicios, setServicios] = useState<IServicio[]>([])
    const [pedido, setPedido] = useState<IPedido>({
        state: "",
        order_id: 0,
        numero: "",
        date_aproved: "",
        date_requested: "" ,
        date_delivered: "",
        requester: "",
        service_id: 0,
        usuario_id: 0,
        client_id: 0,
        archive: false,
        insumos: [],
        first_name: "",
        last_name: "",
        email: "",
        prov: false,
        prov_des: "",
        service_des: ""
    })
    useFocusEffect(
        useCallback(() => {
            //@ts-ignore
            sessionChFn().then(r => r ? nav.navigate("Ingreso") : "")
            const {orderId} = (route.params as IOrderId);
            getUniqPedidoFn(orderId).then(pd => setPedido(pd))
            getCcoFn().then(ccos => setServicios(ccos))
        },[route.params])
    )

    const dateReturner = (date: string):string => {
        const dateSplited = date.split("T")
        let newDate = dateSplited[0]
        return newDate
    }

    const changeState = async (choice: number) => {
        
        switch(choice) {
            case 1: 
                Alert.alert("Cancelar pedido "+pedido.numero, "¿Estas seguro que quieres cancelar el pedido?",
                    [
                        {text: "NO"},
                        {text: "SI",onPress: async ()=>{
                            const res = await deliverOrderFn(pedido.order_id)
                            if(res) {
                                Alert.alert("Cancelar pedido "+pedido.numero, "Pedido Cancelado")
                                setPedido({...pedido, state: "Cancelado"})
                            }
                            else Alert.alert("Cancelar pedido "+pedido.numero, "Error al cancelar el pedido")
                        }}
                    ]
                ); 
                break;
            case 2: 
                Alert.alert("Entregar pedido "+pedido.numero, "¿Estas seguro que quieres entregar el pedido?",
                    [
                        {text: "NO"},
                        {text: "SI",onPress: async ()=>{
                            const res = await deliverOrderFn(pedido.order_id)
                            if(res) {
                                Alert.alert("Entregar pedido "+pedido.numero, "Pedido Entregado")
                                setPedido({...pedido, state: "Entregado"})
                            }
                            else Alert.alert("Entregar pedido "+pedido.numero, "Error al entregar el pedido")
                        }}
                    ]
                ); 
                break;
            default:console.log("Default"); break;
        }
    }

    const buttonReturner = () => {
        if(pedido.state === "Pendiente"){
            return (
                <View style={{...styles.btnState}}>
                    <Button title='Cancelar' color={orColors.cancelado} onPress={()=>changeState(1)}/>
                </View>
            )
        }
        else if(pedido.state === "Aprobado") {
            return (
                <View style={{...styles.stateView}}>
                    <Text style={styles.stateTxt}>Pedido Aprobado</Text>
                </View>
            )
        }
        else if(pedido.state === "Rechazado") {
            return (
                <View style={{...styles.stateView, backgroundColor: orColors.rechazado}}>
                    <Text style={styles.stateTxt}>Pedido Rechazado</Text>
                </View>
            )
        }
        else if(pedido.state === "Cancelado") {
            return (
                <View style={{...styles.stateView, backgroundColor: orColors.cancelado}}>
                    <Text style={styles.stateTxt}>Pedido Cancelado</Text>
                </View>
            )
        }
        else if(pedido.state === "Listo") {
            return (
                <View style={{...styles.btnState, backgroundColor: orColors.cancelado}}>
                    <Button title='Entregar' onPress={()=>changeState(2)}/>
                </View>
            )
        }
        else if(pedido.state === "Entregado") {
            return (
                <View style={{...styles.stateView, backgroundColor: orColors.entregado}}>
                    <Text style={styles.stateTxt}>Pedido Entregado</Text>
                </View>
            )
        }
        else if(pedido.state === "Problemas") {
            return (
                <View style={{...styles.stateView, backgroundColor: orColors.problemas}}>
                    <Text style={styles.stateTxt}>Pedido con Problemas</Text>
                </View>
            )
        }
        else {

        }
    }

  return (
    <View >
    <Text style={styles.title}>Pedido {pedido.numero}</Text>
      <ScrollView >
        <Divider />
        <View style={styles.dataView}>
            <Text style={styles.subtitle}>Cliente: {pedido.client_id + "-" + clientReturner(pedido.client_id, servicios)}</Text>
        </View>
        <View style={styles.dataView}>
            <Text style={styles.subtitle}>CCO: {pedido.service_id + "-" + serviceReturner(pedido.service_id, servicios)}</Text>
        </View>
        <View style={styles.dataView}>
            <Text style={styles.subtitle}>Estado: {pedido.state}</Text>
        </View>
        <View style={styles.dataView}>
            <Text style={styles.subtitle}>Solicitante</Text>
            <Text style={styles.subtitle}>Nombre Completo: {pedido.first_name+" "+pedido.last_name}</Text>
            <Text style={styles.subtitle}>Nombre de Usuario: {pedido.requester}</Text>
            <Text style={styles.subtitle}>Email: {pedido.email}</Text>
        </View>
        <View style={styles.dataView}>
            <Text style={styles.subtitle}>Fecha</Text>
            <Text style={styles.subtitle}>De solicitud: {dateReturner(pedido.date_requested)}</Text>
            <Text style={styles.subtitle}>De aprobacion: {pedido.date_aproved ? dateReturner(pedido.date_aproved): "NaN"}</Text>
            <Text style={styles.subtitle}>De entregado: {pedido.date_delivered ? dateReturner(pedido.date_delivered): "NaN"}</Text>
        </View>
        <View style={styles.insumosView}>
            {pedido.insumos.map((ins, i) => (
            <View key={i} style={styles.insumoSty}>
                <Text style={styles.pedidoTxt}>{ins.insumo_des.split("-")[4]}</Text>
                <Text style={styles.pedidoTxtAm}>Cant: {ins.amount}</Text>
            </View>
            ))}
        </View>
        {buttonReturner()}
      </ScrollView>
    </View>
  )
}

export default Novedad

const styles = StyleSheet.create({
    dataView: {
        margin: 5,
        borderWidth: 1
    },
    btnState: {
        margin: 20,
        marginBottom: 150
    },
    stateView: {
        margin: 20,
        height: 50,
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 150
    },
    stateTxt: {
        textAlign: "center",
        fontWeight: 700,
        color: "white",
        fontSize: 24,
    },
    pedidoTxt: {
        fontWeight: 700,
        width: 250
    },
    pedidoTxtAm: {
        fontWeight: 700,
        width: 100,
    },
    insumosView: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 25,
    },
    insumoSty: {
        flexDirection: "row",
        height: 50,
        alignItems: "center",
        width: 340,
        borderRadius: 5,
        margin: 5,
        borderWidth: 1
    },
    title: {
        fontSize: 34,
        fontWeight: "500",
        color: "#3399ff",
        textAlign: "center"
    },
    subtitle: {
        fontWeight: "500",
        color: "#3399ff",
        marginRight: 5,
        fontSize: 16
    }
})
