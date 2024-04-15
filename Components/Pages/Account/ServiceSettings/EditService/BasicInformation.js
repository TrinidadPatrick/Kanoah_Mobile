import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ActivityIndicator, } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import * as SecureStore from 'expo-secure-store'
import http from '../../../../../http'
import { Icon } from 'react-native-elements'

const BasicInformation = ({route, navigation, serviceInfo}) => {
  const [serviceInformation, setServiceInformation] = useState(null)
  const [basicInformation, setBasicInformation] = useState({ ServiceTitle : "", OwnerContact : "", OwnerEmail : "" , Description : ""})
  const [openModal, setOpenModal] = useState({ ServiceTitle : false, OwnerContact : false, OwnerEmail : false , Description : false})
  const [loading, setLoading] = useState(false)
  
  useEffect(()=>{
    if(basicInformation.ServiceTitle === "")
    {
      setBasicInformation(serviceInfo.basicInformation)
    }
  },[])

  const getServiceInformation = async () => {
    const accessToken = await SecureStore.getItemAsync('accessToken')
    if(accessToken)
    {
        try {
            const result = await http.get('Mobile_getService', {
                headers : {
                    'Authorization' : `Bearer ${accessToken}`,
                    "Content-Type" : 'application/json'
                }
            })

            setServiceInformation(result.data)
        } catch (error) {
            console.log(error)
        }
        return
    }

    navigation.navigate("Home")
  }

  const updateService = async (update_data, option) => {
    const modalOption = option
    setLoading(true)
    const accessToken = await SecureStore.getItemAsync('accessToken')
    try {
      const result = await http.patch(`Mobile_updateService/`, {basicInformation : update_data},  {
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        }
      })
      setBasicInformation(update_data)
      setLoading(false)
      setOpenModal({...openModal, [modalOption] : false})
    } catch (error) {
      console.error(error)
      setUpdating(false)
    }
  }


  return (
    <View className="flex-1 bg-white flex-col relative">
      <ChangeServiceTitle loading={loading} openModal={openModal} setOpenModal={setOpenModal} basicInformation={basicInformation} updateService={updateService} />
      <ChangeOwnerEmail loading={loading} openModal={openModal} setOpenModal={setOpenModal} basicInformation={basicInformation} updateService={updateService} />
      <ChangeOwnerContact loading={loading} openModal={openModal} setOpenModal={setOpenModal} basicInformation={basicInformation} updateService={updateService} />
      <ChangeDescription loading={loading} openModal={openModal} setOpenModal={setOpenModal} basicInformation={basicInformation} updateService={updateService} />
      {/* Service Title */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, ServiceTitle : true})} className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2 ">
        <Text className="text-sm text-gray-500">Service Title</Text>
        <View className="">
          <Text className="text-base text-gray-700">{basicInformation.ServiceTitle}</Text>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
      {/* Owner Email */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, OwnerEmail : true})} className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2">
        <Text className="text-sm text-gray-500">Owner Email</Text>
        <View className="">
          <Text className="text-base text-gray-700">{basicInformation.OwnerEmail}</Text>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
      {/* Owner Contact */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, OwnerContact : true})} className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2">
        <Text className="text-sm text-gray-500">Owner Contact</Text>
        <View className="">
          <Text className="text-base text-gray-700">+63{basicInformation.OwnerContact}</Text>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
      {/* Description */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, Description : true})} className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2">
        <Text className="text-sm text-gray-500">Description</Text>
        <View className="">
          <Text numberOfLines={3} className="text-base text-gray-700">{basicInformation.Description}</Text>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
    </View>
  )
}

const ChangeServiceTitle = ({basicInformation, openModal, setOpenModal, updateService, loading}) => {
  const [serviceTitle, setServiceTitle] = useState('')

  useEffect(()=>{
    setServiceTitle(basicInformation.ServiceTitle)
  },[openModal])

  const submit = () => {
    const update_data = {...basicInformation, ServiceTitle : serviceTitle}
    updateService(update_data, 'ServiceTitle')
  }
  return (
    <>
    {
      openModal.ServiceTitle &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, ServiceTitle : false})}>
      <View 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <TouchableWithoutFeedback>
      <View className="w-full h-[200px] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change service title</Text>

        <TextInput className="border-b-[1px]" onChangeText={(value) =>{setServiceTitle(value)}} value={serviceTitle} />

        <TouchableOpacity disabled={serviceTitle.length === 0} onPress={()=>{submit()}} className={`w-full py-2 ${serviceTitle.length === 0 ? "bg-orange-300" : "bg-themeOrange"} rounded-full`}>
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Submit</Text>
          }
          
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    </View>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

const ChangeOwnerEmail = ({basicInformation, openModal, setOpenModal, updateService, loading}) => {
  const [ownerEmail, setOwnerEmail] = useState('')

  useEffect(()=>{
    setOwnerEmail(basicInformation.OwnerEmail)
  },[openModal])

  const submit = () => {
    const update_data = {...basicInformation, OwnerEmail : ownerEmail}
    updateService(update_data, 'OwnerEmail')
  }
  return (
    <>
    {
      openModal.OwnerEmail &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, OwnerEmail : false})}>
      <View 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <TouchableWithoutFeedback>
      <View className="w-full h-[200px] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change owner email</Text>

        <TextInput className="border-b-[1px]" onChangeText={(value) =>{setOwnerEmail(value)}} value={ownerEmail} />

        <TouchableOpacity disabled={ownerEmail.length === 0} onPress={()=>{submit()}} className={`w-full py-2 ${ownerEmail.length === 0 ? "bg-orange-300" : "bg-themeOrange"} rounded-full`}>
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Submit</Text>
          }
          
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    </View>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

const ChangeOwnerContact = ({basicInformation, openModal, setOpenModal, updateService, loading}) => {
  const [ownerContact, setOwnerContact] = useState('')

  useEffect(()=>{
    setOwnerContact(basicInformation.OwnerContact)
  },[openModal])

  const submit = () => {
    const update_data = {...basicInformation, OwnerContact : ownerContact}
    updateService(update_data, 'OwnerContact')
  }
  return (
    <>
    {
      openModal.OwnerContact &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, OwnerContact : false})}>
      <View 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <TouchableWithoutFeedback>
      <View className="w-full h-[200px] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change owner contact</Text>

        <TextInput inputMode='numeric' maxLength={10} className="border-b-[1px]" onChangeText={(value) =>{setOwnerContact(value)}} value={ownerContact} />

        <TouchableOpacity disabled={ownerContact.length < 10} onPress={()=>{submit()}} className={`w-full py-2 ${ownerContact.length < 10 ? "bg-orange-300" : "bg-themeOrange"} rounded-full`}>
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Submit</Text>
          }
          
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    </View>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

const ChangeDescription = ({basicInformation, openModal, setOpenModal, updateService, loading}) => {
  const [description, setDescription] = useState('')
  const descriptionRef = useRef(null);
  
  const handleFocus = () => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollTo({ y: 0 });
    }
  };

  useEffect(()=>{
    setDescription(basicInformation.Description)
  },[openModal])

  const submit = () => {
    const update_data = {...basicInformation, Description : description}
    updateService(update_data, 'Description')
  }
  return (
    <>
    {
      openModal.Description &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, Description : false})}>
      <View 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
        <TouchableWithoutFeedback>
      <View className="w-full h-[200x] flex-col justify-between space-y-3 bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change description</Text>

        <TextInput autoFocus  verticalAlign='top' multiline numberOfLines={10} className="border-[1px] text-base max-h-[300px] p-1 rounded-md border-gray-200" onChangeText={(value) =>{setDescription(value)}} value={description} />

        <TouchableOpacity onPress={()=>{submit()}} className="w-full py-2 bg-themeOrange rounded-full">
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Submit</Text>
          }
          
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    </View>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

export default BasicInformation