import { View, Text, Button } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const HomePage = (props) => {
    const navigation = props.navigation
    const accessToken = SecureStore.getItem('accessToken')

    const notify = () => {
      axios.post('https://app.nativenotify.com/api/notification', {
        appId: 19825,
        appToken: "bY9Ipmkm8sFKbmXf7T0zNN",
        title: "New Booking",
        body: "You have a new Booking",
        dateSent: "2-24-2024 11:37PM",
        pushData: { yourProperty: "yourPropertyValue" },
      })
    }
    

  return (
    <View className="bg-white w-full h-full flex items-center justify-center">
      <Text className="text-red-500" >HomePage</Text>
      <Button title="Login" onPress={()=>navigation.navigate('Login')} />
    </View>
  )
}

export default HomePage