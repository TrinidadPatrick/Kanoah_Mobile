import { View, Text, ImageBackground } from 'react-native'
import { FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import React from 'react'

const ServiceGallery = ({gallery}) => {
  const SCREEN_WIDTH = Dimensions.get('window').width;


  return (
    <View className="w-full">
      <FlatList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      className="mt-2 "
      contentContainerStyle={{justifyContent : 'center', display : 'flex', alignItems : 'center', columnGap : 10,}}
      data={gallery?.slice(0,4)}
      renderItem={(item)=>{
        const image = item.item
        return (
            <TouchableOpacity style={{width : (SCREEN_WIDTH/4 - 14), height : (SCREEN_WIDTH/4 - 14)}} 
            className={` aspect-square  rounded-sm overflow-hidden relative`}>
            <ImageBackground source={{uri : image.src}} style={{width : "100%", height : "100%"}} />
            <View style={{backgroundColor : "rgba(0,0,0,0.5)"}} className={`w-full ${item.index === 3 && gallery.length > 4 ? "flex items-center justify-center" : "hidden"} h-full absolute `}>
            <Text className={` text-white text-lg font-medium`}>+{gallery.length - 4}</Text>
            </View>
            </TouchableOpacity>
        )
      }}
      />
    </View>
  )
}

export default ServiceGallery