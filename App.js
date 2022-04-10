import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Image } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { useContext, useEffect, useState } from 'react'
import { socket, SocketContext } from './context/socket'

const data = [
  {
    name: 'Cool Cat #1',
    url:
      'https://lh3.googleusercontent.com/jJsUhpTNA_9CwMePUgJZamQW1IIHQgt3Hx1of8Y8EHhKqBsjHU9xb03S79xXzqLpGCVUX243N8dxYNkKaRcc51pFQh6bwZg5F8f-Ig',
  },
  { name: 'Doodle #1', url: '' },
]

export default function App() {
  const socket = useContext(SocketContext)

  const x = useSharedValue(0)
  const y = useSharedValue(0)
  const pressed = useSharedValue(false)

  const [xValue, setXValue] = useState()
  const [yValue, setYValue] = useState()

  const [socketX, setSocketX] = useState(0)
  const [socketY, setSocketY] = useState(0)

  const [users, setUsers] = useState({})

  const uas = useAnimatedStyle(() => {
    return {
      height: 100,
      width: 100,
      borderRadius: 100,
      backgroundColor: pressed.value ? '#FEEF86' : '#001972',
      transform: [{ translateX: x.value }, { translateY: y.value }],
    }
  })

  const uasToo = useAnimatedStyle(() => {
    return {
      height: 100,
      width: 100,
      borderRadius: 100,
      transform: [
        { translateX: withSpring(socketX === undefined ? 0 : socketX) },
        { translateY: withSpring(socketY === undefined ? 0 : socketY) },
      ],
    }
  })

  var balls = [uasToo]

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      pressed.value = true
      ctx.startX = x.value
      ctx.startY = y.value
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX
      y.value = ctx.startY + event.translationY

      runOnJS(setXValue)(x.value)
      runOnJS(setYValue)(y.value)
    },
    onEnd: (event, ctx) => {
      pressed.value = false
    },
  })

  useEffect(() => {
    socket.on('position', (msg) => {
      setUsers(JSON.parse(msg))
    })
  }, [])

  // user1: {x,y}
  // user2: {x,y}
  useEffect(() => {
    Object.entries(users).map(([key, value]) => {
      if (!(key === socket.id)) {
        setSocketX(value.x)
        setSocketY(value.y)
      }
    })
  }, [users])

  useEffect(() => {
    socket.emit(
      'position',
      JSON.stringify({ socketId: socket.id, x: xValue, y: yValue }),
    )
  }, [xValue, yValue])

  return (
    <SocketContext.Provider value={socket}>
      <View style={styles.container}>
        <Text>supreme potato 🥔</Text>

        <PanGestureHandler onGestureEvent={eventHandler}>
          <Animated.View style={[styles.ball, uas]}>
            {/* <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
              }}
              source={{
                uri:
                  'https://lh3.googleusercontent.com/jJsUhpTNA_9CwMePUgJZamQW1IIHQgt3Hx1of8Y8EHhKqBsjHU9xb03S79xXzqLpGCVUX243N8dxYNkKaRcc51pFQh6bwZg5F8f-Ig',
              }}
            /> */}
          </Animated.View>
        </PanGestureHandler>
        {/* 
        {balls.map((curr, idx) => (
          <Animated.View style={[styles.ball, curr]} key={idx.toString()}></Animated.View>
        ))} */}

        {Object.entries(users).map(([key, value]) => {
          // console.log(socket.id)
          if (!(key === socket.id)) {
            return (<Animated.View style={[styles.ball, uasToo]} key={socket.id.toString()}></Animated.View>);

            // setSocketX(value.x)
            // setSocketY(value.y)
          }
        })}
      </View>
      <StatusBar style="auto" />
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
    backgroundColor: 'green',
    borderRadius: 100,
    width: 100,
    height: 100,
  },
})
