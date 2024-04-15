import { View, Text, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator, ScrollView, Alert, Switch, FlatList } from 'react-native'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import * as SecureStore from 'expo-secure-store'
import http from '../../../../../http'
import { Icon } from 'react-native-elements'
import AddServiceOffer from './AddServiceOffer'
import EditServiceOffer from './EditServiceOffer'

const BookingSettings = ({serviceInfo}) => {
  const limits = Array.from({ length: 1000 }, (_, index) => index + 1);
  const [serviceOfferList, setServiceOfferList] = useState([])
  const [fixedServiceOfferList, setFixedServiceOfferList] = useState([])
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [showEditServiceModal, setShowEditServiceModal] = useState(false)
  const [serviceOfferInfo, setServiceOfferInfo] = useState({
    uniqueId : '', 
    name : '',
    origPrice : '',
    duration : '',
    variants : []
  })
  const [acceptBooking, setAcceptBooking] = useState(null)
  const [bookingLimit, setBookingLimit] = useState(1)

  useEffect(()=>{
    setAcceptBooking(serviceInfo.acceptBooking)
    setBookingLimit(serviceInfo.booking_limit)
  },[])

  useEffect(()=>{
    setServiceOfferList(serviceInfo.serviceOffers)
    setFixedServiceOfferList(serviceInfo.serviceOffers)
  },[])

  const confirmDelete = (itemToDelete) => {
    Alert.alert('Confirm delete', 'Are you sure you want to delete this item?', [
      {
        text : 'Cancel',
      },
      {
        text : 'Delete',
        onPress : () => 
        {
          const newData = [...serviceOfferList]
          const index = newData.findIndex((service)=> service.uniqueId === itemToDelete)
          newData.splice(index, 1)
          setServiceOfferList(newData)
          ToastAndroid.show('Item deleted', ToastAndroid.SHORT);
        }
      },
      ],
      )
  }

  const handleEdit = (service) => {
    setServiceOfferInfo(service)
    setShowEditServiceModal(true)
  }

  const handleSearch = (value) => {
    const instance = [...serviceOfferList]
    const filtered = fixedServiceOfferList.filter((service) => service.name.toLowerCase().includes(value.toLowerCase()))
    setServiceOfferList(filtered)
  }

  const handleToggleBooking = async () => {
      setAcceptBooking(!acceptBooking)
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken')
        const result = await http.patch(`Mobile_updateService/`, {acceptBooking : !acceptBooking},  {
          headers : {
            'Authorization' : `Bearer ${accessToken}`
          }
        })
      } catch (error) {
        console.error(error)
      }
  }

  const handleLimit = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken')
      const result = await http.patch(`Mobile_updateService/`, {booking_limit : Number(bookingLimit)},  {
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        }
      })
      ToastAndroid.show('Limit set successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <View className="flex-1 bg-white flex-col">
      <AddServiceOffer serviceOfferList={serviceOfferList} setServiceOfferList={setServiceOfferList} serviceOfferInfo={serviceOfferInfo} setServiceOfferInfo={setServiceOfferInfo} showAddServiceModal={showAddServiceModal} setShowAddServiceModal={setShowAddServiceModal}  />
      <EditServiceOffer serviceOfferList={serviceOfferList} setServiceOfferList={setServiceOfferList} serviceOfferInfo={serviceOfferInfo} setServiceOfferInfo={setServiceOfferInfo} showEditServiceModal={showEditServiceModal} setShowEditServiceModal={setShowEditServiceModal}  />
      {/* Top Navigation */}
      <View className="w-full px-2 flex-row items-center justify-between">
        {/* Accept booking */}
        <View className="flex-row items-center">
          <Text className="text-gray-700 font-medium">Accept booking</Text>
          <Switch onValueChange={()=>handleToggleBooking()} value={acceptBooking} thumbColor={acceptBooking ? '#4185f2' : '#f4f3f4'} trackColor={{false: '#f4f3f4', true: '#4185f2'}} />
        </View>
        {/* Booking limit */}
        <View className="flex-row items-center space-x-1 relative">
        <Text className="text-gray-700 font-medium">Booking limit</Text>
          <TextInput inputMode='numeric' onSubmitEditing={()=>handleLimit()} onChangeText={(value)=>setBookingLimit(value)} value={String(bookingLimit)} className="px-2 py-0 border border-gray-200" />
        </View>
      </View>
      {/* Navigation */}
      <View className="w-full flex-row px-2 pt-0 space-x-2">
        <TouchableOpacity onPress={()=>setShowAddServiceModal(true)} style={{borderRadius : 4}} className="px-3 py-2 bg-themeOrange">
          <Text className="text-white">Add service</Text>
        </TouchableOpacity>
        <TextInput onChangeText={(value)=>handleSearch(value)} placeholderTextColor="#e1e1e1" className="h-full flex-1 border border-gray-300 px-2" style={{borderRadius : 4}} placeholder="Search..." />
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{flexDirection : 'column'}} className="flex-1 mt-5 rounded-lg">
      {
        serviceOfferList?.map((service)=>{
          return (
            <View key={service.uniqueId} className="flex-row py-2 px-3 border-b-[1px] border-gray-200 rounded-md">
                <TouchableOpacity onPress={()=>{handleEdit(service)}} className="w-[80%] flex-col space-y-0.5">
                  <Text className="text-base font-semibold">{service.name}</Text>
                  <Text className="font-medium text-gray-600">{service.variants.length !== 0 ? "₱" + service?.variants[0]?.price + " - " + "₱" + service?.variants[service.variants?.length - 1]?.price : "₱" + service.origPrice}</Text>
                  <Text className={` px-2 py-1 text-xs ${service.status === "ACTIVE" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"} w-[80] text-center rounded-sm`}>{service.status}</Text>
                </TouchableOpacity>
                <View className="flex-1 flex-col justify-center items-center">
                  <TouchableOpacity onPress={()=>confirmDelete(service.uniqueId)}>
                    <Icon type='material-community' name='delete' color='red' />
                  </TouchableOpacity>
                </View>
            </View>
          )
        })
      }
      </ScrollView>
    </View>
  )
}

export default BookingSettings