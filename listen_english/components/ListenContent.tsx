import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import {
  Animated,
  Image,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native'
import * as Speech from 'expo-speech'
import { Audio } from 'expo-av'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { ENGLISH_DATA } from '../constants'
import { ING_PATH } from '../constants'

type EnglishData = {
  id?: string,
  ja?: string,
  en?: string,
  img?: string
}

type ImgPath = Record<string, ImageSourcePropType>

type RootParamList = {
  top: undefined;
  deleteHistory: undefined
  history: { key: string }
}


export interface ListenContentProps {
  showModal: () => void
}
export interface ListenContentMethods {
  switchFunc: () => void
}

const ListenContent = forwardRef<ListenContentMethods, ListenContentProps>(({ showModal }, ref) => {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RootParamList, 'history'>>()

  const routeParams: string | undefined = route.params?.key

  const [jpLanguage, setJpLanguage] = useState<string>()
  const [enLanguage, setEnLanguage] = useState<string>()
  const [languageImg, setLanguageImg] = useState<ImageSourcePropType>(require('../assets/start.png'))

  const isStopped = useRef(true)
  const resumeFrom = useRef('start')

  const isListen = useRef<EnglishData>()
  let opacity = useRef(new Animated.Value(0)).current
  let opacityImg = useRef(new Animated.Value(1)).current
  let opacityAnswer = useRef(new Animated.Value(0)).current

  let loopInterval = useRef<boolean>(true)

  let interOpacity = opacityImg.interpolate({
    inputRange: [0, 150, 300],
    outputRange: [1, 0, 1],
  })

  const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000))

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      isStopped.current = true
    })
    // クリーンアップ関数を返す
    return unsubscribe
  }, [navigation])
  
  // 履歴から来た場合の自動再生
  // useEffect(() => {
  //   if (routeParams !== undefined) {
  //     isStopped.current = !isStopped.current
  //     actionListen()
  //   }
  // }, [])

  const firstSound = async () => {
    Animated.timing(opacityImg, {
      toValue: 300,
      duration: 1000,
      useNativeDriver: true,
    }).start()
    try {
      const soundObject = new Audio.Sound()
      await soundObject.loadAsync(require('../assets/sound/decision.mp3'))
      await soundObject.playAsync()
    }
    catch (error) {
      console.log('error...')
    }
  }

  function jaListen (setListen: EnglishData, reStart: boolean = false) {
    let text: string | undefined = ''
    resumeFrom.current = 'jaListen'
    text = setListen?.ja
    setJpLanguage(text)
    return new Promise((resolve, reject) => {
      try {
        if (text && !reStart) Speech.speak(text, { language: 'ja', rate: 1.0, pitch: 1.0 });
        (() => {
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start()
        })()
        resolve('jaListen')
      } catch (e) {
        reject(e)
      }
    })
  }

  async function storeData(dataArray: Array<string>, valueNumber: number): Promise<void> {
    dataArray.push(valueNumber.toString())
    let value: string = dataArray.join(',')
    try {
      await AsyncStorage.setItem('history', value)
    } catch (e) {
      // saving error
    }
  }

  async function getData(): Promise<Array<string> | undefined> {
    try {
      const value: string | null = await AsyncStorage.getItem('history')
      if (value !== null) {
        return value.split(',')
      }
    } catch (err) {
      return undefined
    }
  }

  function enListen(setListen: EnglishData, reStart: boolean = false) {
    let text: string | undefined = ''
    resumeFrom.current = 'enListen'
    text = setListen?.en
    setEnLanguage(text)
    return new Promise((resolve) => {
      if (text && !reStart) Speech.speak(text, { language: 'en', rate: 1.0, pitch: 1.0 });
      (() => {
        Animated.timing(opacityAnswer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start()
      })()
      resolve('enListen')
    })
  }

  async function actionListen() {
    let actionNumber: number
    let setListen: EnglishData = {}

    let historyData = await getData() || []

    console.log(`161: ${routeParams}`)

    async function getActionNumber(historyData: string[]): Promise<number> {
      let num: number
      if (routeParams !== undefined) {
        num = ENGLISH_DATA.findIndex((u) => u.id === routeParams)
      } else {
        do {
          num = Math.floor(Math.random() * ENGLISH_DATA.length)
        } while (historyData.includes(num.toString()))
      }
      return num
    }

    actionNumber = await getActionNumber(historyData)

    setListen = ENGLISH_DATA[actionNumber]
    let imgPath: ImgPath = ING_PATH

    if (setListen.img) setLanguageImg(imgPath[setListen.img])

    if (routeParams === undefined) storeData(historyData, actionNumber)

    isListen.current = setListen
    await question(setListen)
    console.log('一連の処理終わり')

    if (!isStopped.current && routeParams === undefined) actionListen()
  }
  
  async function question(setListen: EnglishData): Promise<void | string> {
    async function executeSteps(steps: (() => Promise<void | unknown>)[]) {
      for (const step of steps) {
        await new Promise((resolve) => {
          const checkAction = setInterval(() => {
            if (!isStopped.current) {
              clearInterval(checkAction)
              loopInterval.current = false
              resolve(null)
            }
          }, 500)
        })
        await step()
      }
    }

    opacityImg.setValue(1)
    opacity.setValue(0)
    opacityAnswer.setValue(0)

    setJpLanguage('')
    setEnLanguage('')
    
    await executeSteps([
      firstSound,
      () => sleep(1),
      () => jaListen(setListen),
      () => sleep(4),
      () => enListen(setListen),
      () => sleep(4)
    ])
    loopInterval.current = true
  }

  async function switchListen() {
    isStopped.current = !isStopped.current
    Speech.stop()
    showModal()
  }

  // ListenScreen（親component）で使用するonOff関数
  useImperativeHandle(ref, () =>
  ({
    async switchFunc() {
      isStopped.current = !isStopped.current
      if (!isStopped.current && loopInterval.current) {
        actionListen()
      } else {
        Speech.stop()
      }
    }
  })
  )

  return (
    <TouchableOpacity style={styles.listenContent} onPress={switchListen}>
      <Image
        style={styles.headerImg}
        source={languageImg}
      />
      <Animated.View style={{ opacity: interOpacity }}>
        <ImageBackground
          source={require('../assets/icon_1.jpg')}
          resizeMode="contain"
          style={styles.textBox}
        >
          <Animated.View style={{ opacity: opacity }}>
            <Text style={styles.text} adjustsFontSizeToFit>
              {jpLanguage}
            </Text>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
      <ImageBackground
        source={require('../assets/icon_2.jpg')}
        resizeMode="contain"
        style={styles.textBox}
      >
        <Animated.View style={{ opacity: opacityAnswer }}>
          <Text style={styles.text} adjustsFontSizeToFit>
            {enLanguage}
          </Text>
        </Animated.View>
      </ImageBackground>
    </TouchableOpacity>
  )
})

export default ListenContent

const styles = StyleSheet.create({
  listenContent: {
    width: 350,
  },
  headerImg: {
    alignItems: 'center',
    width: '100%',
    resizeMode: 'contain'
  },
  textBox: {
    justifyContent: 'center',
    height: 120,
    marginTop: 20
  },
  text: {
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  centeredView: {
    alignItems: 'center',
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    opacity: 0.5
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})
