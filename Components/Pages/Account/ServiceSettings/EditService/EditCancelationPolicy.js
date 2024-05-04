import { View, Text, Modal, StatusBar, Touchable, TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Icon } from 'react-native-elements'
import { ScrollView } from 'react-native'
import http from '../../../../../http'
import * as SecureStore from 'expo-secure-store'

const EditCancelationPolicy = ({showEditCancelationPolicy, setShowEditCancelationPolicy, serviceInfo}) => {
    const [loading, setLoading] = useState(false)
    const [cancelTimeLimit, setCancelTimeLimit] = useState({day : 1, hour : 0, minutes : 0})
    const [cancelPolicy, setCancelPolicy] = useState('')

    const handleChangeCancelTime = (option, value) => {     
        option === 'day' && value >= 0 && setCancelTimeLimit((prevCancelTimeLimit) => ({...prevCancelTimeLimit, [option] : Number(value)}))
        option === 'hour' && value >= 0 && value <= 24 && setCancelTimeLimit((prevCancelTimeLimit) => ({...prevCancelTimeLimit, [option] : Number(value)}))
        option === 'minutes' && value >= 0 && value <= 60 && setCancelTimeLimit((prevCancelTimeLimit) => ({...prevCancelTimeLimit, [option] : Number(value)}))
    }

    useEffect(()=>{
            setCancelTimeLimit({day : serviceInfo.cancelationPolicy.cancelTimeLimit.day, hour : serviceInfo.cancelationPolicy.cancelTimeLimit.hour, minutes : serviceInfo.cancelationPolicy.cancelTimeLimit.minutes})
            setCancelPolicy(serviceInfo.cancelationPolicy.cancelPolicy)
        
    }, [serviceInfo])

    const submitCancelPolicy = async () => {
        const cancelationPolicy = {
            cancelTimeLimit,
            cancelPolicy
        }
         try {
            setLoading(true)
            const accessToken = await SecureStore.getItemAsync('accessToken')
            const result = await http.patch(`Mobile_updateService/`, {cancelationPolicy},  {
              headers : {
                'Authorization' : `Bearer ${accessToken}`
              }
            })
            setLoading(false)
            ToastAndroid.showWithGravityAndOffset(
                'Update successfull',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
            setShowEditCancelationPolicy(false)
          } catch (error) {
            console.error(error)
          }
    }
    
  return (
    <Modal statusBarTranslucent animationType='slide' visible={showEditCancelationPolicy}>
    <View style={{paddingTop : StatusBar.currentHeight}} className="flex-1 bg-white flex-col">
        {/* Navigation */}
        <View  className="w-full border-b-[1px] border-gray-200 flex-row items-center px-1 py-2 space-x-10">
            <TouchableOpacity onPress={()=>setShowEditCancelationPolicy(false)}>
                <Icon type='material-community' name='arrow-left' />
            </TouchableOpacity>
            <Text className="text-xl font-medium text-gray-700">Cancelation Policy</Text>
        </View>
        <View className="p-2">
            <Text className="text-xl text-gray-700 font-semibold">Edit cancelation policy</Text>
            <Text className="text-sm text-gray-500 font-normal">This can help notify clients when they can cancel their bookings upon booking.</Text>
        </View>

        <View className=" flex-col p-2">
        <Text className='text-gray-600 text-sm'>Timeframe for client cancellations after booking</Text>
          <View className='flex-col gap-2'>
            {/* Day */}
            <View className="py-1 px-2 h-14 bg-white border border-blue-300 rounded-lg">
              <View className="w-full flex-row justify-between items-center gap-x-2">
            <View className="grow">
              <Text className="block text-xs text-gray-500 dark:text-neutral-400">
                Day
              </Text>
              <TextInput 
              inputMode='numeric'
              keyboardType='numeric'
              onChangeText={(value)=>{handleChangeCancelTime('day', value.replace(/[^0-9]/g, ''))}} 
              className="w-20 p-0 bg-transparent border-0 text-gray-800 " type="text" 
              value={String(cancelTimeLimit.day)} 
              />
            </View>
            <View className="flex-row justify-end items-center gap-x-1.5">
              <TouchableOpacity onPress={()=>{handleChangeCancelTime('day', cancelTimeLimit.day - 1)}} className=" flex-row justify-center items-center  text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" >
                <Icon type='material-community' name='minus'  />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{handleChangeCancelTime('day', cancelTimeLimit.day + 1)}} className=" inline-flex justify-center items-center  text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" >
                <Icon type='material-community' name='plus' />
              </TouchableOpacity>
            </View>
              </View>
            </View>
            {/* Hour */}
            <View className="py-1 px-2 h-14 bg-white border border-blue-300 rounded-lg">
              <View className="w-full flex-row justify-between items-center gap-x-2">
            <View className="grow">
              <Text className="block text-xs text-gray-500 dark:text-neutral-400">
                Hour
              </Text>
              <TextInput 
              inputMode='numeric'
              keyboardType='numeric'
              onChangeText={(value)=>{handleChangeCancelTime('hour', value.replace(/[^0-9]/g, ''))}} 
              className="w-20 p-0 bg-transparent border-0 text-gray-800 "
              value={String(cancelTimeLimit.hour)} 
              />
            </View>
            <View className="flex-row justify-end items-center gap-x-1.5">
              <TouchableOpacity onPress={()=>{handleChangeCancelTime('hour', cancelTimeLimit.hour - 1)}} className=" flex-row justify-center items-center  text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" >
                <Icon type='material-community' name='minus'  />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{handleChangeCancelTime('hour', cancelTimeLimit.hour + 1)}} className=" inline-flex justify-center items-center  text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" >
                <Icon type='material-community' name='plus' />
              </TouchableOpacity>
            </View>
              </View>
            </View>
            {/* Minutes */}
            <View className="py-1 px-2 h-14 bg-white border border-blue-300 rounded-lg">
              <View className="w-full flex-row justify-between items-center gap-x-2">
            <View className="grow">
              <Text className="block text-xs text-gray-500 dark:text-neutral-400">
                Minutes
              </Text>
              <TextInput 
              inputMode='numeric'
              keyboardType='numeric'
              onChangeText={(value)=>{handleChangeCancelTime('minutes', value.replace(/[^0-9]/g, ''))}} 
              className="w-20 p-0 bg-transparent border-0 text-gray-800 " type="text" 
              value={String(cancelTimeLimit.minutes)} 
              />
            </View>
            <View className="flex-row justify-end items-center gap-x-1.5">
              <TouchableOpacity onPress={()=>{handleChangeCancelTime('minutes', cancelTimeLimit.minutes - 1)}} className=" flex-row justify-center items-center  text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" >
                <Icon type='material-community' name='minus'  />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{handleChangeCancelTime('minutes', cancelTimeLimit.minutes + 1)}} className=" inline-flex justify-center items-center  text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" >
                <Icon type='material-community' name='plus' />
              </TouchableOpacity>
            </View>
              </View>
            </View>
          </View>
        </View>
        {/* Cancelation policy */}
        <View className='flex-1 p-2 flex-col  mt-2'>
            <Text className='text-gray-600 text-sm'>Cancelation policy (optional)</Text>
            <TextInput textAlignVertical='top' multiline value={cancelPolicy} onChangeText={(value)=>{setCancelPolicy(value)}} className='border border-blue-300 rounded-md resize-none h-[100] w-full p-1.5 text-gray-700 text-sm' />
        </View>

        <TouchableOpacity className="bg-themeOrange m-5 py-3 rounded-md">
            {
                loading ?
                <ActivityIndicator color='white' />
                :
                <Text onPress={()=>submitCancelPolicy()} className="text-center text-white">Submit</Text>
            }
        </TouchableOpacity>
    </View>
</Modal>
  )
}

export default EditCancelationPolicy