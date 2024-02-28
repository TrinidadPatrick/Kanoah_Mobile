import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import useServices from '../../CustomHooks/AllServiceProvider'
import { useFocusEffect } from '@react-navigation/native'
import {StarRatingDisplay} from 'react-native-star-rating-widget';
import {FontAwesome} from '@expo/vector-icons'
import { Image } from '@rneui/themed'
import { Skeleton } from '@rneui/themed';

const TopRatedViewAll = ({route, navigation}) => {
    const {services} = route.params

  return (
    <ScrollView>
    <View style={{rowGap : 15}} className="w-full flex flex-row p-2 flex-wrap justify-between">
    {
        services?.sort((a, b) => Number(b.ratings) - Number(a.ratings)).map((service)=>{
            return (
                <View key={service._id} className="w-[48%] flex flex-col justify-start overflow-hidden bg-white rounded-md shadow-sm">
                <Image style={{width : "100%", height : 150, objectFit : "cover"}} source={{uri : service.serviceProfileImage }} />
                <View className="w-full p-2">
                {/* Service Title */}
                <Text numberOfLines={1} className="relative text-gray-800 font-medium">{service.basicInformation.ServiceTitle}</Text>
                <View className="flex flex-row items-center mt-1 gap-2">
                <StarRatingDisplay  style={{width : 80, display : 'flex', justifyContent : 'space-evenly'}} color="#ffa534" maxStars={5} starSize={17} rating={service.ratings} />
                <Text className="text-gray-400 text-xs">{service.ratings} ({service.totalReviews})</Text>
                </View>
                <View>
                <Text numberOfLines={1}  className="text-xs text-gray-400 mt-1 ">
                  {service.address.barangay.name} {service.address.municipality.name}, {service.address.province.name}
                </Text>
                </View>
                </View>
                </View>
            )
        })
    }
    </View>
    </ScrollView>
  )
}

export default TopRatedViewAll