import { View, Text, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import io from 'socket.io-client'
import http from '../../../../../http';
import { useNavigation } from '@react-navigation/native';

const ClientInProgressBookings = ({navigation}) => {
  const [inProgressBookings, setInProgressBookings] = useState(null)
  const [socket, setSocket] = useState(null)
  const useNav = useNavigation(); 

  useEffect(()=>{
    setSocket(io("https://kanoah.onrender.com"))
    // setSocket(io("http://localhost:5000"))

  },[])

  useFocusEffect(

  React.useCallback(() => {
    const getInProgressBooking = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      if(accessToken)
      {
        try {
          const result = await http.get('Mobile_CLIENT_getInProgressBooking', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          setInProgressBookings(result.data)
        } catch (error) {
          console.log(error)
          return
        }
      }
    }

    getInProgressBooking()

    return () => {
    };
  }, [])
  )

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
            content : `Booking for ${booking.service.selectedService} on ${bookDate} at ${booking.schedule.bookingTime} has been cancelled by the client`, 
            client : booking.client,
            notif_to : booking.shop.owner,
            reference_id : booking._id
        })
        socket.emit('New_Notification', {notification : 'New_Booking', receiver : booking.shop.owner});
        axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: booking.shop.owner,
            appId: 19825,
            appToken: 'bY9Ipmkm8sFKbmXf7T0zNN',
            title: `Cancelled Booking`,
            message: `Booking for ${booking.service.selectedService} on ${bookDate} at ${booking.schedule.bookingTime} has been cancelled by the client`
       });
    } catch (error) {
        console.error(error)
    }
  }

  const cancelBooking = async (bookingId, differenceInMinutes) => {
    if(differenceInMinutes <= 5)
    {
      const status = "CANCELLED"
    const index = inProgressBookings.findIndex(booking => booking._id === bookingId)
    if(index !== -1)
    {
        const newBooking = [...inProgressBookings]
        newBooking[index] = {...newBooking[index], ["status"] : status}
        const filtered = newBooking.filter((booking) => booking.status === "INPROGRESS")
        setInProgressBookings(filtered)
        try {
            const result = await http.patch(`respondBooking/${bookingId}`, {status})
            notifyUser(inProgressBookings[index])
        } catch (error) {
            console.log(error)
        }
    }
    }

    return ;
  }

  // So when the back button is run, always back to the account page
  useEffect(() => {
  const backAction = () => {
    navigation.navigate("Account"); // Navigate to specific screen on back button press
    return true; // Prevent default back button behavior
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

  return () => backHandler.remove()
  }, [navigation]);


  
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
      const differenceInMilliseconds = Math.abs(new Date() - new Date(item.createdAt));
      // Convert milliseconds to minutes
      const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

        const bookingDate = new Date(item.schedule.bookingDate).toLocaleDateString('EN-US', {
          month : 'short', 
          day : '2-digit',
          year : 'numeric'
        })
        
        return (
        <View 
        key={item._id} className="w-full flex-col justify-start bg-white mt-3 overflow-hidden fit">
          {/* Header */}
          <TouchableOpacity onPress={()=>navigation.navigate('ViewService', {serviceId : item.shop._id})} className=" flex-row justify-between items-center p-2 border-b-[1px] border-gray-100">
                  <Text className="text-gray-500 font-medium">{item.shop.basicInformation.ServiceTitle}</Text>
                  <View className="flex-row gap-x-2 items-center">
                  <Text className="text-themeOrange">In Progress</Text>
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
            <View className={`w-full flex-row justify-between py-2 px-2 ${differenceInMinutes <= 5 && "border-b-[1px]"} border-gray-100 `}>
              <Text className="text-right font-medium text-gray-500">Total Amount</Text>
              <Text className="text-right font-medium text-gray-500">₱{item.net_Amount}</Text>
            </View>
            {/* Cancell button */}
              {
                differenceInMinutes <= 5 &&
                <View className="w-full flex-row justify-end py-3 px-2">
                <TouchableOpacity onPress={()=>cancelBooking(item._id, differenceInMinutes)} className="py-1 px-2 bg-gray-100 ">
                <Text className="text-gray-500">Cancel</Text>
                </TouchableOpacity>
                </View>
              }
           
          </TouchableOpacity>
        </View>
        )
      }}
    />
    }
      
    </View>
  )

}



export default ClientInProgressBookings