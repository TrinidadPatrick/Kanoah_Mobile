import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { SelectList } from 'react-native-dropdown-select-list'
import React from 'react'
import { useEffect,useState } from 'react'
import { Rating } from '@kolking/react-native-rating';
import useStore from '../../../store'
import http from '../../../http'

    const FilterDrawerContent = ({categories, subCategories, filterServices, setLoading}) => {
    const { selectedFilterState, storeFilter } = useStore();
    const [ratings, setRatings] = useState([{number : 5, checked : false}, {number : 4, checked : false}, {number : 3, checked : false}, {number : 2, checked : false}, {number : 1, checked : false}])
    const [selectedFilter, setSelectedFilter] = useState({
        category : {name : '', category_code : '', category_id : ''},
        subCategory : {name : '', subCategory_id : ''},
        ratings : [],
        searchValue : '',
        coordinates : {latitude : selectedFilterState.coordinates.latitude, longitude : selectedFilterState.coordinates.longitude},
        radius : selectedFilterState.radius
    })

   
    const handleSelectCategory = (value) => {
        const selectedCategory = categories.find((category) => category.name === value)
        if(selectedCategory)
        {
            storeFilter({...selectedFilterState, category : {name : selectedCategory.name, category_code : selectedCategory.category_code, category_id : selectedCategory._id}, subCategory : {name : '', subCategory_id : ''}})
        }
    }

    const handleSelectSubCategory = (value) => {
      const selectedSubCategory = subCategories.find((subCategory) => subCategory.name === value)
      if(selectedSubCategory)
      {
          storeFilter({...selectedFilterState, subCategory : {name : selectedSubCategory.name, subCategory_id : selectedSubCategory._id}})
      }
  }

    const handleSelectRating = (index) => {
        const newData = [...ratings]
        newData[index].checked = newData[index].checked ? false : true
        setRatings(newData)
        storeFilter({...selectedFilterState, ratings : newData.filter((rating) => rating.checked === true).map((rating)=> rating.number)})
    }
    

    const clearFilter = () => {

      filterServices({
        category : {name : '', category_code : '', category_id : ''},
        subCategory : {name : '', subCategory_id : ''},
        ratings : [],
        searchValue : "",
        coordinates : {latitude : selectedFilterState.coordinates.latitude, longitude : selectedFilterState.coordinates.longitude},
        radius : selectedFilterState.radius
      })

      storeFilter({
        category : {name : '', category_code : '', category_id : ''},
        subCategory : {name : '', subCategory_id : ''},
        ratings : [],
        searchValue : "",
        coordinates : {latitude : selectedFilterState.coordinates.latitude, longitude : selectedFilterState.coordinates.longitude},
        radius : selectedFilterState.radius
      })

      setRatings([{number : 5, checked : false}, {number : 4, checked : false}, {number : 3, checked : false}, {number : 2, checked : false}, {number : 1, checked : false}])
    }

    
  return (
    <ScrollView contentContainerStyle={{display : 'flex',flexDirection : 'column',rowGap : 15, justifyContent : 'space-between', height : "100%"}} className="p-2 flex flex-col  h-full">
    <View style={{rowGap : 15}} className="flex flex-col">
      <View>
        <Text className="text-lg flex">Filter services</Text>
      </View>

      {/* Categories */}
      <View>
        <Text className="text-lg font-medium text-gray-600">Categories</Text>
        <SelectList 
        defaultOption={categories === null ? {} : {key: selectedFilterState.category.name, value: selectedFilterState.category.name }}
        boxStyles={{marginTop : 10, borderRadius : 5}}
        data={categories?.map((category) => ({ key: category.name, value: category.name}))} 
        setSelected={(val) => handleSelectCategory(val)}
        />
      </View>

      {/* Sub Categories */}
      <View>
        <Text className="text-lg font-medium text-gray-600">Sub Categories</Text>
        <SelectList 
        defaultOption={subCategories === null ? {} : {key: selectedFilterState.subCategory.name, value: selectedFilterState.subCategory.name }}
        boxStyles={{marginTop : 10, borderRadius : 5}}
        data={subCategories?.filter((subCat) => subCat.parent_code === selectedFilterState.category.category_code).map((subCategory) => ({ key: subCategory.name, value: subCategory.name}))} 
        setSelected={(val) => handleSelectSubCategory(val)}
        labelKey="name"
        />
      </View>

      {/* Rating Filter */}
      <View className="flex flex-col items-center">
        <Text className="text-lg font-medium text-gray-600 self-start">Rating</Text>
        {
            ratings.map((rating, index) => (
            <CheckBox key={rating.number} size={22} containerStyle={{backgroundColor : 'white',width : "100%", borderWidth : 0, display : 'flex', alignItems : 'center', flexDirection : 'row', justifyContent : 'space-between'}} 
            checked={rating.checked}
            onPress={()=>{
                handleSelectRating(index)
            }}
            title={
                <View style={{columnGap : 7}} className="flex items-center flex-row ">
                <Rating baseColor='#f2f2f2' size={17} style={{marginBottom : 3, marginLeft : 5}} rating={rating.number} spacing={9} disabled />
                <Text className="flex text-base items-center font-medium text-gray-500 mb-0.5">{rating.number}.0</Text>
                </View>} />
            ))
        }
      </View>
    </View>

      {/* Apply and Reset button */}
      <View style={{rowGap : 5}} className="flex flex-col justify-self-end">
        <TouchableOpacity onPress={()=>{filterServices(selectedFilterState)}} className="flex items-center bg-themeOrange py-2.5 rounded-sm" >
            <Text className="text-white">Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>clearFilter()} className="flex items-center bg-gray-200 py-2.5 rounded-sm" >
            <Text className="text-gray-500">Reset</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default FilterDrawerContent