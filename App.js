import 'react-native-gesture-handler';
import { StatusBar as MainStatusbar } from 'expo-status-bar';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './Components/Pages/HomePage/HomePage';
import Login from './Components/Pages/LoginPage/Login';
import Register from './Components/Pages/RegisterPage/Register';
import ForgotPassword from './Components/Pages/LoginPage/ForgotPassword';
import {FontAwesome} from '@expo/vector-icons'
import InputOtp from './Components/Pages/LoginPage/InputOtp';
import NewPassword from './Components/Pages/LoginPage/NewPassword';
import { useEffect, useState, useRef } from 'react';
import registerNNPushToken from 'native-notify';
import axios from 'axios';
import FillInfo from './Components/Pages/RegisterPage/FillInfo';
import VerifyEmailByOtp from './Components/Pages/RegisterPage/VerifyEmailByOtp';
import Explore from './Components/Pages/Explore/Explore';
import TopRatedViewAll from './Components/Pages/HomePage/TopRatedViewAll';
import RecentServicesViewAll from './Components/Pages/HomePage/RecentServicesViewAll';

export default function App() {
  const Stack = createNativeStackNavigator()
  const Tab = createBottomTabNavigator();
  registerNNPushToken(19825, 'bY9Ipmkm8sFKbmXf7T0zNN');



  // Components for home
  const HomeStackScreen = () => (
    <Tab.Navigator>
          <Tab.Screen name="Home" component={HomePage}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
            
          }}

          />
          <Tab.Screen name="Explore" component={Explore}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="list-ul" size={size} color={color} />
            ),
          }}
          />
          <Tab.Screen name="Messages" component={HomePage}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="commenting" size={size} color={color} />
            ),
          }}
          />
          <Tab.Screen name="Notifications" component={HomePage}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bell" size={size} color={color} />
            ),
          }}
          />
          <Tab.Screen name="Account" component={HomePage}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
          />
        </Tab.Navigator>

  );



  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, backgroundColor: 'white', overflow: 'auto' }}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomeStackScreen} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: true }} />
      <Stack.Screen name="ViewAllTopRated" component={TopRatedViewAll} options={{ headerShown: true, headerTitle : "Top Rated Services" }} />
      <Stack.Screen name="RecentServicesViewAll" component={RecentServicesViewAll} options={{ headerShown: true, headerTitle : "Recent Services" }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: true }} />
      <Stack.Screen name="FillInfo" component={FillInfo} options={{ headerShown: true, headerTitle : "Your Information" }} />
      <Stack.Screen name="VerifyEmailByOtp" component={VerifyEmailByOtp} options={{ headerShown: true, headerTitle : "Verify Email" }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true }} />
      <Stack.Screen name="InputOtp" component={InputOtp} options={{ headerShown: true, headerTitle : "Enter Verification Code" }} />
      <Stack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: true, headerTitle : "Enter New Password" }} />
    </Stack.Navigator>
      </NavigationContainer>
      <MainStatusbar style="auto" />
    </View>
  );
}

