import { View, Text, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import { Button } from '@rneui/themed'
import { useState } from 'react'
import http from '../../../../../http'
import React from 'react'

const ChangePasswordProfile = ({route, navigation}) => {
    const {_id} = route.params
    const [visibleInput, setVisibleInput] = useState({
        oldPassword : false,
        newPassword : false, 
        confirmPassword : false
    })
    const [input, setInput] = useState({
        oldPassword : '',
        newPassword : '',
        confirmPassword : ''
    })
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const verifyInput = async () => {
        // Check if the password matches
        if(input.newPassword !== input.confirmPassword)
        {
            setErrorMsg("Password do not match")
            return
        }
        try {
            setLoading(true)
            const data = {
                _id : _id,
                password : input.oldPassword,
                newPassword : input.newPassword
            }
            const result = await http.patch('updatePassword', data)
            if(result.data.status === "invalid")
            {
                setErrorMsg("Password is incorrect")
                return
            }
            ToastAndroid.showWithGravity(
                'Password updated',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            navigation.goBack()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


  return (
    <View className=" h-full flex flex-col p-3 bg-white">
      <Text className="text-2xl font-medium">Create new password</Text>
      <Text className="text-gray-500 w-[90%] text-sm">Always use password with different character types such as Uppercase, lowercase, number, and special characters.</Text>

      {/* Error Container */}
      <View className={`w-full h-[70] bg-red-100 mt-2 ${errorMsg !== "" ? "flex" : "hidden"} flex-col rounded-md p-2 items-center`}>
        <Text className="text-xl text-red-500">Password Error</Text>
        <Text className="text-sm text-red-500">{errorMsg}</Text>
      </View>

      {/* Input */}
      <View style={{rowGap : 5}} className="flex relative flex-col mt-5">
                <Text className="text-gray-500">
                    Old Password    
                </Text>
                <View>
                <TextInput secureTextEntry={visibleInput.oldPassword ? false : true} className={`border border-gray-300 p-2 pr-12 rounded-md text-gray-500`} 
                maxLength={30}
                value={input.oldPassword}
                onChangeText={(text) => setInput({...input, oldPassword : text})}
                />
                <TouchableOpacity onPress={()=>setVisibleInput({...visibleInput, oldPassword : !visibleInput.oldPassword})} className={`absolute top-3 right-3 `}>
                <FontAwesome name={`${visibleInput.oldPassword ? "eye" : "eye-slash"}`} size={20} color="gray" />
                </TouchableOpacity>
                </View>
                             
        </View>
      <View style={{rowGap : 5}} className="flex relative flex-col mt-5">
                <Text className="text-gray-500">
                    Password    
                </Text>
                <View>
                <TextInput secureTextEntry={visibleInput.newPassword ? false : true} className={`border border-gray-300 p-2 pr-12 rounded-md text-gray-500`} 
                maxLength={30}
                value={input.newPassword}
                onChangeText={(text) => setInput({...input, newPassword : text})}
                />
                <TouchableOpacity onPress={()=>setVisibleInput({...visibleInput, newPassword : !visibleInput.newPassword})} className={`absolute top-3 right-3 `}>
                <FontAwesome name={`${visibleInput.newPassword ? "eye" : "eye-slash"}`} size={20} color="gray" />
                </TouchableOpacity>
                <Text className="text-gray-400 text-xs">Must be atleast 8 characters</Text>
                </View>
                             
        </View>
      {/* Input */}
      <View style={{rowGap : 5}} className="flex relative flex-col mt-5">
                <Text className="text-gray-500">
                    Confirm Password    
                </Text>
                <View>
                <TextInput secureTextEntry={visibleInput.confirmPassword ? false : true} className={`border border-gray-300 p-2 pr-12 rounded-md text-gray-500`} 
                maxLength={30}
                value={input.confirmPassword}
                onChangeText={(text) => setInput({...input, confirmPassword : text})}
                />
                <TouchableOpacity onPress={()=>setVisibleInput({...visibleInput, confirmPassword : !visibleInput.confirmPassword})} className={`absolute top-3 right-3 `}>
                <FontAwesome name={`${visibleInput.confirmPassword ? "eye" : "eye-slash"}`} size={20} color="gray" />
                </TouchableOpacity>
                <Text className="text-gray-400 text-xs">Both password must match</Text>
                </View>
                             
        </View>

        <Button
        onPress={()=>verifyInput()}
            disabled={input.oldPassword.length === 0 || input.newPassword.length < 9 || input.confirmPassword.length < 9}
            title={loading ? <ActivityIndicator /> : "Submit"}
            containerStyle={{
            width: "100%",
            marginTop : 10,
            }}
            buttonStyle={{
            backgroundColor : "#EB6B23"
        }}
        />
      
    </View>
  )
}

export default ChangePasswordProfile