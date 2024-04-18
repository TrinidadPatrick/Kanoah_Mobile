import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import useInfo from '../../CustomHooks/UserInfoProvider'
import { useFocusEffect } from '@react-navigation/native'
import ContactLists from './ContactLists'
import ConversationWindow from './ConversationWindow'

const MainChat = ({route, navigation}) => {
    const {userInformation, isLoggedIn, setIsLoggedIn} = useInfo()
    
    // Redirect to login page if not logged in
    useFocusEffect(
        useCallback(()=>{
            if(isLoggedIn === false)
            {
                setIsLoggedIn(null)
                navigation.navigate("Login")
            }
            return () => {
            
            }
        },[isLoggedIn])

    )


  return (
    <View className="flex-1 bg-white">
        {/* <ContactLists userInformation={userInformation} isLoggedIn={isLoggedIn} /> */}
    </View>
  )
}

export default MainChat