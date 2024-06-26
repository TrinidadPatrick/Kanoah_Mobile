import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import {FontAwesome} from 'react-native-vector-icons'
import * as Location from 'expo-location';
import axios from 'axios';
import { Input, Overlay } from 'react-native-elements';
import useStore from '../../../store'
import http from '../../../http';
import Map from './Map';
import { useFocusEffect } from '@react-navigation/native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useCallback } from 'react';

const LocationInput = ({filterServices, selectedSortingOption, setServiceList, navigation}) => {
    const { selectedFilterState, storeFilter } = useStore();
    const [location, setLocation] = useState({
      longitude: 120.9782618,
      latitude: 14.5948914,
    });
    const [address, setAddress] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [visible, setVisible] = useState(false);
    const [placeInput, setPlaceInput] = useState('')
    const [suggestedPlaces, setSuggestedPlaces] = useState([])


    const turnOnLocation = async (providerStatus) => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if(status === 'granted')
      {
        if(!providerStatus.locationServicesEnabled)
        {
          try {
            await Location.enableNetworkProviderAsync()
            let location = await Location.getCurrentPositionAsync({});
            console.log(location)
            setLocation({
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            });
                    
            const newFilter = {
                            ...selectedFilterState,
                            coordinates: {
                              latitude: location.coords.latitude,
                              longitude: location.coords.longitude,
                            },
                            radius: 3,
            };
                          
            storeFilter(newFilter);
            try {
              const response = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}&access_token=pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg`)
            setAddress(response.data.features[0].properties.full_address)
            setSelectedAddress(response.data.features[0].properties.full_address)
            } catch (error) {
              console.log(error)
            }                    
            filterServices(newFilter);
          } catch (error) {
            // Meaning the user rejected the popup
            const newFilter = {
            ...selectedFilterState,
            coordinates: {
              latitude: 0,
              longitude: 0,
              },
              radius: 3,
            };
            storeFilter(newFilter);
            filterServices(newFilter);
            setAddress("Select Address");
            setSelectedAddress("Not Selected");
          }
          }
          // Meaning the gps is already on
          else
        {
          let location = await Location.getCurrentPositionAsync({});
            setLocation({
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            });
                    
            const newFilter = {
                            ...selectedFilterState,
                            coordinates: {
                              latitude: location.coords.latitude,
                              longitude: location.coords.longitude,
                            },
                            radius: 3,
            };
                          
            storeFilter(newFilter);
            // const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=AIzaSyAGPyvnVRcJ5FDO88LP2LWWyTRnlRqNYYA`)
            try {
              const response = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}&access_token=pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg`)
            setAddress(response.data.features[0].properties.full_address)
            setSelectedAddress(response.data.features[0].properties.full_address)
            } catch (error) {
              console.log(error)
            }
            filterServices(newFilter);
          }
        } 
        else {
          // Permission denied or not granted, handle accordingly
          const newFilter = {
            ...selectedFilterState,
            coordinates: {
              latitude: 0,
              longitude: 0,
              },
              radius: 3,
            };
            storeFilter(newFilter);
            filterServices(newFilter);
            setAddress("Select Address");
            setSelectedAddress("Not Selected");
      }
      
      
      
    }

    const checkGpsStatus = async () => {
      try {
        const providerStatus = await Location.getProviderStatusAsync();
        turnOnLocation(providerStatus)
      } catch (error) {
        console.error('Error requesting location permission:', error);
      }
    };

    useFocusEffect(
      useCallback(() => {
        checkGpsStatus();
      }, [])
    );

    
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = address;
    }


    const handleLocationSelect = async (place) => {
        setLocation({latitude : place.center[1], longitude : place.center[0]})
        setPlaceInput(place.place_name)
        setSelectedAddress(place.place_name)
        setAddress(place.place_name)
        setSuggestedPlaces([])
          
    }

    const handleSort = (option, value) => {
      switch (option) {
        case "Latest":
          const latestServices = value?.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
          setServiceList(latestServices)
          break;
        
          case "Oldest":
            const OldestServices = value?.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
            setServiceList(OldestServices)
            break;
          
          case "Most Rated":
            const MostRatedServices = value?.sort((a, b) => Number(b.ratings) - Number(a.ratings))
            setServiceList(MostRatedServices)
            break;
          
            case "Low Rated":
              const LowRatedServices = value?.sort((a, b) => Number(a.ratings) - Number(b.ratings))
              setServiceList(LowRatedServices)
              break;
      
        default:
          break;
      }
    }
    
    const confirmLocation = async (radius) => {
      const newFilter = {...selectedFilterState, coordinates : location, radius : radius}
      storeFilter(newFilter)
      try {
        const result = await http.get(`Mobile_GetServicesByFilter?category=${newFilter.category.category_id}&subCategory=${newFilter.subCategory.subCategory_id}&ratings=${newFilter.ratings}&search=${newFilter.searchValue}&latitude=${newFilter.coordinates.latitude}&longitude=${newFilter.coordinates.longitude}&radius=${radius}`)
        
        const services = handleSort(selectedSortingOption, result.data.services)
        setPlaceInput('')
      } catch (error) {
        console.log(error)
      }
    }

    const handleAutoCompletePlace = async (value) => {
      setPlaceInput(value)
      if (value.length > 2) {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`, {
            params: {
                access_token: 'pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg',
                autocomplete: true,
                limit: 5
            }
        });

        setSuggestedPlaces(response.data.features)
    }
    else
    {
      setSuggestedPlaces([])
    }
  }


  return (
    <View className="px-3 py-3 ">
        <View style={{columnGap : 10}} className="w-full flex flex-row items-center justify-start mt-2 ">
        <View >
        <FontAwesome name="location-arrow" size={22} color="green" className="" />
        </View>
        <Text numberOfLines={1} className="font-semibold text-gray-700" onPress={()=>setVisible(true)} >{address === null ? "Select Address" : address}</Text>
        </View>

        {/* Modal */}
        <Overlay overlayStyle={{height : "100%", position : 'absolute', top : 0, borderBottomRightRadius : 30, borderBottomLeftRadius : 30 }} isVisible={visible} 
        onBackdropPress={()=>setVisible(!visible)}
        >
            <View className="w-[100vw] h-full  flex flex-col justify-between p-2">
                <View className=" flex flex-col">
                <View className="h-[50px] bg-transparent overflow-visible p-1 z-30  relative">
                <View className="h-[50px] bg-transparent border border-gray-200 rounded absolute flex items-center w-full   z-30">
                <FontAwesome name="location-arrow" size={22} color="green" className="absolute z-10 top-3 left-3" />
                {/* Search bar location */}
                <TextInput value={placeInput} className=" w-full top-2 pl-10" placeholder="Input location" onChangeText={(value)=>handleAutoCompletePlace(value)} />

                </View>
                {
                  suggestedPlaces?.length !== 0 &&
                  <ScrollView className="w-full h-[300px] origin-top bg-white shadow p-3 absolute top-14">
                 {
                  suggestedPlaces.map((place, index)=>(
                    <TouchableOpacity key={index} onPress={()=>handleLocationSelect(place)} className="p-2">
                      <Text>{place.place_name}</Text>
                    </TouchableOpacity>
                  ))
                 }
                </ScrollView>
                }
                </View>

                {/* Current Location */}
                <View className="mt-5 bg-gray-100 rounded-md border-gray-300 p-1.5">
                    <Text className="text-base">Current location</Text>
                    <View>
                        <Text className="font-medium text-gray-600">{selectedAddress}</Text>
                    </View>
                </View>
                </View>

                <View className="w-full h-[80%] ">
                    <Map confirmLocation={confirmLocation} setVisible={setVisible} selectedAddress={selectedAddress} setAddress={setAddress} setSelectedAddress={setSelectedAddress} setLocation={setLocation} location={location} />
                </View>

                {/* Choose from map option */}
                
            </View>
        </Overlay>
      
    </View>
  )
}

export default LocationInput