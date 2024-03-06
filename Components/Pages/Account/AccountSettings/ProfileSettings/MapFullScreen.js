import { View, Text } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {FontAwesome, Entypo} from 'react-native-vector-icons'

const MapFullScreen = ({route, navigation}) => {
    const {profile} = route.params
    const [location, setLocation] = useState({
        longitude : profile.Address.longitude,
        latitude : profile.Address.latitude
    })
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
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
        // console.log(response.data.display_name)
    };

    console.log(location)
  return (
    <View className="h-full relative flex">
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
        
        onDrag={handleMarkerDragEnd}
      />
      </MapView>

      <View className="absolute z-10 w-[90%] left-3 top-3 m-2">
      <FontAwesome className={`absolute z-20 top-3 left-3`} name="search" size={18} color="gray" />
      <GooglePlacesAutocomplete
      placeholder='Enter location'
      onPress={(data, details = null) => {
        setLocation({
            longitude : details.geometry.location.lng,
            latitude : details.geometry.location.lat
        })
        console.log(details.geometry.location);
      }}
      fetchDetails
      styles={{textInput : {paddingHorizontal : 38}}}
      query={{
        key: 'AIzaSyAGPyvnVRcJ5FDO88LP2LWWyTRnlRqNYYA',
        language: 'en',
      }}
      />
      </View>
    </View>
  )
}

export default MapFullScreen