import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SocketContext, socket } from './context/socket'; 
import { PanGesture } from './PanGesture';

export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <View style={styles.container}>
        <Text>supreme potato 🥔</Text>
        <PanGesture></PanGesture>
        <StatusBar style="auto" />
      </View>
    </SocketContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
