import { View, Text, Dimensions } from 'react-native'
import React, {useRef, useState, useEffect} from 'react'
import {LineChart,BarChart,PieChart,ProgressChart,ContributionGraph,StackedBarChart} from "react-native-chart-kit";
import * as SecureStore from 'expo-secure-store'
import http from '../../../../../http'

const SalesAndBookingChart = ({service}) => {
  const chartRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
  const [SalesData, setSalesData] = useState([
    { name: 'Jan', Sales: 0, },
    { name: 'Feb', Sales: 0, },
    { name: 'Mar', Sales: 0, },
    { name: 'Apr', Sales: 0, },
    { name: 'May', Sales: 0, },
    { name: 'Jun', Sales: 0, },
    { name: 'Jul', Sales: 0, },
    { name: 'Aug', Sales: 0, },
    { name: 'Sep', Sales: 0, },
    { name: 'Oct', Sales: 0, },
    { name: 'Nov', Sales: 0, },
    { name: 'Dec', Sales: 0, },
  ])

  const [BookingsData, setBookingsData] = useState([
    { name: 'Jan', Bookings: 0, },
    { name: 'Feb', Bookings: 0, },
    { name: 'Mar', Bookings: 0, },
    { name: 'Apr', Bookings: 0, },
    { name: 'May', Bookings: 0, },
    { name: 'Jun', Bookings: 0, },
    { name: 'Jul', Bookings: 0, },
    { name: 'Aug', Bookings: 0, },
    { name: 'Sep', Bookings: 0, },
    { name: 'Oct', Bookings: 0, },
    { name: 'Nov', Bookings: 0, },
    { name: 'Dec', Bookings: 0, },
  ])

//   useEffect(() => {
//     const updateWidth = () => {
//       const width = Dimensions.get('window').width;
//       setContainerWidth(width);
//     };

//     Dimensions.addEventListener('change', updateWidth);
//     return () => Dimensions.removeEventListener('change', updateWidth);
//   }, []);

  const getAccessToken = async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken")
    return accessToken
  }

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

  const formatBookingsValue = (value) => {
    return `${value}`;
  };

  //Get monthly sales
  useEffect(()=>{
    const getTotalSales = async () => {
        try {
            const accessToken = await getAccessToken()
            const result = await http.get(`Mobile_getMonthlySales?service=${service._id}`, {
                headers : {"Authorization" : `Bearer ${accessToken}`}
            })
            const resultData = result.data
            const groupedData = resultData.reduce((acc, obj) => {
                const monthYear = obj.createdAt.slice(0, 7)
                if(!acc[monthYear]){
                    acc[monthYear] = []
                }
                acc[monthYear].push(obj)
                return acc;
            }, {})

            const sumPerGroup = Object.keys(groupedData).map((key) => ({
                monthYear: new Date(key).toDateString().split(" ")[1],
                sum: groupedData[key].reduce((total, obj) => total + Number(obj.service.price), 0),
              }));

            sumPerGroup.map((sum) => {
                const index = SalesData.findIndex((data)=>data.name === sum.monthYear)
                setSalesData((prevData) => [
                    ...prevData.slice(0, index),
                    {...prevData[index], Sales : sum["sum"] },
                    ...prevData.slice(index + 1)
                ])
            })
        } catch (error) {
            console.error(error)
        }
    }

    service !== null && getTotalSales()
  },[service])

  // Get Monthly Bookings Count
  useEffect(()=>{
        const getBookingCounts = async () => {
            try {
                const accessToken = await getAccessToken()
                const result = await http.get(`Mobile_getMonthlyBookings?service=${service._id}`, {
                    headers : {'Authorization' : `Bearer ${accessToken}`}
                })
                const resultData = result.data
                const groupedData = resultData.reduce((acc, obj) => {
                    const monthYear = obj.createdAt.slice(0, 7)
                    if(!acc[monthYear]){
                        acc[monthYear] = []
                    }
                    acc[monthYear].push(obj)
                    return acc;
                }, {})

                const dataArray = Object.entries(groupedData).map(([monthYear, array]) => ({
                    monthYear : new Date(monthYear).toDateString().split(" ")[1],
                    length: array.length,
                  }));
                

                //   console.log(lengthPerGroup)
                dataArray.map((bookings) => {
                    const index = BookingsData.findIndex((booking)=>booking.name === bookings.monthYear)
                    setBookingsData((prevData) => [
                        ...prevData.slice(0, index),
                        {...prevData[index], Bookings : bookings["length"] },
                        ...prevData.slice(index + 1)
                    ])
                })
            } catch (error) {
                console.error(error)
            }
        }

        service !== null && getBookingCounts()
  },[service])



  return (
    <View style={{paddingHorizontal : 10}} className="flex-1">
      <Text className="text-center font-medium text-gray-600">Monthly Sales</Text>
      <LineChart
      withVerticalLines={false}
    data={{
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          data: SalesData.map((sales)=>sales.Sales)
        },
      ]
    }}
    r
    ref={chartRef}
    width={374} // from react-native
    // width={containerWidth * 0.95} // from react-native
    height={220}
    yAxisLabel=""
    yAxisSuffix=""
    formatYLabel={formatSales}
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#24247d",
      backgroundGradientFrom: "#38388a",
      backgroundGradientTo: "#24247d",
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      },
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
      }}
      />

      <Text className="text-center font-medium text-gray-600">Monthly Bookings</Text>
      <LineChart
      withVerticalLines={false}
    data={{
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          data: BookingsData.map((booking)=>booking.Bookings)
        },
      ]
    }}
    r
    ref={chartRef}
    width={374} // from react-native
    // width={containerWidth * 0.95} // from react-native
    height={220}
    yAxisLabel=""
    yAxisSuffix=""
    formatYLabel={formatSales}
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#EB6B23",
      backgroundGradientFrom: "#f0964d",
      backgroundGradientTo: "#EB6B21",
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      },
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
      }}
      />
    </View>
  )
}

export default SalesAndBookingChart