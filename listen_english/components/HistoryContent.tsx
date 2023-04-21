import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

type Props = {
  jp: string,
  en: string,
  id: string
}

interface navigationProps {
  navigate: (screen?: string, params?: {key: string}) => void;
  // TODO必要ないが残してくおく
  goBack: () => void;
}

function HistoryContent(props: Props) {
  const { jp, en, id } = props

  const navigation = useNavigation<navigationProps>()

  return (
    <TouchableOpacity
      style={styles.historyBox}
      onPress={() => navigation.navigate('listen', { key: id })}
    >
      <View style={ styles.textBox }>
        <Text style={styles.historyText}>{jp}</Text>
        <Text style={styles.historyText}>{en}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default HistoryContent

const styles = StyleSheet.create({
  historyBox: {
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 5,
    borderColor: '#333',
    width: '100%',
  },
  textBox: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20
  },
  historyText: {
    fontWeight: '500',
    fontSize: 38,
    textAlign: 'center'
  }
})
