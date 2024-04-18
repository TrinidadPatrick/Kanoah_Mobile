import { View, Text, ScrollView, TouchableOpacity, Linking, BackHandler, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import http from '../../../../../http'
import { useEffect, useState } from 'react'

const ServiceViewBookingDetails = ({route, navigation}) => {
  const [loading, setLoading] = useState(false)
  const bookingInformation = route.params.bookingDetails
  const inProgressBookings = route.params.inProgressBookings
  const setInProgressBookings = route.params.setInProgressBookings
  const socket = route.params.socket

  const convertTo12HourFormat = (time24) => {
    if(time24 !== "")
    {
      // Split the time string into hours and minutes
    const [hours, minutes] = time24.split(':').map(Number);
  
    // Determine AM/PM and convert hours to 12-hour format
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Handle midnight (0) as 12

    // console.log(minutes)
  
    // Format the time in 12-hour format (e.g., "4:55 PM")
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${meridiem}`;
    }
  };

  useEffect(() => {
    const backAction = () => {
      navigation.goBack(); // Navigate to specific screen on back button press
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
    setLoading(true)
    const status = "CANCELLED"
    const index = inProgressBookings.findIndex(booking => booking._id === bookingId)
    if(index !== -1)
    {
        const newBooking = [...inProgressBookings]
        newBooking[index] = {...newBooking[index], ["status"] : status}
        const filtered = newBooking.filter((booking) => booking.status === "INPROGRESS")
        setInProgressBookings(filtered)
        try {
            const result = await http.patch(`respondBooking/${bookingId}`, {status, updatedAt : new Date()})
            notifyUser(inProgressBookings[index])
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    return ;
  }

  const completeBooking = async (bookingId) => {
    setLoading(true)
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
            navigation.goBack()
            setLoading(false)
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
        navigation.goBack()
    } catch (error) {
        console.error(error)
    }
  }

  return (
    <View className="flex-1  bg-white relative flex-col">
    
    <ScrollView>
      {/* Top Part, service information and booking */}
      <View className="flex-col">
        <Text className="font-medium text-lg px-2 text-blue-500 mt-5">Booking details</Text>
        {/* Booking ID */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Booking ID</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.booking_id}</Text>
        </View>
        {/* Service */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Service</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.service.selectedService}</Text>
        </View>
        {/* Variant */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Variant</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.service.selectedVariant ? bookingInformation.service.selectedVariant?.type : "None"}</Text>
        </View>
        {/* Service Option */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Service Option</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.schedule.serviceOption}</Text>
        </View>
        {/* Schedule */}
        <View className="flex-row justify-between items-center px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Schedule</Text>
        <View className="flex-col">
        <Text className="font-medium text-gray-900">{new Date(bookingInformation.schedule.bookingDate).toLocaleDateString('EN-US', {
            month : 'long',
            day : '2-digit',
            year : 'numeric'
        })}</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.schedule.timeSpan[0] + " - " + bookingInformation.schedule.timeSpan[1]}</Text>
        </View>
        </View>
        {/* Date issued */}
        <View className="flex-row justify-between items-center px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Date Issued</Text>
        <View className="flex-col">
        <Text className="font-medium text-gray-900">{new Date(bookingInformation.createdAt).toLocaleDateString('EN-US', {
            month : 'long',
            day : '2-digit',
            year : 'numeric'
        })} - {convertTo12HourFormat(new Date(bookingInformation.createdAt).toLocaleTimeString())}</Text>
        </View>
        </View>
      </View>

      {/* Client information */}
      <View className="flex-col">
        <Text className="font-medium text-lg px-2 text-blue-500 mt-5">Client details</Text>
        {/* Name */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Name</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.contactAndAddress.firstname + " " + bookingInformation.contactAndAddress.lastname}</Text>
        </View>
        {/* Email */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Email</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.contactAndAddress.email}</Text>
        </View>
        {/* Contact */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Contact</Text>
        <Text className="font-medium text-gray-900">+63{bookingInformation.contactAndAddress.contact}</Text>
        </View>
        {/* Address */}
        <TouchableOpacity onPress={()=>{Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${bookingInformation.contactAndAddress.Address.latitude},${bookingInformation.contactAndAddress.Address.longitude}`)}} className="flex-col px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Address</Text>
        <Text className="font-medium text-gray-900">{
        bookingInformation.contactAndAddress.Address.barangay.name + " " +
        bookingInformation.contactAndAddress.Address.municipality.name.slice(0,1) + bookingInformation.contactAndAddress.Address.municipality.name.slice(1).toLowerCase() + " " +
        bookingInformation.contactAndAddress.Address.province.name.slice(0,1) + bookingInformation.contactAndAddress.Address.province.name.slice(1).toLowerCase() + " " +
        bookingInformation.contactAndAddress.Address.region.name
        }</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.contactAndAddress.Address.street}</Text>
        </TouchableOpacity>

        {/* Account */}
        <View className="flex-col px-2 py-3 ">
        <Text className="font-medium text-lg px-2 text-blue-500 mt-5">Payment</Text>
        <View className="flex-row justify-between px-2 py-3  border-gray-100">
        <Text className="font-medium text-gray-600">Service Amount</Text>
        <Text className="font-medium text-gray-900">₱{bookingInformation?.service.price}</Text>
        </View>
        <View className="flex-row justify-between px-2 py-3  border-gray-100">
        <Text className="font-medium text-gray-600">Service Fee</Text>
        <Text className="font-medium text-gray-900">₱{bookingInformation?.service_fee}</Text>
        </View>
        <View className="flex-row justify-between border-b-[1px] px-2 py-3  border-gray-100">
        <Text className="font-medium text-gray-600">Booking Fee</Text>
        <Text className="font-medium text-gray-900">₱{bookingInformation?.booking_fee}</Text>
        </View>
        <View className="flex-row justify-between px-2 py-3  ">
        <Text className="font-medium text-gray-600">Total amount to pay</Text>
        <Text className="font-medium text-green-500">₱{bookingInformation?.net_Amount}</Text>
        </View>
        </View>

        
      </View>

      {/* Buttons */}
      <View className="space-y-3 mx-3 mb-3">
        <TouchableOpacity onPress={()=>verifyComplete(bookingInformation._id)} className="bg-themeOrange py-3 rounded-md">
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Mark as complete</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>verifyCancel(bookingInformation._id)} className="bg-gray-200 py-3 rounded-md">
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-gray-700">Cancel booking</Text>
          }
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  )
}

export default ServiceViewBookingDetails