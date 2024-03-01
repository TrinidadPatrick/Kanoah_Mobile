import { View, Text, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import React from 'react'
import { SearchBar } from 'react-native-elements'
import { Button } from '@rneui/themed'
import {FontAwesome} from '@expo/vector-icons'
import { useState, useEffect } from 'react'
import { Drawer } from 'react-native-drawer-layout';
import ExploreServiceList from './ExploreServiceList'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import http from '../../../http'
import FilterDrawerContent from './FilterDrawerContent'
import useStore from '../../../store'

const Explore = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const [categories, setCategories] = useState(null)
  const [subCategories, setSubCategories] = useState(null)
  const [open, setOpen] = useState(false);
  const [serviceList, setServiceList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSortingOption, setSelectedSortingOption] = useState('Latest')
  const [searchValue, setSearchValue] = useState('')

  useEffect(()=>{
    const getServices = async () => {
     try {
         const result = await http.get(`Mobile_GetServices`)
          handleSort(selectedSortingOption, result.data)
         setLoading(false)
     } catch (error) {
         console.log(error)
     }
    }

    getServices()
 },[])

  useEffect(()=>{
    const getCategories = async () => {
        const categories = await http.get('getCategories')
        setCategories(categories.data.filter((category) => category.type === "Category").sort((a, b) => a.name.localeCompare(b.name)));
        setSubCategories(categories.data.filter((category) => category.type === "SubCategory").sort((a, b) => a.name.localeCompare(b.name)));
    }

    getCategories()
  },[])

  const filterServices = async (filterObject) => {
    setLoading(true)
    setOpen(false)
    try {
      const result = await http.get(`Mobile_GetServicesByFilter?category=${filterObject.category.category_id}&subCategory=${filterObject.subCategory.subCategory_id}&ratings=${filterObject.ratings}`)
      handleSort(selectedSortingOption, result.data.services)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSort = (option, value) => {
    setSelectedSortingOption(option)
    switch (option) {
      case "Latest":
        const latestServices = value?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
        setServiceList(latestServices)
        break;
      
        case "Oldest":
          const OldestServices = value?.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
          setServiceList(OldestServices)
          break;
        
        case "Most Rated":
          const MostRatedServices = value?.sort((a, b) => Number(b.ratings) - Number(a.ratings))
          setServiceList(MostRatedServices)
          break;
        
          case "Low Rated":
            const LowRatedServices = value?.sort((a, b) => Number(a.ratings) - Number(b.ratings))
            setServiceList(LowRatedServices)
            break;
    
      default:
        break;
    }
  }


  return (
    <View className="w-full h-[100%] flex flex-col justify-start">
        <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerType="front"
        renderDrawerContent={() => {
        return <FilterDrawerContent setLoading={setLoading} filterServices={filterServices} categories={categories} subCategories={subCategories} />;
        }}
        >
        
        {/* Search Bar */}
        <View style={{columnGap : 10}} className="w-full flex flex-row items-center justify-evenly mt-2 px-2">
        <SearchBar containerStyle={{
          backgroundColor: 'white', // set background color to transparent
          borderWidth: 1,  
          borderRadius : 10,       // set border bottom width
          borderColor : 'gray',
          height : 47,
          display : 'flex',
          alignItems : 'center',
          justifyContent : 'center',
          flex : 1
        }} 
        inputStyle={{
          height : 47
        }}
        platform='android'
        placeholder='Search services'
        showCancel={false}
        value={searchValue}
        onChangeText={setSearchValue}
        lightTheme>

        </SearchBar>
        {/* Filter Button */}
        <TouchableOpacity onPress={() => setOpen((prevOpen) => !prevOpen)} buttonStyle={{backgroundColor : "#f5f5f5"}} radius={"sm"} type="solid">
        <FontAwesome  name='sliders' size={28} color="black" />
        </TouchableOpacity>
        </View>

        {/* Sort Options */}
        <View className="w-full flex flex-row justify-between py-2">
          <TouchableOpacity onPress={()=>handleSort('Latest', serviceList)} className=" border-r-[1px] border-gray-300 w-[100] flex flex-row justify-center py-0.5 ">
            <Text className={`text-sm ${selectedSortingOption === "Latest" ? "text-themeOrange" : "text-gray-500"}`}>Latest</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>handleSort('Oldest', serviceList)} className=" border-r-[1px] border-gray-300 w-[100] flex flex-row justify-center py-0.5 ">
            <Text className={`text-sm ${selectedSortingOption === "Oldest" ? "text-themeOrange" : "text-gray-500"}`}>Oldest</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>handleSort('Most Rated', serviceList)} className=" border-r-[1px] border-gray-300 w-[100] flex flex-row justify-center py-0.5 ">
            <Text className={`text-sm ${selectedSortingOption === "Most Rated" ? "text-themeOrange" : "text-gray-500"}`}>Most Rated</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>handleSort('Low Rated', serviceList)} className=" w-[100] flex flex-row justify-center py-0.5 ">
            <Text className={`text-sm ${selectedSortingOption === "Low Rated" ? "text-themeOrange" : "text-gray-500"}`}>Low Rated</Text>
          </TouchableOpacity>
        </View>

        {/* Service Lists */}
        <View className={`h-full px-3 pt-3`} style={{paddingBottom : tabBarHeight + 50}}>
          <ExploreServiceList setServiceList={setServiceList} loading={loading} serviceList={serviceList} categories={categories} subCategories={subCategories} />
        </View>

        </Drawer>
    </View>
  )
}

export default Explore