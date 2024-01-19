import React, { createContext, useContext, useEffect, useState } from 'react';
import 'react-native-gesture-handler';

import Login from './Screens/Login';
import Register from './Screens/Register';
import Home_Fireauth from './Screens/Home_Fireauth';
import Home_Resident from './Screens/Home_Resident';
import Chat from './Screens/Chat';
import Chat_Fireauth from './Screens/Chat_Fireauth';
import FireReports from './Screens/Reports';


import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { ActivityIndicator, View } from 'react-native';
import { auth } from './Firebase/firebase'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { app, getDatabase, db } from "firebase/database";





const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      const db = getFirestore(app);
      const userRoleRef = doc(db, 'users', user.uid); // Assuming 'users' is the collection containing user data
      const unsubscribe = onSnapshot(userRoleRef, (doc) => {
        setRole(doc.data()?.role || 'Resident'); // Assuming the role is stored in the 'role' field, defaulting to 'resident'
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser, role }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

function ResidentStack() {
  return (
    <Stack.Navigator initialRouteName="Home_Resident" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home_Resident" component={Home_Resident} />
      <Stack.Screen name="Chat" component={Chat} options={{ title: 'Firey', headerShown: true }} />
      <Stack.Screen name="FireReports" component={FireReports} options={{ title: 'Fire Incident Reports', headerShown: true }} screenOptions={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

function FireauthStack() {
  return (
    <Stack.Navigator initialRouteName="Home_Fireauth" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home_Fireauth" component={Home_Fireauth} />
      <Stack.Screen name="Chat_Fireauth" component={Chat_Fireauth} options={{ title: 'Firey', headerShown: true }} />
      <Stack.Screen name="FireReports" component={FireReports} options={{ title: 'Fire Incident Reports', headerShown: true }} screenOptions={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, setUser, role } = useContext(AuthenticatedUserContext);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (role === 'Fireauth' ? <FireauthStack /> : <ResidentStack />) : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}



