import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView, StatusBar} from 'react-native'
import React, { useCallback } from 'react'
import { useEffect, useState, useRef } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Tab, TabView } from 'react-native-elements'
import http from '../../../../../http'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import Gallery from './Gallery'
import Featured from './Featured'
import { useFocusEffect } from '@react-navigation/native'
import serviceStore from '../../../../../Stores/UserServiceStore'

const MyService = ({route, navigation}) => {
    const {service, setService} = serviceStore()
    const userInformation = route.params.userInformation
    const [serviceInfo, setServiceInfo] = useState(service)
    const [index, setIndex] = useState(0);
    const galleryScrollViewRef = useRef(null);
    const featuredScrollViewRef = useRef(null);
    const [showGalleryViewer, setShowGalleryViewer] = useState(false)
    const [showFeaturedViewer, setShowFeaturedViewer] = useState(false)
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const [galleryImages, setGalleryImages] = useState(null)
    const [featuredImages, setFeaturedImages] = useState(null)

    const getServiceInformation = async () => {
        const accessToken = await SecureStore.getItemAsync('accessToken')
        if(accessToken)
        {
            try {
                const result = await http.get('Mobile_getService', {
                    headers : {
                        'Authorization' : `Bearer ${accessToken}`,
                        "Content-Type" : 'application/json'
                    }
                })

                setServiceInfo(result.data.service)
                setService(result.data.service)
            } catch (error) {
                console.log(error)
            }
            return
        }

        navigation.navigate("Home")
    }

    useFocusEffect(
      useCallback(()=>{
        getServiceInformation()
      },[])
    )

    const getGalleryImages = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken')
      try {
          const result = await http.get('Mobile_getGalleryImages', {
              headers : {
                  'Authorization' : `Bearer ${accessToken}`
              }
          })
          setGalleryImages(result.data.images)
          getFeaturedImages()
      } catch (error) {
          console.log(error)
      }
    }

    const getFeaturedImages = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken')
      try {
          const result = await http.get('Mobile_getFeaturedImages', {
              headers : {
                  'Authorization' : `Bearer ${accessToken}`
              }
          })
          setFeaturedImages(result.data.images)
      } catch (error) {
          console.log(error)
      }
    }
    useEffect(()=>{
        getGalleryImages()
    },[])

    useEffect(()=>{
        navigation.setOptions({
            headerTitle : `${userInformation?.lastname}, ${userInformation.firstname}`
        })
        setServiceInfo(service)
    },[])

    useEffect(()=>{
      navigation.setOptions({
        headerShown: !showGalleryViewer,
      })
    },[showGalleryViewer])

    useEffect(()=>{
      navigation.setOptions({
        headerShown: !showFeaturedViewer,
      })
    },[showFeaturedViewer])
    

  return (
    <View className="flex-1  bg-white flex-col relative">
      {/* Top Part, service details including contact and title */}
      <View className="w-full flex-row gap-x-2 mb-2 p-2">
        {/* Image */}
        <View className="h-[100] aspect-square rounded-md overflow-hidden">
            <Image source={{uri : serviceInfo?.serviceProfileImage}} style={{width : "100%", height : "100%", objectFit : 'cover'}} />
        </View>
        {/* Service Details */}
        <View className="flex-1 flex-col  px-1 rounded-md ">
        <View className="flex-1 flex-col space-y-0.5 ">
            <Text numberOfLines={1} className="text-xl font-medium text-gray-800">{serviceInfo?.basicInformation.ServiceTitle}</Text>
            <Text numberOfLines={1} className="text-sm font-normal text-gray-600">{serviceInfo?.basicInformation.OwnerEmail}</Text>
            <Text numberOfLines={1} className="text-sm font-normal text-gray-600">+63{serviceInfo?.basicInformation.OwnerContact}</Text>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('EditService', {
          serviceInfo
        })}>
                <Text className="text-blue-500">Edit service</Text>
         </TouchableOpacity>
        </View>
      </View>

      {/* Tab */}
      <Tab value={index} sc onChange={(e) => setIndex(e)} indicatorStyle={{backgroundColor: '#EB6B23',height: 3,}} variant="default">
      <Tab.Item
        title="Gallery"
        titleStyle={{ fontSize: 12, color : 'black' }}
        containerStyle={{backgroundColor : "white",}}
      />
      <Tab.Item
        title="Featured Photos"
        titleStyle={{ fontSize: 12, color : "black" }}
        containerStyle={{backgroundColor : "white"}}
      />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
          <Gallery serviceInfo={serviceInfo} showGalleryViewer={showGalleryViewer} galleryScrollViewRef={galleryScrollViewRef} setShowGalleryViewer={setShowGalleryViewer} galleryImages={galleryImages} setGalleryImages={setGalleryImages} />
        </TabView.Item>
        <TabView.Item style={{ backgroundColor: 'white', width: '100%' }}>
          <Featured serviceInfo={serviceInfo} featuredScrollViewRef={featuredScrollViewRef} showFeaturedViewer={showFeaturedViewer} setShowFeaturedViewer={setShowFeaturedViewer} featuredImages={featuredImages} setFeaturedImages={setFeaturedImages} />
        </TabView.Item>
      </TabView>

      {/* Gallery Viewer */}
      <View style={{backgroundColor : "rgba(0,0,0,1)"}} className={`w-full h-full absolute ${showGalleryViewer ? "flex" : "hidden"} flex-row justify-center items-center`}>
        <TouchableOpacity onPress={()=>setShowGalleryViewer(false)} className="absolute w-20 p-2 top-0 left-0  z-20">
        <FontAwesome  name="angle-left" color="white" size={35} />
        </TouchableOpacity>
        <ScrollView ref={galleryScrollViewRef} pagingEnabled={true} ind contentContainerStyle={{display : "flex", flexDirection : "row", alignItems : "center" }} horizontal={true} className="w-full h-full relative " >
        {
            galleryImages?.map((image, index)=>(
            <View key={index} style={{width : SCREEN_WIDTH, height : "auto"}} className="">
            <Image resizeMode='contain' source={{uri : image.src}} style={{width : "100%", height : "100%"}} />
            <View className="absolute  bottom-5 left-5 py-0 text-lg flex flex-row justify-center z-30 w-fit">
            <Text className="text-gray-300">{image.TimeStamp}</Text>
            </View>
            </View>
            
            ))
        }
        </ScrollView>
      </View>

      {/* Featured Viewer */}
      <View style={{backgroundColor : "rgba(0,0,0,1)"}} className={`w-full h-full absolute ${showFeaturedViewer ? "flex" : "hidden"} flex-row justify-center items-center`}>
        <TouchableOpacity onPress={()=>setShowFeaturedViewer(false)} className="absolute w-20 p-2 top-0 left-0  z-20">
        <FontAwesome  name="angle-left" color="white" size={35} />
        </TouchableOpacity>
        <ScrollView ref={featuredScrollViewRef} pagingEnabled={true} ind contentContainerStyle={{display : "flex", flexDirection : "row", alignItems : "center" }} horizontal={true} className="w-full h-full relative " >
        {
            featuredImages?.map((image, index)=>(
            <View key={index} style={{width : SCREEN_WIDTH, height : "auto"}} className="">
            <Image resizeMode='contain' source={{uri : image.src}} style={{width : "100%", height : "100%"}} />
            <View className="absolute  bottom-5 left-5 py-0 text-lg flex flex-row justify-center z-30 w-fit">
            <Text className="text-gray-300">{image.TimeStamp}</Text>
            </View>
            </View>
            
            ))
        }
        </ScrollView>
      </View>

      <StatusBar
        backgroundColor={showGalleryViewer || showFeaturedViewer ? '#000' : '#fff'}
        barStyle={showGalleryViewer || showFeaturedViewer ? 'light-content' : 'dark-content'}
      />
    </View>
  )
}

export default MyService