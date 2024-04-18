import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import React, { useEffect, useState } from 'react'
import http from '../../../../../http'
import * as SecureStore from 'expo-secure-store'
import ReportsAndSummary from './ReportsAndSummary'
import ServiceReviewList from './ServiceReviewList'
import MonthPickerCS from './MonthPicker'

const ServiceReviews = ({route, navigation}) => {
    const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const {serviceInfo} = route.params
    const [ratingList, setRatingList] = useState(null)
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const dateNow = `${year}-${month}`;
    const [dateSelected, setDateSelected] = useState(dateNow)
    const [showMonthPicker, setShowMonthPicker] = useState(false)

    const getRatings = async () => {
        const accessToken = await SecureStore.getItemAsync("accessToken")
        if(accessToken)
        {
            try {
                const result = await http.get(`Mobile_getServiceRatingWithFilter?service=${serviceInfo._id}&dateFilter=${dateSelected}`, {
                    headers : {
                        'Authorization' : `Bearer ${accessToken}`
                    }
                })
                setRatingList(result.data)
              } catch (error) {
                console.error(error)
              }
        }
    }
  
    useEffect(()=>{
        if(serviceInfo !== null){
          getRatings()
        }
    },[serviceInfo, dateSelected])

    const convertToMonthString = (date) => {
        const year = date.split("-")[0]
        const month = date.split("-")[1]
        const monthName = months[month - 1]
       return `${monthName} ${year}`
    } 


  return (
    <View className="flex-1 bg-white flex-col p-2">
      <ReportsAndSummary ratingList={ratingList} /> 
      <MonthPickerCS showMonthPicker={showMonthPicker} setShowMonthPicker={setShowMonthPicker} dateSelected={dateSelected} setDateSelected={setDateSelected}  />
      <TouchableOpacity onPress={()=>setShowMonthPicker(true)} className="mt-5 border-[1px] border-gray-300 w-[150] flex-row items-center justify-between rounded-md overflow-hidden bg-white">
            <Text style={{fontSize : 13}} className="px-2">{convertToMonthString(dateSelected)}</Text>
            <Icon color='gray' className=" p-1" type='material-community' name='calendar-blank-outline' size={23} />
        </TouchableOpacity>
      <ServiceReviewList ratingList={ratingList} />
    </View>
  )
}

export default ServiceReviews