import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import TextStroke from './textStroke'

interface Props {
  stroke: number,
  color: string,
  text: string
  buttonStyle?: {
    fontSize?: number,
    letterSpacing?: number
  },
  route: () => void
}

function NaveButton(props: Props) {
  const { stroke, color, text, buttonStyle, route } = props

  const styles = StyleSheet.create({
    naveButton: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      width: '50%',
    },
    naveButtonText: {
      borderColor: '#ED9C9C',
      color: '#A5CFCF',
      fontSize: 48,
      fontWeight: '600',
      ...buttonStyle
    },
  })

  return (
    <TouchableOpacity style={styles.naveButton} onPress={route}>
      <TextStroke stroke={stroke} color={color}>
        <Text style={ styles.naveButtonText }>{text}</Text>
      </TextStroke>
    </TouchableOpacity>
  )
}

export default NaveButton
