import { View, Text, RefreshControl, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import {Rating} from '@kolking/react-native-rating'
import React, { useEffect, useState } from 'react'
import { Skeleton } from '@rneui/themed';
import useStore from '../../../store'
import http from '../../../http';

const ExploreServiceList = ({serviceList, categories, subCategories, loading, setServiceList, navigation}) => {
    const { selectedFilterState, storeFilter, decrement } = useStore();
    const [refreshing, setRefreshing] = useState(false);


    const handleRefresh = async () => {
        // setRefreshing(true)
        // try {
        //     const result = await http.get(`Mobile_GetServicesByFilter?category=${selectedFilterState.category.category_id}&subCategory=${selectedFilterState.subCategory.subCategory_id}&ratings=${selectedFilterState.ratings}&search=${selectedFilterState.searchValue}`)
        //     setServiceList(result.data.services)
        // } catch (error) {
        //     console.log(error)
        // } finally {
        //     setRefreshing(false)
        // }
    }


  return (
    <View className="flex items-center h-full justify-center py-2">


    {
        loading ? 
        <View className={`flex flex-col`}>
        <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{display : 'flex', flexDirection : 'row', flexWrap : 'wrap'}} className="gap-3">
        {
            Array.from({length : 10}, (_, index)=>(
                <View key={index} className="flex flex-col gap-2 mt-1">
                <Skeleton width={165} height={150} />
                <Skeleton width={150} height={12} />
                <Skeleton  width={100} height={12} />
                <Skeleton  width={130} height={12} />
                </View>
            ))
        }
      

        </ScrollView>
        </View>
        :
        (
       <ScrollView
       showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ display : 'flex', flexDirection : 'row',flexWrap : 'wrap', justifyContent : 'space-between', rowGap : 15}}
       >
        {
             serviceList?.map((service)=>{
                return (
                    <TouchableOpacity onPress={()=>navigation.navigate('ViewService', {serviceId : service._id})} key={service._id} className="w-[48%] flex flex-col justify-start relative overflow-hidden bg-white rounded-md shadow-sm">
                        <Text className="absolute  z-10 bg-themeOrange py-1 px-2 text-xs text-white rounded-full top-1 left-1">{categories?.find((category) => category?._id === service.advanceInformation.ServiceCategory).name}</Text>
                    <Image style={{width : "100%", height : 150, objectFit : "cover"}} source={{uri : service.serviceProfileImage }} />
                    <View className="w-full p-2">
                    {/* Service Title */}
                    <Text numberOfLines={1} className="relative text-gray-800 font-medium">{service.basicInformation.ServiceTitle}</Text>
                    <View className="flex flex-row items-center mt-1 gap-2">
                    <Rating size={15} baseColor='#f2f2f2' rating={Number(service.ratings)} spacing={5} disabled />
                    <Text className="text-gray-400 text-xs">{service.ratings} ({service.totalReviews})</Text>
                    </View>
                    <View>
                    <Text numberOfLines={1}  className="text-xs text-gray-400 mt-1 ">
                      {`${service?.address?.barangay?.name || ''} ${service?.address?.municipality?.name || ''}, ${service?.address?.province?.name || ''}`}
                    </Text>
                    </View>
                    </View>
                    </TouchableOpacity>
                )
            })
        }
        </ScrollView>

        )
    }
    

     </View>
  )
}

export default ExploreServiceList
