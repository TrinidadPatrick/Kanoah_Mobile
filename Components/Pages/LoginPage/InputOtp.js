import { View, Text, TextInput } from 'react-native'
import React, {useRef, useState, useEffect} from 'react'
import { Button } from 'react-native-elements';
import axios from 'axios';
import http from '../../../http';

const InputOtp = ({ route, navigation }) => {
    const { email } = route.params;
    const inputRefs = Array(6).fill(0).map(() => useRef(null));
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(9)
    const [startTimer, setStartTimer] = useState(true)
    const [loading, setIsLoading] = useState(false)
    const [invalidOtp, setInvalidOtp] = useState(false)

    const handleInput = (index, value) => {
    // Move to the next input if a character is entered
    if (value.length === 1) {
        if (index < 6    - 1 && inputRefs[index + 1].current) {
          inputRefs[index + 1].current.focus();
        }
      } else if (value.length <= 1) {
        // Move to the previous input if the character is deleted or blank
        if (index > 0 && inputRefs[index - 1].current) {
          inputRefs[index - 1].current.focus();
        }
      }
  };

  // FOr 10 seconds Countdown
  useEffect(()=>{
    if(startTimer == true){
    const countdown = setInterval(()=>{  
    setTimer(timer - 1)
    if(timer < 2){clearInterval(countdown)}
    }, 1000)
    return ()=>{clearInterval(countdown)}      
    }        
    }, [startTimer, timer])

    useEffect(()=>{
        if(timer <1){
        setStartTimer(false)
        setTimer(10)
        }
    }, [timer])

    const sendOtp = async () => {
        try {
            const result = await axios.post("https://kanoah.onrender.com/api/forgotPassword", {email})
            
            if(result.data.message === "Found")
            {
                navigation.navigate('InputOtp', {
                    email
                })
            }
           
        } catch (error) {
            console.log(error)
        } finally {
            setStartTimer(true)
        }
    }

     // Submit Code for new Password
     const submitCode = async () => {
        setIsLoading(true)
        if(otp != "")
        {
            try {
                const result = await http.post("forgotPassword/sendOtp", {code : otp.join(''), email})
                if(result.data.status === 'verified')
                {
                    navigation.navigate('NewPassword', {
                        email
                    })
                }
                else
                {
                    setInvalidOtp(true)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
            
        }
        
    }


  return (
    <View className=" w-full h-full py-10 bg-white">
      <View className="w-[90%] mx-auto flex flex-col items-center">
            <View  className="w-[100%]  p-2 mx-auto flex flex-col items-center">
            <Text className="text-2xl font-semibold">Enter OTP</Text>
            <Text className="text-base">We've sent a verification code to your email </Text>
            <Text className="text-base">{email}</Text>
            </View>
            <View  className={`w-[100%] bg-red-100 p-2 mx-auto ${invalidOtp ? "flex" : "hidden"} flex-col items-center`}>
            <Text className="text-base text-red-500">Invalid OTP</Text>
            </View>

            <View className="w-full flex flex-row justify-between mt-10">
            {Array.from({ length: 6 }, (_, index) => (
            <TextInput
            className="border-b-[1px] text-xl w-[30px] text-center font-bold"
            key={index}
            onChangeText={(value) => {handleInput(index, value);
            setOtp((prevOtp) => {
            const newOtp = [...prevOtp];
            newOtp[index] = value;
            return newOtp;
            });
            }}
            keyboardType="numeric"
            maxLength={1}
            ref={inputRefs[index]}
            />
            ))}
            </View>

            <View className="w-full mt-8">
            <Button onPress={()=>submitCode()} disabled={otp.join('').length != 6} title={`Next`} buttonStyle={{backgroundColor : "#EB6B23", width : "100"}} />
            {
                timer === 10 ?
                <Text onPress={()=>sendOtp()} className="text-blue-500 mt-1">Resend code</Text> :
                <Text className="mt-1">Please wait {timer} seconds to resend code</Text>
            }         
            </View>
      </View>

    </View>
  )
}

export default InputOtp