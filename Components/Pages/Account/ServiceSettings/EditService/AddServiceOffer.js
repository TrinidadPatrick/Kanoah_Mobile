import { View, Text, Modal, StatusBar, Touchable, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useState, useRef } from 'react'
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native'
import http from '../../../../../http'
import * as SecureStore from 'expo-secure-store'

const AddServiceOffer = ({showAddServiceModal, setShowAddServiceModal, serviceOfferInfo, setServiceOfferInfo, serviceOfferList, setServiceOfferList}) => {
    const [showAddVariationModal, setShowAddVariationModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const clearFields = () => {
        setServiceOfferInfo({
            uniqueId : '', 
            name : '',
            origPrice : '',
            duration : '',
            variants : []
        })
    }


    const addVariation = () => {
        if(serviceOfferInfo?.variants.length !== 0)
        {
          if(serviceOfferInfo?.variants[serviceOfferInfo?.variants.length - 1].type === ''
          || serviceOfferInfo?.variants[serviceOfferInfo?.variants.length - 1].price === ''
          || serviceOfferInfo?.variants[serviceOfferInfo?.variants.length - 1].duration === 0) 
          {
            return
          }
  
        }
        if(serviceOfferInfo.name !== "")
        {
            setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variants: [
                  ...prevServiceOfferInfo.variants,
                    { type: '', price: '', duration : '' }
                ]
              }));
              setShowAddVariationModal(true)
        }
        if(serviceOfferInfo.name === "")
        {
            ToastAndroid.show('Specify a service name first', ToastAndroid.SHORT);
        }
    }

    const handleInputVariationType = (value, index) => {
        setServiceOfferInfo((prevServiceOfferInfo) => ({
            ...prevServiceOfferInfo,
            variants: prevServiceOfferInfo.variants.map((item, i) =>
              i === index ? { ...item, type: value } : item
            ),
          }));
    }

    const handleInputVariationPrice = (value, index) => {
        setServiceOfferInfo((prevServiceOfferInfo) => ({
            ...prevServiceOfferInfo,
            variants: prevServiceOfferInfo.variants.map((item, i) =>
              i === index ? { ...item, price: value } : item
            ),
          }));
    }

    const handleInputVariationDuration = (value, index) => {
        setServiceOfferInfo((prevServiceOfferInfo) => ({
            ...prevServiceOfferInfo,
            variants: prevServiceOfferInfo.variants.map((item, i) =>
              i === index ? { ...item, duration: value } : item
            ),
          }));
    }

    const submitServiceOffer = async () => {
        setLoading(true)
        const Instance = [...serviceOfferList]
        const tempData = {
          uniqueId : Math.floor(1000000000 + Math.random() * 9000000000),
          name : serviceOfferInfo.name,
          origPrice : serviceOfferInfo.variants.length !== 0 ? '' : serviceOfferInfo.origPrice,
          duration : serviceOfferInfo.variants.length !== 0 ? '' : serviceOfferInfo.duration,
          variants : serviceOfferInfo.variants.filter(variant => variant.type !== '' && variant.price !== '') ,
          status : 'ACTIVE'
        }
        Instance.push(tempData)
        setServiceOfferList(Instance)
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken')
            const result = await http.patch(`Mobile_updateService/`, {serviceOffers : Instance},  {
              headers : {
                'Authorization' : `Bearer ${accessToken}`
              }
            })
            clearFields()
            setShowAddServiceModal(false)
            setLoading(false)
          } catch (error) {
            console.error(error)
          }
       
    }

    const handleSubmitVariations = () => {
        const newData = [...serviceOfferInfo.variants]
        const finalVariantList = newData.filter((variants) => variants.type !== "" && variants.price !== "" && variants.duration !== "")
        setServiceOfferInfo({...serviceOfferInfo, variants : finalVariantList})
        setShowAddVariationModal(false)
    }

    return (
    <>
    {
    showAddServiceModal &&
    <Modal statusBarTranslucent animationType='slide' visible={showAddServiceModal}>
        <View style={{paddingTop : StatusBar.currentHeight}} className="flex-1 bg-white flex-col">
            {/* Navigation */}
            <View  className="w-full border-b-[1px] border-gray-200 flex-row items-center px-1 py-2 space-x-10">
                <TouchableOpacity onPress={()=>{setShowAddServiceModal(false);clearFields()}}>
                    <Icon type='material-community' name='arrow-left' />
                </TouchableOpacity>
                <Text className="text-xl font-medium text-gray-700">Add service</Text>
            </View>
            <View className="p-2">
                <Text className="text-xl text-gray-700 font-semibold">Add your service</Text>
                <Text className="text-sm text-gray-500 font-normal">Add your service for your customers. This will still show even if booking is disabled.</Text>
            </View>

            {/* Input box */}
            <View className=" mt-5 flex-col p-2 space-y-3">
                {/* Service name */}
                <View className="w-full flex-col space-y-1">
                    <Text className="text-gray-600">Service name</Text>
                    <TextInput className="p-2 border border-gray-200 rounded-md" value={serviceOfferInfo.name} onChangeText={(value)=>{setServiceOfferInfo({...serviceOfferInfo, name : value})}} />
                </View>
                {/* Service price */}
                <View className="w-full flex-col space-y-1">
                    <Text className="text-gray-600">Service price</Text>
                    <TextInput editable={serviceOfferInfo.variants.length === 0} inputMode='numeric' className="p-2 border border-gray-200 rounded-md" value={serviceOfferInfo.origPrice} onChangeText={(value)=>{setServiceOfferInfo({...serviceOfferInfo, origPrice : value.replace(/[^0-9]/g, '')})}} />
                </View>
                {/* Service duration */}
                <View className="w-full flex-col space-y-1">
                    <Text className="text-gray-600">Service duration (Minutes)</Text>
                    <TextInput editable={serviceOfferInfo.variants.length === 0} inputMode='numeric' className="p-2 border border-gray-200 rounded-md" value={serviceOfferInfo.duration} onChangeText={(value)=>{setServiceOfferInfo({...serviceOfferInfo, duration : value.replace(/[^0-9]/g, '')})}} />
                </View>

                {/* Add Duration button */}
                <TouchableOpacity onPress={()=>{addVariation()}} style={{borderStyle : 'dashed'}} className="py-2 border border-blue-500">
                    <Text className="text-center text-blue-500">Add variation</Text>
                </TouchableOpacity>
            </View>

            {/* Variation Lists */}
            <ScrollView className="flex-1 p-2 space-y-2">
                <Text className="font-medium text-gray-600 text-lg">Variant Lists</Text>
            {
                serviceOfferInfo.variants.length !== 0 &&
                serviceOfferInfo.variants.map((variant, index)=>{
                    return (
                        <View key={index} className={`${variant.type === '' && "hidden"}`}>
                            <Text className="font-medium text-lg">{variant.type}</Text>
                            <Text className="font-medium text-gray-500 text-sm">₱{variant.price}</Text>
                        </View>
                    )
                })
            }
            </ScrollView>
            <TouchableOpacity onPress={()=>submitServiceOffer()} className="bg-themeOrange m-5 py-3 rounded-md">
                {
                    loading ?
                    <ActivityIndicator color='white' />
                    :
                    <Text className="text-center text-white">Submit</Text>
                }
            </TouchableOpacity>
        </View>
    </Modal>
    }

    {/* Add variant */}
    <Modal visible={showAddVariationModal}>
        {/* Variation */}
        <View className="flex-1 ">
        {/* Navigation */}
        <View  className="w-full border-b-[1px] border-gray-200 bg-white flex-row items-center px-1 py-2 space-x-10">
                <TouchableOpacity onPress={()=>{setShowAddVariationModal(false);setServiceOfferInfo({...serviceOfferInfo, variants : []})}}>
                    <Icon type='material-community' name='arrow-left' />
                </TouchableOpacity>
                <Text className="text-xl font-medium text-gray-700">Add variants</Text>
        </View>
        <Text className="text-gray-600 text-lg font-medium p-2 bg-white">Add variants</Text>
        <ScrollView keyboardShouldPersistTaps='handled' className="p-2 bg-white flex-1 relative">
        {
        serviceOfferInfo.variants.map((variation, index) => {
                    return (
                        <View key={index} className="w-full flex-row gap-x-2 mt-2">
                            <TextInput value={variation.type} onChangeText={(value)=>{handleInputVariationType(value, index)}} placeholderTextColor='lightgray' className="p-2 border border-gray-200 flex-1 rounded-md" placeholder="Type" />
                            <TextInput inputMode='numeric' value={variation.price} onChangeText={(value)=>{handleInputVariationPrice(value.replace(/[^0-9]/g, ''), index)}} placeholderTextColor='lightgray' className="p-2 border border-gray-200 flex-1 rounded-md" placeholder="Price" />
                            <TextInput inputMode='numeric' value={variation.duration} onChangeText={(value)=>{handleInputVariationDuration(value.replace(/[^0-9]/g, ''), index)}} placeholderTextColor='lightgray' className="p-2 border border-gray-200 flex-1 rounded-md" placeholder="Duration" />
                            <TouchableOpacity className="flex-row items-center justify-center">
                                <Icon type='material-community' name='delete' color='red' />
                            </TouchableOpacity>
                        </View>
                        )
        })
        }
        <TouchableOpacity onPress={()=>addVariation()} className="w-[30] -left-1 mt-2">
           <Icon type='material-community' name='plus-circle' color='#336dff' />
        </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity onPress={()=>handleSubmitVariations()} className="m-5  bg-themeOrange px-2 py-3 rounded-md">
            <Text className="text-white text-center">Submit</Text>
        </TouchableOpacity>
        </View>
    </Modal>
    </>
  )
}

export default AddServiceOffer