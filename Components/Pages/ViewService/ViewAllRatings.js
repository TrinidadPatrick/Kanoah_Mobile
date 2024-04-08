import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, FlatList } from 'react-native'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import { Image } from '@rneui/themed';
import { Rating } from '@kolking/react-native-rating';
import React from 'react'

const ViewAllRatings = ({route, navigation}) => {
    const {ratings} = route.params


  return (
    <SafeAreaView className="w-full p-2 bg-white">

    {/* Ratings */}
    <FlatList
    data={ratings}
    renderItem={(item)=>{
        const rating = item.item
        const dateCreated = new Date(rating.createdAt).toLocaleDateString().replace(/\//g, '-')
        const dateInArray = dateCreated.split("-")
        const dateRated = dateInArray[1]+"-"+dateInArray[0]+"-"+dateInArray[2]
        return (
            <View key={rating._id} className="w-full my-2 border-b-[0.5px] pb-2 border-gray-200">
                {/* Profile */}
                <View className="flex flex-row relative">
                    <Image source={{uri : rating?.user?.profileImage}} style={{width : 40, height : 40, borderRadius : 100}} />
                    {/* Name and rating */}
                    <View className="flex flex-col ml-2 justify-evenly">
                        <Text className="text-gray-600 font-medium">{rating?.user?.firstname + " " + rating?.user?.lastname}</Text>
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
    }}
    keyExtractor={rating => rating._id}
    className="w-full h-full flex flex-col bg-white py-0 px-2"
    style={{rowGap : 25}}
    />
      
    </SafeAreaView>
  )
}

export default ViewAllRatings