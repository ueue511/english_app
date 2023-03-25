import React, { useState, useEffect } from 'react'
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import Title from '../components/atoms/Title'

import HistoryContent from '../components/HistoryContent'
import NaveTabu from '../components/module/NaveTabu'
import { ENGLISH_DATA } from '../constants'

type EnglishData = {
  id: string,
  ja: string,
  en: string,
  img: string
}

function HistoryScreen() {
  const [historyList, setHistoryList] = useState<EnglishData[]>([])

  const listHistory: number[] = [0, 1, 2, 3, 4, 5]

  useEffect(() => {
    // TODO この判定で正しいのか？
    if (historyList.length < 1) {
      listHistory.forEach((key) => {
        getHistory(key)
      })
    }
  }, [])

  function getHistory(key: number): void {
    let list = ENGLISH_DATA[key]
    setHistoryList((historyList) => [...historyList, list])
  }
  return (
    <View style={styles.container}>
      <Title />
      <FlatList
        data={historyList}
        renderItem={({ item }) => (
          <HistoryContent
            jp={item.ja}
            en={item.en}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <NaveTabu
        routeNameLeft={'deleteHistory'}
        routeNameRight={'top'}
      />
    </View>
  )
}

export default HistoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // androidの高さ調整
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  }
})
