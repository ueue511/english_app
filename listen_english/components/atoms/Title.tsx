import {
  Image,
  StyleSheet,
  View
} from 'react-native'

function Title () {
  return (
    <View>
      <Image
        style={styles.headerImg}
        source={require(`../../assets/splash.png`)}
      />
    </View>
  )
}

export default Title

const styles = StyleSheet.create({
  headerImg: {
    height: 80,
    width: 300,
  }
})
