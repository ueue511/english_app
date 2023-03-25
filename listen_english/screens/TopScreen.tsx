import React from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import TopContent from '../components/TopContent'
import Title from '../components/atoms/Title'
import NaveTabu from '../components/module/NaveTabu'


function TopScreen() {
  return (
    <View style={styles.container}>
      <Title />
      <TopContent />
      <NaveTabu
        routeNameLeft={'deleteHistory'}
        routeNameRight={'history'}
      />
    </View>
  )
}

export default TopScreen

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
