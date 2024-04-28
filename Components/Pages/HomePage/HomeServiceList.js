import { View, Text, FlatList, ScrollView, Touchable, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import useServices from '../../CustomHooks/AllServiceProvider'
import { Rating } from '@kolking/react-native-rating';
import { Image } from 'react-native-elements'

const HomeServiceList = ({services, navigation}) => {

    
  return (
    <View style={{rowGap : 15}} className="w-full flex flex-row p-2 flex-wrap justify-between">
    {
        services?.map((service)=>{
            return (
                // <TouchableOpacity >
                <TouchableWithoutFeedback onPress={()=>navigation.navigate('ViewService', {serviceId : service._id})} key={service._id} >
                <View className="w-[48%] flex flex-col justify-start overflow-hidden bg-white rounded-md shadow-sm" >
                {
                  service.serviceProfileImage !== null
                  ?
                  <Image  containerStyle={{width : "100%", height : 150, objectFit : "cover"}} source={{uri : service?.serviceProfileImage}} /> 
                  :
                  <Image  containerStyle={{width : "100%", height : 150, objectFit : "cover"}} source={require('../../../Utilities/Images/emptyImage.jpg')} /> 
                }
                {/* <Image style={{width : "100%", height : 150, objectFit : "cover"}} source={{uri : service.serviceProfileImage }} /> */}
                <View className="w-full p-2">
                {/* Service Title */}
                <Text numberOfLines={1} className="relative text-gray-800 font-medium">{service.basicInformation.ServiceTitle}</Text>
                <View className="flex flex-row items-center mt-1 gap-2">
                <Rating size={15} baseColor='#f2f2f2' rating={Number(service.ratings)} spacing={5} disabled />
                <Text className="text-gray-400 text-xs">{service.ratings} ({service.totalReviews})</Text>
                </View>
                <View>
                <Text numberOfLines={1}  className="text-xs text-gray-400 mt-1 ">
                  {service.address.barangay.name} {service.address.municipality.name}, {service.address.province.name}
                </Text>
                </View>
                </View>
                </View>
                </TouchableWithoutFeedback>
                // </TouchableOpacity>
            )
        })
    }
    </View>
  )
}

export default HomeServiceList