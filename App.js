import React from 'react';
import 'react-native-gesture-handler';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Home_Fireauth from './Screens/Home_Fireauth';
import Home_Resident from './Screens/Home_Resident';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



const App: () => Node = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Home_Resident" component={Home_Resident} options={{ headerShown: false }} />  
        <Stack.Screen name="Home_Fireauth" component={Home_Fireauth} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;


