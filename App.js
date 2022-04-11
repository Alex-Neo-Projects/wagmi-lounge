import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Image } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from './context/socket'
import { Ball } from './Ball'; 

export default function App() {
  const socket = useContext(SocketContext)

  const x = useSharedValue(0)
  const y = useSharedValue(0)

  const [xValue, setXValue] = useState()
  const [yValue, setYValue] = useState()

  const [socketX, setSocketX] = useState({})
  const [socketY, setSocketY] = useState({})

  const [users, setUsers] = useState({})

  const uas = useAnimatedStyle(() => {
    return {
      height: 100,
      width: 100,
      borderRadius: 100,
      transform: [{ translateX: x.value }, { translateY: y.value }],
    }
  })

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = x.value
      ctx.startY = y.value
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX
      y.value = ctx.startY + event.translationY

      runOnJS(setXValue)(x.value)
      runOnJS(setYValue)(y.value)
    },
  })

  useEffect(() => {
    socket.on('position', (msg) => {
      setUsers(JSON.parse(msg))
    })
  }, [])

  useEffect(() => {
    // update x,y coordinates whenever we receive an emit from the server
    Object.entries(users).map(([key, value]) => {
      if (!(key === socket.id)) {
        let socketXCopy = { ...socketX }; 
        socketXCopy[socket.id] = value.x;
        
        let socketYCopy = { ...socketY }; 
        socketYCopy[socket.id] = value.y;
        
        setSocketX(socketXCopy)
        setSocketY(socketYCopy)
      }
    })
  }, [users])

  useEffect(() => {
    // emit x,y coordinates of current user to the server
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
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                borderColor: 'black',
                borderWidth: 5,
              }}
              source={{ uri: users[socket.id] === undefined ? null : users[socket.id].currImage}}
            />
          </Animated.View>
        </PanGestureHandler>
        {/* loop thru and show circles for the other users connected to the socket */}
        {Object.entries(users).map(([key, value]) => {
          if (!(key === socket.id)) {
            return(<Ball x={users[key].x} y={users[key].y} imageUrl={users[key].currImage} key={key}/>);
          }
        })}
      </View>
      <StatusBar style="auto" />
    </SocketContext.Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
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
