import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { useState } from 'react';
import phil from 'phil-reg-prov-mun-brgy';
import { SelectList } from 'react-native-dropdown-select-list'
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import axios from 'axios';
import http from '../../../../../http';


const AddressSetup = ({route, navigation}) => {
  const {profile, onUpdate, accessToken} = route.params
  const [location, setLocation] = useState({
    longitude : profile.Address === null ? 120.8236601 : profile.Address?.longitude ,
    latitude : profile.Address === null ? 14.5964466 : profile.Address?.latitude
  })
  const [street, setStreet] = useState(profile.Address === null ? "" : profile.Address.street)
  const [locCodesSelected, setLocCodesSelected] = useState([
    ['', '-1'], //Region
    ['','-1'], //Province
    ['','-1'], //Municipality
    ['','-1'] //Barangay
  ])
  const [placeInput, setPlaceInput] = useState('')
  const [suggestedPlaces, setSuggestedPlaces] = useState([])

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

  useEffect(()=>{
    if(profile.Address !== null)
    {
      setLocCodesSelected(
        [
          [profile.Address?.region.name, profile.Address?.region.reg_code],
          [profile.Address?.province.name, profile.Address?.province.prov_code],
          [profile.Address?.municipality.name, profile.Address?.municipality.mun_code],
          [profile.Address?.barangay.name, profile.Address?.barangay.brgy_code]
        ]
          )
    }
  },[])

  const submitAddress = async () => {
    const address = {
      region : {name : locCodesSelected[0][0], reg_code : locCodesSelected[0][1]},
      province :  {name : locCodesSelected[1][0], prov_code : locCodesSelected[1][1]},
      municipality : {name : locCodesSelected[2][0], mun_code : locCodesSelected[2][1]},
      barangay : {name : locCodesSelected[3][0], brgy_code : locCodesSelected[3][1]},
      street : street,
      longitude : location.longitude,
      latitude : location.latitude
    }
    
    const newProfile = {...profile, Address : address}
    onUpdate(newProfile)
    try {
      const result = await http.patch('Mobile_updateProfile', newProfile, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
        navigation.goBack()
  } catch (error) {
      console.log(error)
  }
    
  }

  const getCoordinatesFromFullScreenMap = (location) => {
    setLocation(location)
  }

  const handleAutoCompletePlace = async (value) => {
    console.log(value)
    setPlaceInput(value)
    if (value.length > 2) {
      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`, {
          params: {
              access_token: 'pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg',
              autocomplete: true,
          }
      });

      setSuggestedPlaces(response.data.features)
  }
  else
  {
    setSuggestedPlaces([])
  }
  }

  const handlePlaceSelect = async (place) => {
    setLocation({latitude : place.center[1], longitude : place.center[0]})
    setPlaceInput(place.place_name)
    setSuggestedPlaces([])
      
}
  
  return (
    <View className="h-full relative flex flex-col p-3 bg-white">
      {/* Region */}
      <View>
      <Text className="text-gray-700 font-medium">Region</Text>
      <View className=" mt-2 rounded-md border-gray-400">
      <SelectList 
        boxStyles={{borderColor : "#bfbaba"}}
        defaultOption={!profile?.Address?.region.name ? '' : profile?.Address?.region.name}
        placeholder={!profile?.Address?.region.name ? '' : profile?.Address?.region.name}
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
      <Text className="text-gray-700 font-medium">Province</Text>
      <View className=" mt-2 rounded-md border-gray-400">
      <SelectList  
      boxStyles={{borderColor : "#bfbaba"}}
        defaultOption={!profile?.Address?.province.name ? '' : profile?.Address?.province.name}
        placeholder={!profile?.Address?.province.name ? '' : profile?.Address?.province.name}
        setSelected={(val) => {
          const value = val.split(",").filter((element, index) => index !== 1)
          handleLocationSelect(value, "province")
        }} 
        data={phil.getProvincesByRegion(locCodesSelected[0][1]).sort((a, b) => a.name.localeCompare(b.name)).map((province)=>({key : Object.values(province).toString() , value : province.name}))} 
        save="key"
    />
      </View>
      </View>

      {/* municipality */}
      <View className="mt-5 flex-1">
      <Text className="text-gray-700 font-medium">Municipality</Text>
      <View className=" mt-2 rounded-md border-gray-400">
      <SelectList  
      defaultOption={!profile?.Address?.municipality?.name ? '' : profile?.Address?.municipality?.name}
      placeholder={!profile?.Address?.municipality?.name ? '' : profile?.Address?.municipality?.name}
      boxStyles={{borderColor : "#bfbaba"}}
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
      <Text className="text-gray-700 font-medium">Barangay</Text>
      <View className=" mt-2 rounded-md border-gray-400">
      <SelectList  
      defaultOption={!profile?.Address?.barangay.name ? '' : profile?.Address?.barangay.name}
      placeholder={!profile?.Address?.barangay.name ? '' : profile?.Address?.barangay.name}
      boxStyles={{borderColor : "#bfbaba"}}
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
      {/* Auto Complete */}
      <View className="h-[50px] bg-white overflow-visible z-30  relative">
                <View className="h-[50px] bg-transparent border border-gray-200 rounded absolute flex items-center w-full   z-30">
                <FontAwesome name="location-arrow" size={22} color="green" className="absolute z-10 top-3 left-3" />
                {/* Search bar location */}
                <TextInput value={placeInput} className=" w-full top-2 pl-10" placeholder="Input location" onChangeText={(value)=>handleAutoCompletePlace(value)} />

                </View>
                {
                  suggestedPlaces?.length !== 0 &&
                  <ScrollView className="w-full h-[250px] origin-top bg-white shadow p-3 absolute top-14">
                 {
                  suggestedPlaces.map((place, index)=>(
                    <TouchableOpacity key={index} onPress={()=>handlePlaceSelect(place)} className="p-2">
                      <Text>{place.place_name}</Text>
                    </TouchableOpacity>
                  ))
                 }
                </ScrollView>
                }
                </View>
      </View>
      <TouchableOpacity onPress={()=>navigation.navigate('MapFullScreen', {profile, submit : getCoordinatesFromFullScreenMap})} className="absolute bottom-2 right-2">
      <FontAwesome className={``} name="expand" size={22} color="gray" />
      </TouchableOpacity>
      </View>

      <View className="">
        <TouchableOpacity onPress={()=>submitAddress()} className="p-2 w-full flex flex-row justify-center bg-themeOrange rounded-sm ">
          <Text  className="text-white">Save</Text>
        </TouchableOpacity>
      </View>

      


    </View>
  )
}

export default AddressSetup