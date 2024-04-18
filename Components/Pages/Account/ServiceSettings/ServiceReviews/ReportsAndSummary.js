import { View, Text } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { Rating } from '@kolking/react-native-rating';

const ReportsAndSummary = ({ratingList}) => {
    const [average, setAverage] = useState(null)
    const [ratingBreakdown, setRatingBreakDown] = useState({
        5 : {percentage : 0, count : 0},
        4 : {percentage : 0, count : 0},
        3 : {percentage : 0, count : 0},
        2 : {percentage : 0, count : 0},
        1 : {percentage : 0, count : 0},
    })

    useEffect(()=>{
        if(ratingList)
        {
            const totalRatings = ratingList?.length
            const sumOfRatings = totalRatings > 0 ? ratingList.reduce((sum, rating) => sum + rating.rating, 0) : 0;
            const average = totalRatings === 0 ? 0 : sumOfRatings / totalRatings
            setAverage(average.toFixed(1))
        }
    },[ratingList])

    useEffect(()=>{
        const totalRatings = ratingList?.length

        Object.keys(ratingBreakdown).map((key) => {
            const keyAsNumber = Number(key);
            const ratingCount = ratingList?.filter((rating) => rating.rating === keyAsNumber).length;
            const percentage = ratingCount === 0 ? 0 : Number(((ratingCount / totalRatings) * 100).toFixed(1));
            setRatingBreakDown((prevRatingBreakdown) => ({
                ...prevRatingBreakdown,
                [key]: {
                    percentage: percentage,
                    count: ratingCount || 0 // Handle cases where ratingCount is falsy
                }
            }));
        });
       
    },[ratingList])


  return (
    <View className="w-full flex-col bg-white">
        <Text className="text-lg text-gray-600 font-medium text-center">Overall Rating</Text>
        <Text includeFontPadding={false} style={{fontSize : 70, includeFontPadding : false, textAlignVertical : 'center', lineHeight : 75}} className="text-center  p-0">{average}</Text>
        <View className="w-full flex-row justify-center">
        <Rating size={20} baseColor='#f2f2f2' rating={average} spacing={5} disabled />
        </View>

        <View className="w-full flex-col mt-5 space-y-2">
            <View className="w-full flex-row items-center">
                <Text className="w-[70]">Excellent</Text>
                <Rating size={20} maxRating={1} baseColor='#f2f2f2' rating={1} spacing={5} disabled />
                <View className="flex-1 bg-gray-100 rounded-full h-[15] dark:bg-gray-100 mx-2">
                <View className={`bg-[#ffa534] h-[15] rounded-full`} style={{width : `${ratingBreakdown["5"].percentage}%`}}></View>
                </View>
                <Text className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["5"].count}</Text>
            </View>
            <View className="w-full flex-row items-center">
                <Text className="w-[70]">Very Good</Text>
                <Rating size={20} maxRating={1} baseColor='#f2f2f2' rating={1} spacing={5} disabled />
                <View className="flex-1 bg-gray-100 rounded-full h-[15] dark:bg-gray-100 mx-2">
                <View className={`bg-[#ffa534] h-[15] rounded-full`} style={{width : `${ratingBreakdown["4"].percentage}%`}}></View>
                </View>
                <Text className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["4"].count}</Text>
            </View>
            <View className="w-full flex-row items-center">
                <Text className="w-[70]">Average</Text>
                <Rating size={20} maxRating={1} baseColor='#f2f2f2' rating={1} spacing={5} disabled />
                <View className="flex-1 bg-gray-100 rounded-full h-[15] dark:bg-gray-100 mx-2">
                <View className={`bg-[#ffa534] h-[15] rounded-full`} style={{width : `${ratingBreakdown["3"].percentage}%`}}></View>
                </View>
                <Text className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["3"].count}</Text>
            </View>
            <View className="w-full flex-row items-center">
                <Text className="w-[70]">Poor</Text>
                <Rating size={20} maxRating={1} baseColor='#f2f2f2' rating={1} spacing={5} disabled />
                <View className="flex-1 bg-gray-100 rounded-full h-[15] dark:bg-gray-100 mx-2">
                <View className={`bg-[#ffa534] h-[15] rounded-full`} style={{width : `${ratingBreakdown["2"].percentage}%`}}></View>
                </View>
                <Text className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["2"].count}</Text>
            </View>
            <View className="w-full flex-row items-center">
                <Text className="w-[70]">Terrible</Text>
                <Rating size={20} maxRating={1} baseColor='#f2f2f2' rating={1} spacing={5} disabled />
                <View className="flex-1 bg-gray-100 rounded-full h-[15] dark:bg-gray-100 mx-2">
                <View className={`bg-[#ffa534] h-[15] rounded-full`} style={{width : `${ratingBreakdown["1"].percentage}%`}}></View>
                </View>
                <Text className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["1"].count}</Text>
            </View>
        </View>
    </View>
  )
}

export default ReportsAndSummary