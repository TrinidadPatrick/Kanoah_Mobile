import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import http from '../../http'

const useCategory = () => {
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])


    const getCategories = async () => {
        try {
            const result = await http.get('getCategories')
            const allCategories = result.data.filter((item) => item.type === "Category")
            const allSubCategories = result.data.filter((item) => item.type === "SubCategory")
            setCategories(allCategories)
            setSubCategories(allSubCategories)
            return Promise.resolve(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getCategories()
    },[])
  return {
    getCategories, categories, subCategories
  }
}

export default useCategory