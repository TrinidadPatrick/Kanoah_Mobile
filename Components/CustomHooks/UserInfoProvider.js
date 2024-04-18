import { View, Text } from 'react-native'
import React from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store';
import http from '../../http';

const useInfo = () => {
    const [userInformation, setUserInformation] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(null)

    const fetchUserProfile = async () => {
      try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
        const result = await http.get(`Mobile_getUser`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setUserInformation(result.data);
        setIsLoggedIn(true)
      } catch (error) {
        setIsLoggedIn(false)
      }
    };
    useFocusEffect(
      React.useCallback(()=> {
        setIsLoggedIn(null)
        fetchUserProfile()
        return () => {
        }
      },[])
  
    )
  
  return {
    userInformation, isLoggedIn, setIsLoggedIn
  }
}

export default useInfo