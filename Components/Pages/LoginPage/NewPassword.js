import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import {FontAwesome} from '@expo/vector-icons'
import { Button } from 'react-native-elements'
import http from '../../../http'

const NewPassword = ({ route, navigation }) => {
    const { email } = route.params;
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [invalidInput, setInvalidInput] = useState(false)
    const [passDontMatch, setPasDontMatch] = useState(false)

    const submitPassword = async () => {
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    
        const hasUppercase = uppercaseRegex.test(password);
        const hasLowercase = lowercaseRegex.test(password);
        const hasNumber = numberRegex.test(password);
        const hasSpecialChar = specialCharRegex.test(password);

        if(password.length < 8 || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar)
        {
            setPasDontMatch(false)
            setInvalidInput(true)
            return
        }
        if(password != confirmPassword)
        {
          setPasDontMatch(false)
          setPasDontMatch(true)
        }
        if(password == confirmPassword && password.length >= 8 && hasUppercase && hasLowercase && hasNumber && hasSpecialChar)
        {
          setPasDontMatch(false)
          setInvalidInput(false)
          try {
            const result = await http.post("forgotPassword/newPassword", {email, password})
            if(result.data.status === "updated")
            {
              navigation.navigate('Login')
            }
        } catch (error) {
            console.log(error)
        }
        }
    }
  return (
    <View className="w-full h-full bg-white py-10">
      <View className="w-[90%] mx-auto flex justify-center items-center">
        <Text className="text-xl font-medium">Set New Password</Text>
        <Text className="text-sm font-normal text-center">Please keep in mind to enter a strong and secured password</Text>

        <View className={`px-3 ${passDontMatch ? "flex" : "hidden"} bg-red-100 py-1.5 items-center justify-center mt-5`}>
            <Text className="text-red-500">Password do not match</Text>
        </View>
        <View className={`px-3 ${invalidInput ? "flex" : "hidden"} bg-red-100 py-1.5 items-center justify-center mt-5`}>
            <Text className="text-red-500">Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character</Text>
        </View>

        <View style={{columnGap : 10}} className="w-full border-b-[1px] mt-5 flex flex-row items-center relative">
        <FontAwesome name='lock' size={25} color="gray"/>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder='Password' className="p-1.5 text-lg" />
        </View>
        
        <View style={{columnGap : 10}} className="w-full border-b-[1px] mt-5 flex flex-row items-center">
        <FontAwesome name='lock' size={25} color="gray"/>
        <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder='Confirm Password' className="p-1.5 text-lg" />
        </View>

        <View className="w-full mt-4">
        <Button onPress={()=>submitPassword()} title={`Submit`} buttonStyle={{backgroundColor : "#EB6B23", width : "100"}} />
        </View>
        
      </View>

      
    </View>
  )
}

export default NewPassword