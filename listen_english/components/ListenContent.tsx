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

type setListen = {
  ja: string,
  en: string,
}


function ListenContent() {
  const [jpLanguage, setJpLanguage] = useState<string>()
  const [enLanguage, setEnLanguage] = useState<string>()

  const [action, setAction] = useState(false)

  const isStopped = useRef(true)
  const resumeFrom = useRef('start')
  const isLooping = useRef(false)

  let opacity = useRef(new Animated.Value(0)).current
  let opacityImg = useRef(new Animated.Value(1)).current
  let opacityAnswer = useRef(new Animated.Value(0)).current

  let loopInterval: number

  let interOpacity = opacityImg.interpolate({
    inputRange: [0, 150, 300],
    outputRange: [1, 0, 1],
  })

  const sleep = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000))

  useEffect(() => {
    if (action) {
      actionListen()
    } else {
      clearTimeout(loopInterval)
    }
  }, [action])

  // const actionNumber = Math.floor(Math.random() * 4)
  // const setListen = ENGLISH_DATA[actionNumber]
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

  const jaListen = async (setListen: setListen) => {
    let text: string = ''
    text = setListen['ja']
    setJpLanguage(text)
    Speech.speak(text, { language: 'ja', rate: 1.0, pitch: 1.0 });
    (() => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start()
    })()
  }

  const enListen = async (setListen: setListen) => {
    let text: string = ''
    text = setListen['en']
    setEnLanguage(text)
    Speech.speak(text, { language: 'en', rate: 1.0, pitch: 1.0 });
    (() => {
      Animated.timing(opacityAnswer, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start()
    })()
  }

  async function actionListen() {
    if (isStopped.current || isLooping.current) return
    const actionNumber = Math.floor(Math.random() * 4)
    const setListen = ENGLISH_DATA[actionNumber]

    isLooping.current = true;

    if (resumeFrom.current === 'start') {
      await question(setListen)
    } else if (resumeFrom.current === 'jaListen') {
      await jaListen(setListen)
      await sleep(5)
      if (isStopped.current) {
        resumeFrom.current = 'enListen'
        isLooping.current = false
      }
      await enListen(setListen)
    } else if (resumeFrom.current === 'enListen') {
      await enListen(setListen)
    }

    clearTimeout(loopInterval)
    loopInterval = window.setTimeout(() => {
      resumeFrom.current = 'start'
      isLooping.current = false
      actionListen()
    }, 5000)
  }
  
  async function question(setListen: setListen): Promise<void> {
    opacityImg.setValue(1)
    opacity.setValue(0)
    opacityAnswer.setValue(0)

    setJpLanguage('')
    setEnLanguage('')
    await firstSound()
    await sleep(2)
    if (isStopped.current) {
      resumeFrom.current = 'jaListen'
      return
    }
    await jaListen(setListen)
    await sleep(5)
    if (isStopped.current) {
      resumeFrom.current = 'enListen'
      return;
    }
    await enListen(setListen)
  }
  //   async function executeSteps(steps: (() => Promise<void | unknown>)[]) {
  //     for (const step of steps) {
  //       if (isStopped.current) {
  //         await new Promise((resolve) => {
  //           const checkAction = setInterval(() => {
  //             if (isStopped.current) {
  //               clearInterval(checkAction)
  //               resolve(null)
  //             }
  //           }, 100)
  //         })
  //       }
  //       await step()
  //     }
  //   }

  //   while (isStopped.current) {
  //     opacityImg.setValue(1)
  //     opacity.setValue(0)
  //     opacityAnswer.setValue(0)

  //     setJpLanguage('')
  //     setEnLanguage('')

  //     await executeSteps([
  //       firstSound,
  //       () => sleep(2),
  //       () => jaListen(setListen),
  //       () => sleep(5),
  //       () => enListen(setListen),
  //     ])
  //   }
  // }
  // }

  async function switchListen() {
    isStopped.current = !isStopped.current
    if (!isStopped.current) {
      clearTimeout(loopInterval)
      actionListen()
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
