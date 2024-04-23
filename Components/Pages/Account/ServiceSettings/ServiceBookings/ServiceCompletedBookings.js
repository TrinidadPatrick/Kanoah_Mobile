import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import http from '../../../../../http'
import serviceStore from '../../../../../Stores/UserServiceStore'

const ServiceCompletedBookings = ({route, navigation}) => {
  const {service} = serviceStore()
  const [completedBookings, setCompletedBookings] = useState(null)
  

  const getCompletedBookings = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken')
      const result = await http.get(`Mobile_getCompletedBooking/${service._id}`, {
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        }
      })

      setCompletedBookings(result.data)
  } catch (error) {
      console.log(error)
  }
  }

  useFocusEffect(
        useCallback(()=>{
          getCompletedBookings()
        },[])
  )


  return (
    <View className="flex-1 bg-[#f9f9f9]">
    {
      completedBookings?.length === 0
      ?
      <View className="flex-1 flex-row justify-center items-center">
        <Text className="text-gray-500">No bookings yet</Text>
      </View>
      :
      <FlatList
      className="mt-3"
      data={completedBookings?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {

        const bookingDate = new Date(item.schedule.bookingDate).toLocaleDateString('EN-US', {
          month : 'short', 
          day : '2-digit',
          year : 'numeric'
        })
        
        return (
        <View 
        key={item._id} className="w-full flex-col justify-start bg-white mt-3 overflow-hidden fit">
          {/* Header */}
          <View className=" flex-row justify-between items-center p-2 border-b-[1px] border-gray-100">
                  <View className="flex-row gap-x-2 items-center">
                  <Text className="text-themeOrange">Completed</Text>
                  </View>     
          </View>
          {/* Body */}
          <TouchableOpacity onPress={()=>navigation.navigate('ServiceViewStaticBookingDetail', {bookingDetails : item})} className="w-full flex-col px-2 mt-3">
            <View className="w-full flex-row border-b-[1px] pb-4 border-gray-100">
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
            <View className={`w-full flex-row justify-between py-2 px-2 border-b-[1px] border-gray-100 `}>
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

export default ServiceCompletedBookings