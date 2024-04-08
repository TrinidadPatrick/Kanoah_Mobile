import { View, Text, ScrollView, Image, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import useCategory from '../../CustomHooks/CategoriesProvider'
import { useFocusEffect } from '@react-navigation/native'

const Categories = () => {
    const {getCategories} = useCategory()
    const [categories, setCategories] = useState([])

    useFocusEffect(
        React.useCallback(()=>{
            const getCategory = async () => {
                const list = await getCategories()
                setCategories(list)
            }
            
            getCategory()
        },[])
    )
    
  return (
    <View  className="w-full flex flex-col bg-white p-1 rounded-md shadow-sm">
    <View className="border-b-[1px] p-1 border-gray-300 ">
        <Text className="font-bold text-lg text-gray-600">Featured Categories</Text>
    </View>
    <ScrollView contentContainerStyle={{columnGap : 20}} showsHorizontalScrollIndicator={false} horizontal={true} className="p-2" >
      {
        categories?.filter((category) => category.featured === true)?.map((category) => {
            return (
                <View style={{rowGap : 10}} key={category._id} className="flex flex-col justify-start pt-2 items-center w-[130px]">
                <View className="rounded-full flex items-center relative overflow-hidden justify-center bg-white border-2 border-themeOrange w-[100px] h-[100px]">
                   <Image className="border rounded-full " source={{uri : category.image}} resizeMode='cover' style={{ width : 100, height : 100}} />
                </View>
                <Text className="text-themeBlue font-medium text-center  w-full">{category.name}</Text>
                </View>
            )
        })
      }
    </ScrollView>
    </View>
  )
}

export default Categories