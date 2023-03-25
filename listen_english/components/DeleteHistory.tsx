import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Button from './atoms/Button' 

interface navigationProps {
  navigate: (screen?: string) => void;
  // TODO必要ないが残してくおく
  goBack: () => void;
}

function DeleteHIstory() {
  const navigation = useNavigation<navigationProps>()
  return (
    <View style={styles.DeleteContent}>
      <Text style={styles.text}>
        今まで聞いた
        英語の記録が
        消えますが、
        いいですか？
      </Text>
      <Button
        text={'リセット'}
        justifyContent={'flex-start'}
        route={() => navigation.navigate('top')}
      />
    </View>
  )
}
export default DeleteHIstory

const styles = StyleSheet.create({
  DeleteContent: {
    backgroundColor: 'fff',
    borderColor: '#A5CFCF',
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    borderWidth: 10,
    flex: 1,
    marginTop: '5%',
    width: '100%'
  },
  text: {
    marginTop: 100,
    flex: 1,
    fontSize: 40,
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center'
  }
})
