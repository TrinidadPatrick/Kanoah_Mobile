import { View, Text, TextInput, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import {FontAwesome} from 'react-native-vector-icons'
import * as Location from 'expo-location';
import axios from 'axios';
import { Input, Overlay } from 'react-native-elements';
import Map from './Map';

const LocationInput = () => {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [visible, setVisible] = useState(false);
    const [locationSearchValue, setLocationSearchValue] = useState('')
    const [places, setPlaces] = useState(null)

    // Get the location of the user
    useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
          );
            setAddress(response.data.display_name)
          
        })();
      }, []);
    
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
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coord[1]}&lon=${coord[0]}`
          );
          setAddress(response.data.display_name)
          setPlaces(null)
          setLocationSearchValue('')
    }

  return (
    <View className="px-3 py-3 ">
        <View style={{columnGap : 10}} className="w-full flex flex-row items-center justify-evenly mt-2 ">
        <View >
        <FontAwesome name="location-arrow" size={22} color="green" className="" />
        </View>
        {/* <TextInput className=" border-gray-300 bg-gray-200 rounded-md flex-1 py-1.5 px-2" placeholder='Enter address' /> */}
        <Text onPress={()=>setVisible(true)} >{text}</Text>
        </View>

        {/* Modal */}
        <Overlay overlayStyle={{height : "60%", position : 'absolute', top : 0, borderBottomRightRadius : 30, borderBottomLeftRadius : 30 }} isVisible={visible} 
        onBackdropPress={()=>setVisible(!visible)}
        >
            <View className="w-[100vw] h-full  flex flex-col justify-between p-2">
                <View>
                <View className="h-[50] relative">
                <FontAwesome name="location-arrow" size={22} color="green" className="absolute z-10 top-3 left-3" />
                <TextInput value={locationSearchValue} onChangeText={setLocationSearchValue} className=" border-gray-300 placeholder:text-gray-300 text-gray-700 bg-gray-200 rounded-md flex-1 py-1.5 pl-10" placeholder='Enter address' /> 
                {/* Places Container */}
                <ScrollView  contentContainerStyle={{rowGap : 20 , display : 'flex', flexDirection : 'column',}} className={`w-full ${places === null || places.length === 0 ? "hidden" : "flex"} w-[80%] absolute shadow-sm border h-[200] border-gray-200 bg-white p-2 top-14 flex-col z-20 rounded-md`}>
                {
                    places?.map((place) => (
                        <View  key={place.id}>
                        <Text onPress={()=>{handleLocationSelect(place.center)}} >{place.place_name}</Text>
                        </View>
                    ))
                }
                </ScrollView>   
                </View>

                {/* Current Location */}
                <View className="mt-5 bg-gray-100 rounded-md border-gray-300 p-1.5">
                    <Text className="text-base">Current location</Text>
                    <View>
                        <Text className="font-medium text-gray-600">{text}</Text>
                    </View>
                </View>
                </View>

                <View className="w-full h-[200]">
                    <Map />
                </View>

                {/* Choose from map option */}
                <TouchableOpacity className="w-full flex flex-row items-center space-x-2 justify-center">
                <FontAwesome name="map-o" size={15} color="gray" className="" />
                    <Text>Choose from map</Text>
                </TouchableOpacity>
            </View>
        </Overlay>
      
    </View>
  )
}

export default LocationInput