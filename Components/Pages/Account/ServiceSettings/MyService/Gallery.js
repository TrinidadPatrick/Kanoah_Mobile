import { View, Text, FlatList, Image, TouchableNativeFeedback, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import * as SecureStore from 'expo-secure-store'
import * as ImagePicker from 'expo-image-picker';
import http from '../../../../../http'
import { TouchableOpacity } from 'react-native';
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import { CheckBox, Icon } from 'react-native-elements';
import axios from 'axios';

const Gallery = ({galleryImages, setGalleryImages, galleryScrollViewRef, setShowGalleryViewer, showGalleryViewer, serviceInfo}) => {
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const thisDate = currentYear + "-" + currentMonth + "-" + currentDay
    const [loading, setLoading] = useState(false)
    const [multipleSelectedEnable, setMultipleSelectEnable] = useState(false)
    const [imageToDelete, setImageToDelete] = useState([])
      // Id generator
    const generateId = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
    
        for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
        }
    
        return randomString;
    };

    const scrollToItem = (key) => {
        if (!galleryScrollViewRef.current) return;
    
        // Find the position of the item with the specified key
        const itemOffset = SCREEN_WIDTH * key;
        galleryScrollViewRef.current.scrollTo({ x: itemOffset, animated: false });
      };

    const getGalleryImages = async () => {
        const accessToken = await SecureStore.getItemAsync('accessToken')
        try {
            const result = await http.get('Mobile_getGalleryImages', {
                headers : {
                    'Authorization' : `Bearer ${accessToken}`
                }
            })
            setGalleryImages(result.data.images)
        } catch (error) {
            console.log(error)
        }
    }

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        quality: 1,
        base64: true,
        allowsMultipleSelection : true
        
        
      });
      if (!result.canceled) {
        const base64Images = result.assets.map(asset => `data:image/jpg;base64,${asset.base64}`);
        uploadToCloudinary(base64Images);
      }
    }

    const uploadToCloudinary = async (images) => {
        setLoading(true)
        let imagesToAdd = []
        let apiUrl = 'https://api.cloudinary.com/v1_1/dv9uw26ce/image/upload';

        // Upload the images to cloudinary
        try {
            for (let i = 0; i < images.length; i++) {
              const data = {
                file: images[i],
                upload_preset: 'KanoahGalleryUpload',
              };
        
              const response = await axios.post(apiUrl, data, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
        
              let responseData = response.data;
              const id = generateId(20)
              const imageUrl = responseData.secure_url
              imagesToAdd.push({imageId : id, src : imageUrl, TimeStamp : thisDate});
            }
            
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken')
            const response = await http.patch(`Mobile_addGalleryImage/${serviceInfo._id}`, {galleryImages : imagesToAdd}, {
                headers : {
                    'Authorization' : `Bearer ${accessToken}`
                }}) 
                const newData = [...galleryImages]
                imagesToAdd.map((images)=>{
                    newData.push(images)
                  })
                setGalleryImages(newData)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
          } catch (error) {
            console.log(error);
          }
    }  
    
    const itemView = (index) => {
            scrollToItem(index)
            setShowGalleryViewer(true)
    }

    // Selection for image deletion
    const itemSelect = (imageId) => {
        const newData = [...imageToDelete]
        const checkIndex = newData.findIndex((image) => image === imageId)
        if(checkIndex === -1)
        {
            newData.push(imageId)
            setImageToDelete(newData)
        }
        else
        {
            newData.splice(checkIndex, 1)
            setImageToDelete(newData)
        }
    }

    // Deletes all the selected images
    const deleteMultipleImages = async () => {
    const accessToken = await SecureStore.getItemAsync('accessToken')
    
    const newData = [...galleryImages]
    const filtered = newData.filter((image) => !imageToDelete.includes(image.imageId))
    setGalleryImages(filtered)
    setMultipleSelectEnable(false)

    await http.post('Mobile_deleteMultipleImages', {imageToDelete},{
      headers : {
        'Authorization' : `Bearer ${accessToken}`
      }
    }).then((res)=>{
      setImageToDelete([])
    }).catch((err)=>{
      console.log(err)
    })
    }

  return (
    <View className="flex-1 bg-white p-2 flex-col relative">
        {/* Add image Button */}
        <View className="w-full">
            <TouchableOpacity onPress={()=>{pickImage()}} className="w-full py-2 bg-gray-100 border border-gray-200 rounded-md">
                {
                    loading ?
                    <ActivityIndicator color='gray' />
                    :
                    <Text className="text-center text-gray-600">Upload image</Text>
                }
            </TouchableOpacity>
        </View>

        {
        multipleSelectedEnable &&
        <>
        <View className="w-screen absolute flex-row gap-x-2 bottom-5 z-30 px-5">
            <TouchableOpacity onPress={()=>deleteMultipleImages()} disabled={imageToDelete.length === 0} className={`w-[70%] ${imageToDelete.length === 0 ? "bg-red-300" : "bg-red-500"}  rounded-sm py-2`}>
                <Text className="text-center text-white">Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{setMultipleSelectEnable(false);setImageToDelete([])}} className="w-[30%] bg-gray-100 border border-gray-200 rounded-sm py-2">
                <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
        </View>
        </>
        }

        {/* Lists of photos */}
        <FlatList
        style={{marginTop : 10, backgroundColor : "#f9f9f9", padding : 5, borderRadius : 10}}
        columnWrapperStyle={{gap : 10}}
        contentContainerStyle={{gap: 10}}
        numColumns={3}
        data={galleryImages?.sort((a,b) => new Date(b.TimeStamp) - new Date(a.TimeStamp))}
        keyExtractor={(item, index) => index}
        renderItem={(ImgItem)=>{
            const index = ImgItem.index
            const item = ImgItem.item
            return (
                <TouchableNativeFeedback onLongPress={()=>setMultipleSelectEnable(true)} onPress={()=>{if(multipleSelectedEnable){itemSelect(item.imageId)}else{itemView(index)}}} >
                    <View className="w-[31.33%] rounded-md overflow-hidden aspect-square relative">
                    {/* Multiple Selector */}
                    {
                    multipleSelectedEnable &&
                    <>
                    <View style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="blurer w-full h-full absolute z-20"></View>
                    <View className="absolute z-30 -top-3 -left-4">
                    <CheckBox checked={imageToDelete.includes(item.imageId)} iconType="material-community"
                        checkedIcon="check-circle"
                        checkedColor='white'
                        uncheckedIcon={'checkbox-blank-circle-outline'} uncheckedColor='white' />
                    </View>
                    </>
                    }
                    {/* Image */}
                    <Image className="" source={{ uri : item.src}} style={{width : "100%", height : "100%", objectFit : "cover"}} />
                    </View>
                </TouchableNativeFeedback>
            )
        }}
        />

    </View>
  )
}

export default Gallery