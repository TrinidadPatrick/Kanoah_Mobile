import { View, Text, FlatList, ScrollView } from 'react-native'
import React from 'react'
import useServices from '../../CustomHooks/AllServiceProvider'
import { Rating } from '@kolking/react-native-rating';
import { Image } from 'react-native-elements'

const RecentServicesViewAll = ({route, navigation}) => {
    const {services} = route.params
  return (
    <ScrollView>
    <View style={{rowGap : 15}} className="w-full flex flex-row p-2 flex-wrap justify-between">
    {
        services?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))?.map((service)=>{
            return (
                <View key={service._id} className="w-[48%] flex flex-col justify-start overflow-hidden bg-white rounded-md shadow-sm">
                <Image style={{width : "100%", height : 150, objectFit : "cover"}} source={{uri : service.serviceProfileImage }} />
                <View className="w-full p-2">
                {/* Service Title */}
                <Text numberOfLines={1} className="relative text-gray-800 font-medium">{service.basicInformation.ServiceTitle}</Text>
                <View className="flex flex-row items-center mt-1 gap-2">
                <Rating baseColor='#f2f2f2' size={15} rating={Number(service.ratings)} spacing={5} disabled />
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

export default RecentServicesViewAll