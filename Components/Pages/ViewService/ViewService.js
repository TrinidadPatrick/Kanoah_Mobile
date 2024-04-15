import { View, Text, Image, TouchableOpacity, ImageBackground, ScrollView, TouchableWithoutFeedback, FlatList, Share, Linking, Dimensions } from 'react-native'
import React from 'react'
import { StatusBar as MainStatusbar } from 'expo-status-bar';
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import PagerView from 'react-native-pager-view'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import { Rating } from '@kolking/react-native-rating';
import http from '../../../http'
import useInfo from '../../CustomHooks/UserInfoProvider'
import ServiceDescription from './ServiceDescription'
import ServiceReviews from './ServiceReviews';
import ServiceOffers from './ServiceOffers';
import ServiceSchedule from './ServiceSchedule';
import ServiceGallery from './ServiceGallery';
import useBookingStore from '../BookService/BookServiceStore'
import { useFocusEffect } from '@react-navigation/native';


const ViewService = ({route, navigation}) => {
    const {storeBookingInformation} = useBookingStore()
    const {serviceId} = route.params
    const [service, setService] = useState(null)
    const [ratings, setRatings] = useState(null)
    const [selectedOption, setSelectedOption] = useState("description")
    const [featuredImageIndexSelected, setFeaturedImageIndexSelected] = useState(0)
    const [loading, setLoading] = useState(false)
    const pagerRef = useRef(null);
    const {userInformation, isLoggedIn} = useInfo()
    const [user, setUser] = useState(null)

    const bookService = () => {
      navigation.navigate(isLoggedIn ? "BookService" : "Login", isLoggedIn && {
        service : service,
        userInformation : user
     })
    }


    // Clears the booking data
    useFocusEffect(
      React.useCallback(() => {
        storeBookingInformation({service : null, schedule : null, contactAndAddress : null})
  
        return () => {
        };
      }, [])
    );

    useEffect(()=>{
        if(userInformation !== null)
        {
            setUser(userInformation)
        }
    },[userInformation])

    const scrollToIndex = (index) => {
    if (pagerRef.current) {
      pagerRef.current.setPage(index);
    }
    };

    const share = async (message) => {
        try {
            const url = await Linking.getInitialURL();
            const result = await Share.share({
                message:
                  ('Instagram | A time wasting application'+ '\n'+ url )
              });
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const getService = async () => {
          setLoading(true)
            try {
                const result = await http.get(`getServiceInfo/${serviceId}`)
                setService(result.data.service)
                setRatings(result.data.ratings)
            } catch (error) {
                console.log(error)
            } finally{
              setLoading(false)
            }
        }

        getService()
    },[])

    useEffect(()=>{
        navigation.setOptions({
            headerRight : () =>(
                <View style={{columnGap : 20}} className="w-full justify-end flex flex-row items-center">
                <TouchableOpacity style={{backgroundColor : "rgba(0, 0, 0, 0.4)"}} onPress={()=>console.log("Hello")} className="w-[30] h-[30] flex flex-row justify-center items-center rounded-full">
                    <FontAwesome name="heart-o" color="white" size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor : "rgba(0, 0, 0, 0.6)"}} onPress={()=>console.log("Hello")} className="w-[30] h-[30] flex flex-row justify-center items-center rounded-full">
                    <Entypo name="forward" color="white" size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor : "rgba(0, 0, 0, 0.6)"}} onPress={()=>console.log("Hello")} className="w-[30] h-[30] flex flex-row justify-center items-center rounded-full">
                    <FontAwesome name="ellipsis-v" color="white" size={23} />
                </TouchableOpacity>
              </View>
              ),
              header : () => (
                <View className="flex py-4">
                <View style={{columnGap : 20}} className="w-full justify-end flex flex-row items-center">
                <TouchableOpacity style={{backgroundColor : "rgba(0, 0, 0, 0.4)"}}  className="w-[30] h-[30] flex flex-row absolute left-3 justify-center items-center rounded-full" onPress={()=>navigation.goBack()}>
                <FontAwesome name="angle-left" className="absolute bottom-[1] right-[11]" color="white" size={30} />
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor : "rgba(0, 0, 0, 0.4)"}} onPress={()=>console.log("Hello")} className="w-[30] h-[30] flex flex-row justify-center items-center rounded-full">
                    <FontAwesome name="heart-o" color="white" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>share("https://docs.expo.dev/versions/latest/sdk/sharing/")} style={{backgroundColor : "rgba(0, 0, 0, 0.6)"}} className="w-[30] h-[30] flex flex-row justify-center items-center rounded-full">
                    <Entypo name="forward" color="white" size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor : "rgba(0, 0, 0, 0.6)"}} onPress={()=>console.log("Hello")} className="w-[30] h-[30] flex flex-row justify-center items-center rounded-full">
                    <FontAwesome name="ellipsis-v" color="white" size={23} />
                </TouchableOpacity>
              </View>
                
                </View>
              )
        })
    },[])


  return (
    <>
    <ScrollView contentContainerStyle={{display : "flex", flexDirection : "column", alignItems : 'flex-start'}} className="h-full bg-white">
    <MainStatusbar barStyle="light-content" backgroundColor="transparent" />
    {
      loading ? 
      <>
      <View className="w-full aspect-square flex items-center justify-center bg-gray-100" >
      <Entypo className="" name="bowl" color="gray" size={30} />
      </View>
       <View className="flex flex-row gap-2 mt-1 mx-2">
       <View className="w-[100px] h-[100px] bg-gray-100 animate-pulse"  ></View>
       <View className="flex flex-col flex-1  justify-between pr-2">
       <View className="w-[90%] h-[12px] bg-gray-200 animate-pulse" ></View>
       <View className="w-[80%] h-[12px] bg-gray-100 animate-pulse"  ></View>
       <View className="w-[95%] h-[12px] bg-gray-200 animate-pulse"  ></View>
       <View className="w-[69%] h-[12px] bg-gray-100 animate-pulse"  ></View>
       </View>
       </View>
       </>
      :
      <View className="w-full flex flex-col flex-1 pb-[50] relative">
      <View className="w-full aspect-square bg-gray-50 overflow-hidden relative">
      <PagerView ref={pagerRef} onPageSelected={(e)=>setFeaturedImageIndexSelected(e.nativeEvent.position)} style={{flex : 1}} initialPage={0}>
        {
            service?.featuredImages?.map((image, index)=>{
                return (
                <View key={index} style={{zIndex : 20, position : 'absolute', width : "100%", height : "100%"}}>
                <ImageBackground blurRadius={7} source={{ uri : image.src}} style={{justifyContent : 'center', alignItems : 'center', backgroundColor : "rgba(0, 0, 0, 0.1)"}} >
                <Image source={{uri : image.src}} style={{width : "100%", height : "100%", objectFit : "contain"}} />
                </ImageBackground>
                </View>
                )
            })
        }
        
      </PagerView>
      <Text style={{backgroundColor : "rgba(0, 0, 0, 0.6)"}} className="absolute px-2 py-1 rounded-lg text-white bottom-2 right-2">{featuredImageIndexSelected + 1}/{service?.featuredImages.length}</Text>
      </View>

      <FlatList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      className="mt-2 ml-2"
      contentContainerStyle={{justifyContent : 'center', display : 'flex', alignItems : 'center', columnGap : 10}}
      data={service?.featuredImages}
      renderItem={(item)=>{
        const image = item.item
       
        return (
            <TouchableOpacity onPress={()=>scrollToIndex(item.index)} className={`${item.index == featuredImageIndexSelected ? "border-[1.5px] border-themeOrange" : ""} w-[55] h-[55] aspect-square rounded-sm overflow-hidden`}>
                <Image source={{uri : image.src}} style={{width : "100%", height : "100%"}} />
            </TouchableOpacity>
        )
      }}
      />

      {/* Titles */}
      <View style={{rowGap : 5}} className="mt-3 mb-2 px-2 flex flex-col">
        <Text className="text-2xl ml-1 font-medium text-gray-700">{service?.basicInformation?.ServiceTitle}</Text>
        <View className="flex flex-row items-center">
        <Entypo className="" name="location-pin" color="gray" size={20} />
        <Text numberOfLines={1}  className="text-sm text-gray-400  ">
            {service?.address?.barangay.name} {service?.address?.municipality.name}, {service?.address?.province.name}
        </Text>
        </View>
        <View className="flex flex-row items-center ml-1 mt-3">
        <Rating size={18} baseColor='#f2f2f2' rating={service?.ratings} spacing={5} disabled />
        <Text className="mx-1 text-gray-400 font-medium">{service?.ratings}</Text>
        <Text  className=" text-gray-400 font-medium">({service?.totalReviews})</Text>
        </View>
      </View>

      {/* Owner Contact */}
      <View style={{columnGap : 15}} className="w-full flex flex-row items-center px-2 py-3 mt-2 bg-gray-100 rounded-md">
        <View>
        <Image source={{uri : service?.serviceProfileImage}} style={{width : 90, height : 90, borderRadius : 100}} />
        </View>
        <View style={{rowGap : 10}} className="w-full flex flex-col ">
        <View style={{columnGap : 10}} className="flex flex-row items-center">
        <FontAwesome name="user-circle-o" color="gray" size={20} />
        <Text className="font-normal text-gray-600">{service?.owner.firstname + " " + service?.owner.lastname}</Text>
        </View>
        <View style={{columnGap : 10}} className="flex flex-row items-center">
        <FontAwesome name="envelope-o" color="gray" size={20} />
        <Text className="font-normal text-gray-600">{service?.basicInformation.OwnerEmail}</Text>
        </View>
        <View style={{columnGap : 10}} className="flex flex-row items-center">
        <FontAwesome name="phone" color="gray" size={20} />
        <Text className="font-normal text-gray-600">+63 {service?.basicInformation.OwnerContact}</Text>
        </View>
        </View>
      </View>

      {/* Three Options */}
      <View style={{columnGap : 5}} className="flex flex-row w-full justify-evenly mt-5">
        <TouchableWithoutFeedback onPress={()=>setSelectedOption("description")}>
            <View className="flex flex-row justify-center flex-1 border-r-[1px] relative border-gray-500">
            <Text className={`${selectedOption === "description" ? "text-themeOrange border-themeOrange border-b-[2px]" : "" }  py-1 `}>Description</Text>
            </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>setSelectedOption("reviews")}>
        <View className="flex flex-row justify-center flex-1 border-r-[1px] relative border-gray-500">
            <Text className={`${selectedOption === "reviews" ? "text-themeOrange border-themeOrange border-b-[2px]" : "" }  py-1 `}>Reviews</Text>
        </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={()=>setSelectedOption("services")} className="flex flex-row justify-center flex-1 border-r-[1px] relative border-gray-500">
        <View className="flex flex-row justify-center flex-1 border-r-[1px] relative border-gray-500">
            <Text className={`${selectedOption === "services" ? "text-themeOrange border-themeOrange border-b-[2px]" : "" }  py-1 `}>Services</Text>
        </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Description Review and services */}
      <View className="flex w-full flex-col mt-3">
        {selectedOption === "description" ? <ServiceDescription description={service?.basicInformation?.Description} /> : 
        selectedOption === "reviews" ? <ServiceReviews ratings={ratings} navigation={navigation} /> :
        <ServiceOffers serviceOffers={service?.serviceOffers} />
        }
      </View>

      <View className="w-full h-[15] bg-gray-100">
      </View>
      
      {/* Schedule */}
      <View  className="flex w-full flex-col mt-3">
        <ServiceSchedule serviceHour={service?.serviceHour} />
      </View>

      <View className="w-full h-[15] bg-gray-100">
      </View>
      
      {/* Gallery */}
      <View className="w-full flex flex-col h-fit px-3 pb-5">
        <View className="flex flex-row border-b-[1px] pb-1 border-gray-100 items-center justify-between">
        <Text className="text-sm font-medium">Gallery</Text>
        <TouchableOpacity className="w-[50] flex flex-row justify-end" onPress={()=>{navigation.navigate('ViewAllGallery',{galleryImages : service.galleryImages})}}><FontAwesome className="" name="angle-right" color="gray" size={30} /></TouchableOpacity>
        </View>
        <ServiceGallery gallery={service?.galleryImages} /> 
      </View>

      <View className="w-full h-[15] bg-gray-100">
      </View>

      {/* Other Infos */}
      <View className="w-full h-fit py-2 px-3">
      <Text className="text-sm font-medium mb-2">Service Delivery Options</Text>
      <View style={{columnGap : 10}} className="w-full flex flex-row items-center justify-start">
      {
        service?.advanceInformation.ServiceOptions?.map((option, index)=>{
          return (
            <Text className="font-medium px-2 py-1 bg-gray-200 rounded-sm border border-gray-100 text-gray-500" key={index}>{option}</Text>
          )
        })
      }
      </View>
      </View>

      {/* Service Contacts */}
      <View className="w-full h-fit py-2 px-3">
      <Text className="text-sm font-medium mb-2">Service Contact</Text>
      <View style={{rowGap : 10}} className="w-full flex flex-col items-start justify-start">
          <View className="w-full flex flex-row items-center">
          <FontAwesome name="phone" color="gray" size={20} />
          <Text className="font-medium px-2 pb-1 text-gray-500">
          +63{service?.advanceInformation.ServiceContact} | {service?.advanceInformation.ServiceFax}
          </Text>
          </View>
          <View className="w-full flex flex-row items-center">
          <FontAwesome name="envelope" color="gray" size={20} />
          <Text className="font-medium px-2 pb-1 text-gray-500">
          {service?.advanceInformation.ServiceEmail}
          </Text>
          </View>
      </View>
      </View>

      {/* Social*/}
      <View className={`w-full ${service?.advanceInformation.SocialLink[0].link === "" && service?.advanceInformation.SocialLink[1].link === "" && service?.advanceInformation.SocialLink[2].link === "" && "hidden"} h-fit py-2 px-3`}>
      <Text className="text-sm font-medium mb-2">Social</Text>
      <View style={{rowGap : 10}} className="w-full flex flex-col items-start justify-start">
          <View style={{columnGap : 30}} className="w-full flex flex-row items-center">
          <TouchableOpacity className={`${service?.advanceInformation.SocialLink[1].link !== "" ? "" : "hidden"}`} onPress={()=>{Linking.openURL(service?.advanceInformation.SocialLink[1].link)}}><FontAwesome name="facebook-official" color="#1877f2" size={40} /></TouchableOpacity>
          <TouchableOpacity className={`${service?.advanceInformation.SocialLink[0].link !== "" ? "" : "hidden"}`} onPress={()=>{Linking.openURL(service?.advanceInformation.SocialLink[0].link)}}><FontAwesome name="youtube-play" color="red" size={40} /></TouchableOpacity>
          <TouchableOpacity className={`${service?.advanceInformation.SocialLink[2].link !== "" ? "" : "hidden"}`} onPress={()=>{Linking.openURL(service?.advanceInformation.SocialLink[2].link)}}><FontAwesome name="instagram" color="black" size={40} /></TouchableOpacity>
          </View>
      </View>
      </View>

      </View>
    }
      
      
    </ScrollView>
    
    {/* Chat and Book button */}
    <View  className="w-full h-[50] flex flex-row items-center justify-evenly bg-white absolute bottom-0">
      <TouchableOpacity className="bg-blue-500 w-[30%] py-2 rounded-md">
        <View style={{columnGap : 5}} className="flex flex-row items-center justify-center">
        <FontAwesome  name="comments" color="white" size={20} />
        <Text className="text-white w-fit text-center">Chat</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{bookService()}} className="bg-themeOrange w-[60%] py-2 rounded-md">
        <Text className="text-white w-full text-center">Book Now</Text>
      </TouchableOpacity>
    </View>
    </>
  )
}

export default ViewService