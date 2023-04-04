import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Button from './atoms/Button' 

interface navigationProps {
  navigate: (screen?: string) => void;
  // TODO必要ないが残してくおく
  goBack: () => void;
}

function DeleteHIstory() {
  const navigation = useNavigation<navigationProps>()
  const [caveatText, setCaveatText] = useState<string>(`今まで聞いた英語の記録が消えますが、いいですか？`)
  const [reset, setReset] = useState<boolean>(false)

  const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000))

  const clearAll = async ()=>  {
    try {
      await AsyncStorage.clear()
      setReset(true)
      setCaveatText(`リセットしました。top画面に戻ります。`)
      await sleep(5)
      navigation.navigate('top')
    } catch (e) {
      // clear error
    }
  }
  return (
    <View style={styles.DeleteContent}>
      <Text style={styles.text}>
        {caveatText}
      </Text>
      <Button
        text={'リセット'}
        justifyContent={'flex-start'}
        route={clearAll}
        reset={reset}
      />
    </View>
  )
}
export default DeleteHIstory

const styles = StyleSheet.create({
  DeleteContent: {
    backgroundColor: 'fff',
    borderColor: '#A5CFCF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    borderWidth: 10,
    flex: 1,
    marginTop: '5%',
    width: '100%'
  },
  text: {
    marginTop: 100,
    flex: 1,
    fontSize: 40,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center'
  }
})
