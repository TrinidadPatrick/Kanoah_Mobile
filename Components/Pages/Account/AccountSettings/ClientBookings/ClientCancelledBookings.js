import { View, Text, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import io from 'socket.io-client'
import http from '../../../../../http';
import { useFocusEffect } from '@react-navigation/native';

const ClientCancelledBookings = ({navigation}) => {
  const [cancelledBookings, setCancelledBookings] = useState(null)

  useFocusEffect(

    React.useCallback(() => {
      const getCancelledBooking = async () => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if(accessToken)
        {
          try {
            const result = await http.get('Mobile_CLIENT_getCancelledBooking', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            })
  
            setCancelledBookings(result.data)
          } catch (error) {
            console.log(error)
            return
          }
        }
      }

      getCancelledBooking()

      return () => {
      };
    }, [])
  )

  return (
    <View className="flex-1 bg-[#f9f9f9]">
    {
      cancelledBookings?.length === 0 ?
      <View className="flex-1 flex-row justify-center items-center">
      <Text className="text-gray-500">No bookings yet</Text>
      </View>
      :
      <FlatList
    className="mt-3"
    data={cancelledBookings?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => {
      const bookingDate = new Date(item.schedule.bookingDate).toLocaleDateString('EN-US', {
        month : 'short', 
        day : '2-digit',
        year : 'numeric'
      })
      return (
      <View 
      key={item._id} className="w-full flex-col justify-start shadow-md bg-white mt-3  overflow-hidden fit">
        {/* Header */}
        <TouchableOpacity onPress={()=>navigation.navigate('ViewService', {serviceId : item.shop._id})} className=" flex-row justify-between items-center p-2 border-b-[1px] border-gray-100">
        <Text className="text-gray-500 font-medium">{item.shop.basicInformation.ServiceTitle}</Text>
            <View className="flex-row gap-x-2 items-center">
              <Text className="text-themeOrange">Cancelled</Text>
              <FontAwesome name="angle-right" size={25} color="gray" />
            </View>   
        </TouchableOpacity>
        {/* Body */}
        <TouchableOpacity onPress={()=>navigation.navigate('BookingDetails', {bookingDetails : item})} className="w-full flex-col px-2 mt-3">
          <View className="w-full flex-row border-b-[1px] pb-4 border-gray-100">
            {/* Image */}
            <View className="w-24 flex-none rounded-sm overflow-hidden aspect-square bg-black">
              <Image style={{objectFit : 'cover'}} source={{uri : item.shop.serviceProfileImage }} className="w-full h-full" />
            </View>
          {/* Service and Price  */}
          <View className="flex-1 flex-col justify-between px-2">
          <View className="flex-row justify-between">
            <Text numberOfLines={1} className="text-base text-gray-500 font-medium">{item.service.selectedService}</Text>
          </View>
          <View className="flex-row justify-between ">
            <Text numberOfLines={1} className="text-xs text-gray-400 p-1 bg-gray-100 ">Variant: {item.service.selectedVariant ? item.service.selectedVariant?.type : "None"}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text numberOfLines={1} className="text-sm text-gray-400">{item.schedule.serviceOption}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text numberOfLines={1} className="text-sm text-gray-400">{bookingDate}, {item.schedule.timeSpan[0]} - {item.schedule.timeSpan[1]}</Text>
          </View>
          </View>

          </View>
          {/* Price */}
          <View className={`w-full flex-row justify-between py-2 px-2 border-gray-100 `}>
            <Text className="text-right font-medium text-gray-500">Total Amount</Text>
            <Text className="text-right font-medium text-gray-500">₱{item.net_Amount}</Text>
          </View>
         
        </TouchableOpacity>
      </View>
      )
    }}
  />
    }
    
  </View>
  )
}

export default ClientCancelledBookings