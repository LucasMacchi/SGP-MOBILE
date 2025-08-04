import { StyleSheet, Text, View, Image, Button } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { createDrawerNavigator, DrawerContent } from '@react-navigation/drawer'
import Home from "./index"
import Login from './Login'
import Novedad from './Pedido'
const logo = require('../assets/logo_big.png');

const Drawer = createDrawerNavigator()

const Rootlayout = () => {
  return (
    <Drawer.Navigator screenOptions=
    {{drawerStyle: styles.panel, 
    drawerLabelStyle: styles.label,
    drawerItemStyle: styles.item}}>
      <Drawer.Screen name='Pagina Principal' component={Home}/>
      <Drawer.Screen name='Novedad' component={Novedad} options={{drawerItemStyle: {display: "none"}}}/>
      <Drawer.Screen name='Ingreso' component={Login} options={{drawerItemStyle: {display: "none"},headerLeft: () => null}}/>
    </Drawer.Navigator>
  )
}

export default Rootlayout

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "white"
  },
  label: {
    color: "#3399ff",
    fontWeight: 700,
    fontSize: 24
  },
  item: {
    borderColor: "white",
    marginBottom: 25
  }
})

/*
  return (
    <Stack screenOptions={{headerStyle: {backgroundColor: "#3399ff"}}}>
        <Stack.Screen name='index' options={{title: "Home"}}/>
        <Stack.Screen name='Login' options={{title: "Ingresar"}}/>
    </Stack>
  )
*/