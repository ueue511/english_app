import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  View,
} from 'react-native'
import NaveButton from '../atoms/NaveButton'
import { BUTTON_OPTION_DATA } from '../../constants'

interface Props {
  routeNameLeft: string,
  routeNameRight: string,
}

interface navigationProps {
  navigate: (screen?: string) => void;
  // TODO必要ないが残してくおく
  goBack: () => void;
}

interface ButtonOptionData {
  [key: string]: {
    stork: number,
    color: string,
    text: string,
    style: {
      fontSize?: number,
      letterSpacing?: number
    }
  }
}

export default function NaveTabu(props: Props) {
  const { routeNameLeft, routeNameRight } = props
  const [ buttonLeftOption ] = useState(BUTTON_OPTION_DATA)

  const navigation = useNavigation<navigationProps>()

  const buttonOption: ButtonOptionData = buttonLeftOption

  return (
    <View style={styles.naveButtonContent}>
      <NaveButton
        stroke={buttonOption[routeNameLeft].stork}
        color={buttonOption[routeNameLeft].color}
        text={buttonOption[routeNameLeft].text}
        buttonStyle={buttonOption[routeNameLeft].style}
        route={() => navigation.navigate(routeNameLeft)}
      />
      <View style={{ width: 15, height: '100%', backgroundColor: '#A5CFCF' }}></View>
      <NaveButton
        stroke={buttonOption[routeNameRight].stork}
        color={buttonOption[routeNameRight].color}
        text={buttonOption[routeNameRight].text}
        buttonStyle={buttonOption[routeNameRight].style}
        route={() => navigation.navigate(routeNameRight)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  naveButtonContent: {
    backgroundColor: '#fff',
    bottom: 0,
    borderColor: '#A5CFCF',
    borderTopWidth: 10,
    flexDirection: 'row',
    flex: 1,
    height: 120,
    position: 'absolute',
    width: '100%'
  },
})
