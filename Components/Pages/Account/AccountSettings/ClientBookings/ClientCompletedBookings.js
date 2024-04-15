import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, Animated, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import * as SecureStore from 'expo-secure-store';
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import io from 'socket.io-client'
import http from '../../../../../http';
import { useFocusEffect } from '@react-navigation/native';
import { Rating } from '@kolking/react-native-rating';

const ClientCompletedBookings = ({navigation}) => {
  const [completedBookings, setCompletedBookings] = useState(null)
  const [serviceToRate, setServiceToRate] = useState(null)
  const [openRateComponent, setOpenRateComponent] = useState(false)
  const [openViewRatingComponent, setOpenVIewRatingComponent] = useState(false)
  const animationValue = useRef(new Animated.Value(0)).current;
  const [ratings, setRatings] = useState(null)
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingInfo, setRatingInfo] = useState(null)
  const [review, setReview] = useState('')
  const [socket, setSocket] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setSocket(io("https://kanoah.onrender.com"))
  },[])

  const getUserRatings = async () => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    try {
      const result = await http.get('Mobile_getUserRatings', {
        headers : {
          'Authorization' : `Bearer ${accessToken}`,
          'Content-Type' : 'application/json'
        }
      })
      setRatings(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(

    React.useCallback(() => {
      const getCompletedBooking = async () => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if(accessToken)
        {
          try {
            const result = await http.get('Mobile_CLIENT_getCompletedBooking', {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            })
  
            setCompletedBookings(result.data)
            getUserRatings()
          } catch (error) {
            console.log(error)
            return
          }
        }
      }

      getCompletedBooking()

      return () => {
      };
    }, [])
  )

  const rateService = (item) => {
    setServiceToRate(item)
    setOpenRateComponent(true)
  }

  useEffect(() => {
    if (openRateComponent) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 150, // Adjust animation duration as needed
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 150, // Adjust animation duration as needed
        useNativeDriver: true,
      }).start();
    }
  }, [openRateComponent, openViewRatingComponent]);

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0], // Start from bottom (300) and move to 0 (slide up)
  });

  const submitReview = async () => {
    setLoading(true)
    const service = serviceToRate.shop._id
    const booking = serviceToRate._id
    const receiver = serviceToRate.shop.owner
    const dateNow = new Date()
    const data = {
      rating : ratingValue, review, service, booking, dateNow
    }
    const newRating = [...ratings]
    newRating.push(data)
    setRatings(newRating)
    const newData = [...completedBookings]
    const index = completedBookings.findIndex((bookings) => bookings._id === booking)
    newData[index].rated = true
    setCompletedBookings(newData)
    try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const result = await http.post('Mobile_addRating', data, {
          headers : {
            'Authorization' : `Bearer ${accessToken}`,
            'Content-Type' : 'application/json'
          }
        })

        notifyUser(receiver, ratingValue)
    } catch (error) {
      console.log(error)
    }
  }

  const notifyUser = async (receiver, rating) => {
    try {
        const notify = await http.post('addNotification', {
            notification_type : "New_Rating", 
            createdAt : new Date(),
            content : {
              subject : `You have a new rating!`,
              service : serviceToRate.service.selectedService,
              rating : rating, 
              review : review, 
            }, 
            client : serviceToRate.client,
            notif_to : receiver,
            reference_id : serviceToRate._id
        })
        socket.emit('New_Notification', {notification : 'New_Rating', receiver : receiver}); //notify user theres a new booking
        setOpenRateComponent(false)
        setRatingValue(0)
        setReview('')
        setLoading(false)

    } catch (error) {
        console.error(error)
    }
  }

  const viewRating = (bookingId) => {
    const rating = ratings?.find((rating) => rating.booking === bookingId)
   setRatingInfo(rating)
    setOpenVIewRatingComponent(true)
  }

  return (
    <View className="flex-1 bg-[#f9f9f9] relative">
      { openRateComponent &&
        <Animated.View onTouchStart={()=>{setOpenRateComponent(false);setLoading(false);setRatingValue(0);setReview('')}} style={{ zIndex : 100, display : 'flex', flexDirection : 'column', justifyContent : 'flex-end', backgroundColor : 'rgba(0,0,0,0.6)'}} className="w-full flex-col justify-end h-full absolute  z-20">
        <Animated.View style={{transform: [{ translateY }]}} onTouchStart={(e)=>{e.stopPropagation()}} className="w-full z-30 h-[60%] p-5 bg-white rounded-t-3xl flex-col">
          <Text className="text-xl font-medium">Rate and Review</Text>
          <View className="mt-4 w-full">
            <Text className="text-sm text-gray-500 font-medium">Rating {ratingValue}/5</Text>
            <View className="w-full flex-row justify-center mt-2">
            <Rating baseColor='#f2f2f2' onChange={(value)=>{setRatingValue(value)}} size={30} rating={ratingValue} spacing={20} />
            </View>
          </View>
          {/* Review */}
          <View className="flex-1 mt-5">
          <Text className="text-sm text-gray-500 font-medium">Review</Text>
          <TextInput value={review} onChangeText={(value)=>setReview(value)} maxLength={1000} multiline textAlignVertical='top' className="flex-1 p-2 border-2 rounded-md border-themeOrange mt-2" ></TextInput>
          </View>
          {/* Buttons */}
          <View className="flex-row items-center mt-3 justify-end">
          <TouchableOpacity onPress={()=>{setOpenRateComponent(false);setRatingValue(0);setReview('')}} className="px-3 py-1.5 ">
            <Text className="text-gray-500">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
          disabled={ratingValue == 0}
          onPress={()=>{submitReview()}} className={`px-5 py-1.5 ${ratingValue === 0 ? "bg-orange-300" : "bg-themeOrange"}   rounded-sm `}>
            {
              loading ?
              <ActivityIndicator size="small" color="white" />
              :
              <Text className="text-gray-50">Submit</Text>
            }
            
          </TouchableOpacity>
          </View>
        </Animated.View>
        </Animated.View>
      }
      { openViewRatingComponent &&
              <Animated.View onTouchStart={()=>{setOpenVIewRatingComponent(false)}} style={{ zIndex : 100, display : 'flex', flexDirection : 'column', justifyContent : 'flex-end', backgroundColor : 'rgba(0,0,0,0.6)'}} className="w-full flex-col justify-end h-full absolute  z-20">
              <Animated.View onTouchStart={(e)=>{e.stopPropagation()}} className="w-full z-30 h-[40%] p-5 bg-white rounded-t-3xl flex-col">
                <Text className="text-xl font-medium">User rating and review</Text>
                <View className="mt-4 w-full">
                  <Text className="text-sm text-gray-500 font-medium">Rating {ratingInfo.rating}/5</Text>
                  <View className="w-full flex-row justify-center mt-2">
                  <Rating baseColor='#f2f2f2' disabled size={30} rating={ratingInfo.rating} spacing={20} />
                  </View>
                </View>
                {/* Review */}
                {
                  ratingInfo.review !== "" &&
                  <View className="flex-1 mt-5">
                  <Text className="text-sm text-gray-500 font-medium">Review</Text>
                  <ScrollView className="p-2">
                    <Text>"{ratingInfo.review}"</Text>
                  </ScrollView>
                  </View>
                }
              </Animated.View>
              </Animated.View>
      }
      {
        completedBookings?.length === 0
        ?
        <View className="flex-1 flex-row justify-center items-center">
        <Text className="text-gray-500">No bookings yet</Text>
        </View>
        :
        <FlatList
        className="mt-3"
        data={completedBookings?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const bookingDate = new Date(item.schedule.bookingDate).toLocaleDateString('EN-US', {
            month : 'short', 
            day : '2-digit',
            year : 'numeric'
          })
          return (
          <View 
          key={item._id} className="w-full flex-col justify-start shadow-md bg-white mt-3  overflow-hidden fit">
            {/* Header */}
            <TouchableOpacity onPress={()=>navigation.navigate('ViewService', {serviceId : item.shop._id})} className=" flex-row justify-between items-center p-2 border-b-[1px] border-gray-100">
              <Text className="text-gray-500 font-medium">{item.shop.basicInformation.ServiceTitle}</Text>
                  <View className="flex-row gap-x-2 items-center">
                    <Text className="text-themeOrange">Completed</Text>
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
              <View className={`w-full flex-row justify-between border-b-[1px] py-2 px-2 border-gray-100 `}>
                <Text className="text-right font-medium text-gray-500">Total Amount</Text>
                <Text className="text-right font-medium text-gray-500">₱{item.net_Amount}</Text>
              </View>
              {/* Rate */}
              <View className={`w-full flex-row justify-end py-2 border-gray-100 `}>
                {
                  item.rated ?
                  <TouchableOpacity onPress={()=>viewRating(item._id)} className="py-2 px-5 rounded-sm  bg-themeOrange">
                  <Text className="text-right font-normal text-white">View rating</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={()=>{rateService(item)}} className="py-2 px-5 rounded-sm  bg-themeOrange">
                  <Text className="text-right font-normal text-white">Rate</Text>
                  </TouchableOpacity>
                }
              </View>
             
            </TouchableOpacity>
          </View>
          )
        }}
      />
      }
     
    </View>
  )
}

export default ClientCompletedBookings