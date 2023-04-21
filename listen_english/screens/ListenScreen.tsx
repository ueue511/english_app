import React, { useRef, useState } from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import GestureRecognizer from 'react-native-swipe-gestures'
import { Icon, Overlay } from '@rneui/themed'
import ListenContent from '../components/ListenContent'
import NaveTabu from '../components/module/NaveTabu'

import { ListenContentMethods } from '../components/ListenContent'

interface navigationProps {
  goBack: () => void;
}

function ListenScreen() {
  const [isStop, setIsStop] = useState(true)
  const [defaultIcon, setDefaultIcon] = useState('play-circle')
  const childCompRef = useRef<ListenContentMethods>(null)

  const navigation = useNavigation<navigationProps>()

  function startListen() {
    setIsStop(false)
    setDefaultIcon('pause-circle')
    childCompRef.current?.switchFunc()
  }

  function showModal() {
    setIsStop(true)
  }

  const swipeFromLeftOpen = () => {
    setIsStop(false)
    navigation.goBack()
  }

  const onSwipeConfig = {
    directionalOffsetThreshold: 30,
  }

  return (
    <View style={styles.container}>
      <ListenContent
        showModal={showModal}
        ref={childCompRef}
      />
      <NaveTabu
        routeNameLeft={'top'}
        routeNameRight={'history'}
      />
      <GestureRecognizer
        onSwipeLeft={swipeFromLeftOpen}
        config={onSwipeConfig}
      >
        <Overlay
          isVisible={isStop}
          onBackdropPress={startListen}
          overlayStyle={
            {
              backgroundColor: undefined,
              shadowColor: undefined,
              shadowOpacity: undefined,
              shadowRadius: undefined,
              elevation: undefined // androidの影なし
            }
          }
        >
          <Icon
            color='#fff'
            name={defaultIcon}
            onPress={startListen}
            size={200}
            type='font-awesome-5'
          />
        </Overlay>
      </GestureRecognizer>
    </View>
  )
}

export default ListenScreen

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
