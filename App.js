import React, { createContext, useContext, useEffect, useState } from 'react';
import 'react-native-gesture-handler';

import Login from './Screens/Login';
import Register from './Screens/Register';
import Home_Fireauth from './Screens/Home_Fireauth';
import Home_Resident from './Screens/Home_Resident';
import Chat1 from './Screens/Chat1';
import Chat from './Screens/Chat';

import { onAuthStateChanged } from 'firebase/auth';
import { AuthProvider } from './Firebase/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { auth } from './Firebase/firebase'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return(
    <AuthenticatedUserContext.Provider value={{user, setUser}}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}

function ChatStack (){
  return(
    <Stack.Navigator defaultScreenOptions={Home_Resident}>
      <Stack.Screen name="Home_Resident" component={Home_Resident} options={{ headerShown: false }} />
      <Stack.Screen name="Home_Fireauth" component={Home_Fireauth} options={{ headerShown: false }} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator defaultScreenOptions={Login}>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function RootNavigator(){
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setLoading] = useState(true);
  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth,
      async authenticatedUser =>{
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setLoading(false);
      }
    )
    return () => unsubscribe();
  }, [user]);

  if(isLoading){
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    )
  }

  return(
    <NavigationContainer>
      { user ? <ChatStack/> : <AuthStack/> }
    </NavigationContainer>
  )
}


export default function App(){
  return(
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  )
}




