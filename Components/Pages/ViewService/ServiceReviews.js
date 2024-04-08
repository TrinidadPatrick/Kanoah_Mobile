import { View, Text, TouchableOpacity } from 'react-native'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import { Image } from '@rneui/themed';
import { Rating } from '@kolking/react-native-rating';
import React from 'react'

const ServiceReviews = ({ratings, navigation}) => {
  return (
    <View className="w-[100vw] p-2">
    <View className="flex flex-row items-center justify-between border-b-[1px] py-1 border-gray-200">
    <View className="flex flex-row items-center">
    <Text className="text-lg font-medium text-gray-600 flex flex-row items-center">Ratings</Text>
    <Text className="font-normal text-sm text-gray-500 ml-1">({ratings.length} reviews)</Text>
    </View>
    <TouchableOpacity onPress={()=>navigation.navigate("ViewAllRatings", {
        ratings
    })} style={{columnGap : 10}} className="flex flex-row pr-1 items-center">
        <Text className="text-gray-500">See all</Text>
        <FontAwesome className="" name="angle-right" color="gray" size={20} />
    </TouchableOpacity>
    </View>

    {/* Ratings */}
    <View style={{rowGap : 25}} className="w-full flex flex-col py-3">
        {
            ratings?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).slice(0,3).map((rating)=>{
                const dateCreated = new Date(rating.createdAt).toLocaleDateString().replace(/\//g, '-')
                const dateInArray = dateCreated.split("-")
                const dateRated = dateInArray[1]+"-"+dateInArray[0]+"-"+dateInArray[2]
                return (
            <View key={rating._id} className="w-full">
            {/* Profile */}
            <View className="flex flex-row relative">
                <Image source={{uri : rating?.user?.profileImage}} alt="profile" style={{width : 40, height : 40, borderRadius : 100}} />
                {/* Name and rating */}
                <View className="flex flex-col ml-2 justify-evenly">
                    <Text className="text-gray-600 font-medium">{rating.user.firstname + " " + rating.user.lastname}</Text>
                    <Rating size={15} baseColor='#f2f2f2' rating={rating?.rating} spacing={5} disabled />
                </View>
                <Text className="absolute right-2 text-xs text-gray-500 top-1">{dateRated}</Text>
            </View>
            {/* Review */}
            <View className="mt-2">
                <Text numberOfLines={4} className="text-gray-600">
                    {rating.review}
                </Text>
            </View>
        </View>
                )
            })
        }
        
    </View>

    <TouchableOpacity className="py-2 w-full flex flex-row justify-center items-center border-t-[0.5px] border-gray-300">
        <Text className="text-gray-500">See all reviews</Text>
    </TouchableOpacity>
      
    </View>

    
  )
}

export default ServiceReviews