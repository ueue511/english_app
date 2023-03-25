import React, { useState, useEffect } from 'react'
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import ListenContent from '../components/ListenContent'
import NaveTabu from '../components/module/NaveTabu'

function ListenScreen() {
  return (
    <View style={styles.container}>
      <ListenContent />
      <NaveTabu
        routeNameLeft={'top'}
        routeNameRight={'history'}
      />
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
