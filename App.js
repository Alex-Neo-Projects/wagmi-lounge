import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Image } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { useContext } from 'react'
import { socket, SocketContext } from './context/socket'

export default function App() {
  const socket = useContext(SocketContext)

  const startingPositionX = 0
  const startingPositionY = 0

  const x = useSharedValue(0)
  const y = useSharedValue(0)
  const pressed = useSharedValue(false)


  const uas = useAnimatedStyle(() => {
    return {
      height: 100,
      width: 100,
      borderRadius: 100,
      backgroundColor: pressed.value ? '#FEEF86' : '#001972',
      transform: [{ translateX: x.value }, { translateY: y.value }],
    }
  })

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true
      console.log('pressed!')
    },
    onActive: (event, ctx) => {
      x.value = startingPositionX + event.translationX
      y.value = startingPositionX + event.translationY

      console.log(x.value, y.value); 
    },
    onEnd: (event, ctx) => {
      pressed.value = false
      x.value = withSpring(startingPositionX)
      y.value = withSpring(startingPositionY)
    },
  })

  return (
    <SocketContext.Provider value={socket}>
      <View style={styles.container}>
        <Text>supreme potato 🥔</Text>

        <PanGestureHandler onGestureEvent={eventHandler}>
          <Animated.View style={[uas]}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
              }}
              source={{
                uri:
                  'https://lh3.googleusercontent.com/jJsUhpTNA_9CwMePUgJZamQW1IIHQgt3Hx1of8Y8EHhKqBsjHU9xb03S79xXzqLpGCVUX243N8dxYNkKaRcc51pFQh6bwZg5F8f-Ig',
              }}
            />
          </Animated.View>
        </PanGestureHandler>
      </View>
      <StatusBar style='auto'/>
    </SocketContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    backgroundColor: 'red',
    borderRadius: 100,
    width: 100,
    height: 100,
  },
})
