import { View, Text, StyleSheet, TouchableOpacity, Touchable, TouchableWithoutFeedback, Button, ScrollView, FlatList, TouchableHighlight } from 'react-native'
import { useEffect, useState } from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {FontAwesome, Entypo, Octicons} from 'react-native-vector-icons'
import Moment from 'moment';
import React from 'react'

const SetSchedule = ({service, userInformation, bookingInformation, storeBookingInformation, setStep, bookingSchedule, navigation}) => {
    const [error, setError] = useState({
        selectedDate : false,
        timeSelected : false,
        serviceOption : false,
      })
    const [availableDays, setAvailableDays] = useState([])
    const [timeSelected, setTimeSelected] = useState('')
    const [timeSpan, setTimeSpan] = useState([])
    const [serviceOption, setServiceOption] = useState(service.advanceInformation.ServiceOptions[0])
    const [bookingTimeSlot, setBookingTimeSlot] = useState([])
    const [currentDay, setCurrentDay] = useState('');
    const [bookings, setBookings] = useState([])
    const [unavailableTimes, setUnavailableTimes] = useState([])
    const [bookingScheds, setBookingScheds] = useState([])
    const [selectedDate, setSelectedDate] = useState('');

    // Gets the day of the week today
    useEffect(() => {
        // Get the current date
        const currentDate = new Date();
    
        // Array of days of the week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
        // Get the day of the week (0-indexed)
        const dayIndex = currentDate.getDay();
    
        // Get the day name from the array
        const dayName = daysOfWeek[dayIndex];
    
        // Update state with the current day
        setCurrentDay(dayName);
    }, []);

    const handleDayPress = (day) => {
        const dayOfWeek = Moment(day.dateString).format('dddd');
        setCurrentDay(dayOfWeek)
        setSelectedDate(day.dateString);
    };

    const renderHeader = (date) => {
        const monthYearString = date.toString('MMMM yyyy'); // Format month and year
        return (
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{monthYearString}</Text>
          </View>
        );
    };

    // Set default selected date to correct format if not indicated
    useEffect(()=>{
        if(selectedDate === '')
        {
            const dateObj = new Date().toLocaleDateString('EN-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).replace(/\//g, '-')
    
            const dateArray = dateObj.split("-")
            const defaultDate = dateArray[2] + "-" + dateArray[0] + "-" + dateArray[1]
            setSelectedDate(defaultDate)
        }
    },[])

    useEffect(()=>{
        const days = service.serviceHour.filter((sched)=> sched.isOpen).map((day, index) => day.day)
        setAvailableDays(days)
    },[])

    // Function to check if a date is on an available day
    const isDateAvailable = (dateString) => {
        const date = Moment(dateString)
        const dayOfWeek = date.day(); // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayName = date.format('dddd'); // Get day name (e.g., "Monday")
        return availableDays.includes(dayName);

    }

    const markedDates = {};
    const startDate = Moment().startOf('month'); // Start from the beginning of the current month
    const endDate = Moment().endOf('month'); // End at the end of the current month

    let currentDate = startDate;
    while (currentDate.isSameOrBefore(endDate, 'day')) {
    const dateString = currentDate.format('YYYY-MM-DD');
    if (!isDateAvailable(dateString)) {
      markedDates[dateString] = {
        disabled: true,
        disableTouchEvent: true,
        dotColor: 'red',
      };
    }
    if(!isDateAvailable(dateString) && dateString === selectedDate)
    {
        setSelectedDate('')
    }
    currentDate.add(1, 'day'); // Move to the next day
    }

    // Add selected date styling to markedDates
    if (selectedDate) {
        markedDates[selectedDate] = {
        selected: true,
        selectedColor: '#344ded',
        textDayFontWeight: 'bold',
        textDayFontSize: 18,
        };
    }

    // Sets the timespan
    useEffect(()=>{
    if(timeSelected !== '')
    {
        const dateTimeString = selectedDate + " " + timeSelected;
        const dateTimeUtcString = Moment.utc(dateTimeString, 'YYYY-MM-DD hh:mm A').format(); 

        const dateTime = new Date(dateTimeUtcString);

        // Add minutes to the date
        dateTime.setMinutes(dateTime.getMinutes() + bookingInformation.service.duration);

         // Convert to UTC ISO string and extract time
        const newDateTimeString = dateTime.toISOString().slice(0, 19).replace("T", " ");
        const time24Hour = newDateTimeString.split(" ").slice(1).toString();

        // Convert to 12-hour format
        const [hours, minutes] = time24Hour.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const time12Hour = `${hours12}:${paddedMinutes} ${period}`;

        setTimeSpan([timeSelected, time12Hour])
    }
     
    },[timeSelected])

    // Sets the bookings lists of the selected date
    useEffect(()=>{
        const bookings = bookingSchedule.filter((schedule) => schedule.schedule.bookingDate === selectedDate)
        setBookings(bookings)
    },[selectedDate])

    useEffect(()=>{
        const getSchedules = (bookings) => {
          return bookings.map((booking) => {
            return booking.schedule.timeSpan;
          });
        }
  
        setBookingScheds(getSchedules(bookings))
  
    },[bookings])

    // Sets the time available for the current day
    useEffect(()=>{
        const date = new Date().getTime()
        const yearToday = new Date().toISOString().split("T")[0]
        const dateToday = new Date(date +  28800000)
        const schedule = service?.serviceHour.find((serviceHour) => serviceHour.day === currentDay)
        const fromDate = new Date(`${yearToday === selectedDate ? yearToday : selectedDate}T${schedule?.fromTime}:00`);
        const toDate = new Date(`${selectedDate}T${schedule?.toTime}:00`);
        const timeArray = [];

        let currentTime = fromDate;
        while (currentTime <= toDate) {
          const endTime = new Date(currentTime);
          endTime.setMinutes(endTime.getMinutes() + bookingInformation.service.duration);
          
          // Check if the end time is within the service hours
          if (endTime <= toDate && new Date(currentTime.getTime() + 28800000) >= dateToday ) {
            const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            timeArray.push(formattedTime);
          }
          // Increment the current time by the interval in minutes
          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
              
              setBookingTimeSlot(timeArray);
          },[currentDay, selectedDate])

    // check and disables the time when necessary
    useEffect(()=>{
            if(bookingTimeSlot.length !== 0 && bookingScheds.length !== 0)
            {
              const unavailableTimes = []
              const check = (time) => {
                let count = 0;
                
              for (const timeSpan of bookingScheds) {
                const startTime = new Date(`2000-01-01 ${timeSpan[0]}`);
                const endTime = new Date(`2000-01-01 ${timeSpan[1]}`);
                const targetTimeDate = new Date(`2000-01-01 ${time}`);
        
                if (targetTimeDate >= startTime && targetTimeDate <= endTime) {
                  count++;
                }
              }
            
              return count
              }
        
              bookingTimeSlot.map((slot) => {
                const slotNumber = check(slot)
                if(slotNumber == service.booking_limit)
                {
                  unavailableTimes.push(slot)
                }
              });
      
              setUnavailableTimes(unavailableTimes)
            }
           
      
    },[bookingTimeSlot, bookingScheds])

    const submitSchedule = () => {
        const data = {
            bookingDate : selectedDate,
            bookingTime : timeSelected,
            timeSpan,
            serviceOption : serviceOption
        }
        
        const keys = {
            selectedDate,
            timeSelected,
            serviceOption
          }
          let hasError = false
          
          Object.entries(keys).forEach(([key, value])=>{
           if(value === '')
           {
            setError((prevError) => ({...prevError, [key] : true}))
            hasError = true
           }
           else
           {
            setError((prevError) => ({...prevError, [key] : false}))
           }
          })

          if(!hasError)
          {
            storeBookingInformation({...bookingInformation, schedule : data})
            setStep(3)
          }
    }

    useEffect(()=>{
        if(bookingInformation.schedule !== null)
        {
            const dayOfWeek = Moment(bookingInformation.schedule.bookingDate).format('dddd');
            setCurrentDay(dayOfWeek)
            setServiceOption(bookingInformation.schedule.serviceOption)
            setSelectedDate(bookingInformation.schedule.bookingDate)
            setTimeSelected(bookingInformation.schedule.bookingTime)
        }
    },[])


    return (
    <View className="w-full flex-1 flex flex-col bg-[#eeeeee] ">
        <View className="w-full h-fit ">
        <Calendar
        minDate={new Date().toISOString().split('T')[0]}
        current={selectedDate}
        renderHeader={renderHeader}
        enableSwipeMonths={true}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{textDayFontSize: 14}}
        />
        </View>

        {/* Time selector */}
        <View className="w-full flex-1 bg-white px-2 py-2 mt-3">
        <Text className='text-sm text-gray-500 mb-2 '>Select time 
        <Text className={` text-red-500`}>* </Text>
        {
            error.timeSelected && <Text className={`text-red-500 text-xs ps-1`}>Please select a time</Text>
        }
        </Text>
        <FlatList
        numColumns={3}
        data={bookingTimeSlot}
        keyExtractor={(item, index) => index}
        renderItem={({item}) =>(
        <TouchableOpacity 
        disabled={unavailableTimes.includes(item)}
        onPress={()=>setTimeSelected(item)} 
        className={`px-3 flex-1 m-0.5 py-2 ${item === timeSelected ? 'bg-blue-500 ' : 'bg-gray-100 border border-gray-200 '} disabled:bg-blue-300  text-semiSm rounded-sm `}>
        <Text className={`text-center ${item === timeSelected ? 'text-gray-50' : 'text-gray-500'} text-xs`}>{item}</Text>
        </TouchableOpacity>
        )}
        />
        </View>

        {/* Service Options */}
        <View className="w-full  flex flex-col mb-3 bg-white mt-3 py-3 px-2">
            <TouchableOpacity onPress={()=>navigation.navigate('ServiceOptionList', {
                serviceOptions : service.advanceInformation.ServiceOptions,
                setServiceOption : setServiceOption
            })} >
                <View className="flex flex-row justify-between items-center">
                <View className="flex-row gap-x-2 items-center">
                <Octicons  name="briefcase" color="gray" size={20} />
                <Text className="text-base text-gray-600">Service Option</Text>
                </View>
                <View className="flex-row gap-x-2">
                <Text>{serviceOption}</Text>
                <FontAwesome  name="angle-right" color="black" size={20} />
                </View>
                </View>
            </TouchableOpacity>
        </View>

        <View className="w-full h-[40] flex flex-row items-center">
        <TouchableOpacity onPress={()=>setStep(1)} className="w-fit px-5 h-full flex flex-row items-center rounded-sm bg-gray-200">
            <Text className="text-gray-600">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>submitSchedule()} className="flex-1 rounded-sm flex flex-row justify-center items-center bg-themeOrange h-full">
            <Text className="text-white">Next</Text>
        </TouchableOpacity>
        </View>
    </View>
    );
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#ffffff',
          paddingTop: 50,
        },
        headerContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        },
        headerText: {
          fontSize: 17,
          color : 'gray',
          fontWeight: 'medium',
        },
    });
    
    
export default SetSchedule