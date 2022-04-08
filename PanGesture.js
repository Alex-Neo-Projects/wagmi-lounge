import { useContext, useEffect } from 'react'; 
import { SocketContext} from './context/socket'; 
import { Text } from 'react-native';

export function PanGesture() {
  const socket = useContext(SocketContext)

  useEffect(() => {
  });

  return(
    <Text>socket</Text>
  );
}