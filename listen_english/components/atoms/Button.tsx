import React from 'react'
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

type Props = {
  text: string,
  justifyContent: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | undefined,
  route: () => void,
  reset?: boolean
}

function Button(props: Props) {
  const { text, justifyContent, route, reset } = props
  
  const styles = StyleSheet.create({
    buttonContent: {
      borderRightRadius: 20,
      flex: 1,
      justifyContent: justifyContent,
      display: reset? 'none' : 'flex' 
    },
    button: {
      alignSelf: 'center',
      backgroundColor: '#A5CFCF',
      borderRadius: 20,
      padding: 10,
      width: '85%'
    },
    buttonText: {
      alignSelf: 'center',
      color: '#fff',
      fontSize: 64,
      justifyContent: 'center',
    }
  })
  return (
    <View style={styles.buttonContent}>
      <TouchableOpacity style={styles.button} onPress={route}>
        <Text style={styles.buttonText}>{ text }</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Button
