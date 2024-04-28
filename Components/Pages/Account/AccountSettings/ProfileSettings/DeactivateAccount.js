import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import http from '../../../../../http'
import axios from 'axios';
import authStore from '../../../../../Stores/AuthState';
import useInfo from '../../../../CustomHooks/UserInfoProvider';

const DeactivateAccount = ({route, navigation}) => {
    const {_id} = route.params
    const [password, setPassword] = useState('')
    const [loadingDeac, setLoadingDeac] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const {authState, setAuthState} = authStore()
    const {isLoggedIn, userInformation, setIsLoggedIn} = useInfo()

    const logout = async () => {
        await SecureStore.deleteItemAsync("accessToken")
        unregisterIndieDevice(_id, 19825, 'bY9Ipmkm8sFKbmXf7T0zNN');
        axios.delete(`https://app.nativenotify.com/api/app/indie/sub/19825/bY9Ipmkm8sFKbmXf7T0zNN/${_id}`)
        setAuthState("loggedOut")
        setIsLoggedIn(false)
        setLoadingDeac(false)
        navigation.navigate("Home")
    }

    const deactivateAccount = async () => {
        setLoadingDeac(true)
          if(password != "")
          {
          const id = _id
          const data = {
                  _id : _id,
                  password : password
          }
          const accessToken = SecureStore.getItemAsync('accessToken');
          http.patch('deactivateAccount', data).then((res)=>{
            if(res.data.status == "Deactivated"){
               logout()
            }
            else if (res.data.status == "invalid"){setPasswordError(true); setLoadingDeac(false)}
            }).catch((err)=>{
            console.log(err)
            setLoadingDeac(false)
            })
  
          }
      }

    
  return (
    <View className="flex-1 bg-white p-2 ">
      <Text className="text-xl font-medium">Deactivate Account?</Text>
      <Text className="text-gray-500 leading-5 mt-2">Deactivating your account is a permanent action and cannot be undone. If you have mistakenly deactivated your account, please reach out to us for assistance."</Text>
      
      <View className="mt-5">
        <TextInput value={password} onChangeText={setPassword} placeholder='Current password' className={`px-2 py-1 border ${passwordError ? "border-red-500" : "border-gray-200"} rounded-md`} />
        {passwordError && <Text className="text-xs text-red-500 pl-1">Invalid password</Text>}
        <TouchableOpacity onPress={()=>deactivateAccount()} className="bg-red-500 py-2 mt-3">
            {
                loadingDeac ?
                <ActivityIndicator color='white' />
                :
                <Text className="text-white text-center">Deactivate</Text>
            }
        </TouchableOpacity>
      </View>
      
    </View>
  )
}

export default DeactivateAccount