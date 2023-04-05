import React, { useState, useEffect, useCallback } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import Title from '../components/atoms/Title'

import HistoryContent from '../components/HistoryContent'
import NaveTabu from '../components/module/NaveTabu'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { ListItem } from '@rneui/themed'


import { ENGLISH_DATA } from '../constants'

type EnglishData = {
  id: string,
  ja: string,
  en: string,
  img: string
}

function HistoryScreen() {
  const [animating, setAnimating] = useState<boolean>()
  const [historyList, setHistoryList] = useState<EnglishData[]>([])

  const getData = useCallback(async () => {
    setHistoryList([])
      try {
        const value: string | null = await AsyncStorage.getItem('history')
        if (value !== null) {
          let arrayValue = value.split(',')
          let keyNum: number | null = null
          setHistoryList((historyList) => {
            arrayValue.forEach((listenNum) => {
              keyNum = parseInt(listenNum);
              if (keyNum !== null) {
                let list = ENGLISH_DATA[keyNum]
                historyList.push(list)
              }
            });
            return [...historyList]
          });
        }
        setAnimating(false)
        return 'getData'
      } catch (err) {
        console.log(err) 
      }
    // })
  }, [setHistoryList])

  useEffect(() => {
    (async () => {
      setAnimating(true)
      await getData()
    })()
  }, [getData])

  return (
    <View style={styles.container}>
      <Title />
      <View style={styles.historyContent}>
        <ActivityIndicator
          animating={animating}
          color='#A5CFCF'
          size="large"
          style={styles.loading}
        />
        <FlatList
          data={historyList}
          renderItem={({ item }) => (
            <HistoryContent
              jp={item.ja}
              en={item.en}
              id={item.id}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
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
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-start',
    // androidの高さ調整
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  historyContent: {
    flex: 0.86
  },
  loading: {
    flex: 1,
    justifyContent: 'flex-end',
  }
})
