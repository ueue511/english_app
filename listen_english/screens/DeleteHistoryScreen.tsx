import React from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import Title from '../components/atoms/Title'

import DeleteHistory from '../components/DeleteHistory'
import NaveTabu from '../components/module/NaveTabu'

function DeleteHistoryScreen() {
  return (
    <View style={styles.container}>
      <Title />
      <DeleteHistory />
      <NaveTabu
        routeNameLeft={'history'}
        routeNameRight={'top'}
      />
    </View>
  )
}

export default DeleteHistoryScreen

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
