import { View, Text, Dimensions, FlatList, TouchableOpacity, TextInput, Modal, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import * as SecureStore from 'expo-secure-store'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import ImageViewer from 'react-native-image-zoom-viewer';
import http from '../../../http'
import { Icon } from 'react-native-elements'
import chatStore from './ChatStore'
import socketStore from '../../../socketStore'
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Image } from '@rneui/themed'

const ConversationWindow = ({route, navigation}) => {
    const currentDate = new Date();
    const thisDate = new Date().toLocaleDateString('en-CA');
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeSent = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    const notificationMessage = 'newMessage'
    const {socket, setSocket} = socketStore()
    const {userConversations, storeConversations} = chatStore()
    const navigation = useNavigation()
    const {serviceOwnerId, conversationId, userInformation} = route.params
    const [conversation, setConversation] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [messageInput, setMessageinput] = useState('')
    const [conversationData, setConversationData] = useState({
        me : '',
        entity : '',
        serviceInquired : '',
        serviceId : '',
        headerTitle : '',
        headerImage : '',
        conversationId : '',
        participants : []
    })
    const [imageSizes, setImageSizes] = useState([])
    const flatListRef = useRef(null);
    const [selectedImages, setSelectedImages] = useState(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [showDropdown, setShowDropdown] = useState(false);

    // Triggers when there is a new message
    useEffect(()=>{
        socket?.on('message', (message)=>{
        if(message == 'newMessage')
          {
            getConversation()
          }
        })
      
        return () => {
          // Clean up the socket event listeners when the component unmounts
          socket?.off('message');
        };
    },[socket])

    // Function to scroll FlatList to the bottom
    const scrollToBottom = () => {
    if(conversation !== null && conversation.length !== 0)
    {
        flatListRef.current.scrollToEnd({ animated: true });
    }
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

    // Sets the header
    useEffect(()=>{
        if(conversation !== null)
        {
            navigation.setOptions({
                header : () => {
                    return (
                        (
                            <View style={{shadowColor: "#000",shadowOffset: {width: 0,height: 2,},shadowOpacity: 0.25,shadowRadius: 3.84,   elevation: 2,}} className="py-4 px-2 flex-row items-center bg-white shadow-2xl relative">
                                <TouchableOpacity onPress={()=>navigation.goBack()}>
                                    <Icon type='material-community' name='arrow-left' />
                                </TouchableOpacity>
                                <View className="flex-row flex-1">
                                    <View className="w-12 aspect-square rounded-full overflow-hidden mx-2">
                                        {conversationData.headerImage && <Image source={{ uri : conversationData.headerImage}} style={{width : "100%", height : "100%"}} className="rounded-full" />}
                                        {/* <RenderImage url={conversationData.headerImage} firstname={conversationData.entity.firstname} lastname={conversationData.entity.lastname} /> */}
                                    </View>
                                    <View className="flex-col flex-1">
                                    <Text numberOfLines={1} className="font-medium text-gray-800 text-base">{conversationData.headerTitle}</Text>
                                    {onlineUsers.some((user)=> user.username === conversationData.entity._id) ? <Text className="text-green-400">Online</Text> : <Text>Offline</Text>}
                                    </View>
                                </View>
                                <TouchableOpacity onPress={()=>setShowDropdown(!showDropdown)} className="w-[30] h-full flex-row items-center justify-center relative">
                                    <Icon type='material-community' name='dots-vertical' />
                                </TouchableOpacity>
                                 {/* More options */}
                                 {
                                showDropdown && 
                                <View className=" aspect-square bg-[#f9f9f9] absolute top-14 right-5 flex-col">
                                    <TouchableOpacity onPress={()=>navigation.navigate('ViewService', {serviceId : conversationData.serviceId})} className="px-2 py-3">
                                        <Text>View service</Text>
                                    </TouchableOpacity>
                                </View>
                                 }
                            </View>
                        )
                    )
                }
            })
        }
    },[conversationData, onlineUsers, socket, showDropdown])

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
                setConversationData({...conversationData, entity : entity, me : me, serviceInquired : serviceOwnerId, headerTitle : isReceiverOwner ? entity.firstname + " " + entity.lastname : convoFromZundax.chats[0].virtualServiceInquired.basicInformation.ServiceTitle, headerImage : isReceiverOwner ? entity.profileImage : convoFromZundax.chats[0].virtualServiceInquired.serviceProfileImage ,conversationId : convoFromZundax.chats[0].conversationId, participants : [me._id, entity._id], serviceId : convoFromZundax.chats[0].virtualServiceInquired._id})
                setConversation(convoFromZundax.chats)
            }
        }
        try {
            const messages = await http.get(`Mobile_getMessages/${conversationId}/${1000}/${serviceOwnerId}`, 
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
                setConversationData({...conversationData, entity : entity, me : me, serviceInquired : serviceOwnerId, headerTitle : isReceiverOwner ? entity.firstname + " " + entity.lastname : data[0].virtualServiceInquired.basicInformation.ServiceTitle, headerImage : isReceiverOwner ? entity.profileImage : data[0].virtualServiceInquired.serviceProfileImage ,conversationId : data[0].conversationId, participants : [me._id, entity._id],serviceId : data[0].virtualServiceInquired._id})
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
                conversationId : null, participants : [me, entity], serviceId : service._id
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
            scrollToBottom()
            axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: conversationData.entity,
            appId: 19825,
            appToken: 'bY9Ipmkm8sFKbmXf7T0zNN',
            title: `New message`,
            message: 'You have a new Message'
       });
        } catch (error) {
            console.log(error)
        }
    }

    const storeImagesForViewer = (convoId) => {
        const images = conversation.filter((convo) => convo.messageType === "image").map((image)=> ({url : image.messageContent.content, _id : image._id}))
        const index =  images.findIndex((convo) => convo._id === convoId)
        setSelectedImageIndex(index)
        setSelectedImages(images)
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

    const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true
        
      });
      let base64Img = `data:image/jpg;base64,${result.assets[0].base64}`
      const uri = result.assets[0].uri
      const dimension = await getSize(base64Img)
      const sendingId = Math.floor(Math.random() * 1000)

      const data = {
        sendingId : sendingId,
        conversationId : conversationData.conversationId,
        participants : conversationData.participants,
        readBy : userInformation?._id, // always the user who is in here first
        serviceInquired : conversationData.serviceInquired,
        createdAt : currentDate,
        messageType : "image",
        messageContent : 
        {
          sender : conversationData.me._id || conversationData.me,
          receiver: conversationData.entity._id || conversationData.entity,
          content: uri,
          size : dimension,
          date : thisDate,
          timestamp : timeSent
        }
      }
      setConversation([...conversation, data])
      uploadToCloudinary(base64Img, sendingId)
    
    }

    const uploadToCloudinary = async (base64Img, sendingId) => {
        let apiUrl = 'https://api.cloudinary.com/v1_1/dv9uw26ce/image/upload';

        let data = {
            "file": base64Img,
            "upload_preset": "kanoah_chat_image",
          }

          console.log("Sending")
          axios.post(apiUrl, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then(async (response) => {
              let imageUrl = response.data.secure_url;
              console.log("Sent")
              handleImageSend(imageUrl, sendingId)
            })
            .catch((error) => {
              console.log(error);
            });
    }  

    const handleImageSend = async (imageUrl, sendingId) => { 
        const dimension = await getSize(imageUrl)
        const data = {
            sendingId : sendingId,
            conversationId : conversationData.conversationId,
            participants : conversationData.participants,
            readBy : userInformation?._id, // always the user who is in here first
            serviceInquired : conversationData.serviceInquired,
            createdAt : currentDate,
            messageType : "image",
            messageContent : 
            {
              sender : conversationData.me._id || conversationData.me,
              receiver: conversationData.entity._id || conversationData.entity,
              content: imageUrl,
              size : dimension,
              date : thisDate,
              timestamp : timeSent
            }
        }
        try {
            const result = await http.post('Mobile_sendMessage', data)
            socket.emit('message', {notificationMessage, receiverName : conversationData.entity._id || conversationData.entity});
            axios.post(`https://app.nativenotify.com/api/indie/notification`, {
            subID: conversationData.entity,
            appId: 19825,
            appToken: 'bY9Ipmkm8sFKbmXf7T0zNN',
            title: `New message`,
            message: 'You have a new Message'
       });
            scrollToBottom()
        } catch (error) {
            console.log(error)
        }
    }

    // get and sets the image size of each image message
    const getSize = async (imageUrl) => {
        return new Promise((resolve, reject) => {
            Image.getSize(imageUrl, (width, height) => {
                resolve({width : width, height : height})
            }, reject)
        })
    }

    const groupedMessages = conversation !== null && conversation.reduce((groups, message) => {
            const date = new Date(message.createdAt).toDateString();
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(message);
            return groups;
    }, {});
          
    // Step 2: Convert grouped messages object to array for FlatList rendering
    const groupedData = Object.keys(groupedMessages).map((date) => ({
    date,
    messages: groupedMessages[date],
    }));
        

  return (
    <View className="flex-1 bg-white">
        <FlatList 
      ref={flatListRef}
      contentContainerStyle={{padding : 10, gap : 10, backgroundColor : 'white'}}
      data={groupedData}
      keyExtractor={(item, index) => index}
      renderItem={({item})=>(
        <View>
             <View className="flex-row items-center">
                <View className="flex-1 border-t-[0.5px] border-gray-200"></View>
                <Text className="mx-4 text-sm text-center my-2 text-gray-300 font-medium">
                  {item.date}
                </Text>
                <View className="flex-1 border-t-[0.5px] border-gray-200"></View>
                
              </View>
            {
                item.messages?.map((item, index)=>{
                    const me = item.messageContent.sender === userInformation?._id ? item.messageContent.sender : item.messageContent.receiver
                    const entity = item.messageContent.sender === userInformation?._id ? item.messageContent.receiver : item.messageContent.sender
                    const myMessage =  me === item.messageContent.sender
                    const aspectRatio = item.messageType === "image" && item.messageContent.size.width / item.messageContent.size.height;
                    const calculatedHeight = item.messageType === "image" && 200 / aspectRatio;
                    return (
                        <View key={index} className={`w-full flex-col ${myMessage ? "items-end" : "items-start"} my-2`}>
                            <View className={`gap-x-1 max-w-[70%]  ${myMessage ? " flex-row-reverse" : "flex-row"} items-end `}>
                               {!myMessage &&  
                               <View className="w-6  h-6 rounded-full overflow-hidden">
                                   {conversationData.headerImage && <Image source={{uri : conversationData.headerImage }} style={{width : "100%", height : "100%"}} /> }
                                </View>
                                }
                                {
                                    item.messageType === "text" ?
                                    <Text className={`${myMessage ? "text-white bg-blue-500" : "text-gray-700 bg-gray-200 "} p-2 rounded-md`}>{item.messageContent.content}</Text>
                                    :
                                    <View style={{width : 200, height : calculatedHeight}} className={` p-1 `}>
                                    <TouchableOpacity onPress={()=>storeImagesForViewer(item._id)} className=" ">
                                    <Image source={{uri : item.messageContent.content}} resizeMode='cover' style={{width : "100%", height : "100%", borderRadius : 10}} />
                                    </TouchableOpacity>
                                    </View>
                                }
                            </View>
                            <Text className="text-xs text-gray-500 pl-[30]">{item.messageContent.timestamp}</Text>
                        </View>
                    )
                })
            }
        </View>
      )}
      />

      {/* Message Input */}
      <View className=" flex-row items-center py-2 px-2  m-3 border bg-gray-50 border-gray-100 rounded-full">
        <TouchableOpacity onPress={()=>pickImage()} className="px-2 py-2  border-r-[1px] border-gray-300">
        <Icon type='material-community' name='image-outline' color='gray' />
        </TouchableOpacity>
        <TextInput value={messageInput} onChangeText={setMessageinput} placeholder='Message...' placeholderTextColor='lightgray' className=" flex-1 text-base pl-2 " />
        <TouchableOpacity disabled={messageInput === ""} onPress={()=>{sendMessage("text")}} className="bg-blue-400 flex-row rounded-full items-center px-2 py-2 justify-center">
            <Icon className=" translate-x-0.5 " type='material-community' name='send' color="white" />
        </TouchableOpacity>
      </View>

      {/* View image */}
      <Modal transparent statusBarTranslucent visible={selectedImages !== null}>
        <View style={{backgroundColor : 'black', paddingTop : StatusBar.currentHeight}} className="flex-1 flex-col px-2">
            {/* Navigation */}
            <View className="flex-row items-center py-4 px-3">
                <TouchableOpacity onPress={()=>setSelectedImages(null)}>
                <Icon type='material-community' name='arrow-left' color='white' size={30} />
                </TouchableOpacity>
            </View>
            {/* Image */}
            <View className="flex-1 bg-black">
                <ImageViewer index={selectedImageIndex} imageUrls={selectedImages} />
                {/* <Image source={{uri : selectedImage}} containerStyle={{borderRadius : 10, overflow : 'hidden'}} style={{width : "100%", height : "100%", objectFit : 'contain', borderRadius : 10}} /> */}
            </View>
            {/* Bottom spacer */}
            <View className="h-[70] w-full">

            </View>
        </View>
      </Modal>
    </View>
  )
}

export default ConversationWindow