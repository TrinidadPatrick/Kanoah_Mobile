import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import http from '../../http'

const useCategory = () => {

    const getCategories = async () => {
        try {
            const result = await http.get('getCategories')
            return Promise.resolve(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getCategories()
    },[])
  return {
    getCategories
  }
}

export default useCategory