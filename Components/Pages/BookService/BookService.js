import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import useInfo from '../../CustomHooks/UserInfoProvider'
import {FontAwesome, Entypo, Octicons} from 'react-native-vector-icons'
import useBookingStore from './BookServiceStore'
import ServiceSelect from './ServiceSelect'
import http from '../../../http'
import SetSchedule from './SetSchedule'
import ContactAndAddress from './ContactAndAddress'
import BookConfirmation from './BookConfirmation'

const BookService = ({route, navigation}) => {
    const {bookingInformation, storeBookingInformation} = useBookingStore()
    const service = route.params.service || {}
    const userInformation = route.params.userInformation || {}
    const [bookingSchedule, setBookingSchedule] = useState([])
    const [step, setStep] = useState(1)

    useEffect(()=>{
        if(service !== null)
        {
          const getBookingSchedule = async () => {
            try {
              const result = await http.get(`getBookingSchedules/${service._id}`)
              if(result)
              {
                setBookingSchedule(result.data)
              }
            } catch (error) {
              console.log(error)
            }
          }
          getBookingSchedule()
        }
    }, [])


  return (
    <View className="w-full flex-1 bg-themeBlue flex flex-col">
      <View className="py-3 flex flex-row items-center relative justify-center">
        <TouchableOpacity onPress={()=>{navigation.goBack()}} className="absolute left-3">
        <Octicons name="arrow-left" color="white" size={25} />
        </TouchableOpacity>
        <View>
        <Text className="text-white text-center">Booking For</Text>
        <Text className="text-white text-center font-semibold text-lg">{service.basicInformation.ServiceTitle}</Text>
        </View>
      </View>
      <View className="w-full flex-1 bg-white rounded-t-3xl overflow-hidden">
       {
        step === 1 ?
        <ServiceSelect setStep={setStep} service={service} bookingInformation={bookingInformation} storeBookingInformation={storeBookingInformation} userInformation={userInformation} />
        :
        step === 2 ?
        <SetSchedule navigation={navigation} setStep={setStep} service={service} bookingSchedule={bookingSchedule} bookingInformation={bookingInformation} storeBookingInformation={storeBookingInformation} userInformation={userInformation} />
        :
        step === 3 ?
        <ContactAndAddress navigation={navigation} setStep={setStep} service={service} bookingInformation={bookingInformation} storeBookingInformation={storeBookingInformation} userInformation={userInformation} />
        :
        <BookConfirmation navigation={navigation} setStep={setStep} service={service} bookingInformation={bookingInformation} storeBookingInformation={storeBookingInformation} userInformation={userInformation} />
       }
      </View>
    </View>
  )
}

export default BookService