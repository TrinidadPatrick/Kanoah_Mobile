import 'react-native-gesture-handler';
import { StatusBar as MainStatusbar } from 'expo-status-bar';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity ,Linking, Button } from 'react-native';
import { NavigationContainer, useNavigation, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomePage from './Components/Pages/HomePage/HomePage';
import Login from './Components/Pages/LoginPage/Login';
import Register from './Components/Pages/RegisterPage/Register';
import ForgotPassword from './Components/Pages/LoginPage/ForgotPassword';
import {FontAwesome, Entypo, Octicons} from '@expo/vector-icons'
import InputOtp from './Components/Pages/LoginPage/InputOtp';
import NewPassword from './Components/Pages/LoginPage/NewPassword';
import registerNNPushToken from 'native-notify';
import axios from 'axios';
import FillInfo from './Components/Pages/RegisterPage/FillInfo';
import VerifyEmailByOtp from './Components/Pages/RegisterPage/VerifyEmailByOtp';
import Explore from './Components/Pages/Explore/Explore';
import TopRatedViewAll from './Components/Pages/HomePage/TopRatedViewAll';
import RecentServicesViewAll from './Components/Pages/HomePage/RecentServicesViewAll';
import Account from './Components/Pages/Account/Account';
import Profile from './Components/Pages/Account/AccountSettings/ProfileSettings/Profile';
import AddressSetup from './Components/Pages/Account/AccountSettings/ProfileSettings/AddressSetup';
import MapFullScreen from './Components/Pages/Account/AccountSettings/ProfileSettings/MapFullScreen';
import ChangePasswordProfile from './Components/Pages/Account/AccountSettings/ProfileSettings/ChangePasswordProfile';
import ViewService from './Components/Pages/ViewService/ViewService';
import ViewAllRatings from './Components/Pages/ViewService/ViewAllRatings';
import ViewAllGallery from './Components/Pages/ViewService/ViewAllGallery';
import BookService from './Components/Pages/BookService/BookService';
import ServiceOptionList from './Components/Pages/BookService/ServiceOptionList';
import AddressModal from './Components/Pages/BookService/AddressModal';
import BookConfirmation from './Components/Pages/BookService/BookConfirmation';
import ClientInProgressBookings from './Components/Pages/Account/AccountSettings/ClientBookings/ClientInProgressBookings';
import ClientBookings from './Components/Pages/Account/AccountSettings/ClientBookings/ClientBookings';
import ClientCompletedBookings from './Components/Pages/Account/AccountSettings/ClientBookings/ClientCompletedBookings';
import ClientCancelledBookings from './Components/Pages/Account/AccountSettings/ClientBookings/ClientCancelledBookings';
import ClientBookingDetails from './Components/Pages/Account/AccountSettings/ClientBookings/ClientBookingDetails';
import BlockedServices from './Components/Pages/Account/AccountSettings/BlockedServices/BlockedServices';
import FavoriteList from './Components/Pages/Account/AccountSettings/FavoriteServices/FavoriteList';
import MyService from './Components/Pages/Account/ServiceSettings/MyService/MyService';
import BasicInformation from './Components/Pages/Account/ServiceSettings/EditService/BasicInformation';
import Address from './Components/Pages/Account/ServiceSettings/EditService/Address';
import ServiceHour from './Components/Pages/Account/ServiceSettings/EditService/ServiceHour';
import BookingSettings from './Components/Pages/Account/ServiceSettings/EditService/BookingSettings';
import AdvanceInformation from './Components/Pages/Account/ServiceSettings/EditService/AdvanceInformation';
import Tags from './Components/Pages/Account/ServiceSettings/EditService/Tags';
import ServiceInProgressBookings from './Components/Pages/Account/ServiceSettings/ServiceBookings/ServiceInProgressBookings';
import ServiceCompletedBookings from './Components/Pages/Account/ServiceSettings/ServiceBookings/ServiceCompletedBookings';
import ServiceCancelledBookings from './Components/Pages/Account/ServiceSettings/ServiceBookings/ServiceCancelledBookings';
import ServiceViewBookingDetails from './Components/Pages/Account/ServiceSettings/ServiceBookings/ServiceViewBookingDetails';
import ServiceViewStaticBookingDetail from './Components/Pages/Account/ServiceSettings/ServiceBookings/ServiceViewStaticBookingDetail';
import ServiceReviews from './Components/Pages/Account/ServiceSettings/ServiceReviews/ServiceReviews';
import MainChat from './Components/Pages/Chat/MainChat';
import socketStore from './socketStore';
import ConversationWindow from './Components/Pages/Chat/ConversationWindow';
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
import useInfo from './Components/CustomHooks/UserInfoProvider';
import * as SecureStore from 'expo-secure-store'
import http from './http';
import ContactLists from './Components/Pages/Chat/ContactLists';

export default function App() {
  
  const Stack = createNativeStackNavigator()
  const Tab = createBottomTabNavigator();
  const topTab = createMaterialTopTabNavigator();
  registerNNPushToken(19825, 'bY9Ipmkm8sFKbmXf7T0zNN');



  // Components for home
  const HomeStackScreen = () => {
    const {socket, setSocket} = socketStore()
    const {userInformation, isLoggedIn, setIsLoggedIn} = useInfo()
    const [unreadCounts, setUnreadCounts] = useState(0)

    useEffect(()=>{

    },[])

    const countUnreadNotifs = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken')
      try {
        const result = await http.get('Mobile_countUnreadMessages', {
          headers : {
            'Authorization' : `Bearer ${accessToken}`
          }
        })
        setUnreadCounts(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
        setSocket(io("https://kanoah.onrender.com"))
        countUnreadNotifs()
    },[])

    // Set the user loggedIn in the socket
    useEffect(()=>{
      if(isLoggedIn && userInformation !== null)
      {
        socket?.emit('loggedUser', userInformation?._id)
        
        return () => {
            socket?.emit('disconnectUser', userInformation?._id)
        }
      }
    },[socket, userInformation, isLoggedIn])

    // Notify user if there is new message
    useEffect(()=>{
      socket?.on('message', (message)=>{
      if(message == 'newMessage')
        {
          countUnreadNotifs()
        }
      })
    
      return () => {
        // Clean up the socket event listeners when the component unmounts
        socket?.off('message');
      };
    },[socket])
    
    
    return (
    <Tab.Navigator>
          <Tab.Screen name="Home" component={HomePage}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
            
          }}

          />
          <Tab.Screen name="Explore" component={Explore}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="list-ul" size={size} color={color} />
            ),
          }}
          />
          <Tab.Screen name="Chats"
          options={({navigation})=>(
            {
              headerShown: true,
            headerLeft: () => 
          (
            <TouchableOpacity className="ml-4 mr-2" onPress={()=>navigation.goBack()}>
              <Octicons name="arrow-left"  color="black" size={25} />
            </TouchableOpacity>
          ),
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="commenting" size={size} color={color} />
            ),
            tabBarBadge : unreadCounts > 0 ? unreadCounts : null
            }
          )}
          >
          {()=><ContactLists userInformation={userInformation} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          </Tab.Screen>
          <Tab.Screen name="Notifications" component={HomePage}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="bell" size={size} color={color} />
            ),
          }}
          />
          <Tab.Screen name="Account" component={Account}
          options={{ headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
          />
    </Tab.Navigator>
    )
        };

  const ClientBookingsStackScreen = () => (
    <topTab.Navigator>
      <Tab.Screen name="ClientInProgressBookings" component={ClientInProgressBookings} options={{tabBarLabel : 'In Progress'}}  />
      <Tab.Screen name="ClientCompletedBookings" component={ClientCompletedBookings} options={{tabBarLabel : 'Completed'}} />
      <Tab.Screen name="ClientCancelledBookings" component={ClientCancelledBookings} options={{tabBarLabel : 'Cancelled'}} />
    </topTab.Navigator>

  )

  const EditServiceStack = ({route}) => {
    const { serviceInfo } = route.params || {};

    return(
    <topTab.Navigator tabBarScrollEnabled={true} // Enable tab scrolling
    // swipeEnabled={false}
    screenOptions={{
      tabBarScrollEnabled: true,
      tabBarItemStyle : {width : 'auto'}, 
    }}>
    <Tab.Screen
      name="BasicInformation"
      options={{ tabBarLabel: 'Basic Information' }}
    >
      {() => <BasicInformation serviceInfo={serviceInfo} />}
    </Tab.Screen>
    <Tab.Screen
      name="AdvanceInformation"
      options={{ tabBarLabel: 'Advance Information' }}
    >
      {() => <AdvanceInformation serviceInfo={serviceInfo} />}
    </Tab.Screen>
    <Tab.Screen
      name="Address"
      options={{ tabBarLabel: 'Address' }}
    >
      {() => <Address serviceInfo={serviceInfo} />}
    </Tab.Screen>
    <Tab.Screen
      name="ServiceHours"
      options={{ tabBarLabel: 'Service Hours' }}
    >
      {() => <ServiceHour serviceInfo={serviceInfo} />}
    </Tab.Screen>
    <Tab.Screen
      name="Tags"
      options={{ tabBarLabel: 'Tags' }}
    >
      {() => <Tags serviceInfo={serviceInfo} />}
    </Tab.Screen>
    <Tab.Screen
      name="BookingSetting"
      options={{ tabBarLabel: 'Booking and Services' }}
    >
      {() => <BookingSettings serviceInfo={serviceInfo} />}
    </Tab.Screen>
    </topTab.Navigator>
    )
  }

  const ServiceBookingsStack = ({route}) => {
    return (
      <topTab.Navigator>
      <Tab.Screen initialParams={{serviceInfo : route.params.serviceInfo}} name="ServiceInProgressBookings" component={ServiceInProgressBookings} options={{tabBarLabel : 'In Progress'}}  />
      <Tab.Screen initialParams={{serviceInfo : route.params.serviceInfo}} name="ServiceCompletedBookings" component={ServiceCompletedBookings} options={{tabBarLabel : 'Completed'}} />
      <Tab.Screen initialParams={{serviceInfo : route.params.serviceInfo}} name="ServiceCancelledBookings" component={ServiceCancelledBookings} options={{tabBarLabel : 'Cancelled'}} />
    </topTab.Navigator>
    )
  }


  

  return (
    <View className="w-full h-screen flex flex-col" style={{ flex: 1, paddingTop: StatusBar.currentHeight, backgroundColor: 'white', overflow: 'auto', }}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomePage" component={HomeStackScreen} />
      <Stack.Screen name="ClientBookings" component={ClientBookingsStackScreen} 
      options={({navigation}) => ({
        headerShown : true, headerTitle : 'My bookings', headerShadowVisible : false, headerTitleAlign : 'center', headerTintColor : 'black',
        headerLeft: () => 
          (
            <TouchableOpacity onPress={()=>navigation.navigate("Account")}>
              <Octicons name="arrow-left"  color="black" size={25} />
            </TouchableOpacity>
          ),
      })} />
      <Stack.Screen name="ServiceBookings" initialParams={({route})=> route.params.serviceInfo} component={ServiceBookingsStack} 
      options={({navigation}) => ({
        headerShown : true, headerTitle : 'My service bookings', headerShadowVisible : false, headerTitleAlign : 'center', headerTintColor : 'black',
        headerLeft: () => 
          (
            <TouchableOpacity onPress={()=>navigation.navigate("Account")}>
              <Octicons name="arrow-left"  color="black" size={25} />
            </TouchableOpacity>
          )
      })} />
      <Stack.Screen name="EditService" initialParams={({route})=> route.params.serviceInfo} component={EditServiceStack} 
      options={({navigation}) => ({
        headerShown : true, headerTitle : 'Edit service', headerShadowVisible : false, headerTitleAlign : 'center', headerTintColor : 'black',
        headerLeft: () => 
          (
            <TouchableOpacity onPress={()=>navigation.goBack()}>
              <Octicons name="arrow-left"  color="black" size={25} />
            </TouchableOpacity>
          )
        
      })} />
      <Stack.Screen name="Login" options={({navigation}) => ({
        headerShown : true, headerTitleAlign : 'center',
        headerLeft: () => 
          (
            <TouchableOpacity onPress={()=>navigation.navigate("Home")}>
              <Octicons name="arrow-left"  color="black" size={25} />
            </TouchableOpacity>
          )
      })} component={Login} />
      <Stack.Screen name="ViewAllTopRated" component={TopRatedViewAll} options={{ headerShown: true, headerTitle : "Top Rated Services" }} />
      <Stack.Screen name="RecentServicesViewAll" component={RecentServicesViewAll} options={{ headerShown: true, headerTitle : "Recent Services" }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: true }} />
      <Stack.Screen name="FillInfo" component={FillInfo} options={{ headerShown: true, headerTitle : "Your Information" }} />
      <Stack.Screen name="VerifyEmailByOtp" component={VerifyEmailByOtp} options={{ headerShown: true, headerTitle : "Verify Email" }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: true }} />
      <Stack.Screen name="InputOtp" component={InputOtp} options={{ headerShown: true, headerTitle : "Enter Verification Code" }} />
      <Stack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: true, headerTitle : "Enter New Password" }} />
      <Stack.Screen name="ChangePasswordProfile" component={ChangePasswordProfile} options={{ headerShown: true, headerTitle : "Change Password" }} />
      <Stack.Screen name="ViewService" component={ViewService} options={{ headerShown: true, headerTitle : "", headerTransparent : true, headerTintColor : "white" }} />
      <Stack.Screen name="ServiceViewBookingDetails" component={ServiceViewBookingDetails} options={{ headerShown: true, headerTitle : "Booking details", headerTransparent : false, headerTintColor : "black" }} />
      <Stack.Screen name="ServiceViewStaticBookingDetail" component={ServiceViewStaticBookingDetail} options={{ headerShown: true, headerTitle : "Booking details", headerTransparent : false, headerTintColor : "black" }} />
      <Stack.Screen name="ViewAllRatings" component={ViewAllRatings} options={{ headerShown: true, headerTitle : "Ratings" }} />
      <Stack.Screen name="ViewAllGallery" component={ViewAllGallery} options={{ headerShown: true, headerTitle : "Service Gallery" }} />

      {/* Booking stack */}
      <Stack.Screen name="BookService" component={BookService} options={{ headerShown: false, headerTitle : "Book Service" }} />
      <Stack.Screen name="ServiceOptionList" component={ServiceOptionList} options={{ headerShown: true, headerTitle : "Service Option" }} />
      <Stack.Screen name="AddressModal" component={AddressModal} options={{ headerShown: true, headerTitle : "Set location" }} />
      <Stack.Screen name="BookConfirmation" component={BookConfirmation} options={{ headerShown: true, headerTitle : "Confirm Booking" }} />
      <Stack.Screen name="BookingDetails" component={ClientBookingDetails} options={{ headerShown: true, headerTitle : "Booking Details" }} />

      {/* Account Settings stack */}
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: true, headerTitle : "Edit Profile" }} />
      <Stack.Screen name="AddressSetup" component={AddressSetup} options={{ headerShown: true, headerTitle : "Address" }} />
      <Stack.Screen name="MapFullScreen" component={MapFullScreen} options={{ headerShown: true, headerTitle : "Pin Location" }} />
      <Stack.Screen name="BlockedServices" component={BlockedServices} options={{ headerShown: true, headerTitle : "Blocked services " }} />
      <Stack.Screen name="Favorites" component={FavoriteList} options={{ headerShown: true, headerTitle : "Favorite services " }} />

      {/* Service Settings stack */}
      <Stack.Screen name="MyService" component={MyService} options={{ headerShown: true, headerTitle : "My Service" }} />
      <Stack.Screen name="ServiceReviews" component={ServiceReviews} options={{ headerShown: true, headerTitle : "Service reviews" }} />

      <Stack.Screen name="ConversationWindow" component={ConversationWindow} options={{ headerShown: true, headerTitle : "" }} />
      
      
    </Stack.Navigator>
      </NavigationContainer>
      <MainStatusbar style="auto" />
    </View>
  );
}

