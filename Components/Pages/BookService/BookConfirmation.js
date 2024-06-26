import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react'
import useBookingStore from './BookServiceStore'
import {FontAwesome, Entypo, Octicons} from 'react-native-vector-icons'
import http from '../../../http'
import axios from 'axios'
import io from 'socket.io-client';

const windowHeight = Dimensions.get('window').height;

const BookConfirmation = ({route, navigation}) => {
    const {service, userInformation} = route.params
    const {bookingInformation} = useBookingStore()
    const [finalBookingInformation, setFinalBookingInformation] = useState(null)
    const [socket, setSocket] = useState(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [paid, setPaid] = useState(false)
    const [loadingGcashPayment, setLoadingGcashPayment] = useState(false)

    useEffect(()=>{
        setSocket(io("https://kanoah.onrender.com"))
        // setSocket(io("http://localhost:5000"))
    
    },[])

    const generateBookingId = () => {
        const variables = '1234567890'
        let id = ''
        for(let i = 0; i <= 10;i++)
        {
            const randomIndex = Math.floor(Math.random() * variables.length)
            id += variables.charAt(randomIndex)

        }

        return id;
    }

    const computeDistance = () => {
        const providerPlace = {longitude : service.address.longitude, latitude : service.address.latitude}
        const clientPlace = {longitude : bookingInformation.contactAndAddress.Address.longitude, latitude : bookingInformation.contactAndAddress.Address.latitude}

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const earthRadius = 6371;
        const toRadians = degrees => degrees * (Math.PI / 180);

        // Convert latitude and longitude from degrees to radians
        const radLat1 = toRadians(lat1);
        const radLon1 = toRadians(lon1);
        const radLat2 = toRadians(lat2);
        const radLon2 = toRadians(lon2);

        const deltaLat = radLat2 - radLat1;
        const deltaLon = radLon2 - radLon1;

        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(radLat1) * Math.cos(radLat2) *
                  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Distance in kilometers
        const distance = earthRadius * c;

        return distance;
    }


    
         // Calculate distance between providerPlace and clientPlace
    const distance = Number(calculateDistance(providerPlace.latitude, providerPlace.longitude, clientPlace.latitude, clientPlace.longitude).toFixed(0))

    const basePrice = 49

    
    return basePrice + (distance * 5)
    }
    
    const handleOpenGcashPayment = async () => {
        setShowPaymentModal(true)
    }

    const handlePay = () => {
        setLoadingGcashPayment(true)
        setTimeout(()=>{
            submitBooking()
        }, 2000)
    }

    const submitBooking = async () => {

        const htmlContent = `
        <div class='w-full bg-[#f9f9f9] flex overflow-auto flex-col h-fit py-3 relative space-y-2 rounded-md '>
        <h1 class='text-center font-semibold text-lg md:text-lg text-gray-800'>Booking Confirmation</h1>
        <button class='absolute top-1'>
            <ArrowBackIosOutlinedIcon class=' hover:text-gray-400' fontSize='small left-0' />
        </button>

        <div class='flex gap-3 w-full bg-white border shadow-sm p-2'>
            <div class='w-[120px] min-w-[120px] flex items-center rounded-sm overflow-hidden aspect-video '>
                <img src=${service.serviceProfileImage} alt="service image" />
            </div>
            <div class='w-full'>
                <h1 class='font-medium text-sm md:text-base'>${service.basicInformation?.ServiceTitle}</h1>
                <h2 class='font-normal text-xs md:text-sm'>Service: ${finalBookingInformation?.service?.selectedService}</h2>
                <h2 class='font-normal text-xs md:text-sm'>Variant: ${finalBookingInformation?.service?.selectedVariant.type}</h2>
                <h2 class='font-normal text-xs md:text-sm'>Service Option: ${finalBookingInformation?.schedule?.serviceOption}</h2>
            </div>
            <div class='relative justify-self-end w-fit font-semibold'>
                ₱${finalBookingInformation?.service?.price}
            </div>
        </div>

        <div class='w-full bg-white border rounded-sm shadow-sm'>
            <h2 class='font-semibold'>Booking ID: <span class='font-normal underline text-blue-500'>${finalBookingInformation?.booking_id}</span></h2>
        </div>


        <div class='bg-white w-full rounded-sm shadow-sm'>
           
            <div class='flex h-fit items-stretch justify-between gap-2 flex-col md:flex-row-reverse'>

            <ul class='w-full max-w-full text-ellipsis overflow-hidden'>
                <h1 class='font-semibold text-xs'>Client Details</h1>
                <li class='text-xs md:text-sm text-gray-700'>${finalBookingInformation?.contactAndAddress?.firstname + " " + finalBookingInformation?.contactAndAddress?.lastname}</li>
                <li class='text-xs md:text-sm text-gray-700'>${finalBookingInformation?.contactAndAddress?.email}</li>
                <li class='text-xs md:text-sm text-gray-700'>+63${finalBookingInformation?.contactAndAddress?.contact}</li>
            </ul>

            <ul class='w-full '>
            <h1 class='font-semibold'>Schedule</h1>
                <li class='text-xs md:text-sm text-gray-700'>${new Date(finalBookingInformation?.schedule?.bookingDate).toLocaleDateString('EN-US', {
                    month : 'long',
                    day : '2-digit',
                    year : 'numeric'
                })}</li >
                <li class='text-xs md:text-sm text-gray-700'>${finalBookingInformation?.schedule?.timeSpan[0]} - ${finalBookingInformation?.schedule?.timeSpan[1]}</li >
            </ul>
            </div>

            <div class='mt-2'>
            <h2 class='font-semibold'>Address</h2>
            <ul class='flex items-start '>
                <li class='text-xs md:text-sm font-medium mx-0.5 text-gray-700'>${finalBookingInformation?.contactAndAddress?.Address.barangay.name}, 
                ${finalBookingInformation?.contactAndAddress?.Address.municipality.name}, ${finalBookingInformation?.contactAndAddress?.Address.province.name}, ${finalBookingInformation?.contactAndAddress?.Address.region.name}</li>
            </ul>
            <span class='text-xs md:text-sm text-gray-700'>${finalBookingInformation?.contactAndAddress?.Address.street}</span>
            </div>
        </div>
        <div class='p-3 bg-white w-full border rounded-sm shadow-sm'>
        <ul class='grid grid-cols-2 gap-0 gap-x-5'>
                <div class={'font-medium text-xs md:text-sm text-gray-600 '}>Total Service Amount:</div>
                <div class={'font-normal pl-2 text-xs md:text-sm text-gray-600 '}>₱${finalBookingInformation?.service?.price}</div>
                <div class={'font-medium text-xs md:text-sm text-gray-600 '}>Service Fee:</div>
                <div class={'font-normal pl-2 text-xs md:text-sm text-gray-600 '}>₱${finalBookingInformation?.service_fee}</div>
                <div class={'font-medium text-xs md:text-sm text-gray-600 '}>Booking Fee:</div>
                <div class={'font-normal pl-2 text-xs md:text-sm text-gray-600 '}>₱${finalBookingInformation?.booking_fee}</div>
                <div class={'font-medium text-xs md:text-sm text-gray-600 '}>Total amount to pay:</div>
                <div class={'font-normal pl-2 text-xs md:text-sm text-red-500 border-t-1 border-gray-700 '}>₱${finalBookingInformation?.net_Amount}</div>
        </ul>
        </div>
    </div>
        `

        const result = await http.post('sendBookingReceipt', {email : userInformation.email, html : htmlContent})
        const receiver = service.owner._id
        // console.log(finalBookingInformation)
        if(finalBookingInformation !== null)
        {   
            try {
                const result = await http.post('addBooking', finalBookingInformation)
                if(result.status === 200)
                {
                    socket.emit('New_Notification', {notification : 'New_Booking', receiver : receiver}); //notify user theres a new booking
                    await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
                    subID: receiver,
                    appId: 19825,
                    appToken: 'bY9Ipmkm8sFKbmXf7T0zNN',
                    title: `New booking`,
                    message: 'You have a new booking'
                    });
                    notifyUser(result.data._id, receiver) //insert notification in the database
                    
                }
            } catch (error) {
                console.log(error)
            }
           

        }
    }

    const notifyUser = async (booking_id, receiver) => {

        try {
            const notify = await http.post('addNotification', {
                notification_type : "New_Booking", 
                createdAt : new Date(),
                content : "You have a new Booking!", 
                client : userInformation._id,
                notif_to : receiver,
                reference_id : booking_id
            })
            console.log(notify.data)
            setPaid(true)
            setLoadingGcashPayment(false)
            setShowPaymentModal(false)
            navigation.navigate("ClientBookings")
        } catch (error) {
            console.error(error.response)
        }
    }

    useEffect(()=>{
        const booking_fee = service.price <= 200 ? 15 : service.price <= 500 ? 25 : service.price <= 1000 ? 35 : 45
        const service_fee = bookingInformation.schedule?.serviceOption === "Home Service" ? computeDistance() : 0
        const data = {
            shop : service._id,
            service : bookingInformation.service,
            schedule : bookingInformation.schedule,
            contactAndAddress : bookingInformation.contactAndAddress,
            createdAt : new Date(),
            booking_id : generateBookingId(),
            client : userInformation._id,
            service_fee : service_fee,
            booking_fee,
            net_Amount : Number(bookingInformation.service.price) + Number(service_fee) + Number(booking_fee)
          }
          setFinalBookingInformation(data)
    },[])


  return (
    <View className="flex-1  bg-white relative flex-col">
    {/* Gcash payment and backdrop */}
    <View style={{backgroundColor : "rgba(0,0,0,0.6)"}} className={`absolute ${showPaymentModal ? "" : "hidden"} w-full h-full z-20 bg-black`}></View>
    <View style={{ transform: [{ translateY: showPaymentModal ? 0 : windowHeight }]}} className="absolute flex-col justify-start delay-300 transition-all w-full h-[70vh] z-20 origin-top bg-white shadow-md bottom-0">
    {/* Header */}
    <View className="flex-row items-center justify-center relative py-3 px-3">
    <TouchableOpacity  className="absolute left-3" onPress={()=>{setShowPaymentModal(false)}}>
    <FontAwesome name="angle-left" color="skyblue" size={30} />
    </TouchableOpacity>
    <Text>Gcash</Text>
    </View>
    {/* Body */}
    <View className="flex-1">
        <View className="w-full h-[40%] bg-blue-500 relative flex-col">
            {/* Gcash icon */}
            <View className="w-full flex-row justify-center">
                <Image source={require('./Images/gcash_active.png')} style={{width: 130, height: 90, objectFit : "contain",}} />
            </View>
            {/* Main Input */}
            <View style={{shadowColor: "#000", shadowOffset: {width: 0,height: 2,},shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5,}} className="w-[70%] h-[300px] px-5 flex-col mx-auto bg-white relative rounded-md z-30">
                <Text className="py-2 text-center text-blue-500 font-semibold">KANOAH</Text>
                    <Text className="font-semibold text-gray-600">PAY WITH</Text>
                        <View className="w-full flex-row justify-between mt-2">
                            <Text className="text-gray-500 font-medium">Gcash</Text>
                            <Text className="text-gray-500 font-medium">PHP 3,141.00</Text>
                        </View>
                        <View className="w-full flex-row justify-between mt-0">
                            <Text className="text-gray-500 font-medium"></Text>
                            <Text className="text-gray-500 font-medium">Available Balance</Text>
                        </View>
            <Text className="font-semibold text-gray-600 mt-5">YOU ARE ABOUT TO PAY</Text>
            <View className="py-1 w-full flex-row justify-between mt-5 border-b-[1px] border-gray-200">
            <Text className="font-medium text-gray-300">Amount</Text>
            <Text className="font-medium text-gray-300">PHP {finalBookingInformation?.net_Amount}</Text>
            </View>
            <View className="py-1 w-full flex-row justify-between mt-2 ">
            <Text className="font-medium text-gray-500">Total</Text>
            <Text className="font-medium text-gray-500">PHP {finalBookingInformation?.net_Amount}</Text>
            </View>
            <TouchableOpacity onPress={()=>handlePay()} className="absolute bottom-3 bg-blue-500 rounded-full w-[90%] py-2 flex-1 left-[13%]">
                {
                    loadingGcashPayment && !paid ? <ActivityIndicator color='white' />
                    :
                    loadingGcashPayment && paid
                    ?
                    ""
                    :
                    <Text className="text-white font-medium text-center">PAY PHP {finalBookingInformation?.net_Amount}</Text>
                }
                
                
            </TouchableOpacity>
            </View>
        </View>
    </View>
    </View>
    
    <ScrollView>
        {/* Reminder */}
        <View className=' w-full p-1 bg-white'>
            <Text className='text-center text-sm'>Cancelation policy</Text>
            <Text className='text-xs text-center text-gray-700'>{service?.cancelationPolicy?.cancelPolicy}</Text>
            <Text className='text-xs text-center text-gray-700'>This policy is provided by the service provider.</Text>
        </View>
        <Text className="font-semibold text-xl px-2 py-3 bg-gray-50 rounded-sm text-gray-600 text-center">{service.basicInformation.ServiceTitle}</Text>
      {/* Top Part, service information and booking */}
      <View className="flex-col">
        <Text className="font-medium text-lg px-2 text-blue-500 mt-5">Booking details</Text>
        {/* Service */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Service</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.service.selectedService}</Text>
        </View>
        {/* Variant */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Variant</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.service.selectedVariant !== "" ? bookingInformation.service.selectedVariant.type : "No variant"}</Text>
        </View>
        {/* Service Option */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Service Option</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.schedule.serviceOption}</Text>
        </View>
        {/* Schedule */}
        <View className="flex-row justify-between items-center px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Schedule</Text>
        <View className="flex-col">
        <Text className="font-medium text-gray-900">{new Date(bookingInformation.schedule.bookingDate).toLocaleDateString('EN-US', {
            month : 'long',
            day : '2-digit',
            year : 'numeric'
        })}</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.schedule.timeSpan[0] + " - " + bookingInformation.schedule.timeSpan[1]}</Text>
        </View>
        </View>
      </View>

      {/* Client information */}
      <View className="flex-col">
        <Text className="font-medium text-lg px-2 text-blue-500 mt-5">Client details</Text>
        {/* Name */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Name</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.contactAndAddress.firstname + " " + bookingInformation.contactAndAddress.lastname}</Text>
        </View>
        {/* Email */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Email</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.contactAndAddress.email}</Text>
        </View>
        {/* Contact */}
        <View className="flex-row justify-between px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Contact</Text>
        <Text className="font-medium text-gray-900">+63{bookingInformation.contactAndAddress.contact}</Text>
        </View>
        {/* Address */}
        <View className="flex-col px-2 py-3 border-b-[1px] border-gray-100">
        <Text className="font-medium text-gray-600">Address</Text>
        <Text className="font-medium text-gray-900">{
        bookingInformation.contactAndAddress.Address.barangay.name + " " +
        bookingInformation.contactAndAddress.Address.municipality.name.slice(0,1) + bookingInformation.contactAndAddress.Address.municipality.name.slice(1).toLowerCase() + " " +
        bookingInformation.contactAndAddress.Address.province.name.slice(0,1) + bookingInformation.contactAndAddress.Address.province.name.slice(1).toLowerCase() + " " +
        bookingInformation.contactAndAddress.Address.region.name
        }</Text>
        <Text className="font-medium text-gray-900">{bookingInformation.contactAndAddress.Address.street}</Text>
        </View>

        {/* Account */}
        <View className="flex-col px-2 py-3 ">
        <Text className="font-medium text-lg px-2 text-blue-500 mt-5">Payment</Text>
        <View className="flex-row justify-between px-2 py-3  border-gray-100">
        <Text className="font-medium text-gray-600">Service Amount</Text>
        <Text className="font-medium text-gray-900">₱{bookingInformation.service.price}</Text>
        </View>
        <View className="flex-row justify-between px-2 py-3  border-gray-100">
        <Text className="font-medium text-gray-600">Service Fee</Text>
        <Text className="font-medium text-gray-900">₱{finalBookingInformation?.service_fee}</Text>
        </View>
        <View className="flex-row justify-between border-b-[1px] px-2 py-3  border-gray-100">
        <Text className="font-medium text-gray-600">Booking Fee</Text>
        <Text className="font-medium text-gray-900">₱{finalBookingInformation?.booking_fee}</Text>
        </View>
        <View className="flex-row justify-between px-2 py-3  ">
        <Text className="font-medium text-gray-600">Total amount to pay</Text>
        <Text className="font-medium text-green-500">₱{finalBookingInformation?.net_Amount}</Text>
        </View>
        </View>

        <View className="w-full">
        <TouchableOpacity onPress={()=>handleOpenGcashPayment()} className="w-full bg-themeOrange py-4 rounded-md">
            <Text className="text-center text-white">Submit</Text>
        </TouchableOpacity>
        </View>
        
      </View>
      </ScrollView>
    </View>
  )
}


export default BookConfirmation