import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { LogBox } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import http from '../../../../../http'
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {FontAwesome, Entypo} from 'react-native-vector-icons'

const Profile = ({navigation}) => {
    const accessToken = SecureStore.getItem('accessToken');
    const [editableField, setEditableField] = useState('')
    const [profile, setProfile] = useState(null)
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
      ]);

    // Get the user profile
    // useFocusEffect(
    //     React.useCallback(() => {
    //       const fetchUserProfile = async () => {
    //         try {
    //           const result = await http.get(`Mobile_getUser`, {
    //             headers: {
    //               Authorization: `Bearer ${accessToken}`,
    //               'Content-Type': 'application/json',
    //             },
    //           });
    //           setProfile(result.data);
    //         } catch (error) {
    //           console.error(error);
    //         }
    //       };
    
    //       fetchUserProfile();
    
    //       // Cleanup function to cancel any pending requests or clear resources
    //       return () => {
    //         // Add cleanup logic here if needed
    //       };
    //     }, []) // Empty dependency array ensures the effect runs only on mount and unmount
    //   );
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



  return (
    <View className="h-full flex flex-col p-5 bg-white">
        {/* Profile Picture */}
        <View className=" flex flex-row justify-center py-3">
            <Image style={{width: 120, height: 120, objectFit : "contain", borderRadius : 100, borderWidth : 2, borderColor : "gray"}} source={{uri : profile?.profileImage}} />
        </View>

        {/* Informations */}
        <View className="flex flex-col " style={{rowGap : 15}}>
            {/* Username */}
            <View style={{rowGap : 5}} className="flex relative flex-col">
                <Text className="text-gray-500">
                    Username
                </Text>
                <TextInput  editable={editableField === 'username'} className={`border border-gray-300 ${editableField === "username" ? "bg-white" : "bg-gray-100"} p-2 rounded-md text-gray-500`} 
                value={profile?.username}
                onChangeText={(text) => setProfile({...profile, username : text})}
                />
                {
                    editableField === "username" ?
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
                <TextInput  editable={editableField === 'firstname'} className={`border border-gray-300 ${editableField === "firstname" ? "bg-white" : "bg-gray-100"} p-2 rounded-md text-gray-500`} value={profile?.firstname} />
                {
                    editableField === "firstname" ?
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
                <TextInput  editable={editableField === 'lastname'} className={`border border-gray-300 ${editableField === "lastname" ? "bg-white" : "bg-gray-100"} p-2 rounded-md text-gray-500`} value={profile?.lastname} />
                {
                    editableField === "lastname" ?
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
                <TextInput  editable={editableField === 'contact'} className={`border border-gray-300 ${editableField === "contact" ? "bg-white" : "bg-gray-100"} p-2 rounded-md text-gray-500`} value={profile?.contact} />
                {
                    editableField === "contact" ?
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
                <TextInput  editable={editableField === 'email'} className={`border border-gray-300 ${editableField === "email" ? "bg-white" : "bg-gray-100"} p-2 rounded-md text-gray-500`} value={profile?.email} />
                {
                    editableField === "email" ?
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
                value={`${profile?.Address.barangay.name} ${profile?.Address.municipality.name} ${profile?.Address.province.name}`} />
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
                <Text className="text-white">{`${profile?.birthDate.month} ${profile?.birthDate.day} ${profile?.birthDate.year}`}</Text>
            </TouchableOpacity>
            </View>
            </View>

            {/* Buttons */}
            <View className="flex flex-row items-center">
            <TouchableOpacity  style={{ alignSelf: 'center', paddingHorizontal: 15, paddingVertical : 10, shadowColor: '#171717'}} className="flex rounded-sm flex-row items-center bg-gray-50 border-[1px] border-gray-100">
                <Text className="font-medium text-xs text-gray-500">Change password</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={{ alignSelf: 'center', paddingHorizontal: 15, paddingVertical : 10, shadowColor: '#171717'}} className="flex rounded-sm flex-row items-center ">
                <Text className="font-medium text-xs text-red-500">Deactivate Account</Text>
            </TouchableOpacity>
            </View>

        </View>
    </View>
  )
}

export default Profile