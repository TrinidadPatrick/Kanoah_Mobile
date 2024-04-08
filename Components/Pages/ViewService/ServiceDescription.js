import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {FontAwesome, Entypo} from 'react-native-vector-icons'

const ServiceDescription = ({description}) => {
    const [seeMore, setSeeMore] = useState(false)
  return (
    <View className="flex flex-col p-2">
      <Text className=" px-2 shadow-gray py-2 font-medium">Description</Text>
      <Text className="px-2 leading-5 text-gray-500" numberOfLines={seeMore ? 200 : 6} >{description}</Text>

      <TouchableOpacity style={{columnGap : 5}} onPress={()=>setSeeMore(!seeMore)} className="w-full py-2 flex flex-row justify-center">
        <Text className="text-gray-500">See more</Text>
        <FontAwesome name="angle-down" color="gray" size={20} />
      </TouchableOpacity>
    </View>
  )
}

export default ServiceDescription