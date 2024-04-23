import { View, Text, TextInput, Image, BackHandler, Pressable, ImageBackground } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import {FontAwesome} from '@expo/vector-icons'
import http from '../../../http';
import useInfo from '../../CustomHooks/UserInfoProvider';
import * as SecureStore from 'expo-secure-store';


const Login = (props) => {
    const {setIsLoggedIn} = useInfo()
    const navigation = props.navigation
    const [userInfos, setUserInfo] = useState({
        UsernameOrEmail : "",
        password : "",
    })
    const [invalidLogin, setInvalidLogin] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


  const signin = async () => {
    setIsLoading(true)
    try {
        const result = await http.post(`loginMobile`, userInfos)
        if(result.data.status === "authenticated"){
            registerIndieID(result.data.userId, 19825, 'bY9Ipmkm8sFKbmXf7T0zNN');
            setIsLoggedIn(true)
            await SecureStore.setItemAsync('accessToken', result.data.accessToken)
            navigation.navigate('Home')
        }
    } catch (error) {
        setInvalidLogin(true)
    } finally{
        setIsLoading(false)
    }
  }

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Home"); // Navigate to specific screen on back button press
      return true; // Prevent default back button behavior
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => backHandler.remove()
    }, [navigation]);

  return (
    <ImageBackground source={require('../../../Utilities/Images/login_bg9.png')}>
    <View className="h-full relative flex justify-start pt-10 items-center">
    <View className={`${invalidLogin ? "block" : "hidden"} w-[90%] bg-red-200 py-2 mt-3 rounded-sm`}>
      <Text className='text-center text-sm text-red-600'>Invalid username/email or password.</Text>
    </View>
        <View style={{rowGap : 30}} className="w-[95%] flex items-center py-5">
        <Image  style={{width: 230, height: 90, objectFit : "contain"}} source={require('../../../Utilities/Images/DarkLogo.png')} />

        {/* Buttons */}
        <View style={{columnGap : 3}} className="w-full flex flex-row justify-center ">
        <Pressable columnGap={10} className="bg-themeBlue px-10  py-2 flex flex-row justify-center items-center rounded-sm" title='Sign In' >
        <FontAwesome name='user' size={18} color="white"/>
            <Text className="text-white text-sm">
            Sign In
            </Text>
        </Pressable>
        <Pressable columnGap={10} className="bg-white px-10  py-2 flex flex-row justify-center items-center rounded-sm" title='Sign In' >
        <FontAwesome name='user-plus' size={18} color="black"/>
            <Text className="text-black text-sm">
            Sign Up
            </Text>
        </Pressable>
        </View>

        {/* Text Input */}
        <View style={{rowGap : 15}} className="w-full px-3 flex">
            <View style={{borderBottomWidth : 1, columnGap : 5}} className="w-full flex flex-row items-center">
            <FontAwesome name='user-circle-o' size={20} color="gray"/>
            <TextInput value={userInfos.UsernameOrEmail} onChangeText={text => setUserInfo({...userInfos, UsernameOrEmail : text})} placeholder='Username/Email'  className="w-full text-base p-2" />
            </View>
            <View style={{borderBottomWidth : 1, columnGap : 5}} className="w-full flex flex-row items-center relative">
            <FontAwesome name='lock' size={20} color="gray"/>
            <TextInput value={userInfos.password} onChangeText={text => setUserInfo({...userInfos, password : text})} secureTextEntry={true} placeholder='Password'  className=" w-full text-base p-2" />
            <Text onPress={()=>navigation.navigate('ForgotPassword')} className="text-xs text-blue-500  absolute -bottom-5 right-0">Forgot Password</Text>
            </View>
            
        </View>
        
        {/* Login Button */}
        <View className="w-full px-3 mt-2">
        {
            userInfos.UsernameOrEmail === "" || userInfos.password === "" ?
            <Pressable columnGap={10} className="bg-gray-300 py-[10] w-full flex justify-center items-center rounded-sm" title='Sign In' >
            <Text className="text-white text-base">Sign In</Text>
            </Pressable>
            :
            <Pressable onPress={()=>signin()} columnGap={10} className={` ${isLoading ? "bg-slate-600" : "bg-themeBlue"} py-[10] w-full flex justify-center items-center rounded-sm`} title='Sign In' >
            <Text className="text-white text-base">Sign In</Text>
            </Pressable>
        }
        <View className="flex flex-row justify-center mt-1">
        <Text className="text-xs text-black  text-center">Dont have an account? </Text>
        <Text onPress={()=>navigation.navigate('Register')} className="text-xs text-blue-500  text-center">Register now</Text>
        </View>
        </View>

        </View>
    </View>
    </ImageBackground>
  )
}


export default Login