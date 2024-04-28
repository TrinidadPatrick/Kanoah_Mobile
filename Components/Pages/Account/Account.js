import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React, { useCallback, useState } from 'react'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import useInfo from '../../CustomHooks/UserInfoProvider';
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import http from '../../../http';
import authStore from '../../../Stores/AuthState';
import axios from 'axios';
import serviceStore from '../../../Stores/UserServiceStore';

const Account = ({navigation}) => {
  const {service} = serviceStore()
  const {authState, setAuthState} = authStore()
  const {isLoggedIn, userInformation, setIsLoggedIn} = useInfo()
  
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken")
      unregisterIndieDevice(userInformation._id, 19825, 'bY9Ipmkm8sFKbmXf7T0zNN');
      axios.delete(`https://app.nativenotify.com/api/app/indie/sub/19825/bY9Ipmkm8sFKbmXf7T0zNN/${userInformation._id}`)
      setAuthState("loggedOut")
      setIsLoggedIn(false)
      navigation.navigate("Home")
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <View className="bg-white h-full flex flex-col px-5 py-5 relative">
      <Text className="text-4xl font-medium">Settings</Text>
      {
        authState === "loggedOut" ? 
        <View className="w-full h-full flex flex-row justify-center items-center">
          <TouchableOpacity onPress={()=>{navigation.navigate("Login");setIsLoggedIn(null)}} className="bg-themeOrange px-4 py-2 rounded-sm">
            <Text className="text-white">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('Register')} className=" px-4 py-2 rounded-sm">
            <Text className="text-black">Sign up</Text>
          </TouchableOpacity>
        </View>
        :
      <View className="h-[95%]">
      <View className="mt-10">
        <View className="flex flex-row items-center gap-2 border-b-[1px] pb-2 border-gray-300">
        <FontAwesome name="user-o" size={20} color="black" />
        <Text className="font-medium text-lg ">Account</Text>
        </View>
        
        {/* Options */}
        <View style={{rowGap : 20}} className="mt-5 flex flex-col">
            {/* Edit Profile */}
            <TouchableOpacity onPress={()=>navigation.navigate('Profile')} className="flex flex-row items-center justify-between">
            <Text className="font-medium text-gray-500">Edit Profile</Text>
            <FontAwesome name="angle-right" size={25} color="black" />
            </TouchableOpacity>
            {/* Bookings */}
            <TouchableOpacity onPress={()=>navigation.navigate('ClientBookings')} className="flex flex-row items-center justify-between">
            <Text className="font-medium text-gray-500">Your Bookings</Text>
            <FontAwesome name="angle-right" size={25} color="black" />
            </TouchableOpacity>
            {/* Blocked Services */}
            <TouchableOpacity onPress={()=>navigation.navigate('BlockedServices')} className="flex flex-row items-center justify-between">
            <Text className="font-medium text-gray-500">Blocked Services</Text>
            <FontAwesome name="angle-right" size={25} color="black" />
            </TouchableOpacity>
            {/* Favorites */}
            <TouchableOpacity onPress={()=>navigation.navigate('Favorites')} className="flex flex-row items-center justify-between">
            <Text className="font-medium text-gray-500">Favorites</Text>
            <FontAwesome name="angle-right" size={25} color="black" />
            </TouchableOpacity>
            
        </View>
      </View>

      <View className="mt-10">
        <View className="flex flex-row items-center gap-2 border-b-[1px] pb-2 border-gray-300">
        <Entypo name="log-out" size={20} color="black" />
        <Text className="font-medium text-lg ">My Service</Text>
        </View>
        
        {/* Options */}
        {
          service === null?
          <View className="h-[250] flex-col items-center justify-center space-y-2">
            <Text className="font-medium text-gray-600">You are currently not registered to a service</Text>
            <TouchableOpacity onPress={()=>{Linking.openURL('https://web-based-service-finder.vercel.app/serviceRegistration')}} className="bg-gray-50 px-3 py-2">
              <Text>Add service</Text>
            </TouchableOpacity>
          </View>

          :
          <View style={{rowGap : 20}} className="mt-5 flex flex-col">
          {/* Edit Profile */}
          <TouchableOpacity onPress={()=>navigation.navigate("ServiceDashboard",{userInformation})} className="flex flex-row items-center justify-between">
          <Text className="font-medium text-gray-500">Dashboard</Text>
          <FontAwesome name="angle-right" size={25} color="black" />
          </TouchableOpacity>
          {/* Bookings */}
          <TouchableOpacity onPress={()=>navigation.navigate("MyService",{userInformation})} className="flex flex-row items-center justify-between">
          <Text className="font-medium text-gray-500">My Service</Text>
          <FontAwesome name="angle-right" size={25} color="black" />
          </TouchableOpacity>
          {/* Service Bookings */}
          <TouchableOpacity onPress={()=>navigation.navigate("ServiceBookings")} className="flex flex-row items-center justify-between">
          <Text className="font-medium text-gray-500">Bookings</Text>
          <FontAwesome name="angle-right" size={25} color="black" />
          </TouchableOpacity>
          {/* Favorites */}
          <TouchableOpacity onPress={()=>navigation.navigate("ServiceReviews")} className="flex flex-row items-center justify-between">
          <Text className="font-medium text-gray-500">Reviews</Text>
          <FontAwesome name="angle-right" size={25} color="black" />
          </TouchableOpacity>
          
      </View>
        }
      </View>


      <TouchableOpacity onPress={()=>logout()} style={{ alignSelf: 'center', paddingHorizontal: 15, paddingVertical : 10, shadowColor: '#171717'}} className="flex bg-white shadow-sm flex-row items-center rounded-full absolute bottom-0">
        <Entypo name="log-out" size={20} color="red" />
        <Text className="font-medium text-red-500">Logout</Text>
      </TouchableOpacity>
      </View>
      }
      
    </View>
  )
}

export default Account