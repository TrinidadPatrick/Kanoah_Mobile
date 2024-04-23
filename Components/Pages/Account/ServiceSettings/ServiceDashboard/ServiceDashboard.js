import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import SummaryDetails from './SummaryDetails'
import serviceStore from '../../../../../Stores/UserServiceStore'
import { Icon } from 'react-native-elements'
import { useState } from 'react'
import MonthPickerCS from '../ServiceReviews/MonthPicker'
import SalesAndBookingChart from './SalesAndBookingChart'

const ServiceDashboard = ({navigation}) => {
    const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const {service} = serviceStore()
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const dateNow = `${year}-${month}`;
    const [dateSelected, setDateSelected] = useState(dateNow)
    const [showMonthPicker, setShowMonthPicker] = useState(false)

    const convertToMonthString = (date) => {
        const year = date.split("-")[0]
        const month = date.split("-")[1]
        const monthName = months[month - 1]
        return `${monthName} ${year}`
    } 

    useEffect(()=>{
        navigation.setOptions({
            headerTitle : service?.basicInformation.ServiceTitle
        })
    },[])

  return (
    <ScrollView contentContainerStyle={{flexDirection : 'column', rowGap : 15}} className="flex-1 bg-white p-0">
        {/* Header */}
        <View className="flex-row items-center justify-between p-2">
            <MonthPickerCS showMonthPicker={showMonthPicker} setShowMonthPicker={setShowMonthPicker} dateSelected={dateSelected} setDateSelected={setDateSelected} />
            <Text className="font-medium text-lg">Dasboard</Text>
            <TouchableOpacity onPress={()=>setShowMonthPicker(true)} className="border-[1px] border-gray-300 w-[150] flex-row items-center justify-between rounded-md overflow-hidden bg-white">
            <Text style={{fontSize : 13}} className="px-2">{convertToMonthString(dateSelected)}</Text>
            <Icon color='gray' className=" p-1" type='material-community' name='calendar-blank-outline' size={23} />
            </TouchableOpacity>
        </View>
      <SummaryDetails service={service} dateSelected={dateSelected} />
      <SalesAndBookingChart service={service} dateSelected={dateSelected} />
    </ScrollView>
  )
}

export default ServiceDashboard