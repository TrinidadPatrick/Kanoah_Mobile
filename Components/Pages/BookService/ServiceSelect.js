import { View, Text, Button, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react'
import useBookingStore from './BookServiceStore'

const ServiceSelect = ({service, userInformation, bookingInformation, storeBookingInformation, setStep}) => {
    const [error, setError] = useState({
        service : false,
        variant : false
    })
    const [selectedService, setSelectedService] = useState('')
    const [selectedVariant, setSelectedVariant] = useState("")
    const [duration, setDuration] = useState(null)
    const [variants, setVariants] = useState([])
    const [price, setPrice] = useState('')
    const [selectedServiceId, setSelectedServiceId] = useState('')

    const handleSelectService = (service) => {
        if(service.origPrice === "" && service.variants.length !== 0)
        {   
            
            const variantList = service.variants
            setSelectedService(service.name)
            setSelectedVariant("")
            setVariants(variantList)
            setPrice("---")
            setSelectedServiceId(service.uniqueId)
            return
        }
        setSelectedService(service.name)
        setVariants([])
        setPrice(service.origPrice)
        setDuration(Number(service.duration))
        setSelectedServiceId(service.uniqueId)
        return
       
    }

    const handleSelectVariant = (variant) => {
        setSelectedVariant(variant)
        setPrice(variant.price)
        setDuration(Number(variant.duration))
    }

    const submitServiceContext = () => {
        const data = {
            selectedService,
            selectedVariant,
            price,
            duration,
            selectedServiceId
        }

        setError((prevError) => ({
            ...prevError,
            service: selectedService === "" ? true : false,
            variant: price === "---" ? true : false,
          }));

        if(selectedService !== "" && price !== "---")
        {
            storeBookingInformation({...bookingInformation, service : data})
            setStep(2)
        }
        
    }

    useEffect(()=>{
        if(bookingInformation.service !== null)
        {
            const variants = service?.serviceOffers.find((service) => service.name === bookingInformation.service.selectedService).variants
            setVariants(variants)
            setSelectedService(bookingInformation.service.selectedService)
            setSelectedVariant(bookingInformation.service.selectedVariant)
            setDuration(bookingInformation.service.duration)
            setPrice(bookingInformation.service.price)
            setSelectedServiceId(bookingInformation.service.selectedServiceId)
        }
    },[])



    
  return (
    <View className="flex-1 flex flex-col gap-y-2 rounded-2xl pt-4">

      {/* Services List */}
      <Text className='text-sm text-gray-500 px-1 '>Choose service to book</Text>
      <Text className={` ${error.service ? "" : "hidden"} text-xs text-red-500`}>Please select an option first</Text>
      <FlatList
      numColumns={2}
      className="w-full flex-1"
      data={service?.serviceOffers}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
      <TouchableOpacity onPress={()=>handleSelectService(item)} className={` border ${item.name === selectedService ? "border-themeOrange" : "border-gray-100 "} rounded-md shadow-md bg-white h-[100px] m-1 w-[47.5%] flex justify-center items-center `}>
        <Text numberOfLines={3} className='text-sm text-gray-700 font-bold text-center '>{item.name}</Text>
        {
            item.variants.length !== 0 ?
        <Text className='text-xs text-gray-700 font-semibold text-center'>{item.variants[0].price + " - " + item.variants[item.variants.length - 1].price}</Text>
        :
        <Text className='text-xs text-gray-700 font-semibold text-center'>{item.origPrice}</Text>
        
        }
      </TouchableOpacity>
      )}
      />
      <View className="h-[15] bg-[#eeeeee]"></View>


      {/* Variant List */}
      <View className=" w-full h-[100] flex flex-col mt-3 p-2">
      <Text className={`text-xs text-gray-500 mb-2`}>Choose variant</Text>
      <Text className={` ${error.variant ? "" : "hidden"} text-xs text-red-500`}>Please select a variant first</Text>
      <Text className={` ${variants.length !== 0 ? "hidden" : ""}  text-base text-gray-500`}>No variants available</Text>
      <ScrollView  horizontal  contentContainerStyle={{justifyContent : 'center', display : 'flex', alignItems : 'center', columnGap : 10}} className="w-full h-fit">
      {
        variants?.map((variant, index)=>{
                        return (
                            <TouchableOpacity onPress={()=>handleSelectVariant(variant)} className={`${variant.type === selectedVariant.type ? " border-themeOrange" : "border-gray-100"} flex w-fit h-fit px-2 py-1 text-gray-900 border rounded-sm text-semiSm`} key={index}>
                                <Text>{variant.type}</Text>
                            </TouchableOpacity>
                        )
        })
      }
      </ScrollView>
      </View>

      {/* Price and button */}
      <View className="h-[40] w-full flex flex-row items-center">
      <Text className="w-[30%] text-center text-lg font-semibold">₱{price}</Text>
      <TouchableOpacity onPress={()=>submitServiceContext()} className="flex-1 h-full flex items-center flex-row justify-center rounded-sm bg-themeOrange">
        <Text className="text-white text-center font-semibold" >Next</Text>
      </TouchableOpacity>
      </View>
    </View>
  )
}

export default ServiceSelect