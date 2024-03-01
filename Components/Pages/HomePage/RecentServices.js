import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import useServices from '../../CustomHooks/AllServiceProvider'
import { useFocusEffect } from '@react-navigation/native'
import {FontAwesome} from '@expo/vector-icons'
import { Rating } from '@kolking/react-native-rating';
import { Skeleton } from '@rneui/themed';
import { Image } from '@rneui/themed'

const RecentServices = ({services, navigation}) => {
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
      if(services === null)
      {
        setLoading(true)
      }
      else{
        setLoading(false)
      }
    },[services])


  return (
    <View className="w-full h-[220px] flex bg-white rounded-md shadow-sm p-2 ">

<View className={`${loading ? "flex" : "hidden"} flex-col`}>
      <Skeleton width={150} height={40} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{display : 'flex', flexDirection : 'row'}} className="flex flex-row space-x-3">
      <View className="flex flex-col gap-2 mt-1">
      <Skeleton width={100} height={100} />
      <Skeleton width={70} height={7} />
      <Skeleton  width={100} height={7} />
      <Skeleton  width={80} height={7} />
      </View>
      <View className="flex flex-col gap-2 mt-1">
      <Skeleton width={100} height={100} />
      <Skeleton width={70} height={7} />
      <Skeleton  width={100} height={7} />
      <Skeleton  width={80} height={7} />
      </View>
      <View className="flex flex-col gap-2 mt-1">
      <Skeleton width={100} height={100} />
      <Skeleton width={70} height={7} />
      <Skeleton  width={100} height={7} />
      <Skeleton  width={80} height={7} />
      </View>
      <View className="flex flex-col gap-2 mt-1">
      <Skeleton width={100} height={100} />
      <Skeleton width={70} height={7} />
      <Skeleton  width={100} height={7} />
      <Skeleton  width={80} height={7} />
      </View>
      <View className="flex flex-col gap-2 mt-1">
      <Skeleton width={100} height={100} />
      <Skeleton width={70} height={7} />
      <Skeleton  width={100} height={7} />
      <Skeleton  width={80} height={7} />
      </View>
      </ScrollView>
    </View>

    <View className={` ${loading ? "hidden" : ""} flex flex-row justify-between p-1 border-b-[1px] border-gray-200`}>
    <Text className={`font-bold ${loading ? "hidden" : ""} text-lg text-gray-700`}>Recent Services</Text>
    <TouchableOpacity className={`${loading ? "hidden" : ""}`} onPress={()=>navigation.navigate('RecentServicesViewAll', {services})}>
    <Text  className="font-normal text-base text-gray-500">View all</Text>
    </TouchableOpacity>
    </View>

      {/* Lists */}
      <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{flexGrow : 1, justifyContent : 'center', alignItems : 'center', columnGap : 15}} horizontal={true} className={`p-2 ${loading ? "hidden" : ""}` }>
        {
          services?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((service, index) => {
            return (
              <View key={service._id} className=" flex flex-col items-center ">
                <Image  containerStyle={{width: "100%", height : 100, objectFit : "cover", borderRadius : 10}} source={{uri : service.serviceProfileImage}} /> 
                <View className="w-full mt-1.5">
                <Rating baseColor='#f2f2f2' size={15} rating={Number(service.ratings)} spacing={5} disabled />
              <Text className="text-gray-400 font-medium text-xs mt-1">{service.ratings}({service.totalReviews})</Text>
                </View>
              </View>
            )
          })
        }
        
      </ScrollView>
      
    </View>
  )
}

export default RecentServices