import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import http from '../../../http'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import socketStore from '../../../socketStore'


const ContactLists = ({userInformation, isLoggedIn, setIsLoggedIn}) => {
    const {socket, setSocket} = socketStore()
    const navigation = useNavigation()
    const [contactList, setContactList] = useState(null)

    // Triggers when there is a new message
    useEffect(()=>{
            socket?.on('message', (message)=>{
            console.log(message)
            if(message == 'newMessage')
              {
                getAllContacts()
              }
            })
          
            return () => {
              // Clean up the socket event listeners when the component unmounts
              socket?.off('message');
            };
    },[socket])


    // Redirect to login page if not logged in
    useFocusEffect(
        useCallback(()=>{
            if(isLoggedIn === false)
            {
                setIsLoggedIn(null)
                navigation.navigate("Login")
            }
            return () => {
            
            }
        },[isLoggedIn])

    )

    const countUnreadNotifs = async () => {
        const accessToken = await SecureStore.getItemAsync('accessToken')
        try {
          const result = await http.get('Mobile_countUnreadMessages', {
            headers : {
              'Authorization' : `Bearer ${accessToken}`
            }
          })
          return result.data
        } catch (error) {
          console.log(error)
        }
      }
    
    const getAccessToken = async () => {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            return accessToken;
          } catch (error) {
            console.error('Error retrieving access token:', error);
            return null;
          }
    }

    // Gets all the contacts of the user
    const getAllContacts = async () => {
        try {
            const accessToken = await getAccessToken()
            const result = await http.get(`Mobile_retrieveContacts/${userInformation._id}`, {
                headers : {
                    "Authorization" : `Bearer ${accessToken}`
                }
            })
            setContactList(result.data)
            const chatCount = await countUnreadNotifs()
            navigation.setOptions({
                tabBarBadge : chatCount > 0 ? chatCount : null
            })
        } catch (error) {
            console.log(error)
        }
    }

    // Trigers the getAllContacts
    useFocusEffect(
        useCallback(()=>{
            if(isLoggedIn === true && userInformation !== null)
            {
                getAllContacts()
            }
        },[isLoggedIn, userInformation])
    )

    const RenderImage = ({url, firstname, lastname}) => {
        const baseUrl = url.split(".")[0]

        if(baseUrl === "https://ui-avatars")
        {
            return (
                <View className="w-full h-full flex-row justify-center items-center rounded-full bg-blue-400 ">
                    <Text className="text-2xl text-white">{firstname.charAt(0)}</Text>
                    <Text className="text-2xl text-white">{lastname.charAt(0)}</Text>
                </View>
            )
        }

        return (
            <Image source={{ uri : url}} style={{width : "100%", height : "100%"}} className="rounded-full" />
        )
    }

    const handleReadMessage = async (conversationId) => {
        const readMessage = await http.put('handleReadMessage', {conversationId, myId : userInformation?._id})
        const chatCount = await countUnreadNotifs()
        navigation.setOptions({
            tabBarBadge : chatCount > 0 ? chatCount : null
        })
    }

    
  return (
    <View className="flex-1 bg-white ">
        <FlatList
        data={contactList}
        contentContainerStyle={{gap : 10}}
        keyExtractor={(item) => item._id}
        renderItem={({item})=>{
            const sender = item.participants.find((participant) => participant._id !== userInformation._id)
            const receiver = item.participants.find((participant) => participant._id === userInformation._id)
            const isReceiverOwner = item.virtualServiceInquired.userId === receiver._id //Check if the conversation is between the reciever owner
            const dateNow = new Date().toLocaleDateString("EN-US", {month : 'short', day : '2-digit', year : 'numeric'})
            const messageDate = new Date(item.createdAt).toLocaleDateString("EN-US", {month : 'short', day : '2-digit', year : 'numeric'})
            return (
                <TouchableOpacity onPress={()=>{if(!item.readBy.includes(userInformation._id)){handleReadMessage(item.conversationId)};navigation.navigate("ConversationWindow", {
                    serviceOwnerId : item.virtualServiceInquired.owner,
                    conversationId : item.conversationId
                })}} className="w-full flex-row p-1 space-x-3   ">
                    {/* Image profile */}
                    <View className="image-container w-12 rounded-full overflow-hidden aspect-square ">
                        {
                            isReceiverOwner ? <RenderImage url={sender.profileImage} firstname={sender.firstname} lastname={sender.lastname} /> 
                            :
                            <Image source={{uri : item.virtualServiceInquired.serviceProfileImage}} style={{width : "100%", height : "100%", objectFit : "cover"}} className="origin-center" />
                        }
                    </View>
                    {/* title and initial message */}
                    <View className="flex-col flex-1 justify-evenly">
                        <View className="chat-title flex-row space-x-2 items-center">
                            <Text numberOfLines={1} className={` ${item.readBy.includes(userInformation._id) ? "font-medium" : "font-bold"}  text-base`}>{isReceiverOwner ? sender.firstname + " " + sender.lastname : item.virtualServiceInquired.basicInformation.ServiceTitle}</Text>
                            {
                                isReceiverOwner && <Icon type='material-community' name='store' size={20} />
                            }
                        </View>
                        <View className="chat-message flex-row">
                            {
                                item.messageType === "text" ? <Text numberOfLines={1} className={`${item.readBy.includes(userInformation._id) ? "font-normal" : "font-bold"} text-gray-600 text-sm`}>{receiver._id === item.messageContent.sender ? "You: " + item.messageContent.content : item.messageContent.content }</Text>
                                :
                                <Text numberOfLines={1} className="font-normal text-gray-600 text-sm">{receiver._id === item.messageContent.sender ? "You: Photo" : "Photo" }</Text>
                            }
                        </View>
                    </View>
                    <View className="px-0.5 flex-col justify-center">
                        {
                            dateNow === messageDate ? 
                            <Text className={` ${item.readBy.includes(userInformation._id) ? "font-normal text-gray-500" : "font-bold"} text-xs`}>{item.messageContent.timestamp}</Text>
                            :
                            <Text className={` ${item.readBy.includes(userInformation._id) ? "font-normal text-gray-500" : "font-bold"} text-xs`}>{messageDate}</Text>
                        }         
                    </View>
                </TouchableOpacity>
            )
        }}
        />
    </View>
  )
}

export default ContactLists