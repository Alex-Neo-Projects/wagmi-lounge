import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { StyleSheet, Image } from 'react-native'

export function Ball(props) {
  const uas = useAnimatedStyle(() => {
    return {
      height: 100,
      width: 100,
      borderRadius: 100,
      transform: [
        { translateX: withSpring(props.x === undefined ? 0 : props.x) },
        { translateY: withSpring(props.y === undefined ? 0 : props.y) },
      ],
    }
  })
  
  return (
    <Animated.View style={[styles.ball, uas]}>
      <Image
        style={{
          width: 100,
          height: 100,
          borderRadius: 100,
        }}
        source={{ uri: props.imageUrl}}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ball: {
    backgroundColor: 'green',
    borderRadius: 100,
    width: 100,
    height: 100,
  },
})
