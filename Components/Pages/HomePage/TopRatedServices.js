import { View, Text, ScrollView, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { Rating } from '@kolking/react-native-rating';
import { Image } from 'react-native-elements';
import { Skeleton } from '@rneui/themed';

  const TopRatedServices = ({services, navigation}) => {
  // const {services, getServices} = useServices()
  const [topRated, setTopRated] = useState(null)
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


  // console.log(services[0].ratings)
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

    {
      services === null ? ""
      :
      <View>
      <View className={` ${loading ? "hidden" : ""} p-1 border-b-[1px] flex flex-row justify-between border-gray-200`}>
      <Text className={`font-bold text-lg ${loading ? "hidden" : ""} text-gray-700`}>Top Rated</Text>
      <TouchableOpacity className={`${loading ? "hidden" : ""}`} onPress={()=>navigation.navigate('ViewAllTopRated', {services})}>
      <Text className={`font-normal text-base text-gray-500`}>View all</Text>
      </TouchableOpacity>
      </View>

      <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{flexGrow : 1, justifyContent : 'center', alignItems : 'center', columnGap : 15}} horizontal={true} className={`p-2 ${loading ? "hidden" : ""}` }>
        {
          services?.sort((a, b) => Number(b.ratings) - Number(a.ratings))?.map((service) => {
            return (
              <View key={service?._id} className=" flex flex-col items-center ">
                <Image  containerStyle={{width: 100, height : 100, objectFit : "cover", borderRadius : 10}} source={{uri : service?.serviceProfileImage}} /> 
                  <View className="w-full mt-1.5">
                  <Rating baseColor='#f2f2f2' size={15} rating={Number(service.ratings)} spacing={5} disabled />
                  <Text className="text-gray-400 font-medium text-xs mt-1">{service?.ratings} ({service?.totalReviews})</Text>
                </View>
              </View>
            )
          })
        }
        
      </ScrollView>
      </View>
     
    }
      
      
    </View>
  )
}

export default TopRatedServices