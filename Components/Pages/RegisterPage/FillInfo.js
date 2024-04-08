import { View, Text, Image, Pressable, TextInput, TouchableHighlight } from 'react-native'
import React from 'react'
import { useState } from 'react'
import {FontAwesome} from '@expo/vector-icons'
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import http from '../../../http';
import { Button } from 'react-native-elements';

const FillInfo = ({route, navigation}) => {
    const {userInfos} = route.params
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [userInformation, setUserInformation] = useState({
        username : userInfos.username,
        email : "",
        password : userInfos.password,
        firstname: "",
        lastname : "",
        contact : "",
        birthDate : {
            month : new Date().toLocaleString('en-US', { month : 'long'}),
            day : new Date().toLocaleString('en-US', { day : 'numeric'}),
            year : new Date().toLocaleString('en-US', { year : 'numeric'})
        }
    })
    const [emailExist, setEmailExist] = useState(false)

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
        const month = new Date(selectedDate).toLocaleString('en-US', { month : 'long'})
        const day = new Date(selectedDate).toLocaleString('en-US', { day : 'numeric'})
        const year = new Date(selectedDate).toLocaleString('en-US', { year : 'numeric'})
        setUserInformation({...userInformation, birthDate : {month, day, year}})
      };

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

      const verifyEmail = async () => {
        try {
            const result = await http.post('verifyEmail', {email : userInformation.email})
            if(result.data.status === "EmailExist")
            {
                setEmailExist(true)
            }
            else{
                navigation.navigate('VerifyEmailByOtp', {userInformation})
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <View className="h-full relative flex justify-start items-center bg-white">
        <View style={{rowGap : 20}} className="w-[95%] flex items-center py-5">
        <Image  style={{width: 230, height: 90, objectFit : "contain"}} source={require('../../../Utilities/Images/DarkLogo.png')} />

        {/* Buttons */}
        <View style={{columnGap : 3}} className="w-full flex flex-row justify-center ">
        <Pressable columnGap={10} className="bg-white px-10  py-2 flex flex-row justify-center items-center rounded-sm" title='Sign In' >
        <FontAwesome name='user' size={18} color="white"/>
            <Text className="text-black text-sm">
            Sign In
            </Text>
        </Pressable>
        <Pressable columnGap={10} className="bg-themeBlue px-10  py-2 flex flex-row justify-center items-center rounded-sm" title='Sign In' >
        <FontAwesome name='user-plus' size={18} color="white"/>
            <Text className="text-white text-sm">
            Sign Up
            </Text>
        </Pressable>
        </View>

        {/* Text Input */}
        <View style={{rowGap : 25}} className="w-full px-3 flex">
            {/* Firstname */}
            <View style={{borderBottomWidth : 1, columnGap : 5}} className="w-full border-gray-500 flex flex-row items-center">
            <FontAwesome name='user-circle-o' size={20} color="gray"/>
            <TextInput value={userInformation.firstname} onChangeText={(text) => setUserInformation({...userInformation, firstname : text})} placeholder='Firstname'  className="w-full text-base p-2" />
            </View>

            {/* Lastname */}
            <View style={{borderBottomWidth : 1, columnGap : 5}} className="w-full border-gray-500 flex flex-row items-center relative">
            <FontAwesome name='lock' size={20} color="gray"/>
            <TextInput value={userInformation.lastname} onChangeText={(text) => setUserInformation({...userInformation, lastname : text})} placeholder='Lastname'  className=" w-full text-base p-2" />
            </View>

            {/* Contact */}
            <View style={{borderBottomWidth : 1, columnGap : 5}} className="w-full border-gray-500 flex flex-row items-center relative">
            <FontAwesome name='phone' size={20} color="gray"/>
            <Text className="translate-x-3 text-base">+63</Text>
            <TextInput value={userInformation.contact} onChangeText={(text) => setUserInformation({...userInformation, contact : text})} keyboardType='numeric'  className=" w-full text-base p-2" />
            </View>

            {/* Email */}
            <View style={{borderBottomWidth : 1, columnGap : 5}} className={`w-full ${emailExist ? "border-red-500" : "border-gray-500"}  flex flex-row items-center relative`}>
            <FontAwesome name='envelope' size={20} color="gray"/>
            <TextInput value={userInformation.email} onChangeText={(text) => setUserInformation({...userInformation, email : text})} placeholder='Email'  className=" w-full text-base p-2" />
            <Text className={`absolute ${emailExist ? "" : "hidden"} -bottom-4 text-red-500 text-xs`}>Email already in use</Text>
            </View>
            
            <View className="w-full relative">
            <Text className="text-gray-500 text-xs">Date of birth</Text>
            <TouchableHighlight onPress={()=>showDatepicker()} className="bg-gray-500 w-[130px] flex items-center p-2 rounded-sm">
                <Text className="text-white">{new Date(date).toLocaleDateString()}</Text>
            </TouchableHighlight>
            </View>

            <View className="w-full">
            <Button title='Next' disabled={!userInformation.firstname.length > 0 || !userInformation.lastname.length > 0 || !userInformation.email.length > 0} buttonStyle={{backgroundColor : "#EB6B23"}}  onPress={()=>verifyEmail()} />
            <View className="flex flex-row justify-center mt-1">
            <Text className="text-xs text-black  text-center">Already have an account? </Text>
            <Text onPress={()=>navigation.navigate('Login')} className="text-xs text-blue-500  text-center">Login now</Text>
            </View>
            </View>
            
            
        </View>
        
        

        </View>
    </View>
  )
}

export default FillInfo