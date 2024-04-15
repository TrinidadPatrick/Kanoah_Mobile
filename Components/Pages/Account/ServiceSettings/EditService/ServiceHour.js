import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import http from '../../../../../http'
import React from 'react'

const ServiceHour = ({serviceInfo}) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Holidays'] 
  const [schedule, setSchedule] = useState(
    days.map((day) => ({
      day,
      isOpen: false,
      fromTime: '',
      toTime: '',
    }))
  );
  const [showFromPicker, setShowFromPicker] = useState({Sunday : false, Monday : false, Tuesday : false, Wednesday : false, Thursday : false, Friday : false, Saturday : false, Holidays : false})
  const [showToPicker, setShowToPicker] = useState({Sunday : false, Monday : false, Tuesday : false, Wednesday : false, Thursday : false, Friday : false, Saturday : false, Holidays : false})
  const [loading, setLoading] = useState(false)

  const handleToggle = (day) => {
    const newSchedule = [...schedule]
    const index = newSchedule.findIndex((sched) => sched.day === day)
    newSchedule[index] = {
      day,
      isOpen : !newSchedule[index].isOpen,
      fromTime : !newSchedule[index].isOpen ? "06:00" : "",
      toTime : !newSchedule[index].isOpen ? "18:00" : "",
    }
    setSchedule(newSchedule)
  };

  const handleTimeSelectFrom = async (selectedDate, day) => {
    const newData = [...schedule]
    const date = new Date(selectedDate).toLocaleTimeString().split(":").slice(0, 2)
    const index = newData.findIndex((sched) => sched.day === day)
    newData[index].fromTime = date.join(":")
    setShowFromPicker({...showFromPicker, [day] : false})
  }

  const handleTimeSelectTo = async (selectedDate, day) => {
    const newData = [...schedule]
    const date = new Date(selectedDate).toLocaleTimeString().split(":").slice(0, 2)
    const index = newData.findIndex((sched) => sched.day === day)
    newData[index].toTime = date.join(":")
    setShowToPicker({...showToPicker, [day] : false})
  }
  
  useEffect(()=>{
    setSchedule(serviceInfo.serviceHour)
  },[])

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
  
  const updateService = async () => {
    setLoading(true)
    const accessToken = await SecureStore.getItemAsync('accessToken')
    try {
      const result = await http.patch(`Mobile_updateService/`, {serviceHour : schedule},  {
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        }
      })
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }
  

  return (
    <View className="flex-1">
    <View style={{flexDirection : 'column', justifyContent : 'flex-start'}} className="flex-1 space-y-3 bg-white py-3 px-2">
    {
      schedule?.map((schedule, index) => {
        return (
          <View key={index} className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Switch trackColor={{false: '#f4f3f4', true: '#4185f2'}} thumbColor={schedule.isOpen ? '#4185f2' : '#f4f3f4'} onValueChange={()=>{handleToggle(schedule.day)}} value={schedule.isOpen} />
              <Text>{schedule.day}</Text> 
            </View>
            <View>
              <View className="flex-row items-center">
                <TouchableOpacity className="w-[80] flex-row justify-center py-1.5 rounded-md border border-gray-200 bg-gray-100" onPress={()=>{if(schedule.isOpen){setShowFromPicker({...showFromPicker, [schedule.day] : true})}}}>
                  <Text style={{fontSize : 13}}>{schedule?.fromTime !== "" ? convertTo12HourFormat(schedule?.fromTime) : "--:--"}</Text>
                </TouchableOpacity>
                <Text className="mx-1">-</Text>
                <TouchableOpacity className="w-[80] flex-row justify-center py-1.5 rounded-sm border border-gray-200 bg-gray-100" onPress={()=>{if(schedule.isOpen){setShowToPicker({...showFromPicker, [schedule.day] : true})}}}>
                <Text style={{fontSize : 13}}>{schedule?.fromTime !== "" ? convertTo12HourFormat(schedule?.toTime) : "--:--"}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {
              showFromPicker[schedule.day] &&
              <DateTimePicker
              onChange={(e, selectedDate)=>handleTimeSelectFrom(selectedDate, schedule.day)}
              value={new Date()}
              mode="time"
              is24Hour={false}
              display="default"
              />
            }
            {
              showToPicker[schedule.day] &&
              <DateTimePicker
              onChange={(e, selectedDate)=>handleTimeSelectTo(selectedDate, schedule.day)}
              value={new Date()}
              mode="time"
              is24Hour={false}
              display="default"
              />
            }
          </View>
        )
        })
        }
    </View>
    <TouchableOpacity onPress={()=>{if(!loading){updateService()}}} className="py-3 w-full bg-themeOrange">
      {
        loading ? 
        <ActivityIndicator color='white' />
        :
        <Text className="text-center text-white">
        Save
      </Text>
      }
    </TouchableOpacity>
    </View>
  )
}

export default ServiceHour