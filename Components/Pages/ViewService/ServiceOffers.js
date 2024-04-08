import { View, Text, FlatList, SafeAreaView, ScrollView } from 'react-native'
import {FontAwesome, Entypo} from 'react-native-vector-icons'
import { ListItem } from '@rneui/themed'
import React from 'react'
import { useState } from 'react'

const ServiceOffers = ({serviceOffers}) => {
    const [expandedItems, setExpandedItems] = useState([])

    const handleExpand = (index) => {
        const newExpandedItems = [...expandedItems];
        newExpandedItems[index] = !newExpandedItems[index];
        setExpandedItems(newExpandedItems);
    }

  return (
    <SafeAreaView className="w-full flex flex-col p-2">
    <View className="py-1 border-b-[1px] w-full border-gray-200">
    <Text className="text-lg font-medium text-gray-600 ">Services</Text>
    </View>

    {
    serviceOffers?.map((services, index)=>{
        return (
            <ListItem.Accordion
            key={index}
            icon={<FontAwesome className={`${services.variants && services.variants.length === 0 ? " opacity-0" : ""}`} name="angle-down" color="#b1b1b3" size={20} />}
            content={
            <>
            <ListItem.Content style={{display : 'flex', flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                <ListItem.Title>{services.name}</ListItem.Title>
                <ListItem.Title style={{fontSize : 12}}>
                {services.variants && services.variants.length !== 0 ? `₱${services.variants[0]?.price} - ₱${services.variants.slice(-1)[0]?.price}` : `₱${services.origPrice}`}
                </ListItem.Title>
            </ListItem.Content>
            </>
            }
            isExpanded={expandedItems[index]}
            onPress={() => {handleExpand(index)}}>
            {
                services.variants.length !== 0 && services.variants.map((variant, index)=>{
                    return (
                        <ListItem key={index} bottomDivider>
                            <ListItem.Content >
                            <ListItem.Title>{variant.type}</ListItem.Title>
                            <ListItem.Subtitle style={{color : "#929496"}}>₱{variant.price}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    )
                })
            }
            </ListItem.Accordion>
            )
         })
    }


    {/* <ScrollView contentContainerStyle={{display : "flex", flexDirection : "column", rowGap : 15, paddingVertical : 10, paddingHorizontal : 10}}>
        {
            serviceOffers?.map((services, index)=>{
                console.log(services.variants)
                return (
                    <View key={index} className="flex flex-row items-center pb-3 border-b-[1px] border-gray-100 justify-between">
                    <Text>{services.name}</Text>
                    <View className="flex flex-row items-center gap-3">
                    <Text>
                    {services.variants && services.variants.length !== 0 ? `₱${services.variants[0]?.price} - ₱${services.variants.slice(-1)[0]?.price}` : `₱${services.origPrice}`}
                    </Text>
                    <FontAwesome className={`${services.variants && services.variants.length === 0 ? " opacity-0" : ""}`} name="angle-down" color="#d6d4d4" size={20} />
                    </View>
                    </View>
                )
            })
        }
    </ScrollView> */}
   
    </SafeAreaView>
  )
}

export default ServiceOffers