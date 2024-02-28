import { View, Text } from 'react-native'
import React from 'react'
import { SearchBar } from 'react-native-elements'
import { Button } from '@rneui/themed'
import {FontAwesome} from '@expo/vector-icons'
import { useState } from 'react'
import { Drawer } from 'react-native-drawer-layout';

const Explore = () => {
    const [open, setOpen] = useState(false);
  return (
    <View className="w-full h-full flex bg-white flex-col justify-start">
        <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerType="front"
        renderDrawerContent={() => {
        return <Text>Drawer content</Text>;
        }}
        >
        
        {/* Search Bar */}
        <View style={{columnGap : 10}} className="w-full flex flex-row items-center justify-evenly mt-2 px-2">
        <SearchBar containerStyle={{
          backgroundColor: 'white', // set background color to transparent
          borderWidth: 1,  
          borderRadius : 10,       // set border bottom width
          borderColor : 'gray',
          height : 47,
          display : 'flex',
          alignItems : 'center',
          justifyContent : 'center',
        //   width : "100%"
        flex : 1
        }} 
        inputStyle={{
          height : 47
        }}
        platform='android'
        placeholder='Search services'
        showCancel={false}
         lightTheme>

        </SearchBar>
        {/* Filter Button */}
        <Button onPress={() => setOpen((prevOpen) => !prevOpen)} buttonStyle={{backgroundColor : "#f5f5f5"}} radius={"sm"} type="solid">
        <FontAwesome  name='sliders' size={28} color="black" />
        </Button>
        </View>

        </Drawer>
    </View>
  )
}

export default Explore