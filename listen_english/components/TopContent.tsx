import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Button from './atoms/Button'

interface navigationProps {
  navigate: (screen?: string) => void;
  // TODO必要ないが残してくおく
  goBack: () => void;
}

function TopContent() {
  const navigation = useNavigation<navigationProps>()

  return (
    <View style={styles.topContent}>
      <Button
        text={'Listen'}
        justifyContent={'center'}
        route={() => navigation.navigate('listen')}
      />
    </View>
  )
}

export default TopContent

const styles = StyleSheet.create({
  topContent: {
    backgroundColor: 'fff',
    borderColor: '#A5CFCF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderWidth: 10,
    flex: 1,
    marginTop: '5%',
    width: '100%'
  }
})
