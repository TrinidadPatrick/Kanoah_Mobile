import { View, Text } from 'react-native'
import React,{ useState, useEffect} from 'react'
import * as SecureStore from 'expo-secure-store'
import http from '../../../../../http'

const SummaryDetails = ({service, dateSelected}) => {
    
    const getAccessToken = async () => {
        const accessToken = await SecureStore.getItemAsync("accessToken")
        return accessToken
    }

    const [totalBookings, setTotalBookings] = useState({
        bookings : 0,
        percentIncrease : 0
    })
    const [totalReview, setTotalReview] = useState({
        reviews : 0,
        percentIncrease : 0
    })
    const [ratingAverage, setRatingAverage] = useState({
        average : 0,
        percentIncrease : 0
    })
    const [totalSales, setTotalSales] = useState({
        sales : 0,
        percentIncrease : 0
    })

    // Count total Bookings
    useEffect(()=>{
            const countBookings = async () => {
                try {
                    const accessToken = await getAccessToken()
                    const result = await http.get(`Mobile_countBookings?service=${service._id}&dateFilter=${dateSelected}`, {
                        headers : {"Authorization" : `Bearer ${accessToken}`}
                    })
                    setTotalBookings({
                        bookings : result.data.thisMonth,
                        percentIncrease : result.data.percentIncrease
                    })
                } catch (error) {
                    console.error(error)
                }
            }
    
            service !== null && countBookings()
    },[dateSelected])

    // Count total Reviews
    useEffect(()=>{
            const countBookings = async () => {
                try {
                    const accessToken = await getAccessToken()
                    const result = await http.get(`Mobile_countRatings?service=${service._id}&dateFilter=${dateSelected}`, {
                        headers : {"Authorization" : `Bearer ${accessToken}`}
                    })
                    setTotalReview({
                        reviews : result.data.thisMonth,
                        percentIncrease : result.data.percentIncrease
                    })
                } catch (error) {
                    console.error(error)
                }
            }
    
            service !== null && countBookings()
    },[dateSelected])

    // Get Rating Average
    useEffect(()=>{
        const getRatingAverage = async () => {
            try {
                const accessToken = await getAccessToken()
                const result = await http.get(`Mobile_getRatingAverage?service=${service._id}&dateFilter=${dateSelected}`, {
                    headers : {"Authorization" : `Bearer ${accessToken}`}
                })
                setRatingAverage({
                    average : result.data.averageThisMonth,
                    percentIncrease : result.data.percentIncrease
                })
            } catch (error) {
                console.error(error)
            }
        }

        service !== null && getRatingAverage()
    },[dateSelected])

    // Get Total Sales
    useEffect(()=>{
        const getTotalSales = async () => {
            try {
                const accessToken = await getAccessToken()
                const result = await http.get(`Mobile_getTotalSales?service=${service._id}&dateFilter=${dateSelected}`, {
                    headers : {"Authorization" : `Bearer ${accessToken}`}
                })
                setTotalSales({
                    sales : result.data.sales,
                    percentIncrease : result.data.percentIncrease
                })
            } catch (error) {
                console.error(error)
            }
        }

        service !== null && getTotalSales()
    },[dateSelected])

    const formatSales = (number) => {
    const sale = Number(number)
    // Check if the number is greater than or equal to 1000
    if (sale >= 1000) {
    // Divide the number by 1000 and round to one decimal place
    const formattedNumber = (sale / 1000).toFixed(1);
    // Append 'k' to indicate thousands
    return `${formattedNumber}k`;
     }
     // Return the original number if it's less than 1000
    return sale.toString();
    }


  return (
    <View className="h-[250]  flex-col  rounded-md overflow-hidden bg-white border border-gray-200 mx-2">
      <View className="flex-1 flex-row rounded-md">
        {/* Bookings */}
        <View className="flex-1 flex-col border-r-[1px] border-b-[1px] border-gray-200 p-1 justify-evenly items-center">
            <Text className="text-base font-medium text-gray-600">Bookings</Text>
            <Text numberOfLines={1} className="text-4xl font-medium text-gray-600">{totalBookings.bookings}</Text>
            <Text className={`${totalBookings.percentIncrease < 0 ? "text-red-500" : "text-green-500 "} rounded-sm text-semiSm`}>{totalBookings.percentIncrease > 0 ? "+" : ""}{totalBookings.percentIncrease === null ? 0.0 : totalBookings.percentIncrease.toFixed(0)}%<Text className="text-gray-600"> this month</Text></Text>
        </View>
        {/* Reviews */}
        <View className="flex-1 flex-col border-b-[1px]  border-gray-200 p-1 justify-evenly items-center">
        <Text className="text-base font-medium text-gray-600">Total Reviews</Text>
            <Text className="text-4xl font-medium text-gray-600">{totalReview.reviews}</Text>
            <Text numberOfLines={1} className={`${totalReview.percentIncrease < 0 ? "text-red-500" : "text-green-500 "} rounded-sm text-semiSm`}>{totalReview.percentIncrease > 0 ? "+" : ""}{totalReview.percentIncrease === null ? 0.0 : totalReview.percentIncrease.toFixed(0)}%<Text className="text-gray-600"> this month</Text></Text>
        </View>
      </View>
      <View className="flex-1 flex-row rounded-md">
        {/* Average */}
        <View className="flex-1 flex-col border-r-[1px]  border-gray-200 p-1 justify-evenly items-center">
        <Text className="text-base font-medium text-gray-600">Rating Average</Text>
            <Text className="text-4xl font-medium text-gray-600">{ratingAverage.average}</Text>
            <Text numberOfLines={1} className={`${ratingAverage.percentIncrease < 0 ? "text-red-500" : "text-green-500 "} rounded-sm text-semiSm`}>{ratingAverage.percentIncrease > 0 ? "+" : ""}{ratingAverage.percentIncrease === null ? 0.0 : ratingAverage.percentIncrease.toFixed(1)}%<Text className="text-gray-600"> this month</Text></Text>
        </View>
        {/* Total Sales */}
        <View className="flex-1 flex-col  border-gray-200 p-1 justify-evenly items-center">
        <Text className="text-base font-medium text-gray-600">Total Sales</Text>
            <Text className="text-4xl font-medium text-gray-600">{formatSales(totalSales.sales)}</Text>
            <Text numberOfLines={1} className={`${totalSales.percentIncrease < 0 ? "text-red-500" : "text-green-500 "} rounded-sm text-semiSm`}>{totalSales.percentIncrease > 0 ? "+" : ""}{totalSales.percentIncrease === null ? 0.0 : Number(totalSales.percentIncrease)}%<Text className="text-gray-600"> this month</Text></Text>
        </View>
      </View>
    </View>
  )
}

export default SummaryDetails