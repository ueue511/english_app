import React, { useRef, useEffect, useState } from 'react'
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native'
import * as Speech from 'expo-speech'
import { Audio } from 'expo-av'

import { ENGLISH_DATA } from '../constants'

type EnglishData = {
  id?: string,
  ja?: string,
  en?: string,
  img?: string
}


function ListenContent() {
  const [jpLanguage, setJpLanguage] = useState<string>()
  const [enLanguage, setEnLanguage] = useState<string>()

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

  // useEffect(() => {
  //   if (action) {
  //     actionListen()
  //   } else {
  //     clearTimeout(loopInterval)
  //   }
  // }, [action])
  
  // useEffect(() => {
  //   let isMounted = true
  //   if (isMounted && action) {
  //     question(setListen)
  //   }
  //   return () => {
  //     isMounted = false
  //   };
  // }, [action])

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
    let actionNumber: number = 0
    let setListen: EnglishData = {}

    actionNumber = Math.floor(Math.random() * 4)
    setListen = ENGLISH_DATA[actionNumber]

    isListen.current = setListen

    await question(setListen)

    if (!isStopped.current === false) return 
    console.log('最初の処理終わり')

    await sleep(5)
    resumeFrom.current = 'start'

    if (!isStopped.current) actionListen()
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
          }, 100)
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
      () => sleep(2),
      () => jaListen(setListen),
      () => sleep(5),
      () => enListen(setListen),
    ])
  }

  async function switchListen() {
    isStopped.current = !isStopped.current
    if (!isStopped.current && loopInterval.current) {
      actionListen()
    } else {
      Speech.stop()
    }
  }

  return (
    <TouchableOpacity style={styles.listenContent} onPress={switchListen}>
      <Image
        style={styles.headerImg}
        source={require(`../assets/01.jpg`)}
      />
      <Animated.View style={{ opacity: interOpacity }}>
        <ImageBackground
          source={require(`../assets/icon_1.jpg`)}
          resizeMode="contain"
          style={styles.textBox}
        >
          <Animated.View style={{ opacity: opacity }}>
            <Text style={styles.text}>
              {jpLanguage}
            </Text>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
      <ImageBackground
        source={require(`../assets/icon_2.jpg`)}
        resizeMode="contain"
        style={styles.textBox}
      >
        <Animated.View style={{ opacity: opacityAnswer }}>
          <Text style={styles.text}>
            {enLanguage}
          </Text>
        </Animated.View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default ListenContent

const styles = StyleSheet.create({
  listenContent: {
    width: 350,
  },
  headerImg: {
    alignItems: 'center',
    width: '95%',
    resizeMode: 'contain'
  },
  textBox: {
    justifyContent: 'center',
    height: 120,
    marginTop: 20
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center'
  },
})
