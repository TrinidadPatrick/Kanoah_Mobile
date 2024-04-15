import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import http from '../../../../../http'
import * as SecureStore from 'expo-secure-store'
import { Icon } from 'react-native-elements'

const Tags = ({serviceInfo}) => {
  const [tags, setTags] = useState([])
  const [isFocused, setIsFocused] = useState(false)
  const [tag, setTag] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setTags(serviceInfo.tags)
  },[])

  const handleAddTag = () => {
    const newTag = [...tags]
    newTag.push(tag)
    setTags(newTag)
    setTag('')
  }

  const updateService = async () => {
    setLoading(true)
    const accessToken = await SecureStore.getItemAsync('accessToken')
    try {
      const result = await http.patch(`Mobile_updateService/`, {tags},  {
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        }
      })
      setLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleRemoveTag = (index) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
  }


  return (
    <View className="bg-white flex-1 flex-col">
      <Text className="text-lg font-medium text-gray-800 px-2 pt-2">Edit service tags</Text>
      <Text className="text-gray-500 px-2">Tags can help your business reach more people. Make sure to use tags that are relevant or reflect your business.</Text>

      {/* Input */}
      <View className="w-full relative mt-5 px-2">
        <TextInput onSubmitEditing={()=>handleAddTag()} value={tag} onChangeText={(value)=>setTag(value)} onFocus={()=>setIsFocused(true)} onBlur={()=>setIsFocused(false)} className={`border ${isFocused ? "border-blue-500" : "border-gray-200"} py-1.5 px-2  rounded-md`} />
        <TouchableOpacity onPress={()=>handleAddTag()} className="px-3 py-1.5 rounded-sm top-[4.9] right-[13] bg-blue-500 absolute">
          <Text className="text-white">Add</Text>
        </TouchableOpacity>
      </View>

      <View className=" flex-1">
      <ScrollView contentContainerStyle={{flexDirection : 'row', flexWrap : 'wrap'}} className="flex-1 border mt-5 border-gray-200 px-2 py-2 rounded-md mx-2 mb-2">
      {
        tags?.map((tag, index) => (
          <View key={index} className="flex-row gap-2 pb-2 px-2 mx-1 my-2 bg-gray-200 rounded-3xl mt-0">
            <Text>{tag}</Text>
            <TouchableOpacity onPress={()=>handleRemoveTag(index)}>
            <Icon type='material-community' name='close-circle' size={20} />
            </TouchableOpacity>
          </View>
        ))
      }
      </ScrollView>
      </View>

      <TouchableOpacity onPress={()=>updateService()} className="py-3 bg-themeOrange">
        {
          loading ? <ActivityIndicator color='white' />
          :
          <Text className="text-white text-center">Save</Text>
        }
      </TouchableOpacity>
      
    </View>
  )
}

export default Tags