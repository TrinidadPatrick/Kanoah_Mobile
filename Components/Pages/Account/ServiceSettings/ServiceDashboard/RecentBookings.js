import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import http from '../../../../../http'
import { Image } from 'react-native-elements'

const RecentBookings = ({service, dateSelected}) => {
    const [selectedFilter, setSelectedFilter] = useState('Completed')
    const [bookings, setBookings] = useState(null)

    const getAccessToken = async () => {
        const accessToken = await SecureStore.getItemAsync("accessToken")
        return accessToken
    }

    useEffect(() => {
        const getDBBookings = async () => {
            try {
                const accessToken = await getAccessToken()
                const result = await http.get(`Mobile_getDBBookings?service=${service._id}&dateFilter=${dateSelected}`, {
                    headers : {"Authorization" : `Bearer ${accessToken}`}
                })
                setBookings(result.data)
            } catch (error) {
                console.error(error)
            }
        }

        service !== null && getDBBookings()
    },[service, selectedFilter, dateSelected])


  return (
    <View className="flex-col flex-1 p-2">
      <Text className="text-gray-700 font-medium text-lg">Recent Bookings</Text>
      {
        bookings !== null && bookings.length !== 0 ?
        <ScrollView contentContainerStyle={{rowGap : 20,}} className="flex-1   mt-2">
        {
          bookings?.sort((a,b)=> new Date(b.schedule.bookingDate) - new Date(a.schedule.bookingDate)).map((booking)=>{
              const date = new Date( booking.schedule.bookingDate).toLocaleDateString('EN-US', {
                  month : 'short',
                  day : '2-digit',
                  year : 'numeric'
              })
              return (
                  <View key={booking._id} className={`flex-row space-x-2`}>
                      <View className="w-[60] aspect-square  rounded-md overflow-hidden">
                          <Image source={{uri : booking.client.profileImage}} style={{width : "100%", height : "100%", objectFit : 'cover'}} />
                      </View>
                      <View className="flex-col flex-1 justify-between ">
                          <Text numberOfLines={1} className="text-base font-medium text-gray-700">{booking.service.selectedService}</Text>
                          <Text numberOfLines={1} className="text-xs font-medium text-gray-500">{booking.schedule.timeSpan[0]} - {booking.schedule.timeSpan[1]} | {date} </Text>
                          <Text numberOfLines={1} className={`text-xs font-medium ${booking.status === "COMPLETED" ? "text-green-500" : booking.status === "CANCELLED" ? "text-red-500" : "text-gray-500"}`}>{booking.status}</Text>
                      </View>
                  </View>
              )
          })
        }
        </ScrollView>
        :
        bookings !== null && bookings.length === 0
        ?
        <View className="flex-1 h-[200] flex-row justify-center items-center bg-gray-50 rounded-md">
            <Text>No bookings yet</Text>
        </View>
        :
        ""
      }
    </View>
  )
}

export default RecentBookings