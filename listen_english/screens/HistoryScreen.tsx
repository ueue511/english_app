import React, { useState, useEffect, useCallback } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import Title from '../components/atoms/Title'
import NaveTabu from '../components/module/NaveTabu'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ListItem, SearchBar } from '@rneui/themed'
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { ENGLISH_DATA } from '../constants'

type EnglishData = {
  id: string,
  ja: string,
  en: string,
  img: string
}

interface navigationProps {
  navigate: (screen?: string, params?: { key: string }) => void;
  // TODO必要ないが残してくおく
  goBack: () => void;
}

function HistoryScreen() {
  const [animating, setAnimating] = useState<boolean>()
  const [historyList, setHistoryList] = useState<EnglishData[]>([])
  const [onSearchBox, setonSearchBox] = useState<boolean>(false)
  const [searchKeyWords, setSearchKeyWords] = useState<string>()
  const navigation = useNavigation<navigationProps>()

  const getData = useCallback(async (useSearchBox: boolean = false, keyWord: string = '') => {
    console.log(historyList)
    setHistoryList([])
      try {
        const value: string | null = await AsyncStorage.getItem('history')
        if (value !== null) {
          setonSearchBox(true)
          let arrayValue = value.split(',')
          let keyNum: number | null = null
          setHistoryList((historyList) => {
            arrayValue.forEach((listenNum) => {
              keyNum = parseInt(listenNum);
              if (keyNum !== null) {
                let list = ENGLISH_DATA[keyNum]
                if (useSearchBox && !list.ja.includes(keyWord || '')) {
                  if (!list.en.indexOf(keyWord || '')) {
                    ''
                  } else {
                    historyList.push(list)
                  }
                } else {
                  historyList.push(list)
                }
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
  }, [setHistoryList])

  useEffect(() => {
    (async () => {
      setAnimating(true)
      await getData()
    })()
  }, [getData])

  const renderItem = ({ item }: { item: EnglishData }) => (
    <ListItem
      containerStyle={[styles.listItem]}
      key={item.id}
    >
      <ImageBackground
        source={require('../assets/listen-circle-play-regular.png')}
        resizeMode="contain"
      >
      <ListItem.Content style={styles.listItemContent}>
        <Swipeable
          renderLeftActions={(progress, dragX) => leftActions(item.id, item.en)}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('listen', { key: item.id })}
          >
            <Text style={styles.listItemText} adjustsFontSizeToFit>{item.ja}</Text>
          </TouchableOpacity>
        </Swipeable>
      </ListItem.Content>
      </ImageBackground>
    </ListItem>
  )

  const leftActions = (id: string, en: string) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('listen', { key: id })}
      >
        <Text style={styles.listItemTextEnglish} adjustsFontSizeToFit>{en}</Text>
      </TouchableOpacity>
    )
  }

  const clearSearch = () => {
    getData(true, searchKeyWords)  //ERROR: not called when `onClearText`
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: '#fff',
      flex: 1,
      justifyContent: 'flex-start',
      // androidの高さ調整
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      width: 'auto'
    },
    historyContent: {
      flex: 0.86
    },
    loading: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    listItem: {
      justifyContent: 'center',
      height: 100,
      width: '100%',
    },

    listItemContent: {
      margin: 10,
    },
    listItemTextEnglish: {
      color: '#bf78a7',
      fontWeight: '600',
      fontSize: 24,
    },
    listItemText: {
      width: '100%',
      justifyContent: 'center',
      fontSize: 26,
      fontWeight: '600',
    },
    searchBar: {
      display: onSearchBox ? 'flex' : 'none',
      width: 'auto',
      borderColor: '#A5CFCF',
      borderRadius: 2,
      borderWidth: 5,
    }
  })

  return (
    <View style={styles.container}>
      <Title />
      <SearchBar
        platform={Platform.OS === 'android' ? 'android' : 'default'}
        placeholder="検索"
        containerStyle={styles.searchBar}
        clearIcon={{ type: 'font-awesome-5', name: 'check-circle' }}
        onChangeText={(newVal) => setSearchKeyWords(newVal)}
        onClear={clearSearch}
      />
      <View style={styles.historyContent}>
        <ActivityIndicator
          animating={animating}
          color='#A5CFCF'
          size="large"
          style={styles.loading}
        />
        <FlatList
          style={{width: "160%"}}
          data={historyList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          initialNumToRender={8}
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
