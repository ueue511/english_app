import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

type Props = {
  jp: string,
  en: string,
}

function HistoryContent(props: Props) {
  const { jp, en } = props
  return (
    <TouchableOpacity style={ styles.historyBox }>
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
    borderBottomWidth: 10,
    width: '100%'
  },
  textBox: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20
  },
  historyText: {
    fontSize: 42,
    textAlign: 'center'
  }
})
