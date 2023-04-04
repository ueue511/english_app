import React, { useState } from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Icon, Overlay } from '@rneui/themed'
import ListenContent from '../components/ListenContent'
import NaveTabu from '../components/module/NaveTabu'

function ListenScreen() {
  const [isStop, setIsStop] = useState(true)
  return (
    <TouchableOpacity style={styles.container} onPress={() => setIsStop(true)}>
      <ListenContent
        isStop={isStop}
      />
      <NaveTabu
        routeNameLeft={'top'}
        routeNameRight={'history'}
      />
      <Overlay
        isVisible={isStop}
        onBackdropPress={() => setIsStop(false)}
      >
        <Icon
          color="#A5CFCF"
          name="play"
          size={100}
          type="material-community"
        />
      </Overlay>
    </TouchableOpacity>
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
