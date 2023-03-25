import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import TopScreen from './screens/TopScreen'
import ListenScreen from './screens/ListenScreen'
import HistoryScreen from './screens/HistoryScreen'
import DeleteHistoryScreen from './screens/DeleteHistoryScreen'

const Stack = createStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name='top' component={TopScreen} />
        <Stack.Screen options={{ headerShown: false }} name='listen' component={ListenScreen} />
        <Stack.Screen options={{ headerShown: false }} name='history' component={HistoryScreen} />
        <Stack.Screen options={{ headerShown: false }} name='deleteHistory' component={DeleteHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
