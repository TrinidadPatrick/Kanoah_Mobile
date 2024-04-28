import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { LogBox } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import { Overlay } from 'react-native-elements';
import http from '../../../../../http'
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {FontAwesome, Entypo} from 'react-native-vector-icons'

const Profile = ({navigation}) => {
    const accessToken = SecureStore.getItem('accessToken');
    const [editableField, setEditableField] = useState('')
    const [profile, setProfile] = useState(null)
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
      ]);
    
    //   Get the profile of the user
    useEffect(()=>{
        const fetchUserProfile = async () => {
            try {
              const result = await http.get(`Mobile_getUser`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              setProfile(result.data);
            } catch (error) {
              console.error(error);
            }
          };
    
          fetchUserProfile();
    },[])

    const onChange = async (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        const month = new Date(selectedDate).toLocaleString('en-US', { month : 'long'})
        const day = new Date(selectedDate).toLocaleString('en-US', { day : 'numeric'})
        const year = new Date(selectedDate).toLocaleString('en-US', { year : 'numeric'})
        const newProfile = {...profile, birthDate : {month, day, year}}
        setProfile(newProfile)
        try {
            const result = await http.patch('Mobile_updateProfile', newProfile, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              })
        } catch (error) {
            console.log(error)
        }
    };
    
    // Show the datepicker
    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
          value: date,
          onChange,
          mode: currentMode,
          is24Hour: true,
        });
    };
    
    const showDatepicker = () => {
        showMode('date');
    };

    const submitEdit = async () => {
        setEditableField("")
        try {
            const result = await http.patch('Mobile_updateProfile', profile, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              })
        } catch (error) {
            console.log(error)
        }
    }

    const check = (value) => {
        setProfile(value)
    }

    const pickProfile = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true
        
      });
      let base64Img = `data:image/jpg;base64,${result.assets[0].base64}`

      uploadToCloudinary(base64Img)
    }

    const removeProfile = async () => {
        const newProfile = {...profile, profileImage : `https://ui-avatars.com/api/?name=${profile.firstname}+${profile.lastname}&background=0D8ABC&color=fff`}
        setProfile(newProfile)
        try {
            const result = await http.patch('Mobile_updateProfile', profile, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              })
        } catch (error) {
            console.log(error)
        }
    }

    const uploadToCloudinary = async (uri) => {
        let apiUrl = 'https://api.cloudinary.com/v1_1/dv9uw26ce/image/upload';

        let data = {
            "file": uri,
            "upload_preset": "KanoahProfileUpload",
          }


          axios.post(apiUrl, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(async (response) => {
              let data = response.data;
              const newProfile = {...profile, profileImage : data.secure_url}
              setProfile(newProfile)
              try {
                const result = await http.patch('Mobile_updateProfile', newProfile, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      'Content-Type': 'application/json',
                    },
                  })
            } catch (error) {
                console.log(error)
            }
            })
            .catch((error) => {
              console.log(error);
            });
    }   



  return (
    <View className="h-full flex flex-col p-5 bg-white">
        {/* Profile Picture */}
        <View className=" flex flex-row justify-center py-3">
            <TouchableOpacity onPress={()=>setVisible(true)} className="relative  rounded-full">
            <FontAwesome className={` absolute bottom-1 p-2 bg-gray-300 rounded-full right-0 z-20`} name="camera" size={20} color="gray" />
            <Image style={{width: 120, height: 120, objectFit : "contain", borderRadius : 100, borderWidth : 2, borderColor : "gray"}} source={{uri : profile?.profileImage}} />
            </TouchableOpacity>
        </View>

        {/* Informations */}
        <View className="flex flex-col " style={{rowGap : 15}}>
            {/* Username */}
            <View style={{rowGap : 5}} className="flex relative flex-col">
                <Text className="text-gray-500">
                    Username
                </Text>
                <TextInput  editable={editableField === 'username'} className={`border border-gray-300 ${editableField === "username" ? "bg-white" : "bg-gray-100"} p-2 pr-12 rounded-md text-gray-500`} 
                maxLength={30}
                value={profile?.username}
                onChangeText={(text) => setProfile({...profile, username : text})}
                />
                {
                    editableField === "username" && profile?.username.length >= 8 ?
                    <TouchableOpacity onPress={()=>submitEdit()} className="absolute bottom-2.5 right-2  py-1 rounded-sm  px-1">
                    <Text className="text-gray-500">Save</Text>
                    </TouchableOpacity>
                    :
                    <Entypo onPress={()=>setEditableField("username")} className={` ${editableField !== "" && editableField !== "username" ? "hidden" : ""} absolute bottom-3 right-2`} name="edit" size={15} color="gray" />
                }                
            </View>

            {/* Name */}
            <View className="flex flex-row w-full justify-evenly" style={{columnGap : 5}}>
            <View style={{rowGap : 5}} className="flex relative flex-col flex-1">
                <Text className="text-gray-500">
                    Firstname
                </Text>
                <TextInput 
                maxLength={30}
                 onChangeText={(text) => setProfile({...profile, firstname : text})}
                 editable={editableField === 'firstname'} className={`border border-gray-300 ${editableField === "firstname" ? "bg-white" : "bg-gray-100"} p-2 pr-12 rounded-md text-gray-500`} value={profile?.firstname} />
                {
                    editableField === "firstname" && profile?.firstname.length !== 0 ?
                    <TouchableOpacity onPress={()=>submitEdit()} className={` absolute bottom-2.5 right-2  py-1 rounded-sm  px-1`}>
                    <Text className="text-gray-500">Save</Text>
                    </TouchableOpacity>
                    :

                    <Entypo onPress={()=>setEditableField("firstname")} className={` ${editableField !== "" && editableField !== "firstname" ? "hidden" : ""} absolute bottom-3 right-2`} name="edit" size={15} color="gray" />
                }                
            </View>
            <View style={{rowGap : 5}} className="flex relative flex-col flex-1">
                <Text className="text-gray-500">
                    Lastname
                </Text>
                <TextInput 
                 onChangeText={(text) => setProfile({...profile, lastname : text})}
                editable={editableField === 'lastname'} className={`border border-gray-300 ${editableField === "lastname" ? "bg-white" : "bg-gray-100"} p-2 pr-12 rounded-md text-gray-500`} value={profile?.lastname} />
                {
                    editableField === "lastname" && profile?.lastname.length !== 0 ?
                    <TouchableOpacity onPress={()=>submitEdit()} className="absolute bottom-2.5 right-2  py-1 rounded-sm  px-1">
                    <Text className="text-gray-500">Save</Text>
                    </TouchableOpacity>
                    :
                    <Entypo onPress={()=>setEditableField("lastname")} className={` ${editableField !== "" && editableField !== "lastname" ? "hidden" : ""} absolute bottom-3 right-2`} name="edit" size={15} color="gray" />
                }                
            </View>
            </View>

            {/* Contact */}
            <View style={{rowGap : 5}} className="flex relative flex-col">
                <Text className="text-gray-500">
                    Contact
                </Text>
                <TextInput
                maxLength={10}
                 onChangeText={(text) => setProfile({...profile, contact : text})}
                editable={editableField === 'contact'} className={`border border-gray-300 ${editableField === "contact" ? "bg-white" : "bg-gray-100"} p-2 rounded-md text-gray-500`} value={profile?.contact} />
                {
                    editableField === "contact" && profile?.contact.length !== 0 ? 
                    <TouchableOpacity onPress={()=>submitEdit()} className="absolute bottom-2.5 right-2  py-1 rounded-sm  px-1">
                    <Text className="text-gray-500">Save</Text>
                    </TouchableOpacity>
                    :
                    <Entypo onPress={()=>setEditableField("contact")} className={` ${editableField !== "" && editableField !== "contact" ? "hidden" : ""} absolute bottom-3 right-2`} name="edit" size={15} color="gray" />
                }                
            </View>

            {/* Email */}
            <View style={{rowGap : 5}} className="flex relative flex-col">
                <Text className="text-gray-500">
                    Email
                </Text>
                <TextInput  
                maxLength={50}
                 onChangeText={(text) => setProfile({...profile, email : text})}
                editable={editableField === 'email'} className={`border border-gray-300 ${editableField === "email" ? "bg-white" : "bg-gray-100"} p-2 rounded-md text-gray-500`} value={profile?.email} />
                {
                    editableField === "email" && profile?.email.length !== 0 ?
                    <TouchableOpacity onPress={()=>submitEdit()} className="absolute bottom-2.5 right-2  py-1 rounded-sm  px-1">
                    <Text className="text-gray-500">Save</Text>
                    </TouchableOpacity>
                    :
                    <Entypo onPress={()=>setEditableField("email")} className={` ${editableField !== "" && editableField !== "email" ? "hidden" : ""} absolute bottom-3 right-2`} name="edit" size={15} color="gray" />
                }                
            </View>

            {/* Address */}
            <View style={{rowGap : 5}} className="flex relative flex-col">
                <Text className="text-gray-500">
                    Address
                </Text>
                <TextInput  editable={editableField === 'address'} className={`border border-gray-300 ${editableField === "address" ? "bg-white" : "bg-gray-100"} p-2 rounded-md text-gray-500`} 
                value={`${profile?.Address === null ? "Setup address" : profile?.Address === undefined ? "" : profile?.Address?.barangay.name + " " + profile?.Address?.municipality.name + " " + profile?.Address?.province.name}`} 
                />
                {
                    editableField === "address" ?
                    <TouchableOpacity onPress={()=>submitEdit()} className="absolute bottom-2.5 right-2  py-1 rounded-sm  px-1">
                    <Text className="text-gray-500">Save</Text>
                    </TouchableOpacity>
                    :
                    <Entypo onPress={()=>navigation.navigate("AddressSetup", {
                        profile, onUpdate : check, accessToken
                    })} className="absolute bottom-3 right-2" name="edit" size={15} color="gray" />
                }                
            </View>
           
            
            {/* Date of birth */}
            <View className="w-full relative">
            <Text className="text-gray-500 text-xs">Date of birth</Text>
            <View style={{columnGap : 7}} className="flex flex-row items-center">
            <TouchableOpacity onPress={()=>showDatepicker()} className="bg-gray-500 w-[150px] mt-1 flex items-center p-2 rounded-sm">
                <Text className="text-white">{profile?.birthDate === undefined ? "" : profile?.birthDate.month + ' ' + profile?.birthDate.day + ' ' + profile?.birthDate.year}</Text>
            </TouchableOpacity>
            </View>
            </View>

            {/* Buttons */}
            <View className="flex flex-row items-center">
            <TouchableOpacity onPress={()=>navigation.navigate('ChangePasswordProfile', {_id : profile._id})} style={{ alignSelf: 'center', paddingHorizontal: 15, paddingVertical : 10, shadowColor: '#171717'}} className="flex rounded-sm flex-row items-center bg-gray-50 border-[1px] border-gray-100">
                <Text className="font-medium text-xs text-gray-500">Change password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("DeactivateAccount", {_id : profile._id})} style={{ alignSelf: 'center', paddingHorizontal: 15, paddingVertical : 10, shadowColor: '#171717'}} className="flex rounded-sm flex-row items-center ">
                <Text className="font-medium text-xs text-red-500">Deactivate Account</Text>
            </TouchableOpacity>
            </View>

        </View>

            {/* Profile selection Button */}
            <Overlay overlayStyle={{backgroundColor : "white", position : "absolute", bottom : 0, padding : 0}} isVisible={visible} onBackdropPress={()=>setVisible(false)}>
            <View className="bg-gray-100 flex flex-col p-3 justify-evenly w-[100vw] h-[150] bottom-0 rounded-t-xl">
                <TouchableOpacity onPress={()=>pickProfile()} style={{columnGap : 10}} className="flex flex-row items-center">
                    <FontAwesome className={` bg-gray-300 p-2 rounded-full `} name="image" size={20} color="black" />
                    <Text className="text-lg font-medium text-gray-800">Change profile picture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>removeProfile()} style={{columnGap : 10}} className="flex flex-row items-center">
                    <FontAwesome className={` bg-red-200 px-3 py-2 rounded-full `} name="trash-o" size={20} color="red" />
                    <Text className="text-lg font-medium text-red-500">Remove profile picture</Text>
                </TouchableOpacity>
            </View>
            </Overlay>

            
    </View>
  )
}

export default Profile