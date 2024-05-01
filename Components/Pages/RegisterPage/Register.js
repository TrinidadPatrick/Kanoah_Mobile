import { View, Text, TextInput, Button, FlatList, ScrollView, Platform, Image, StyleSheet, Pressable, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesome} from '@expo/vector-icons'
import http from '../../../http';

const Register = (props) => {
    const navigation = props.navigation
    const [userInfos, setUserInfo] = useState({
        username : "",
        password : "",
    })
    const [validInput, setValidInput] = useState({username : true, password : true})
    const [usernameTaken, setUsernameTaken] = useState(false)


    const next = async () => {
        const {username, password} = userInfos

        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

        const hasUppercase = uppercaseRegex.test(password);
        const hasLowercase = lowercaseRegex.test(password);
        const hasNumber = numberRegex.test(password);
        const hasSpecialChar = specialCharRegex.test(password);

        if(username.length < 5){
        setValidInput((prevData) => ({...prevData, username : false}))
        }if (username.length > 5){
            setValidInput((prevData) => ({...prevData, username : true}))
        }if(password.length < 8 || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar){
            setValidInput((prevData) => ({...prevData, password : false}))
        }if(password.length >= 8 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar){
            setValidInput((prevData) => ({...prevData, password : true}))
        }if(username.length >= 5 && password.length >= 8 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar)
        {
            try {
                const result = await http.post("verifyUsername", {username : userInfos.username})
                if(result.data.status === "available")
                {
                    setUsernameTaken(false)
                    navigation.navigate('FillInfo', {userInfos})
                }
                else
                {
                    setUsernameTaken(true)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    


  return (
    <ImageBackground
    source={require('../../../Utilities/Images/login_bg9.png')}
    >
    <View className="h-full relative flex justify-start pt-10 items-center">

        <View style={{rowGap : 30}} className="w-[95%] flex items-center py-5">
        <Image  style={{width: 230, height: 90, objectFit : "contain"}} source={require('../../../Utilities/Images/DarkLogo.png')} />

        {/* Buttons */}
        <View style={{columnGap : 3}} className="w-full flex flex-row justify-center ">
        <Pressable columnGap={10} className="bg-white px-10  py-2 flex flex-row justify-center items-center rounded-sm" title='Sign In' >
        <FontAwesome name='user' size={18} color="black"/>
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
        <View style={{rowGap : 15}} className="w-full px-3 flex">
            <View style={{borderBottomWidth : 1, columnGap : 5}} className={`w-full flex ${!validInput.username || usernameTaken ? "border-red-500" : ""} relative flex-row items-center`}>
            <FontAwesome name='user-circle-o' size={20} color="gray"/>
            <TextInput value={userInfos.username} onChangeText={(text)=>{setUserInfo({...userInfos, username : text})}} placeholder='Enter Username'  className="w-full text-base p-2" />
            <Text className={`text-red-500 ${validInput.username ? "hidden" : ""} -bottom-4 text-xs absolute`}>Username must contain atleast 6 characters</Text>
            <Text className={`text-red-500 ${!usernameTaken ? "hidden" : ""} -bottom-4 text-xs absolute`}>Username already taken</Text>
            </View>
            
            <View className="flex-col">
            <View style={{borderBottomWidth : 1, columnGap : 5}} className={` ${!validInput.password || usernameTaken ? "border-red-500" : ""} relative flex-row items-center`}>
            <FontAwesome name='lock' size={20} color="gray"/>
            <TextInput value={userInfos.password} onChangeText={(text)=>{setUserInfo({...userInfos, password : text})}} secureTextEntry={true} placeholder='Create password'  className=" w-full text-base p-2" />
            </View>
            <Text className={`text-red-500 ${validInput.password ? "hidden" : ""}  text-xs`}>Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character</Text>
            </View>
            
        </View>
        
        {/* Next Button */}
        <View className="w-full px-3 mt-2">
        <TouchableOpacity onPress={()=>next()} columnGap={10} className="bg-themeBlue py-[10] w-full flex justify-center items-center rounded-sm" title='Sign In' >
            <Text className="text-white text-base">
            Next
            </Text>
        </TouchableOpacity>
        <View className="flex flex-row justify-center mt-1">
        <Text className="text-xs text-black  text-center">Already have an account? </Text>
        <Text onPress={()=>navigation.navigate('Login')} className="text-xs text-blue-500  text-center">Login now</Text>
        </View>
        </View>

        </View>
    </View>
    </ImageBackground>
  )
}

export default Register