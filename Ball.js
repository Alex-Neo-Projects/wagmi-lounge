import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Image, Text, View } from 'react-native'

export function Ball(props) {
  const uas = useAnimatedStyle(() => {
    return {
      height: 60,
      width: 60,
      borderRadius: 100,
      transform: [
        { translateX: withSpring(props.x === undefined ? 0 : props.x) },
        { translateY: withSpring(props.y === undefined ? 0 : props.y) },
      ],
    }
  })

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        padding: 5,
      }}
    >
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
            bottom: 70,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: '#000000',
              fontFamily: 'SFProRoundedBold',
            }}
          >
            {props.chat}
          </Text>
        </View>

        <Image
          style={{
            width: 85,
            height: 85,
            borderRadius: 100,
            borderColor: '#D3D3D3',
            overflow: 'hidden',
          }}
          source={{ uri: props.imageUrl }}
        />
      </Animated.View>
    </View>
  )
}
