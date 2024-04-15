import { View, Text, ScrollView, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import http from '../../../../../http'
import {FontAwesome, Entypo, Octicons, Clarity} from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'

const FavoriteList = () => {
    const [favoriteServices, setFavoriteServices] = useState(null)
    const [showSort, setShowSort] = useState(false)
    const [selectedSort, setSelectedSort] = useState('Date added(newest)')
    const [selectedItemId, setSelectedItemId] = useState(null)

    useEffect(()=>{
        const getFavorites = async () => {
            const accessToken = await SecureStore.getItemAsync('accessToken')
            try {
                const result = await http.get('Mobile_getFavorites', {
                    headers : {
                        "Content-Type" : 'aplication/json',
                        "Authorization" : `Bearer ${accessToken}`,
                    }
                })
                setFavoriteServices(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getFavorites()
    },[])

    const handleSort = (option) => {
        switch (option) {
            case "Date added(newest)":
            const sorted1 = favoriteServices?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
            setFavoriteServices(sorted1)
            setShowSort(false)
            setSelectedSort(option)
            break;
            case "Date added(oldest)":
            const sorted2 = favoriteServices?.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
            setFavoriteServices(sorted2)
            setShowSort(false)
            setSelectedSort(option)
            break;
            case "Date published(newest)":
            const sorted3 = favoriteServices?.sort((a,b) => new Date(b.service.createdAt) - new Date(a.service.createdAt))
            setFavoriteServices(sorted3)
            setShowSort(false)
            setSelectedSort(option)
            break;
            case "Date published(oldest)":
            const sorted4 = favoriteServices?.sort((a,b) => new Date(a.service.createdAt) - new Date(b.service.createdAt))
            setFavoriteServices(sorted4)
            setShowSort(false)
            setSelectedSort(option)
            break;
        
            default:
            break;
        }
    }

    const handleOpenMoreOptions = (itemId) => {
        setSelectedItemId(itemId)
        const checkIfAlreadySelected = selectedItemId === itemId //check if the item selected is already selected
        // If already selected, diselect that item
        if(checkIfAlreadySelected)
        {
            setSelectedItemId(null)
            return
        }
        setSelectedItemId(itemId)
    }


  return (
    <TouchableWithoutFeedback onPress={()=>{setShowSort(false);setSelectedItemId(null)}}>
    <View className="flex-1 bg-[#f9f9f9] flex-col">
        {/* Navigation */}
        <View className="w-full flex-row px-2 pt-3 items-center gap-x-1 relative">
            <TouchableOpacity onPress={()=>{setShowSort(!showSort)}} className="w-7 h-7">
            <Image source={require('./sortIcon.png')} className="w-full h-full" />
            </TouchableOpacity>
            <Text className="font-medium text-gray-500">Showing {favoriteServices === null ? 0 : favoriteServices?.length} results</Text>

            {/* Sort dropdown */}
            <View className={`flex-col ${showSort ? "" : "hidden"} absolute bg-white origin-top top-10 left-3 shadow-lg rounded-md z-20`}>
                <TouchableOpacity className={`${selectedSort === "Date added(newest)" && "bg-gray-300"}`} onPress={()=>handleSort('Date added(newest)')}><Text className="px-2 py-2">Date added(newest)</Text></TouchableOpacity>
                <TouchableOpacity className={`${selectedSort === "Date added(oldest)" && "bg-gray-300"}`} onPress={()=>handleSort('Date added(oldest)')}><Text className="px-2 py-2">Date added(oldest)</Text></TouchableOpacity>
                <TouchableOpacity className={`${selectedSort === "Date published(newest)" && "bg-gray-300"}`} onPress={()=>handleSort('Date published(newest)')}><Text className="px-2 py-2">Date published(newest)</Text></TouchableOpacity>
                <TouchableOpacity className={`${selectedSort === "Date published(oldest)" && "bg-gray-300"}`} onPress={()=>handleSort('Date published(oldest)')}><Text className="px-2 py-2">Date published(oldest)</Text></TouchableOpacity>
            </View>
        </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{display : 'flex', flexDirection : 'column', rowGap : 15}} className="flex-1 py-3">
        {
            favoriteServices?.map((item)=>{
                const service = item.service
                const currentDate = new Date();
                const thisDate = currentDate.toISOString().split('T')[0]; // Extract only the date part
                const from = new Date(service.createdAt);
                const to = new Date(thisDate);
                const fromAdded = new Date(item.createdAt);
                const toAdded = new Date();
                const years = to.getFullYear() - from.getFullYear();
                const months = to.getMonth() - from.getMonth();
                const days = to.getDate() - from.getDate();
                const yearsAdded = toAdded.getFullYear() - fromAdded.getFullYear();
                const monthsAdded = toAdded.getMonth() - fromAdded.getMonth();
                const daysAdded = toAdded.getDate() - fromAdded.getDate();
                const timeDifferenceMS = new Date(toAdded.getTime()) - new Date(fromAdded.getTime())
                const secondsAdded = Math.floor(timeDifferenceMS / 1000);
                const minutesAdded = Math.floor(timeDifferenceMS / 60000);
                const hoursAdded = Math.floor(timeDifferenceMS /  (1000 * 60 * 60));
                const createdAgo =  years > 0 ? `${years} ${years === 1 ? 'year' : 'years'} ago` : months > 0 ? `${months} ${months === 1 ? 'month' : 'months'} ago` : days > 0 ? `${days} ${days === 1 ? 'day' : 'days'} ago` : 'Less than a day ago';
                const createdAgoAdded =  yearsAdded > 0 ? `${years} ${years === 1 ? 'year' : 'years'} ago` : monthsAdded > 0 ? `${months} ${months === 1 ? 'month' : 'months'} ago` :
                 daysAdded > 0 ? `${days} ${days === 1 ? 'day' : 'days'} ago` : hoursAdded > 0 ? `${hoursAdded} ${hoursAdded === 1 ? 'hour' : 'hours'} ago` : 
                 minutesAdded > 0 ? `${minutesAdded} ${minutesAdded === 1 ? 'minute' : 'minutes'} ago` : `${secondsAdded} ${secondsAdded === 1 ? 'second' : 'seconds'} ago`;
                return (
                    <View key={service._id} className="flex-row gap-x-2 bg-white p-2 overflow-visible shadow-2xl relative">
                        {/* Image Container */}
                        <View className="h-20 aspect-video rounded-md overflow-hidden ">
                            <Image style={{objectFit : 'contain'}} className="w-full h-full" source={{uri : service.serviceProfileImage}} />
                        </View>
                        {/* Information Container */}
                        <View className="flex-1 flex-col justify-between">
                            <Text numberOfLines={1} className="font-medium text-base text-gray-800">{service.basicInformation.ServiceTitle}</Text>
                                <Text className="text-xs">{service.owner.firstname} {service.owner.lastname}</Text>
                                {/* <View className="w-1 h-1 rounded-full bg-black mx-1"></View> */}
                                <Text className="text-xs">{createdAgo}</Text>
                                <Text className="text-xs">Added {createdAgoAdded}</Text>
                        </View>
                        {/* More Options */}
                        <TouchableOpacity onPress={()=>{handleOpenMoreOptions(item._id)}} className="p-1 absolute  right-1 bottom-2 flex-col justify-end">
                            <Entypo name="dots-three-vertical"  color={`${selectedItemId === item._id ? "gray" : "black"}`} size={20} />
                        </TouchableOpacity>
                        {/* More Option content */}
                        <View className={`${selectedItemId === item._id ? "" : "hidden"} absolute right-6 bottom-0 border border-gray-100 z-20 bg-white shadow-xl rounded-md flex-col`}>
                            <TouchableOpacity  className="py-2 px-2">
                                <Text>Remove from blocklist</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            })
        }
      </ScrollView>
    </View>
    </TouchableWithoutFeedback>
  )
}

export default FavoriteList