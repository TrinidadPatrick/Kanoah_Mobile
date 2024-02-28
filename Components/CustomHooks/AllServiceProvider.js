import { View, Text } from 'react-native'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import http from '../../http';
import React from 'react'

const useServices = () => {
    const [services, setServices] = useState([])
    const accessToken = SecureStore.getItem('accessToken')

    const getServices = async () => {
        try {
          const result = await http.get(`Mobile_GetServices`, {
            headers : {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          })
          setServices(result.data)
          return Promise.resolve(result.data)
        } catch (error) {
          console.log(error)
        }
      }

    useEffect(()=>{
      getServices()
    },[])


return {
    services, getServices
}
}

export default useServices