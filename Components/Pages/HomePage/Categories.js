import { View, Text, ScrollView, Image } from 'react-native'
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
    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} className="p-2" >
      {
        categories?.filter((category) => category.featured === true)?.map((category) => {
            return (
                <View key={category._id} className="rounded-full mx-2 flex items-center p-2 justify-center bg-white border-2 border-themeOrange w-[100px] h-[100px]">
                   {/* <Image source={{uri : category.image}} /> */}
                   <Text className="text-gray-700 font-medium text-center">{category.name}</Text>
                </View>
            )
        })
      }
    </ScrollView>
    </View>
  )
}

export default Categories