import { View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react';
import React from 'react'

const ServiceOptionList = ({route, navigation}) => {
    const setServiceOption = route.params.setServiceOption
    const serviceOptions = route.params.serviceOptions
    

  return (
    <View className="bg-white flex-1">
    {
        serviceOptions.map((option, index)=>{
            return (
                <View
                className="py-5 border-b-[1px] border-gray-200 px-2 flex-row justify-between"
                key={index}>
                <Text>{option}</Text>
                <TouchableOpacity className="px-3 py-1 bg-themeOrange rounded-sm" onPress={()=>{setServiceOption(option);navigation.goBack()}}>
                    <Text className="text-white">Select</Text>
                </TouchableOpacity>
                </View>
            )
        })
    }
    </View>
  )
}

export default ServiceOptionList