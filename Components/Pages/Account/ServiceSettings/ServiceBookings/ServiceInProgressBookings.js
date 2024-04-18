import { View, Text, FlatList, TouchableOpacity, BackHandler, Image, Alert } from 'react-native'
import { useEffect, useState, useCallback } from 'react'
import http from '../../../../../http'
import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import io from 'socket.io-client'

const ServiceInProgressBookings = ({route, navigation}) => {
  const serviceInfo = route.params.serviceInfo
  const [inProgressBookings, setInProgressBookings] = useState(null)
  const [socket, setSocket] = useState(null)

  useEffect(()=>{
    setSocket(io("https://kanoah.onrender.com"))
    // setSocket(io("http://localhost:5000"))

  },[])


  const getInProgressBookings = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken')
      const result = await http.get(`Mobile_getInProgressBooking/${serviceInfo._id}`, {
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        }
      })

      setInProgressBookings(result.data)
  } catch (error) {
      console.log(error)
  }
  }

  useFocusEffect(
        useCallback(()=>{
          getInProgressBookings()
        },[])
  )

  // So when the back button is run, always back to the account page
  useEffect(() => {
  const backAction = () => {
    navigation.navigate("Account"); // Navigate to specific screen on back button press
    return true; // Prevent default back button behavior
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

  return () => backHandler.remove()
  }, [navigation]);

  const verifyComplete = (bookingId) => {
    Alert.alert('Confirmation', 'Mark this booking as complete?', [
      {
        text : 'Cancel',
      },
      {
        text : 'Yes',
        onPress : () => {completeBooking(bookingId)}
      },
      ],
      )
  }

  const verifyCancel = (itemId) => {
    Alert.alert('Confirmation', 'Cancel this booking?', [
      {
        text : 'Cancel',
      },
      {
        text : 'Yes',
        onPress : () => {cancelBooking(itemId)}
      },
      ],
      )
  }

  const cancelBooking = async (bookingId) => {

    const status = "CANCELLED"
    const index = inProgressBookings.findIndex(booking => booking._id === bookingId)
    if(index !== -1)
    {
        const newBooking = [...inProgressBookings]
        newBooking[index] = {...newBooking[index], ["status"] : status}
        const filtered = newBooking.filter((booking) => booking.status === "INPROGRESS")
        setInProgressBookings(filtered)
        try {
            const result = await http.patch(`respondBooking/${bookingId}`, {status, updatedAt : new Date(), cancelledBy : {
              role : 'Provider',
              user : serviceInfo.userId
            }})
            notifyUser(inProgressBookings[index])
        } catch (error) {
            console.log(error)
        }
    }

    return ;
  }

  const completeBooking = async (bookingId) => {

    const status = "COMPLETED"
    const index = inProgressBookings.findIndex(booking => booking._id === bookingId)
    if(index !== -1)
    {
        const newBooking = [...inProgressBookings]
        newBooking[index] = {...newBooking[index], ["status"] : status}
        const filtered = newBooking.filter((booking) => booking.status === "INPROGRESS")
        setInProgressBookings(filtered)
        try {
            const result = await http.patch(`respondBooking/${bookingId}`, {status, updatedAt : new Date()})
        } catch (error) {
            console.log(error)
        }
    }

    return ;
  }

  const notifyUser = async (booking) => {
    const bookDate = new Date(booking.schedule.bookingDate).toLocaleDateString('EN-US', {
        month : 'short',
        day : '2-digit',
        year : 'numeric'
    })
    try {
        const notify = await http.post('addNotification', {
            notification_type : "Cancelled_Bookings", 
            createdAt : new Date(),
            content : `Your booking for ${booking.service.selectedService} on ${bookDate} at ${booking.schedule.bookingTime} has been cancelled by the service provider. Kindly review your GCash account for the refunded amount.`, 
            client : booking.shop.owner,
            notif_to : booking.client,
            reference_id : booking._id
        })
        socket.emit('New_Notification', {notification : 'New_Booking', receiver : booking.client});
    } catch (error) {
        console.error(error)
    }
  }
  
  return (
    <View className="flex-1 bg-[#f9f9f9]">
    {
      inProgressBookings?.length === 0
      ?
      <View className="flex-1 flex-row justify-center items-center">
        <Text className="text-gray-500">No bookings yet</Text>
      </View>
      :
      <FlatList
      className="mt-3"
      data={inProgressBookings?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
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
                  <Text className="text-themeOrange">In Progress</Text>
                  </View>     
          </View>
          {/* Body */}
          <TouchableOpacity onPress={()=>navigation.navigate('ServiceViewBookingDetails', {bookingDetails : item, inProgressBookings, setInProgressBookings, socket})} className="w-full flex-col px-2 mt-3">
            <View className="w-full flex-row border-b-[1px] pb-4 border-gray-100">
              {/* Image */}
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
            {/* Cancel and complete button */}
              <View className="flex-row items-center justify-end">
                <View className=" py-3 px-2">
                <TouchableOpacity onPress={()=>verifyComplete(item._id)} className="py-1 px-2 bg-green-100 ">
                <Text className="text-green-500">Mark as Complete</Text>
                </TouchableOpacity>
                </View>
                <View className=" py-3 px-2">
                <TouchableOpacity onPress={()=>verifyCancel(item._id)} className="py-1 px-2 bg-gray-100 ">
                <Text className="text-gray-500">Cancel</Text>
                </TouchableOpacity>
                </View>
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

export default ServiceInProgressBookings