import { View, Text } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store';
import http from '../../http';

const useInfo = () => {
    const [userInformation, setUserInformation] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    
    useEffect(()=>{
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
    
          fetchUserProfile();
    },[])
  return {
    userInformation, isLoggedIn
  }
}

export default useInfo