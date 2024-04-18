import { View, Text, Modal, StatusBar, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon } from 'react-native-elements'

const MonthPickerCS = ({showMonthPicker, setShowMonthPicker, dateSelected, setDateSelected}) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [selectedMonth, setSelectedMonth] = useState('')
    const months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    const years = Array.from({length :( Number(selectedYear) + 10) - Number(selectedYear) + 1}, (_,index) => selectedYear + index)
    
   const handleMonthSelect = (index) => {
    const monthSelected = months[index]
    const selectedDate = `${selectedYear}-${index+1 < 10 ? String(0)+String(index + 1) : index+1}`
    setDateSelected(selectedDate)
    setSelectedMonth(monthSelected)
    setShowMonthPicker(false)
   }

   useEffect(()=>{
    const monthIndex = dateSelected.split("-")[1]
    setSelectedMonth(months[monthIndex - 1])
   },[])

    return (
    <Modal transparent statusBarTranslucent visible={showMonthPicker}>
    <TouchableWithoutFeedback onPress={()=>setShowMonthPicker(false)}>
        <View style={{backgroundColor : "rgba(0,0,0,0.6)", paddingTop : StatusBar.currentHeight}} className="flex-1 flex-row justify-center items-center">
        <View className="w-[80%] pb-3 bg-white flex-col rounded-md">
            {/* Year picker */}
            <View className="flex-row items-center w-full justify-between py-4 px-2">
            <TouchableOpacity onPress={()=>setSelectedYear(Number(selectedYear) - 1)}>
                <Icon type='material-community' name='chevron-left' size={30} />
            </TouchableOpacity>
                <Text className="text-lg font-medium">{selectedYear}</Text>
            <TouchableOpacity onPress={()=>setSelectedYear(Number(selectedYear) + 1)}>
                <Icon type='material-community' name='chevron-right' size={30} />
            </TouchableOpacity>
            </View>
            {/* Month Picker */}
            <View className="flex-row flex-wrap justify-evenly">
            {
                months.map((month, index) =>{
                    return (
                        <TouchableOpacity onPress={()=>handleMonthSelect(index)} className={` ${month === selectedMonth && "bg-blue-500"} w-[30%] py-3`} key={index}>
                            <Text className={`text-center ${month === selectedMonth && "text-white"}`}>{month}</Text>
                        </TouchableOpacity>
                    )
                })
            }
            </View>
        </View>
        </View>
    </TouchableWithoutFeedback>
    </Modal>
  )
}

export default MonthPickerCS