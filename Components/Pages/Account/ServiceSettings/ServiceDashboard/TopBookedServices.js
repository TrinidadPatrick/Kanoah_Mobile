import { View, Text } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import http from '../../../../../http'
import { PieChart } from 'react-native-chart-kit'

const TopBookedServices = ({service, dateSelected}) => {
    const [serviceOffers, setServiceOffers] = useState(null)

    const getAccessToken = async () => {
        const accessToken = await SecureStore.getItemAsync("accessToken")
        return accessToken
    }

    useEffect(()=>{
        const getServiceOffers = async () => {
            try {
                const accessToken = await getAccessToken()
                const result = await http.get(`Mobile_getDBServiceOffers?service=${service._id}&dateFilter=${dateSelected}`, {
                    headers : {"Authorization" : `Bearer ${accessToken}`}
                })
                const serviceOffer = result.data.serviceOffers.serviceOffers
                const bookings = result.data.bookingResult.map((service) => service.service)

                const groupedData = bookings.reduce((result, serviceObj) => {
                    const matchingGroup = result.find(groupObj => groupObj.uniqueId == serviceObj.selectedServiceId)
                    if (matchingGroup) {
                        matchingGroup.services.push(serviceObj);
                      } else {
                        const newGroup = {
                          uniqueId: serviceObj.selectedServiceId,
                          groupInfo: serviceOffer.find(group => group.uniqueId == serviceObj.selectedServiceId),
                          services: [serviceObj],
                        };
                        if(newGroup.uniqueId !== undefined && newGroup.groupInfo !== undefined && newGroup.services !== undefined)
                        {
                          result.push(newGroup);
                        }
                      }
                    
                      return result;

                }, [])

                const final = groupedData.sort((a,b)=> b.services.length - a.services.length).map((service) => {
                    return {
                        service : service.groupInfo.name,
                        bookingsCount : service.services.length
                    }  
                })
                const sorted = final.sort((a,b)=> b.bookingsCount - a.bookingsCount)
                const data = sorted.map((booking, index)=> ({
                    name : booking.service,
                    count : booking.bookingsCount,
                    color : index === 0 ? '#008FFB' : index === 1 ? '#00E396' : index === 2 ?'#FEB019' : index === 3 ? '#FF4560' : '#FF1560',
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15
                }))
                setServiceOffers(data)

            } catch (error) {
                console.error(error)
            }
        }

        service !== null && getServiceOffers()
    },[service, dateSelected])



  return (
    <View className="flex-1">
        <Text className="text-center font-medium text-gray-600">Top booked services</Text>
        {
            serviceOffers !== null && serviceOffers.length !== 0
            ?
            <PieChart
            data={serviceOffers}
              width={390}
              height={250}
              chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                  borderRadius: 16
              },
              propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
              }
              }}
              accessor={"count"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              // center={[10, 50]}
              absolute
            /> 
            :
            serviceOffers !== null && serviceOffers.length === 0
            ?
            <View className="flex-1 flex-row justify-center items-center h-[250] bg-gray-50">
                <Text>No bookings yet</Text>
            </View>
            :
            ""
        }
    </View>
  )
}

export default TopBookedServices