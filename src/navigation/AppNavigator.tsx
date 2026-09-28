import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Import Screens
import Onboarding from '../screens/Onboarding/Onboarding';
import CreateWallet from '../screens/CreateWallet';
import ImportWallet from '../screens/ImportWallet';
import SeedPhrase from '../screens/SeedPhrase';
import Home from '../screens/Home';
import Send from '../screens/Send';
import Receive from '../screens/Receive';
import { Settings} from '../screens/Settings';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="CreateWallet" component={CreateWallet} />
      <Stack.Screen name="ImportWallet" component={ImportWallet} />        
      <Stack.Screen name="SeedPhrase" component={SeedPhrase} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Send" component={Send} />
      <Stack.Screen name="Receive" component={Receive} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};