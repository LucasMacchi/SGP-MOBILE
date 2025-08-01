import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { logoutFn, sessionChFn } from '../Utils/userFunctions'
import { useNavigation } from 'expo-router'
import Divider from './Componets/Divider'
import { Picker } from '@react-native-picker/picker'
import { IClient, IFilter, IServicio } from '../Utils/interfaces'
import { getCcoFn, getClientes } from '../Utils/dataFunctions'
import orColors from "../Utils/ordersColors.json"
import RNDateTimePicker from '@react-native-community/datetimepicker'
import { getPedidosFn } from '../Utils/pedidosFunctions'
import FontAwesome from '@expo/vector-icons/FontAwesome';


const Home = () => {
  const nav = useNavigation()

  const [servicios, setServicios] = useState<IServicio[]>([])
  const [serviciosF, setServiciosF] = useState<IServicio[]>([])
  const [clientes, setClientes] = useState<IClient[]>([])
  const [showDateStart, setShwStr] = useState(false)
  const [showDateEnd, setShwEnd] = useState(false)

  const monthLess = (): string => {
    const date = new Date()
    const newD = new Date(date.setMonth(date.getMonth() - 1))
    return newD.toISOString()
    
  }
  const [filter, setFilter] = useState<IFilter>({
    limit: 50,
    client:   0,
    service: 0,
    numero: "",
    state: "",
    dateStart: monthLess(),
    dateEnd: new Date().toISOString().split("T")[0],
    user_id: 0,
  })

  useEffect(() => {
    sessionChFn().then(r => r ? nav.navigate("Ingreso") : "")
    getCcoFn().then(ccos => setServicios(ccos))
  },[])

  const logoutBtn = async () => {
    await logoutFn()
    window.location.reload()
  }

  useEffect(() => {
    let arr: IServicio[] = servicios
    if(filter.client) arr = arr.filter(c => c.client_id === filter.client)
    setServiciosF(arr)
  },[filter.client])


  const changeDate = (end: boolean, value: Date | undefined) => {
    if(value) {
      if(end) {
        setShwEnd(false)
        setFilter({...filter, dateEnd: value.toISOString()})
      }
      else {
        setShwStr(false)
        setFilter({...filter, dateStart: value.toISOString()})
      }
    }
  }

  const filtrarPedidos = async () => {
    const res = await getPedidosFn(filter)
  }

  return (
    <View>
      <Text style={styles.title}>Tus Pedidos</Text>
      <Divider />
      <View>
        <View style={styles.selectView}>
          <Text style={styles.subtitle}>Cliente:</Text>
          <Picker style={styles.filterSelect} onValueChange={(v:number) => setFilter({...filter, client: v})}>
            <Picker.Item key={0} value={0} label={"---"}/>
            {getClientes(servicios).map((cl) => (
              <Picker.Item key={cl.client_id} value={cl.client_id} label={cl.client_des}/>
            ))}
          </Picker>
        </View>
        <View style={styles.selectView}>
          <Text style={styles.subtitle}>Servicios:</Text>
          <Picker style={styles.filterSelect} onValueChange={(v:number) => setFilter({...filter, service: v})}>
            <Picker.Item key={0} value={0} label={"---"}/>
            {serviciosF.map((cco) => (
              <Picker.Item key={cco.service_id} value={cco.service_id} label={cco.service_des}/>
            ))}
          </Picker>
        </View>
        <View style={styles.selectView}>
          <Text style={styles.subtitle}>Estado:</Text>
          <Picker style={styles.filterSelect} onValueChange={(v:number) => setFilter({...filter, service: v})}>
            <Picker.Item key={""} value={""} label={"---"}/>
            <Picker.Item key={""} value={""} label={"Pendiente"} color={orColors.pendiente}/>
            <Picker.Item key={""} value={""} label={"Aprobado"} color={orColors.aprobado}/>
            <Picker.Item key={""} value={""} label={"Rechazado"} color={orColors.rechazado}/>
            <Picker.Item key={""} value={""} label={"Cancelado"} color={orColors.cancelado}/>
            <Picker.Item key={""} value={""} label={"Listo"} color={orColors.listo}/>
            <Picker.Item key={""} value={""} label={"Entregado"} color={orColors.entregado}/>
            <Picker.Item key={""} value={""} label={"Problemas"} color={orColors.problemas}/>
          </Picker>
        </View>
        <View style={styles.selectView}>
          <Text style={styles.subtitle}>Desde:</Text>
          <Button title={filter.dateStart.split("T")[0]}  onPress={() => setShwStr(true)}/>
          {showDateStart && <RNDateTimePicker mode="date" value={new Date(filter.dateStart)} onChange={(e, v) => changeDate(false, v)}/>}
          <Text style={styles.subtitle}>Hasta</Text>
          <Button title={filter.dateEnd.split("T")[0]}  onPress={() => setShwEnd(true)}/>
          {showDateEnd && <RNDateTimePicker mode="date" value={new Date(filter.dateStart)} onChange={(e, v) => changeDate(true, v)}/>}
        </View>
        <View style={styles.filterBrn}>
          <Button title='filtrar' onPress={filtrarPedidos} />
        </View>
        <View style={styles.pedidoView}>
          <View style={styles.pedido}>
            <Text style={styles.pedidoTxt}>3242JL25</Text>
            <Text style={styles.pedidoTxt}>{filter.dateEnd.split("T")[0]}</Text>
            <Text style={styles.pedidoTxt}>Aprobado</Text>
            <FontAwesome name='align-justify' color={"white"}/>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  pedido: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: orColors.aprobado,
    height: 50,
    alignItems: "center",
    width: 340,
    borderRadius: 5
  },
  pedidoTxt: {
    color: "white",
    fontWeight: 700
  },
  pedidoView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  link: {
    margin: 150
  },
  filterBrn: {
    margin: 20
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
    fontSize: 20
  },
  selectView: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10
  },
  filterSelect: {
    width: 250,
    fontWeight: 700
  }
})