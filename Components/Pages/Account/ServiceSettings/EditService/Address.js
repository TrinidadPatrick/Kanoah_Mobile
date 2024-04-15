import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react';
import phil from 'phil-reg-prov-mun-brgy';
import { SelectList } from 'react-native-dropdown-select-list'
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as SecureStore from 'expo-secure-store'
import axios from 'axios';
import http from '../../../../../http';

const Address = ({serviceInfo}) => {
  const [location, setLocation] = useState({
    longitude : serviceInfo?.address === null ? 120.8236601 : serviceInfo?.address?.longitude ,
    latitude : serviceInfo?.address === null ? 14.5964466 : serviceInfo?.address?.latitude
  })
  const [error, setError] = useState({
    region : false,
    province : false,
    municipality : false,
    barangay : false
  })
  const [street, setStreet] = useState(serviceInfo?.address === null ? "" : serviceInfo?.address?.street)
  const [locCodesSelected, setLocCodesSelected] = useState([
    ['', '-1'], //Region
    ['','-1'], //Province
    ['','-1'], //Municipality
    ['','-1'] //Barangay
  ])
  const [loading, setLoading] = useState(false)

  const customMapStyle = [
    {
        featureType: 'landscape.man_made',
        // elementType: 'geometry',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#cccccc', // Grayish color for buildings
          },
          {
            visibility: 'on', // Show the buildings
          },
          {
            strokeColor: '#555555', // Border color for buildings
          },
          {
            strokeWidth: 10, // Border width for buildings
          },
        ],
      },
    {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#a2daf2', // Set the color for water bodies
        },
      ],
    },
    // Add more styling rules as needed
  ];

  const handleMarkerDragEnd = async (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude })
    const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
    // console.log(response.data.display_name)
  };

  const handleLocationSelect = (value, optionChanges) => {
    const newData = [...locCodesSelected]
    switch (optionChanges) {
        case 'region':
          setLocCodesSelected([
            [value[0], value[1]],
            ['', '-1'], // Province
            ['', '-1'], // Municipality
            ['', '-1']  // Barangay
          ]);
          break;
        
        case 'province':

            setLocCodesSelected([
                [newData[0][0], newData[0][1]],
                [value[0], value[1]], // Province
                ['', '-1'], // Municipality
                ['', '-1']  // Barangay
            ]);
            break;
        
        case 'city':

        setLocCodesSelected([
            [newData[0][0], newData[0][1]],
            [newData[1][0], newData[1][1]], // Province
            [value[0], value[1]], // Municipality
            ['', '-1']  // Barangay
        ]);
        break;

        case 'barangay':

        setLocCodesSelected([
            [newData[0][0], newData[0][1]],
            [newData[1][0], newData[1][1]], // Province
            [newData[2][0], newData[2][1]], // Municipality
            [value[0], value[1]]  // Barangay
        ]);
        break;
      }
  }

  // Set the address from db
  useEffect(()=>{
    if(serviceInfo?.address !== undefined)
    {
      setLocCodesSelected(
        [
          [serviceInfo?.address.region.name, serviceInfo?.address.region.reg_code],
          [serviceInfo?.address.province.name, serviceInfo?.address.province.prov_code],
          [serviceInfo?.address.municipality.name, serviceInfo?.address.municipality.mun_code],
          [serviceInfo?.address.barangay.name, serviceInfo?.address.barangay.brgy_code]
        ]
      )
    }
    
  },[])

  const updateService = async () => {
    let hasError = false
    const address = {
      region : {name : locCodesSelected[0][0], reg_code : locCodesSelected[0][1]},
      province :  {name : locCodesSelected[1][0], prov_code : locCodesSelected[1][1]},
      municipality : {name : locCodesSelected[2][0], mun_code : locCodesSelected[2][1]},
      barangay : {name : locCodesSelected[3][0], brgy_code : locCodesSelected[3][1]},
      street : street,
      longitude : location.longitude,
      latitude : location.latitude
    }

    Object.entries(address).map(([key, value]) => {
      if(value.name === "" && (key === " region" || key === "province" || key === "municipality" || key === "barangay"))
      {
        setError((prevError) => ({...prevError, [key] : true}))
        hasError = true
      }
      else
      {
        setError((prevError) => ({...prevError, [key] : false}))
      }
    })
    if(!hasError)
    {
      try {
        setLoading(true)
        const accessToken = await SecureStore.getItemAsync('accessToken')
        const result = await http.patch(`Mobile_updateService/`, {address : address},  {
          headers : {
            'Authorization' : `Bearer ${accessToken}`
          }
        })
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
    }
  }


  return (
    <View className="h-full relative flex flex-col p-3 bg-white">
      {/* Region */}
      <View>
      <Text className="text-gray-700 font-medium">Region<Text className="text-red-500">*</Text></Text>
      <View className=" mt-2 rounded-md border-gray-400">
      <SelectList 
        boxStyles={{borderColor : error.region ? "red" : "#bfbaba"}}
        defaultOption={!serviceInfo.address.region.name ? '' : serviceInfo.address.region.name}
        placeholder={locCodesSelected[0][0]}
        setSelected={(val) => {
          const value = val.split(",")
          handleLocationSelect(value, "region")
        }} 
        data={phil?.regions?.map((region)=>({key : Object.values(region).toString(), value : region.name}))} 
        save="key"
    />
      </View>
      </View>

      <View style={{columnGap : 10}} className="w-full flex flex-row">
      {/* Province */}
      <View className="mt-5 flex-1">
      <Text className="text-gray-700 font-medium">Province<Text className="text-red-500">*</Text></Text>
      <View className=" mt-2 rounded-md border-gray-400">
      <SelectList  
        boxStyles={{borderColor : error.province ? "red" : "#bfbaba"}}
        defaultOption={!serviceInfo.address?.province.name ? '' : serviceInfo.address?.province.name}
        placeholder={locCodesSelected[1][0]}
        setSelected={(val) => {
          const value = val.split(",").filter((element, index) => index !== 1)
          handleLocationSelect(value, "province")
        }} 
        data={phil.getProvincesByRegion(locCodesSelected[0][1]).sort((a, b) => a.name.localeCompare(b.name)).map((province)=>({key : Object.values(province).toString(), value : province.name}))} 
        save="key"
    />
      </View>
      </View>

      {/* municipality */}
      <View className="mt-5 flex-1">
      <Text className="text-gray-700 font-medium">Municipality<Text className="text-red-500">*</Text></Text>
      <View className=" mt-2 rounded-md border-gray-400">
      <SelectList  
      defaultOption={!serviceInfo.address?.municipality?.name ? '' : serviceInfo.address?.municipality?.name}
      placeholder={locCodesSelected[2][0]}
      boxStyles={{borderColor : error.municipality ? "red" : "#bfbaba"}}
        setSelected={(val) => {
          const value = val.split(",").filter((element, index) => index !== 1)
          handleLocationSelect(value, "city")
        }} 
        data={phil.getCityMunByProvince(locCodesSelected[1][1]).sort((a, b) => a.name.localeCompare(b.name)).map((municipality)=>({key : Object.values(municipality).toString() , value : municipality.name}))} 
        save="key"
    />
      </View>
      </View>
      </View>

      {/* Barangay */}
      <View className="mt-5">
      <Text className="text-gray-700 font-medium">Barangay<Text className="text-red-500">*</Text></Text>
      <View className=" mt-2 rounded-md border-gray-400">
      <SelectList  
      defaultOption={!serviceInfo.address?.barangay.name ? '' : serviceInfo.address?.barangay.name}
      placeholder={locCodesSelected[3][0]}
      boxStyles={{borderColor : error.barangay ? "red" : "#bfbaba"}}
        setSelected={(val) => {
          const value = val.split(",")
          handleLocationSelect(value, "barangay")
        }} 
        data={phil.getBarangayByMun(locCodesSelected[2][1]).sort((a, b) => a.name.localeCompare(b.name)).map((municipality)=>({key : Object.values(municipality).toString() , value : municipality.name}))} 
        save="key"
    />
      </View>
      </View>

      {/* Street */}
      <View className="mt-5">
      <Text className="text-gray-700 font-medium mb-2">Street</Text>
        <TextInput value={street} onChangeText={setStreet} placeholder='ex. barangay 123...' style={{textAlignVertical : "top", borderColor : "#bfbaba"}} numberOfLines={2} multiline className="border border-gray-500 rounded-lg p-2" />
      </View>
      
      {/* Map */}
      <View className="flex-1 mt-5 mb-2 rounded-lg overflow-hidden relative">
      <MapView
      style={{ flex: 1, borderRadius : 20 }}
      provider={PROVIDER_GOOGLE}
      mapType="standard"
      customMapStyle={customMapStyle}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      }}
      region={{
        latitude : location.latitude,
        longitude : location.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0121,
      }}
    >

      <Marker coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0021,
        
        }}
        draggable
        tappable
        
        onDragEnd={handleMarkerDragEnd}
      />
      </MapView>
      <View className="absolute top-0 p-1 w-full">
      <GooglePlacesAutocomplete
      placeholder='Search'
      onPress={(data, details = null) => {
        setLocation({
            longitude : details.geometry.location.lng,
            latitude : details.geometry.location.lat
        })
      }}
      fetchDetails
      query={{
        key: 'AIzaSyAGPyvnVRcJ5FDO88LP2LWWyTRnlRqNYYA',
        language: 'en',
      }}
      />
      </View>
      </View>

      <View className="">
        <TouchableOpacity onPress={()=>updateService()} className="p-2 w-full flex flex-row justify-center bg-themeOrange rounded-sm ">
          {
            loading ?
            <ActivityIndicator color='white' />
            :
            <Text  className="text-white">Save</Text>
          }
        </TouchableOpacity>
      </View>

      


    </View>
  )
}

export default Address