import { View, Text, ScrollView, TouchableOpacity, Linking, BackHandler } from 'react-native'
import React from 'react'
import http from '../../../../../http'
import { useEffect, useState } from 'react'

const ServiceViewStaticBookingDetail = ({route, navigation}) => {
    const bookingInformation = route.params.bookingDetails

    useEffect(() => {
        const backAction = () => {
          navigation.goBack(); // Navigate to specific screen on back button press
          return true; // Prevent default back button behavior
        };
      
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      
        return () => backHandler.remove()
      }, [navigation]);

      
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

      </ScrollView>
    </View>
  )
}

export default ServiceViewStaticBookingDetail