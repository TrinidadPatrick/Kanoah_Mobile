import { View, Text, TouchableOpacity } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import { Linking } from 'react-native';
import React from 'react'

const ServiceFullAddress = ({address}) => {
    
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
    <>
    {
        address !== undefined &&
    <View className="flex-1 rounded-lg overflow-hidden relative">
    <View className="flex flex-col items-start mb-2">
        <Text numberOfLines={1}  className="text-sm text-gray-400  ">
            {address?.barangay.name} {address?.municipality.name}, {address?.province.name}, {address?.region.name}
        </Text>
        <Text numberOfLines={1}  className="text-sm text-gray-400 text-left ">
            {address?.street}
        </Text>
    </View>
    <MapView
    onPress={()=>{Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`)}}
    zoomEnabled
    zoomControlEnabled={true}
    scrollEnabled={false}
    style={{ flex: 1, borderRadius : 20 }}
    provider={PROVIDER_GOOGLE}
    mapType="standard"
    customMapStyle={customMapStyle}
    initialRegion={{
      latitude: address.latitude,
      longitude: address.longitude,
      latitudeDelta: 0.0122,
      longitudeDelta: 0.0121,
    }}
  >

    <Marker coordinate={{
      latitude: address.latitude,
      longitude: address.longitude,
      latitudeDelta: 0.0001,
      longitudeDelta: 0.0021,
      
      }}
      tappable
      
    />
    </MapView>
    </View>
    }
    </>
  )
}

export default ServiceFullAddress