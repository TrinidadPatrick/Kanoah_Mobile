import { View, Text, BackHandler, FlatList, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import * as SecureStore from 'expo-secure-store'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import http from '../../../http'
import useInfo from '../../CustomHooks/UserInfoProvider'
import { Icon } from 'react-native-elements'
import chatStore from './ChatStore'
import socketStore from '../../../socketStore'
import { io } from 'socket.io-client'

const ConversationWindow = ({route}) => {
    const {socket, setSocket} = socketStore()
    const {userConversations, storeConversations} = chatStore()
    const navigation = useNavigation()
    const {userInformation} = useInfo()
    const {serviceOwnerId, conversationId} = route.params
    const [conversation, setConversation] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [messageInput, setMessageinput] = useState('')
    const [conversationData, setConversationData] = useState({
        me : '',
        entity : '',
        serviceInquired : '',
        headerTitle : '',
        headerImage : '',
        conversationId : '',
        participants : []
    })
    const flatListRef = useRef(null);

    // Triggers when there is a new message
    useEffect(()=>{
        socket?.on('message', (message)=>{
        console.log(message)
        if(message == 'newMessage')
          {
            getConversation()
          }
        })
      
        // return () => {
        //   // Clean up the socket event listeners when the component unmounts
        //   socket?.off('message');
        // };
    },[socket])

    // Function to scroll FlatList to the bottom
    const scrollToBottom = () => {
    // flatListRef.current.scrollToEnd({ animated: true });
    };

    useEffect(()=>{
        scrollToBottom()
    },[conversation])

    useEffect(()=>{
        if(userInformation !== null)
        {
            getConversation()
            socket?.on('onlineUsers', (onlineUsers)=>{
                setOnlineUsers(onlineUsers)
            }) 
            socket?.emit('loggedUser', userInformation?._id)
            
            return () => {
                socket?.emit('disconnectUser', userInformation?._id)
            }
        }
    },[socket, userInformation])

    useEffect(()=>{
        if(conversation !== null)
        {
            navigation.setOptions({
                header : () => {
                    // const sender = conversation[0].participants.find((participant) => participant._id !== userInformation._id)
                    // const receiver = conversation[0].participants.find((participant) => participant._id === userInformation._id)
                    // const isReceiverOwner = conversation[0].virtualServiceInquired.userId === receiver._id //Check if the conversation is between the reciever owner
                    return (
                        (
                            <View style={{shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            
                            elevation: 5,}} className="py-4 px-2 flex-row items-center bg-white shadow-2xl">
                                <TouchableOpacity onPress={()=>navigation.goBack()}>
                                    <Icon type='material-community' name='arrow-left' />
                                </TouchableOpacity>
                                <View className="flex-row">
                                    <View className="w-12 aspect-square rounded-full overflow-hidden mx-2">
                                        <RenderImage url={conversationData.headerImage} firstname={conversationData.entity.firstname} lastname={conversationData.entity.lastname} />
                                    </View>
                                    <View className="flex-col">
                                    <Text numberOfLines={1} className="font-medium text-gray-800 text-base">{conversationData.headerTitle}</Text>
                                    {onlineUsers.some((user)=> user.username === conversationData.entity._id) ? <Text className="text-green-400">Online</Text> : <Text>Offline</Text>}
                                    </View>
                                </View>
                            </View>
                        )
                    )
                }
            })
        }
    },[conversationData, onlineUsers, socket])

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

    const getAccessToken = async () => {
        const accessToken = await SecureStore.getItemAsync("accessToken")

        return accessToken
    }

    
    const getConversation = async () => {
        const accessToken = await getAccessToken()
        // Only run this if the message is open via contact List
        if(conversationId !== null)
        {
            const convoFromZundax = userConversations.find((convo) => convo.conversationId === conversationId)
            if(convoFromZundax)
            {
                const entity = convoFromZundax.chats[0].participants.find((participant) => participant._id !== userInformation._id) // the other participant
                const me = convoFromZundax.chats[0].participants.find((participant) => participant._id === userInformation._id) // me
                const isReceiverOwner = convoFromZundax.chats[0].virtualServiceInquired.userId === me._id
                setConversationData({...conversationData, entity : entity, me : me, serviceInquired : serviceOwnerId, headerTitle : isReceiverOwner ? entity.firstname + " " + entity.lastname : convoFromZundax.chats[0].virtualServiceInquired.basicInformation.ServiceTitle, headerImage : isReceiverOwner ? entity.profileImage : convoFromZundax.chats[0].virtualServiceInquired.serviceProfileImage ,conversationId : convoFromZundax.chats[0].conversationId, participants : [me._id, entity._id]})
                setConversation(convoFromZundax.chats)
            }
        }
        try {
            const messages = await http.get(`Mobile_getMessages/${conversationId}/${10}/${serviceOwnerId}`, 
            {
                headers : {
                    "Authorization" : `Bearer ${accessToken}`
                }
            }
            )
            const data = messages.data.result
            if(data.length !== 0) // Thid typically means there is an existing conversation and the conversation is open via contact list
            {
                setConversation(data)
                const entity = data[0].participants.find((participant) => participant._id !== userInformation._id) // the other participant
                const me = data[0].participants.find((participant) => participant._id === userInformation._id) // me
                const isReceiverOwner = data[0].virtualServiceInquired.userId === me._id
                setConversationData({...conversationData, entity : entity, me : me, serviceInquired : serviceOwnerId, headerTitle : isReceiverOwner ? entity.firstname + " " + entity.lastname : data[0].virtualServiceInquired.basicInformation.ServiceTitle, headerImage : isReceiverOwner ? entity.profileImage : data[0].virtualServiceInquired.serviceProfileImage ,conversationId : data[0].conversationId, participants : [me._id, entity._id]})
                scrollToBottom()
                storeMessages(data, data[0].conversationId)
            }
            else //this means this is a new conversation so the header information is always the service details
            {
                const receiver = await http.get(`getReceiver/${serviceOwnerId}`)
                const service = await http.get(`getServiceFromChat/${serviceOwnerId}`)
                setConversation([])
                const entity = receiver.data._id
                const me = userInformation?._id
                setConversationData({...conversationData, entity : entity, me : me, serviceInquired : serviceOwnerId, headerTitle : service.data.basicInformation.ServiceTitle, headerImage : service.data.serviceProfileImage, 
                conversationId : null, participants : [me, entity]
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const sendMessage = async (type) => {
        const currentDate = new Date();
        const thisDate = new Date().toLocaleDateString('en-CA');
        let hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const timeSent = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
        const notificationMessage = 'newMessage'
        const data = {
            sendingId : Math.floor(Math.random() * 1000),
            conversationId : conversationData.conversationId,
            participants : conversationData.participants,
            readBy : userInformation?._id, // always the user who is in here first
            serviceInquired : conversationData.serviceInquired,
            createdAt : currentDate,
            messageType : type,
            messageContent : 
            {
              sender : conversationData.me._id || conversationData.me,
              receiver: conversationData.entity._id || conversationData.entity,
              content: messageInput,
              date : thisDate,
              timestamp : timeSent
            }
        }
        setConversation([...conversation, data])
        setMessageinput("")
        try {
            const result = await http.post('Mobile_sendMessage', data)
            socket.emit('message', {notificationMessage, receiverName : conversationData.entity._id || conversationData.entity});
        } catch (error) {
            console.log(error)
        }
    }

    // Store messages in zustand
    const storeMessages = (conversationToStore, conversationId) => {
        if(conversationId != null)
        {
            const newConversation = [...userConversations]
            const index = newConversation.findIndex((convo) => convo.conversationId === conversationId)
            if(index === -1)
            {
                newConversation.push({conversationId : conversationId, chats : conversationToStore})
                storeConversations(newConversation)
            }
            else
            {
                newConversation.splice(index, 1, {conversationId : conversationId, chats : conversationToStore})
                storeConversations(newConversation)
            }
        }
    }



  return (
    <View className="flex-1 bg-white">
      <FlatList 
      ref={flatListRef}
      contentContainerStyle={{padding : 10, gap : 10, backgroundColor : 'white'}}
      data={conversation}
      keyExtractor={(item, index) => index}
      renderItem={({item})=>{
            const me = item.messageContent.sender === userInformation?._id ? item.messageContent.sender : item.messageContent.receiver
            const entity = item.messageContent.sender === userInformation?._id ? item.messageContent.receiver : item.messageContent.sender
            // const sender = item.participants.find((participant) => participant._id !== userInformation._id)
            // const receiver = item.participants.find((participant) => participant._id === userInformation._id)
            const myMessage =  me === item.messageContent.sender
            const senderMessage =  entity === item.messageContent.receiver
            return (
                <View className={`w-full flex-col ${myMessage ? "items-end" : "items-start"} `}>
                    <View className={`${myMessage ? "bg-blue-500" : "bg-gray-200"} max-w-[70%] p-2 rounded-md`}>
                        <Text className={`${myMessage ? "text-white" : "text-gray-700"}`}>{item.messageContent.content}</Text>
                    </View>
                    <Text className="text-xs">{item.messageContent.timestamp}</Text>
                </View>
            )
      }}
      />

      {/* Message Input */}
      <View className=" flex-row items-center py-2 px-2  m-3 border bg-gray-50 border-gray-100 rounded-full">
        <TextInput value={messageInput} onChangeText={setMessageinput} placeholder='Message...' placeholderTextColor='lightgray' className=" flex-1 text-base " />
        <TouchableOpacity onPress={()=>{sendMessage("text")}} className="bg-blue-400 flex-row rounded-full items-center px-2 py-2 justify-center">
            <Icon className=" translate-x-0.5 " type='material-community' name='send' color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ConversationWindow