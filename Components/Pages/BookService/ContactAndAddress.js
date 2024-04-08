import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react';
import phil from 'phil-reg-prov-mun-brgy';
import { SelectList } from 'react-native-dropdown-select-list'
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import axios from 'axios';
import React from 'react'

const ContactAndAddress = ({service, userInformation, bookingInformation, storeBookingInformation, setStep, navigation}) => {
    const [userDetails, setUserDetails] = useState({
        firstname : "",
        lastname : "",
        email : "",
        contact : "",
        Address : {}
    })

    useEffect(()=>{
        if(bookingInformation.contactAndAddress === null)
        {
          setUserDetails({
            firstname : userInformation.firstname,
            lastname : userInformation.lastname,
            email : userInformation.email,
            contact : userInformation.contact,
            Address : userInformation.Address
            })
        }
        else
        {
          setUserDetails({
            firstname : bookingInformation.contactAndAddress?.firstname,
            lastname : bookingInformation.contactAndAddress?.lastname,
            email : bookingInformation.contactAndAddress?.email,
            contact : bookingInformation.contactAndAddress?.contact,
            Address : bookingInformation.contactAndAddress?.Address
            })
        }
          
    },[])

    const submit = () => {
        const finalData = {...bookingInformation, contactAndAddress : userDetails}
        storeBookingInformation(finalData)
        navigation.navigate('BookConfirmation', {
            service, userInformation
        })
    }

  return (
    <View className="flex-1 relative flex flex-col bg-white">
        <Text className="text-lg font-medium text-gray-500 mb-5 px-3 pt-2">Contact and Address</Text>
        <View className="w-full flex-1 flex-col px-3 gap-y-4">
        {/* Firstname */}
        <View className="w-full flex-col">
            <Text className="text-gray-500 mb-1">Firstname<Text className="text-red-500">*</Text></Text>
            <TextInput
            className="px-2 py-2 border border-gray-200 rounded-md text-base"
            value={userDetails.firstname}
            onChangeText={(value)=>{setUserDetails({...userDetails, firstname : value})}}
            />
        </View>
        {/* Lastname */}
        <View className="w-full flex-col">
            <Text className="text-gray-500 mb-1">Lastname<Text className="text-red-500">*</Text></Text>
            <TextInput
            className="px-2 py-2 border border-gray-200 rounded-md text-base"
            value={userDetails.lastname}
            onChangeText={(value)=>{setUserDetails({...userDetails, lastname : value})}}
            />
        </View>
        {/* Email */}
        <View className="w-full flex-col">
            <Text className="text-gray-500 mb-1">Email<Text className="text-red-500">*</Text></Text>
            <TextInput
            className="px-2 py-2 border border-gray-200 rounded-md text-base"
            value={userDetails.email}
            onChangeText={(value)=>{setUserDetails({...userDetails, email : value})}}
            />
        </View>
        {/* Contact */}
        <View className="w-full flex-col">
            <Text className="text-gray-500 mb-1">Contact<Text className="text-red-500">*</Text></Text>
            <TextInput
            className="px-2 py-2 border border-gray-200 rounded-md text-base"
            value={userDetails.contact}
            onChangeText={(value)=>{setUserDetails({...userDetails, contact : value})}}
            />
        </View>
        {/* Address */}
        <TouchableOpacity onPress={()=>navigation.navigate('AddressModal', {
            userInformation, navigation, setUserDetails, userDetails
        })} className="w-full flex-col">
            <Text className="text-gray-500 mb-1">Address<Text className="text-red-500">*</Text></Text>
            <View className=" flex-row border bg-gray-50 border-gray-200 py-2 px-1 rounded-md">
            <View className="flex-1 flex-col">
            {
            userDetails.Address === null
            ?
            <Text className="text-sm">No address yet</Text>
            :
            <>
            <Text className="text-base">{userDetails.Address?.barangay?.name}, {userDetails.Address?.municipality?.name.slice(0,1) + userDetails.Address?.municipality?.name.slice(1).toLowerCase()}, {userDetails.Address?.province?.name}</Text>
            <Text className="text-sm">{userDetails.Address?.street}</Text>
            </>
            }
            </View>
            <View className=" px-1 flex-col justify-center">
            <FontAwesome  name="angle-right" color="gray" size={25} />
            </View>
            </View>
        </TouchableOpacity>
        </View>

        <View className="w-full h-[40] flex flex-row items-center">
        <TouchableOpacity onPress={()=>setStep(2)} className="w-fit px-5 h-full flex flex-row items-center rounded-sm bg-gray-200">
            <Text className="text-gray-600">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{submit()}}  className="flex-1 rounded-sm flex flex-row justify-center items-center bg-themeOrange h-full">
            <Text  className="text-white">Next</Text>
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default ContactAndAddress