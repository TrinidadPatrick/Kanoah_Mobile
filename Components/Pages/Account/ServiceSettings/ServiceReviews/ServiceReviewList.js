import { View, Text, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { Rating } from '@kolking/react-native-rating';
import http from '../../../../../http';

const ServiceReviewList = ({ratingList}) => {
    const [ratings, setRatings] = useState([])
    const [selectedRating, setSelectedRating] = useState([])

    useEffect(()=>{
        ratingList !== null && setRatings(ratingList)
    },[ratingList])

    const RenderImage = ({url, firstname, lastname}) => {
        const baseUrl = url.split(".")[0]

        if(baseUrl === "https://ui-avatars")
        {
            return (
                <View className="w-full h-full flex-row justify-center items-center rounded-full bg-blue-400 ">
                    <Text className="text-2xl text-white">{firstname.charAt(0)}</Text>
                    <Text className="text-2xl text-white">{lastname.charAt(0)}</Text>
                </View>
            )
        }

        return (
            <Image source={{ uri : url}} style={{width : "100%", height : "100%"}} className="rounded-full" />
        )
    }

    const handleReadMore = (id) => {
        const newData = [...selectedRating]
        newData.push(id)
        setSelectedRating(newData)
    }
    const handleReadLess = (id) => {
        const newData = [...selectedRating]
        const index = newData.findIndex((data) => data._id === id)
        newData.splice(index, 1)
        setSelectedRating(newData)
    }

    const removeRating = async (ratingId) => {
        const newRating = [...ratings]
        const index = newRating.findIndex((rating) => rating._id === ratingId)
        ratings[index].status = "Removed"
        setRatings(newRating)
        try {
            const accessToken = await SecureStore.getItemAsync("accessToken")
            const result = await http.patch(`Mobile_removeRating/${ratingId}`, "", {
                headers : {
                    "Authorization" : `Bearer ${accessToken}`
                }
            })
        } catch (error) {
            console.error(error)
        }
    }
    const restoreRating = async (ratingId) => {
        const newRating = [...ratings]
        const index = newRating.findIndex((rating) => rating._id === ratingId)
        ratings[index].status = "Active"
        setRatings(newRating)
        try {
            const accessToken = await SecureStore.getItemAsync("accessToken")
            const result = await http.patch(`Mobile_restoreRating/${ratingId}`, "", {
                headers : {
                    "Authorization" : `Bearer ${accessToken}`
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <View className="flex-1 mt-5 bg-[#f9f9f9] relative">
      <FlatList 
      contentContainerStyle={{gap: 15}}
    data={ratings?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))}
    keyExtractor={(item) => item._id}
    renderItem={({item})=> {
        const origReview = item.review
        const dateObject = new Date(item.createdAt)
        const dateCreated = dateObject.toLocaleDateString('EN-US', {
                    month : "long",
                    day : "2-digit",
                    year : "numeric"
                            })
        const review =  selectedRating?.includes(item._id) ? origReview : origReview.slice(0, 150)
        return (
            <View className={`flex-col ${item.status === "Active" ? "bg-white" : "bg-white"} py-2 px-1 `}>
                {/* Header */}
                <View className="flex-row gap-2">
                    {/* Image Container */}
                    <View className="w-[50] aspect-square rounded-full overflow-hidden ">
                        <RenderImage url={item.user.profileImage} firstname={item.user.firstname} lastname={item.user.lastname} />
                    </View>
                    {/* Name and Date */}
                    <View className="flex-1 flex-col">
                        <View className="flex-row items-center">
                        <Text className="text-gray-700 text-base font-medium">{item.user.firstname + " " + item.user.lastname}</Text>
                        <Text className={`${item.status === "Removed" ? "" : "hidden"} mx-2 text-sm text-red-500 font-medium`}>Removed</Text>
                        </View>
                        <Text className="text-gray-600 font-normal">{dateCreated}</Text>
                    </View>
                </View>
                {/* Body */}
                <View className="w-full flex-col mt-3">
                    <Text className={`${item.status === "Active" ? "text-gray-700 " : "text-gray-500"} font-normal`}>Service : {item.booking?.service.selectedService}</Text>
                    <View className="flex-row items-center space-x-2 mt-1">
                    <Text className={`${item.status === "Active" ? "text-gray-700 " : "text-gray-500"} font-normal`}>Rating :</Text>
                    <Rating size={15} baseColor='#f2f2f2' rating={item.rating} spacing={5} disabled />
                    </View>
                    <View className="flex-col mt-1">
                        <Text className={`${item.status === "Active" ? "text-gray-700 " : "text-gray-500"} font-normal`}>Review : {review}</Text>
                        {/* <Text>sswdqwd</Text> */}
                        {
                        selectedRating?.includes(item._id) ?
                        <TouchableOpacity onPress={()=>handleReadLess(item._id)} className="text-gray-500"><Text>...Read less</Text></TouchableOpacity> 
                        :
                        <TouchableOpacity className={`${origReview.length <= 150 ? "hidden" : ""} text-gray-500`} onPress={()=>handleReadMore(item._id)} ><Text>...Read more</Text></TouchableOpacity>
                        }
                    </View>
                </View>
                <View className=' mt-1 flex-row items-center justify-start '>
                            {
                                item.status === "Active" ?
                                <TouchableOpacity onPress={()=>{removeRating(item._id)}} ><Text className='text-red-400  text-sm'>Remove</Text></TouchableOpacity>
                                :
                                <TouchableOpacity onPress={()=>{restoreRating(item._id)}} ><Text className='text-gray-500  text-sm'>Restore</Text></TouchableOpacity>
                            }
                </View>
            </View>
            
        )
    }}
      />
    </View>
  )
}

export default ServiceReviewList