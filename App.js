import { StatusBar } from 'expo-status-bar'
import {
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated'
import { PanGestureHandler } from 'react-native-gesture-handler'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from './context/socket'
import { Ball } from './Ball'
import { useFonts } from 'expo-font'
import { FONTS } from './utils/constants'

export default function App() {
  const [loaded] = useFonts(FONTS)

  const socket = useContext(SocketContext)

  const x = useSharedValue(0)
  const y = useSharedValue(0)

  const [xValue, setXValue] = useState()
  const [yValue, setYValue] = useState()

  const [socketX, setSocketX] = useState({})
  const [socketY, setSocketY] = useState({})

  const [users, setUsers] = useState({})

  const [text, onChangeText] = useState('')

  const [initial, setInitial] = useState(true)
  const [loading, setLoading] = useState(false)

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

    socket.on('chat', (msg) => {
      setUsers(JSON.parse(msg))
    })

    socket.on('remove', (msg) => {
      setUsers(JSON.parse(msg))
    })
  }, [])

  useEffect(() => {
    if (initial) {
      setLoading(true)
    }

    Object.entries(users).map(([key, value]) => {
      if (!(key === socket.id)) {
        let socketXCopy = { ...socketX }
        socketXCopy[socket.id] = value.x

        let socketYCopy = { ...socketY }
        socketYCopy[socket.id] = value.y

        setSocketX(socketXCopy)
        setSocketY(socketYCopy)
      }
    })

    if (initial) {
      setInitial(false)

      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }, [users])

  useEffect(() => {
    // setTimeout(() => {
      socket.emit(
        'position',
        JSON.stringify({ socketId: socket.id, x: xValue, y: yValue }),
      )
    // }, 500)
  }, [xValue, yValue])

  useEffect(() => {
    socket.emit('chat', JSON.stringify({ chat: text }))
  }, [text])

  if (!loaded) {
    return null
  }

  return (
    <SocketContext.Provider value={socket}>
      {loading ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: '#fafafa',
          }}
        >
          <ActivityIndicator size={30} color="#000000"></ActivityIndicator>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              backgroundColor: '#fafafa',
            }}
          >
            <View
              style={{
                display: 'flex',
                position: 'absolute',
                top: 0,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                paddingTop: 50,
                paddingLeft: 15,
                height: '25%',
                width: '100%',
              }}
            >
              <Text style={{ fontSize: 40, fontFamily: 'SFProRoundedBold' }}>
                wagmi lounge 🛋
              </Text>
            </View>

            <PanGestureHandler onGestureEvent={eventHandler}>
              <Animated.View
                style={[
                  {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  uas,
                ]}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 200,
                    padding: 5,
                    position: 'absolute',
                    bottom: 95,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#000000',
                      fontFamily: 'SFProRoundedBold',
                    }}
                  >
                    {text}
                  </Text>
                </View>

                <Image
                  style={{
                    width: 85,
                    height: 85,
                    borderRadius: 100,
                    borderColor: '#D3D3D3',
                    overflow: 'hidden',
                    borderWidth: 4,
                  }}
                  source={{
                    uri:
                      users[socket.id] === undefined
                        ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAAAAADuvYBWAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA6OSURBVHja7d1rgaM6AIZhJERCJCAhEnBwcLA4KA4mDqgD1kEksA4iAQmcH522uQMz7XRmeJ+fu13I8kEgN6gqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABeQErBQThW4npelmVqORIHytwuFyeOxWFcM18WrvWjULfMF8PROIj+Hvryqac51faN/Mln/w8v/x5nJ/RP/J9rsyzLsgw/9bDV088u/ytCl/P7JuzPbPvdyj8JQt+/lf5HHgXzw8v/itDFfRv2R17oB3uafUjo6lFPg69vwiyE/oGD9hMfhVpCJ3RCJ3RCJ/RfG7rSo9GN+4Db9sMwDOleq22hi7YfjDFm1G2d+UU3mLG9b7brnf2JbjBj52xeqE4Pw6A7tdLx0urBGGOGbJcboVdVVb29d1W8/4k4Tfdf+YOw4jRZa52NWGutNW2U58n90WKHRFL/XbpI7GWv6rJP+37q1e//vrueEeN829qc70lTenb3O51kWK7J2jks/9geL/ST32ptvOO2LPZ+SKRd0vyBWnmOf2HbXGvZCrcMi/J3pKqqqsQYbC0duzLxfr1fZsvfHS10p69FeYc/jvS85Ljt9T9z8idBUGf3iDs7HaqqqrTXfZLIysapR2dGfEJuK/8RQm+8A35K5vX+0yl70O6XijC531ivjp+drbt3WRvsSKavzzl8UKhzV/HttlUqf3uw0Du3V7ItZpo9rvdObJn/zbL851yX7l69f+OfEYvK7DUY7Knn/G5v1cKyXv6DhO6MsZtsZHLjlSJKmbupux3gjXcJB+moU2Zbw9bM76nnC9ccOPTsTc+EP02eFKW75iVRmQr9HO3JPZ2yG1MbntCuNXxVLr+Vxw29cLlcKlOzcqEHCdlxMHPq6HuhTzba1LKlTDr3hDZPw2hS1beYDnhLXwv9etCssZmbXjsa4x65yRgz6jp1wc395URR59TNUxaTTFyL0xTGP4tUd8ti1OXPW5uoisLyX7qPfvN1vi30946UZkrU7ys9cu7mzf1Bq53jpNKhX7uCwsQ7UVXXOfuJ+t2mH8n6dPnpkQtDd9pVffR8tRK6e6GP3mNW3BAIQzd926rb1oKrX6Tv3V0iRe8xPD0PlNCDbL0nGr0k482G3mafjProkvND/xd002abU3JOPL+bzCO99zc9oedC93va52SjJhu6yT4ZuVuScejRBMtlyU3J6uOnQpkfAFKpzRC6fxiDOW86eTrkQi/NnevDSllmGl9x6P75I+LSttkL3bvbC0JPh95lL5QNoTeFg6/Cv5Opdlwq9LnK1tg2+k9FfSw68XeE7oeuMiNhm0LXhVErEUYs0w3uOHST/y/YqEc9GjdpE2Ui9PJSp12hO9egbkNhVLI4sFk4I/oodLeQobdE7UPofujVZ0Kflm0KlUhiv/1a6PXG3RL6M0KfXxO62rhbQ+hPCH15TejNxt3+JfTXhW4eHHq7cb88yL0w9PY1od9HdQn9y0Pvq5eEPrf0yD059HHI0Kp6dOjOPX3O7XboREXozwjd7ln48pQm27aV04T+nHZ6/YWhS0J/YejnPdOPHhe62z8gCP2LQ+9KvelVVVW1qp8RuikM11VVVYlaCUJ/UuiqXM82szu54oGh6/L09dMcLK8h9AeG7i9RCP3xm8sPDF2l5kreDMU5cpLQ94fuhasLQ+T/BTX/A0N3T7a36DqPS9ouK/cDQi+H7s2WcP/iLZP5NalHht6nV05V1W0VdnaO3Buh7w99ObkVqrvC4M35C/FWnNj22dC9uXzu4LxMToxsDrNI+YGhB7OXJ3PrZlPJFemis3Hd8MjQ/bmd47U09WlOVuR1VH5J6Guhi/wa8GCJuBl6PUzJVW8PDV3MwWoq3Q+jv0jHaU+I4hp2Qk8nY7KLCVcWrTot+IeGvmEiRZvuLz7CA91jQu/zWdYr02duM9wfG3phPe3Kwpdib9LvDb3NTzd2G0NOMmLOT0DbtlDcr2Pjy8zmn7S6dBdQOfWz30U3lxe7/zJdIuCm0Lq26WS6wpVSF2r4fzJ5PsXDM1N+KnubmR3db7in5Mv/mx/iReLcds77qJLrNywuCnu2ZPbFBFokK51En22fH0NxiuvfFrJn29yUth9Mq/mNdOK/2eXfx3A/wsGttZsz01KqKlwZfrsu/Qv6vhSxTZycNt+b3meLm9zvdZl8KfW5/d0t9ffUvZczpf4suHyiOkBqe5+vEp0s6hwc/yk+9Nf31fWpYl73e87/F2yiuG3QsJhNlxltlfcSzr+8nV5VldLGDMGhUGdjx+QVUcnWTJNOtmikavu+a+v0YVWdNpO11ppBt+lN98bp2Entd0j/pTobO2bSFKofr/vtVHF8/Vr+CgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwkRoma1rJgTiQ95d62+Y7FEYq3hpUVrcFjdyV+Xd4pa44zcuy2BPJ5mvlta+dmy2xq8w7O1/hX+5dp3i34fvTdsNHztw3gr64Zj0VP9mELe9l3/Y6bLPs+QDfU9n8u6xRVdXGLxHbnxS6ONh3tz5Ab/r69L7tvPZJTn2fG813dd4S+rTrUNvq24SuCPjDoQ+7NqQI/ReEbrfcGoX+Jm9MJ/RHhL6pnV5VVTNaO/WiIvSfFPqfZJfcT3sCJvRdof+OBg6hEzoIHbtDbwZj+tvPRNv33f0fydNoxtyzu2i6YTTGjLrLJCG6wYzO5iqhOj0MQ/YfXH/V9n3f3QcDy6Ffy2GGvqkJfT10+c/9Mvn169TXD4+f8u070XnfTpqHxJj79atM14/hqWFeCl+Bijc8vT9yFkJXp+Bbu4Mi9JXfWvdYNsGH2trsmJw4xR+3tGGNIL2NV2IM+4dShfsTfEP5VAxdmVQfREvoxbrdHTF3Pj0+C++MCAc0/8xbeny0Nxwv47G/+ONrMg5xktnQxdtnup4OG7ozpiK8Ednav778nvq3bKeP91VT4xZDJj+gWOfqBj/BdOgyP4Q8N4Se5eZyCj85nvkiszCFrr5T6taxLKqyG+ZyyNyPkqHL4rSB/wh9S+i2ELr77fWx2MF7Sod+2jDuk03xLRn6v/LQsST09dD9qRciG/pppVtfpUJvN/y8MGZwSvyDtakihtDXQzfRBZgMvQ6q3nEw/gU6i0To84ZpW6pw2SZC9/Zqukapzv/wryD01dDjp99k6Nb7kPVl8/5H1d9SP33f7jSF8d/PkXAGrx2GccpWDe7kz3+3/2U/Zx4qCX0l9OtHyVOht+mGkXc7lunQ7eVTyc5nur0rN7jQ9aUMss+Efk4/DUp70Hmzbui6j6ls6LNuWyVTASeuXq8xLOe4xrapFKMHNp26o8/5hpmKn0bSLYDjXukrfRd+V2pwmBKhq2wlouIa2+amXLtnyPL3/Q+9el/mH+pVtHG/IPV8yGmz6zNnbhWiF3rYP5YI/ZyfZGdKuQQzK/t4hmaT7eMJKv610N97/F8+xevbhX6735nSVMlE6PlDXXXRVW2z8+bFHJ0OujAn35RDfwsLrrq+Pdaz+6bQ/yYOZ70eel1oBovo4rX5WfYmSri0skKV7+kLyxq3TYyMD368+iEOvS0ti5rDTdn8KaKj0OdSkyPRTtf+uJok9M0r2UypBysO3TnSYzTb0ob9IjZ/ivRh6KK4DuMchx525Rjd1IReJOPQ/24I/e+yjQxD79dCV8W1lV2iXZ/oYphNrwShrzzHuUdu2BC6+ZLQ416VJhF6nVuvdcypM27ok4lpVX0wdPu00JviClmZGqHp8i3SQR469O3dsA8M3Va7Q2/3h171hSK8CUL/2tD7rwm9auwnF+sR+sNCN9WjQ68zEyNFb5lF8YWhj0PG/Ynhow9y8UhJfgq0aM1nXqtD6Lue3jfMPNwTer27yXbPvdGm3EYh9M+Eft71Epo9ocviRKfz6rKmuj1PH3itDqGvh97tuoz2hO71tIrClgpr2YTy50sdanD1eaE3a/MOvVd57grdFG7q9bJ5AaPXjGsI/QGhi9TcNiecyXuR7K7QdaF+PyenVxk7m/gmo7/Py+9+Seju7+P6/TpnRX0k9CZ/icrUJIrTfdGTX8cT+qND7wqX+m2e0kfa6d68Cr+NnZwuJbMNM6r3R4fuRmMymaem2ayH7g/m5Cba3kLvssU46PsLnhi6P5jjbvxPPB1jX+jBAPnpsvF4TbQKNzCKzH/+UK+RfWbo3kTW24QVv1/sQ9V7PG5rdK/NnFns0KXXo3uLlwdCf0zo4dCWGXo9BMtW2o+FvmtZk/C7YXRTSykbPS8Hrd2fG3q19v2A+012Z+iFKRptHOW4Ou5zqAv9yaFLu3Ulxd7Qs1seEgMuct68ouNwoa+MNP3dH/pK6s7LJQqhd8ke8jr3VpPUI3ldTn0+2DTJbvuYgy51tuRePyI3zl0ojMll+nObOT0wLlKncV06+ezRpsbW2+9rqvTY4zTK/e2I7GcEvOZTn7/LOJvuVs4nW3vnj3P6yfwMUCOro9HbZ4/cjuZYqjKi+6NMPnQZ/8S5v7korkX6zKaj82kQ/snpda1mZlAYVR2Q3lzHXS+t9KWh8/dHeQ6Xn+voUF8r4POeIrobnm/b7HMDcGExnH9zNEobM3Sb5gu1o5mGXC+1Ohs75t73XrfaGGutnUadXlckWzPl5qGrs7Fjuoh121/eJeq+bUCbyejUXmTTj2YqlgMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4qP8Bya8KDpcESXgAAAAASUVORK5CYII='
                        : users[socket.id].currImage,
                  }}
                />
              </Animated.View>
            </PanGestureHandler>
            {Object.entries(users).map(([key, value]) => {
              if (!(key === socket.id)) {
                return (
                  <Ball
                    x={users[key].x}
                    y={users[key].y}
                    imageUrl={users[key].currImage}
                    key={key}
                    chat={users[key].chat}
                  />
                )
              }
            })}
            <View
              style={{
                display: 'flex',
                height: '24%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
              }}
            >
              <TextInput
                style={{
                  display: 'flex',
                  width: '90%',
                  height: 50,
                  borderColor: '#000000',
                  borderWidth: 3,
                  paddingLeft: 13,
                  paddingRight: 13,
                  borderRadius: 100,
                  fontSize: 20,
                  fontFamily: 'SFProRoundedBold',
                  color: '#ffffff',
                  position: 'absolute',
                  bottom: 25,
                  backgroundColor: '#000000',
                }}
                onChangeText={onChangeText}
                value={text}
                placeholderTextColor={'rgb(142,142,142)'}
                placeholder={'type here'}
                autoCorrect={false}
                maxLength={60}
              />
            </View>
          </View>
          <StatusBar style="auto" />
        </KeyboardAvoidingView>
      )}
    </SocketContext.Provider>
  )
}
