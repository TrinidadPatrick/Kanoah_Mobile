import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Slider } from 'react-native-elements';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import useStore from '../../../store'
import axios from 'axios';

const Map = ({location, setLocation, setSelectedAddress, setAddress, selectedAddress, setVisible, confirmLocation}) => {
    const { selectedFilterState, storeFilter, decrement } = useStore();
    const [radius, setRadius] = useState(selectedFilterState.radius)

    const handleMarkerDragEnd = async (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setLocation({latitude, longitude})
          try {
            const response = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${location.longitude}&latitude=${location.latitude}&access_token=pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg`)
          setAddress(response.data.features[0].properties.full_address)
          setSelectedAddress(response.data.features[0].properties.full_address)
          } catch (error) {
            console.log(error)
          } 
    };

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


  return (
    <View className="h-full border rounded-md overflow-hidden bg-[#ecf1f7a1] border-gray-200 shadow-md">
        
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
        <Circle
        center={{latitude : location.latitude, longitude : location.longitude}}
        radius={radius * 1000}
        strokeWidth={2}
        strokeColor="#444444a1" // Border color
        fillColor="#ecf1f7a1"   // Fill color
      />
      <Marker coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0001,
        longitudeDelta: 0.0021,
        
        }}
        draggable
        onDragEnd={handleMarkerDragEnd}
      />
    </MapView>

    {/* Radius Slider */}
    <View className="absolute bottom-10 w-[90%] left-[5%] px-2 py-2 rounded-md shadow-md bg-white">
    <View style={{columnGap : 10}} className="w-full flex flex-row justify-evenly items-center ">
    <View className="w-full flex-1">
    <Slider
    step={1}
    value={radius}
    minimumValue={1}
    onValueChange={(value) => setRadius(value)}
    maximumValue={100}
    thumbStyle={{backgroundColor : 'blue', height : 20, width : 20}}
    />
    </View>
    <Text>{radius} km</Text>
    </View>

    {/* Confirm Button */}
    <TouchableOpacity onPress={()=>{setAddress(selectedAddress);setVisible(false);confirmLocation(radius)}} className="w-[100%] bg-themeBlue py-3 rounded-md shadow-md flex flex-row items-center space-x-2 justify-center">
        <Text className="text-white" >Confirm Location</Text>
    </TouchableOpacity>
    </View>
    </View>
  )
}


export default Map