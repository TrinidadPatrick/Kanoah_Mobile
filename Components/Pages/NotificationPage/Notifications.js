import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import useInfo from '../../CustomHooks/UserInfoProvider';
import { Rating } from '@kolking/react-native-rating';
import http from '../../../http'
import * as SecureStore from 'expo-secure-store'
import { Icon } from 'react-native-elements'
import { Image, BottomSheet, ListItem} from '@rneui/themed';
import authStore from '../../../Stores/AuthState';

const Notifications = ({navigation}) => {
  const {authState, setAuthState} = authStore()
    const {isLoggedIn} = useInfo()
    const [notifications, setNotifications] = useState(null)
    const [openMoreOption, setOpenMoreOption] = useState(false)
    const [selectedNotif, setSelectedNotif] = useState(null)
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [noNotifs, setNoNotifs] = useState(false)

    useFocusEffect(
      useCallback(()=>{
        if(authState === "loggedOut")
        {
          setNotifications([])
          navigation.navigate("Login")
        }
      },[authState])
    )

    const getAccessToken = async () => {
        const accessToken = await SecureStore.getItemAsync("accessToken")
        return accessToken
    }

    const getNotifications = async () => {
        try {
            const accessToken = await getAccessToken()
          const result = await http.get(`Mobile_getNotifications?page=${page}`, {
            headers : { 'Authorization' : `Bearer ${accessToken}`}
          })
          if(result.data.length !== 0)
          {
            setNotifications(result.data)
            return
          }
          setNoNotifs(true)
        } catch (error) {
          console.error(error)
        }
    }

    useFocusEffect(
      useCallback(()=>{
        if(authState === "loggedIn")
      {
        getNotifications()
      }

        return () => {
        
        }
      },[authState])
      
    )
    
    // useEffect(()=>{
    //   if(authState === "loggedIn")
    //   {
    //     getNotifications()
    //   }
    // },[authState])

    const loadMoreData = async () => {
        const nextPage = page + 1

        setTimeout(async() => {
            if(!isLoadingMore)
            {
                try {
                    setIsLoadingMore(true);
                    const accessToken = await getAccessToken()
                    const response = await http.get(`Mobile_getNotifications?page=${nextPage}`, {
                        headers : {"Authorization" : `Bearer ${accessToken}`}
                    });
                    setNotifications([...notifications, ...response.data]);
                    setPage(nextPage);
                    setIsLoadingMore(false);
                  } catch (error) {
                    console.error('Error loading more notifications:', error);
                  }
            }
          }, 1000); // Simulated loading delay
    }

    const countUnreadNotifs = async () => {
      try {
        const accessToken = await getAccessToken()
         const unreadCounts = await http.get('Mobile_countUnreadNotifs', {
          headers : {"Authorization" : `Bearer ${accessToken}`}
         })
        return unreadCounts.data
      } catch (error) {
        console.log(error)
      }
    }

    const markAsRead = async (notification_id, notif_to, notification_type) => {
      const newNotifications = [...notifications]
      const index = newNotifications.findIndex((notif) => notif._id === notification_id)
      newNotifications[index].isRead = true
      setNotifications(newNotifications)
  
      setOpenMoreOption(false)
      setSelectedNotif(null)
      try {
        const accessToken = await getAccessToken()
        const result = await http.patch('Mobile_markAsRead',{notification_id, notif_to}, {
          headers : {"Authorization" : `Bearer ${accessToken}`}
        })
        const countUnreadNotif = await countUnreadNotifs()
        navigation.setOptions({
          tabBarBadge : countUnreadNotif > 0 ? countUnreadNotif : null
         })
      } catch (error) {
        console.error(error)
      }
    }

    const markAllAsRead = async () => {
      const instance = [...notifications]
       instance.map((notifs) => {
         notifs.isRead = true
       })
       setNotifications(instance)
   
       try {
        const accessToken = await getAccessToken()
         const result = await http.patch('Mobile_markAllAsRead',"",  {
          headers : {"Authorization" : `Bearer ${accessToken}`}
         })
         const countUnreadNotif = await countUnreadNotifs()
          navigation.setOptions({
            tabBarBadge : countUnreadNotif > 0 ? countUnreadNotif : null
          })
       } catch (error) {
         console.error(error)
       }
     }

    const handleRefresh = async () => {
      setRefreshing(true); // Start refreshing
      await getNotifications()
      const countUnreadNotif = await countUnreadNotifs()
      navigation.setOptions({
        tabBarBadge : countUnreadNotif > 0 ? countUnreadNotif : null
       })
      setRefreshing(false);
    };

    const deleteNotif = async (notifId) => {
      // Mobile_deleteNotif
      try {
        const accessToken = await getAccessToken()
          const result = await http.delete(`Mobile_deleteNotif/${notifId}`, {
            headers : {
              "Authorization" : `Bearer ${accessToken}`
            }
          })
          setSelectedNotif(null)
          setOpenMoreOption(false)
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <View className="bg-white flex-1 flex-col px-2">
      {/* Navigation */}
      <View className="flex-row justify-between py-1 items-center border-b-[0.9px] border-gray-200">
        <Text className="text-xl font-medium text-gray-600">Notifications</Text>
        <TouchableOpacity onPress={()=>markAllAsRead()}>
            <Text>Mark as all read</Text>
        </TouchableOpacity>
      </View>

      {
        authState === "loggedIn"
        &&
        noNotifs
        ?
        <View className="flex-1 flex-col items-center justify-center">
            <Text className="text-3xl font-medium text-gray-600">No notifications</Text>
        </View>
        :
        authState === "loggedIn"
        &&
        !noNotifs
        ?
        <FlatList
        data={notifications?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))}
        // onRefresh={()=>}
        style={{marginTop : 10}}
        contentContainerStyle={{gap : 15}}
        ListFooterComponent={isLoadingMore && <ActivityIndicator />}
        keyExtractor={(item, index)=> index}
        onEndReached={loadMoreData} // Call loadMoreData when end of list is reached
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={(Notifs)=>{
          const item = Notifs.item
          const index = Notifs.index
          const date = new Date(item.createdAt)
          const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
          })
          return (
              <TouchableOpacity onLongPress={()=>{setSelectedNotif(item);setOpenMoreOption(true)}} onPress={()=>{markAsRead(item._id, item.notif_to, item.notification_type);navigation.navigate(item.notification_type === "New_Booking" ? "ServiceBookings" : item.notification_type === "New_Rating" ? "ServiceReviews" : "ServiceBookings")}} className={`w-full  ${item.isRead ? "bg-white" : "bg-[#dce4f951]"} border-b-[0.5px] px-2 border-gray-200 pb-3`}>
              {
                  item.notification_type === "New_Rating" ? 
                  <View className="flex-row space-x-2 w-full">
                  {/* Icon */}
                  <View className="w-[50] h-[50] flex-row justify-center items-center rounded-full overflow-hidden border-2 border-orange-500 bg-orange-100 p-1">
                      <Image source={require('../../../Utilities/Images/Rating_Icon.png')} containerStyle={{width : "70%", height : "70%"}} style={{width : "100%", height : "100%"}} />
                  </View>
                  <View className="flex-col flex-1">
                  <View className="flex-row items-center space-x-2">
                  <Text className="text-base font-medium text-gray-700">You have a new Rating`</Text>
                  <View className={`w-2 h-2 ${item.isRead ? "hidden" : ""} bg-red-600 rounded-full`}></View>
                  </View>
                      <Text className='text-xs text-gray-500 whitespace-nowrap'>{formattedDate.replace('at', '|')}</Text>
                      {/* Content */}
                      <View className=' border border-gray-100 rounded-md flex-col space-y-1 items-start justify-start mr-1 mt-1 p-1'>
                        <View className='w-full flex-row items-center'>
                          <Text className='text-sm font-medium text-orange-500 w-[55]'>Service: </Text>
                          <Text className=' text-gray-600 text-sm font-medium'> {item.content.service}</Text>
                        </View>
                        <View className='w-full flex-row items-center'>
                          <Text className='text-sm font-medium text-orange-500 w-[55]'>Rating:</Text>
                          <Rating size={15} baseColor='#f2f2f2' rating={item.content.rating} spacing={5} disabled />
                          {/* <StyledRating readOnly className='relative left-[0.1rem]' defaultValue={item.content.rating} precision={1} icon={<StarRoundedIcon fontSize='small' />  } emptyIcon={<StarRoundedIcon fontSize='small' className='text-gray-300' />} /> */}
                        </View>
                        <View className={`w-full ${item.content.review === "" ? "hidden" : "flex-row"} items-start`}>
                          <Text className='text-sm font-medium text-orange-500'>Review: </Text>
                          <Text className='px-1 text-gray-600 text-sm font-medium'>{item.content.review}</Text>
                        </View>
                      </View>
                  </View>
                  </View>
                  :
                  item.notification_type === "New_Booking" ?
                  <View className="flex-row space-x-2">
                  {/* Icon */}
                  <View className="w-[50] h-[50] flex-row justify-center items-center rounded-full overflow-hidden border-2 border-blue-500 bg-blue-300 p-1">
                      <Image source={require('../../../Utilities/Images/Book_Icon4.png')} containerStyle={{width : "70%", height : "70%"}} style={{width : "100%", height : "100%"}} />
                  </View>
                  {/* Content */}
                  <View className="flex-col">
                  <View className="flex-row items-center space-x-2">
                  <Text className="text-base font-medium text-gray-700">You have a new booking</Text>
                  <View className={`w-2 h-2 ${item.isRead ? "hidden" : ""} bg-red-600 rounded-full`}></View>
                  </View>
                  <Text className='text-xs text-gray-500 whitespace-nowrap'>{formattedDate.replace('at', '|')}</Text>
                  </View>
                  </View>
                  :
                  item.notification_type === "Report Update" ? 
                  <View className="flex-row space-x-2">
                  {/* Icon */}
                  <View className="w-[50] h-[50] flex-row justify-center items-center rounded-full overflow-hidden border-2 border-gray-500 bg-gray-200 p-1">
                      <Image source={require('../../../Utilities/Images/Flag.png')} containerStyle={{width : "70%", height : "70%"}} style={{width : "100%", height : "100%"}} />
                  </View>
                  {/* Content */}
                  <View className="flex-col flex-1">
                      <View className="flex-row items-center space-x-2">
                      <Text className="text-base font-medium text-gray-700">Report update</Text>
                      <View className={`w-2 h-2 ${item.isRead ? "hidden" : ""} bg-red-600 rounded-full`}></View>
                      </View>
                      <Text className='text-xs text-gray-700'>{item.content.body.trim().replace(/\n\s*/g, ' ')}</Text>
                      <Text className='text-xs text-gray-500 font-medium mt-1 whitespace-nowrap'>{formattedDate.replace('at', '|')}</Text>
                  </View>
                  </View>
                  :
                  <View className="flex-row space-x-2">
                  {/* Icon */}
                  <View className="w-[50] h-[50] flex-row justify-center items-center rounded-full overflow-hidden border-2 border-red-500 bg-red-100 p-1">
                      <Image source={require('../../../Utilities/Images/Book_Icon4.png')} containerStyle={{width : "70%", height : "70%"}} style={{width : "100%", height : "100%"}} />
                  </View>
                  {/* Content */}
                  <View className="flex-col flex-1">
                      <View className="flex-row items-center space-x-2">
                      <Text className="text-base font-medium text-red-500">Cancelled booking</Text>
                      <View className={`w-2 h-2 ${item.isRead ? "hidden" : ""} bg-red-600 rounded-full`}></View>
                      </View>
                      <Text className='text-xs text-gray-700'>{item.content}</Text>
                      <Text className='text-xs text-gray-500 font-medium mt-1 whitespace-nowrap'>{formattedDate.replace('at', '|')}</Text>
                  </View>
                  </View>
              }
              </TouchableOpacity>
          )
        }}
        />
        :
        ""
      }

    <BottomSheet containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} backdropTransitionOutTiming={0} onBackdropPress={()=>setOpenMoreOption(false)} modalProps={{}} isVisible={openMoreOption}>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title >
              <TouchableOpacity onPress={()=>{markAsRead(selectedNotif._id, selectedNotif.notif_to,)}}>
                <Text className="text-base">Mark as read</Text>
              </TouchableOpacity>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
        <ListItem>
          <ListItem.Content>
            <ListItem.Title >
              <TouchableOpacity onPress={()=>{deleteNotif(selectedNotif._id)}}>
                <Text className="text-base text-red-500">Remove notification</Text>
              </TouchableOpacity>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
    </BottomSheet>
    </View>
  )
}

export default Notifications