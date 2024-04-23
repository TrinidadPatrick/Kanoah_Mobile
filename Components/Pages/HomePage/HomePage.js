import { View, Text, Button, Image, ScrollView } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import http from '../../../http';
import { SearchBar } from 'react-native-elements';
import TopRatedServices from './TopRatedServices';
import useServices from '../../CustomHooks/AllServiceProvider';
import RecentServices from './RecentServices';
import Categories from './Categories';
import HomeServiceList from './HomeServiceList';

const HomePage = (props) => {
    const {services, getServices} = useServices()
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

    // console.log(services)


  return (
    <View style={{rowGap : 15}} className="bg-gray-100 w-full h-full flex flex-col items-center justify-start p-2 ">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{display : 'flex', flexDirection : 'column', rowGap : 15}}>
      <View className="w-full flex items-center bg-themeBlue rounded-md">
      <Image  style={{width: 170, height: 60, objectFit : "contain"}} source={require('../../../Utilities/Images/Logo1.png')} />
      </View>

      {/* Search bar */}
      {/* <View className="w-full rounded-md">
        <SearchBar containerStyle={{
          backgroundColor: 'white', // set background color to transparent
          borderWidth: 2,  
          borderRadius : 10,       // set border bottom width
          borderColor : 'white',
          height : 50,
          display : 'flex',
          alignItems : 'center',
          justifyContent : 'center'
        }} 
        inputStyle={{
          height : 50
        }}
        platform='android'
        placeholder='Search services'
         lightTheme>

        </SearchBar>
      </View> */}
      
      {/* Top Rated Services */}
      <View className="w-full">
        <TopRatedServices services={services} navigation={navigation} />
      </View>

      {/* Categories */}
      <View className="w-full">
        <Categories />
      </View>


      {/* RecentServices */}
      <View className="w-full">
        <RecentServices services={services} navigation={navigation} />
      </View>

      {/* Lists */}
      <View className="w-full">
        <HomeServiceList navigation={navigation} services={services} />
      </View>

      </ScrollView>
    </View>
  )
}




export default HomePage