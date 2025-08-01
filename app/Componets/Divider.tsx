
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Divider = () => {
  return (
    <View style={styles.divider}>
    </View>
  )
}

export default Divider

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: "#3399ff",
        borderColor: "#3399ff",
        borderWidth: 1,
    }
})