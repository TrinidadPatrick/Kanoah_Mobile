import { View, Text, ScrollView, FlatList, Image, Dimensions, TouchableOpacity, StatusBar, Modal } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import {FontAwesome, Entypo} from 'react-native-vector-icons'

const ViewAllGallery = ({route, navigation}) => {
    const galleryImages = route.params.galleryImages
    const scrollViewRef = useRef(null);
    const [showViewer, setShowViewer] = useState(false)
    const SCREEN_WIDTH = Dimensions.get('window').width;


    const scrollToItem = (key) => {
        if (!scrollViewRef.current) return;
    
        // Find the position of the item with the specified key
        const itemOffset = SCREEN_WIDTH * key;
        scrollViewRef.current.scrollTo({ x: itemOffset, animated: false });
    };

    useEffect(()=>{
        if(showViewer)
        {
            navigation.setOptions({
                headerShown : false
            })
        }
        else
        {
            navigation.setOptions({
                headerShown : true
            })
        }
    },[showViewer])

  return (
    <View className="w-full h-full relative">
        <FlatList
        data={galleryImages}
        keyExtractor={(item, index) =>index}
        renderItem={(item, index) => (
        <View className="w-[50%] aspect-square p-2  ">
            <TouchableOpacity onPress={() => {scrollToItem(item.index);setShowViewer(true)}} className="w-full h-full overflow-hidden rounded-xl bg-white">
                <Image className="w-[100%] h-[100%] object-cover " source={{uri : item.item.src}} />
             </TouchableOpacity>
        </View>
        )}
        numColumns={2}
        />

        {/* Lightbox */}
        <View style={{backgroundColor : "rgba(0,0,0,1)"}} className={`w-full h-full absolute ${showViewer ? "flex" : "hidden"} flex-row justify-center items-center`}>
        <TouchableOpacity onPress={()=>setShowViewer(false)} className="absolute w-20 p-2 top-0 left-0  z-20">
        <FontAwesome  name="angle-left" color="white" size={35} />
        </TouchableOpacity>
        <ScrollView ref={scrollViewRef} pagingEnabled={true} ind contentContainerStyle={{display : "flex", flexDirection : "row", alignItems : "center" }} horizontal={true} className="w-full h-full relative " >
        {
            galleryImages.map((image, index)=>(
            <View key={index}  style={{width : SCREEN_WIDTH, height : "auto"}} className="">
            <Image  resizeMode='contain' source={{uri : image.src}} style={{width : "100%", height : "100%"}} />
            <View className="absolute  bottom-5 left-5 py-0 text-lg flex flex-row justify-center z-30 w-fit">
            <Text className="text-gray-300">{image.TimeStamp}</Text>
            </View>
            </View>
            
            ))
        }
        </ScrollView>
        </View>

        {showViewer && <StatusBar backgroundColor='black' />}
    </View>
  )
}

export default ViewAllGallery