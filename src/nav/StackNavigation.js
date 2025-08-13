import { createStackNavigator } from '@react-navigation/stack';
import Onboard from '../screens/Onboard';
import Home from '../screens/Home';
import Tips from '../screens/Tips';
import SavedTips from '../screens/SavedTips';
import Game from '../screens/Game';
import Upgrades from '../screens/Upgrades';
import Rocket from '../screens/Rocket';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboard" component={Onboard} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Tips" component={Tips} />
      <Stack.Screen name="SavedTips" component={SavedTips} />
      <Stack.Screen name="Game" component={Game} />
      <Stack.Screen name="Upgrades" component={Upgrades} />
      <Stack.Screen name="Rocket" component={Rocket} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
