import { View, Text, TouchableOpacity, TextInput, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import http from '../../../http';
import { Icon, Image } from 'react-native-elements'

const ReportService = ({route, navigation}) => {
    const {service} = route.params
    const reasons = ['Explicit Content', 'Fake Information/False Claims', 'Hate Speech/Bullying', 'Violence/Threats','Spam/Scams', 'Terrorism', 'Involves a child', 'Nudity', 'Non-Compliance with Terms of Service']
    const [reportObject, setReportObject] = useState({
        service : {
            name : service.basicInformation.ServiceTitle,
            _id : service._id,
            owner : {
                _id : service.owner._id,
                firstname : service.owner.firstname,
                lastname : service.owner.lastname,
                profileImage : service.owner.profileImage,
            }
        },
        reasons : [],
        textDetails : '',
        photos : [],
        createdAt : new Date()
    })
    const [loading, setLoading] = useState(false)
    const [submiting, setSubmiting] = useState(false)

    useEffect(()=>{
        navigation.setOptions({
            headerTitle : "Report" + " " + service?.basicInformation.ServiceTitle
        })
    },[])


    const generateId = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters.charAt(randomIndex);
        }
      
        return randomString;
      };

    const handleSelectReason = (value) => {
        const newSelectedReasons = [...reportObject.reasons]
        const checkIndex = newSelectedReasons.findIndex((reason)=>reason === value)
        if(checkIndex == -1)
        {
          newSelectedReasons.push(value)
          setReportObject({...reportObject, reasons : newSelectedReasons})
          return
        }
        newSelectedReasons.splice(checkIndex, 1)
        setReportObject({...reportObject, reasons : newSelectedReasons})
        
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
                upload_preset: 'Kanoah_ReportImages',
              };
        
              const response = await axios.post(apiUrl, data, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
        
              let responseData = response.data;
              const id = generateId(20)
              const imageUrl = responseData.secure_url
              imagesToAdd.push({imageId : id, src : imageUrl, TimeStamp : new Date()});
              setReportObject({...reportObject, photos : imagesToAdd})
            }
            setLoading(false)
          } catch (error) {
            console.log(error);
          }
    }

    const submitReport = async () => {
        setSubmiting(true)
        try {
        const accessToken = await SecureStore.getItemAsync("accessToken")
          const result = await http.post('Mobile_AddReport', reportObject, {
            headers : {'Authorization' : `Bearer ${accessToken}`}
          })
          if(result.data.message === "Reported successfull")
          {
            ToastAndroid.showWithGravityAndOffset(
                'Report successfull',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
            setTimeout(()=>{
                navigation.goBack()
            },  1000)
          }
        } catch (error) {
          console.log(error)
        } finally {
            setSubmiting(false)
        }
    }


  return (
    <View className="flex-1 bg-white flex-col p-2">
        {/* Reason */}
        <View className="flex-col">
            <Text className="font-medium text-gray-600">Reason for reporting this service?</Text>
            <View className="flex-row flex-wrap gap-3 mt-1">
            {
            reasons.map((reason, index) => {
                return (
                    <TouchableOpacity onPress={()=>handleSelectReason(reason)} key={index} className={` px-3 ${reportObject.reasons.includes(reason) ? " bg-teal-600 text-white" : "bg-gray-100"} py-1 `}>
                        <Text className={`${reportObject.reasons.includes(reason) ? "  text-white" : ""}`}>{reason}</Text>
                    </TouchableOpacity>
            )})
            }
            </View>
        </View>
        {/* Text detail */}
        <View className="flex-col mt-10">
            <Text className="font-medium text-gray-600">Can you provide a detailed explanation about the issue?</Text>
            <Text className=" text-gray-500 text-xs">Provide a detailed description of your encounter with the service, it will greatly help us to process your request faster.</Text>
            <View className="mt-2 h-[150] border border-gray-200 rounded-md">
            <TextInput value={reportObject.textDetails} onChangeText={(value)=>{setReportObject({...reportObject, textDetails : value})}} maxLength={1000} multiline className="p-2" />
            </View>
        </View>
        {/* Photos */}
        <View className="flex-col mt-10">
            <Text className="font-medium text-gray-600">Attach Photos</Text>
            <TouchableOpacity onPress={()=>pickImage()} className="bg-themeOrange w-[150] flex-row items-center px-2 py-1.5 rounded-sm">
                {
                    loading ? <ActivityIndicator color='white' />
                    :
                    <>
                    <Icon type='material-community' name='tray-arrow-up' color='white' size={18} />
                    <Text className="text-white flex-1 text-center">
                    Upload
                    </Text>
                    </>
                }
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{columnGap : 15}} horizontal className="mt-2  border border-gray-200 rounded-md p-2">
            {
                reportObject.photos.map((photo)=>(
                    <View className="w-[100] aspect-square">
                        <Image source={{uri : photo.src}} style={{width : "100%", height : "100%"}} />
                    </View>
                ))
            }
            </ScrollView>
        </View>

        <TouchableOpacity onPress={()=>submitReport()} className="bg-gray-100 border border-gray-200 absolute w-full px-2 py-2 left-2 bottom-5 rounded-sm">
            {
                submiting ? <ActivityIndicator color='white' /> 
                :
                <Text className="text-gray-700 font-medium text-center">Submit</Text>
            }
        </TouchableOpacity>
    </View>
  )
}

export default ReportService