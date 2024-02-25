import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { useState } from 'react'
import {FontAwesome} from '@expo/vector-icons'
import { Button } from 'react-native-elements'
import http from '../../../http'
import axios from 'axios'


const ForgotPassword = (props) => {
    const navigation = props.navigation
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    

    const sendOtp = async () => {
        setLoading(true)
        try {
            const result = await axios.post("https://kanoah.onrender.com/api/forgotPassword", {email})
            if(result.data.message === "Found")
            {
                navigation.navigate('InputOtp', {
                    email
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <View className="w-full h-full flex justify-start items-center pt-10 bg-white">
      <View className="w-[80%]">
        <Text className="text-center text-2xl font-semibold text-themeBlue">Email Address Here</Text>
        <Text className="text-center text-base font-normal text-gray-500">Enter the email address associated with your account.</Text>

        <View className="w-full border flex flex-row items-center rounded-md px-2 mt-5">
        <FontAwesome name='envelope-o' size={25} color="gray"/>
            <TextInput className="p-1.5 text-lg" value={email} onChangeText={setEmail} placeholder="Email" />
        </View>
        <Button loading={loading} onPress={()=>sendOtp()} disabled={email.length === 0} title="Next" buttonStyle={{backgroundColor : '#0E2F41', marginTop : 10}}  />
        
      </View>
    </View>
  )
}




export default ForgotPassword