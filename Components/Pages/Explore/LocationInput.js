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
    const [locationSearchValue, setLocationSearchValue] = useState('')
    const [places, setPlaces] = useState(null)


    // Check if gps is on, if not prompt to enable else get services
    useFocusEffect(
      useCallback(() => {
        const requestLocationPermission = async () => {
          try {
            const providerStatus = await Location.getProviderStatusAsync();

            if (!providerStatus.locationServicesEnabled) {
              // GPS is disabled, prompt the user to enable it
              try {
                await Location.enableNetworkProviderAsync();
              } catch (error) {
                navigation.navigate('Home')
                // Handle error or provide feedback to the user
              }
            } 
            else{
              try {
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
          
                const response = await axios.get(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
                );
          
                filterServices(newFilter);
                setAddress(response.data.display_name);
                setSelectedAddress(response.data.display_name);
              } catch (error) {
                navigation.navigate('Home')
                return
                setErrorMsg('Permission to access location was denied');
              }
            }
          } catch (error) {
            console.error('Error requesting location permission:', error);
          }
        };

        requestLocationPermission();
      }, [])
    );

    // console.log(selectedFilterState)
    
    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = address;
    }

    useEffect(() => {
        const accessToken = 'pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ydzQ2YzYwNWhvMmtyeTNwNDl3ejNvIn0.9n7wjqLZye4DtZcFneM3vw'; // Replace with your actual Mapbox access token
      
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${locationSearchValue}.json?access_token=${accessToken}`)
          .then((res) => {
           setPlaces(res.data.features) // Logging the response data

          })
          .catch((err) => {
            console.log(err);
          });
    }, [locationSearchValue]);

    const handleLocationSelect = async (coord) => {
        setPlaces(null)
        setLocation({latitude : coord[1], longitude : coord[0]})
        setLocationSearchValue('')
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coord[1]}&lon=${coord[0]}`
          );
          setSelectedAddress(response.data.display_name)
          
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
      } catch (error) {
        console.log(error)
      }
    }

    console.log(selectedFilterState.searchValue)
  return (
    <View className="px-3 py-3 ">
        <View style={{columnGap : 10}} className="w-full flex flex-row items-center justify-evenly mt-2 ">
        <View >
        <FontAwesome name="location-arrow" size={22} color="green" className="" />
        </View>
        <Text numberOfLines={1} className="font-semibold text-gray-700" onPress={()=>setVisible(true)} >{text}</Text>
        </View>

        {/* Modal */}
        <Overlay overlayStyle={{height : "100%", position : 'absolute', top : 0, borderBottomRightRadius : 30, borderBottomLeftRadius : 30 }} isVisible={visible} 
        onBackdropPress={()=>setVisible(!visible)}
        >
            <View className="w-[100vw] h-full  flex flex-col justify-between p-2">
                <View>
                <View className="h-[50] relative">
                <FontAwesome name="location-arrow" size={22} color="green" className="absolute z-10 top-3 left-3" />
                {/* Search bar location */}
                <TextInput value={locationSearchValue} onChangeText={setLocationSearchValue} className=" border-gray-300 placeholder:text-gray-300 text-gray-700 bg-gray-100 rounded-md flex-1 py-1.5 pl-10" placeholder='Enter address' /> 


                {/* Places Container */}
                <ScrollView keyboardShouldPersistTaps='handled'  contentContainerStyle={{rowGap : 20 , display : 'flex', flexDirection : 'column',}} className={`w-full ${places === null || places.length === 0 ? "hidden" : "flex"} w-[80%] absolute shadow-sm border h-[200] border-gray-200 bg-white p-2 top-14 flex-col z-20 rounded-md`}>
                {
                    places?.map((place) => (
                        <View  key={place.id}>
                        <TouchableWithoutFeedback onPress={()=>{handleLocationSelect(place.center); Keyboard.dismiss}} >
                            <Text>
                            {place.place_name}
                            </Text>
                            </TouchableWithoutFeedback>
                        </View>
                    ))
                }
                </ScrollView>   
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