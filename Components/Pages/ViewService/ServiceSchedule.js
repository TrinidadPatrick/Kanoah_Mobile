import { View, Text } from 'react-native'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import React from 'react'

const ServiceSchedule = ({serviceHour}) => {
  return (
    <View className="p-2 flex flex-col">
      <Text className="font-medium">Service Schedule</Text>

      <View style={{rowGap : 15, columnGap : 15}} className="flex flex-row flex-wrap mt-3">
        {
            serviceHour?.map((sched, index)=>{
              const [hours, minutes] = sched.toTime.split(':');
              const [fromHours, fromMinutes] = sched.fromTime.split(':');
              const toDateTime = new Date(0, 0, 0, hours, minutes);
              const fromDateTime = new Date(0, 0, 0, fromHours, fromMinutes);
              const toTime = toDateTime.toLocaleTimeString('EN-us', { hour: '2-digit', minute: '2-digit' });
              const fromTime = fromDateTime.toLocaleTimeString('EN-us', { hour: '2-digit', minute: '2-digit' });
              const currentDate = new Date()
              const currentDay = currentDate.getDay()
              const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return (
                    <View 
                    style={{rowGap : 10}}
                    key={index}
                        className={`w-[47.5%] ${daysOfWeek[currentDay] === sched.day ? "border border-themeOrange border-l-8 border-l-themeOrange" : "border border-gray-100 border-l-8 border-l-themeOrange"} bg-white py-1 rounded-md flex flex-col items-center justify-center`}>
                        <Text style={{fontSize : 16}} className="font-medium">{sched.day}</Text>
                        {
                            sched.isOpen ?
                            <Text>{fromTime} - {toTime}</Text>
                            :
                            <Text className="text-red-500">Closed</Text>
                        }
                    </View>
                )
            })
        }
      </View>
    </View>
  )
}

export default ServiceSchedule