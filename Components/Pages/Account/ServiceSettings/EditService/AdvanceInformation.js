import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ActivityIndicator, ScrollView, Keyboard } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import * as SecureStore from 'expo-secure-store'
import http from '../../../../../http'
import useCategory from '../../../../CustomHooks/CategoriesProvider'
import { CheckBox, Icon, Input } from 'react-native-elements'

const AdvanceInformation = ({route, navigation, serviceInfo}) => {
  const {categories, subCategories} = useCategory()
  const [openModal, setOpenModal] = useState({ ServiceCategory : false, ServiceSubCategory : false, ServiceContact : false , ServiceEmail : false, ServiceFax : false, ServiceOptions : false, SocialLink : false})
  const [advanceInformation, setAdvanceInformation] = useState({ ServiceContact : "",
    ServiceFax : "",
    ServiceEmail : "",
    ServiceCategory : "",
    ServiceSubCategory : "",
    ServiceOptions : [],
    SocialLink : [{media : "Youtube",link : ""}, {media : "Facebook",link : ""}, {media : "Instagram",link : ""}],
  })
  const [serviceCategory, setServiceCategory] = useState('')
  const [serviceSubCategory, setServiceSubCategory] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const category = categories?.find((categoryItem) => categoryItem._id === serviceInfo.advanceInformation.ServiceCategory)
    const subCategory = serviceInfo?.advanceInformation.ServiceSubCategory !== null ? subCategories?.find((subcategoryItem) => subcategoryItem._id === serviceInfo.advanceInformation.ServiceSubCategory)?.name : "Not specified"
    setServiceCategory(category)
    setServiceSubCategory(subCategory)
  },[categories, subCategories])

  useEffect(()=>{
    if(advanceInformation.ServiceEmail === "")
    {
      setAdvanceInformation(serviceInfo.advanceInformation)
    }
  },[])

  const updateService = async (update_data, option) => {
    setLoading(true)
    const modalOption = option
    const accessToken = await SecureStore.getItemAsync('accessToken')
    try {
      const result = await http.patch(`Mobile_updateService/`, {advanceInformation : update_data},  {
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        }
      })
      setLoading(false)
      setAdvanceInformation(update_data)
      setOpenModal({...openModal, [modalOption] : false})
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <View className="flex-1 bg-white flex-col relative">
      <ChangeServiceCategory setServiceSubCategory={setServiceSubCategory} setServiceCategory={setServiceCategory} categories={categories} openModal={openModal} setOpenModal={setOpenModal} advanceInformation={advanceInformation} updateService={updateService} />
      <ChangeServiceSubCategory setServiceSubCategory={setServiceSubCategory} subCategories={subCategories} serviceCategory={serviceCategory} openModal={openModal} setOpenModal={setOpenModal} advanceInformation={advanceInformation} updateService={updateService} />
      <ChangeServiceContact loading={loading} openModal={openModal} setOpenModal={setOpenModal} advanceInformation={advanceInformation} updateService={updateService} />
      <ChangeServiceEmail loading={loading} openModal={openModal} setOpenModal={setOpenModal} advanceInformation={advanceInformation} updateService={updateService} />
      <ChangeServiceFax loading={loading} openModal={openModal} setOpenModal={setOpenModal} advanceInformation={advanceInformation} updateService={updateService} />
      <ChangeServicOptions loading={loading} openModal={openModal} setOpenModal={setOpenModal} advanceInformation={advanceInformation} updateService={updateService} />
      <ChangeSocialLink loading={loading} openModal={openModal} setOpenModal={setOpenModal} advanceInformation={advanceInformation} updateService={updateService} />
      {/* Service Contact */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, ServiceContact : true})} className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2 ">
        <Text className="text-sm text-gray-500">Service Contact</Text>
        <View className="">
          <Text className="text-base text-gray-700">+63{advanceInformation.ServiceContact}</Text>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
      {/* Service Fax */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, ServiceFax : true})} className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2">
        <Text className="text-sm text-gray-500">Fax number</Text>
        <View className="">
          <Text className="text-base text-gray-700">{advanceInformation.ServiceFax}</Text>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
      {/* Service Email */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, ServiceEmail : true})} className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2">
        <Text className="text-sm text-gray-500">Service Email</Text>
        <View className="">
          <Text className="text-base text-gray-700">{advanceInformation.ServiceEmail}</Text>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
      {/* Service Category */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, ServiceCategory : true})}  className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2">
        <Text className="text-sm text-gray-500">Service Category</Text>
        <View className="">
          <Text className="text-base text-gray-700">{serviceCategory?.name}</Text>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
      {/* Service SubCategory */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, ServiceSubCategory : true})}  className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2">
        <Text className="text-sm text-gray-500">Service Sub Category</Text>
        <View className="">
          <Text className="text-base text-gray-700">{serviceSubCategory === null ? "Not specified" : serviceSubCategory}</Text>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
      {/* Service Options */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, ServiceOptions : true})}  className="flex-row border-b-[1px] border-gray-100">
      <View className="flex-col flex-1 py-2 px-2">
        <Text className="text-sm text-gray-500">Service Options</Text>
        <View className="flex-row w-full overflow-hidden ">
          <View className="">
          <Text ellipsizeMode='tail' numberOfLines={1} className="text-base text text-gray-700">
          {
            advanceInformation?.ServiceOptions.map((option, index) => option + `${index === advanceInformation?.ServiceOptions.length - 1 ? '' : ', '}`)
          }
          </Text>
          </View>
        </View>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
      {/* Social Links */}
      <TouchableOpacity onPress={()=>setOpenModal({...openModal, SocialLink : true})}  className="flex-row border-b-[1px] border-gray-100 bg-gray-50">
      <View className="flex-col flex-1 py-3 px-2">
        <Text className="text-base text-gray-700">Edit social media links</Text>
      </View>
      <View className="h-full  flex-row items-center px-2 justify-center">
        <Icon type='font-awesome-5' name='chevron-right' size={20} color="lightgray"  />
      </View>
      </TouchableOpacity>
    </View>
  )
}

const ChangeServiceContact = ({advanceInformation, openModal, setOpenModal, updateService, loading}) => {
  const [serviceContact, setServiceContact] = useState('')

  useEffect(()=>{
    setServiceContact(advanceInformation.ServiceContact)
  },[openModal])

  const submit = () => {
    const update_data = {...advanceInformation, ServiceContact : serviceContact}
    updateService(update_data, 'ServiceContact')
  }
  return (
    <>
    {
      openModal.ServiceContact &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, ServiceContact : false})}>
      <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <TouchableWithoutFeedback>
      <View className="w-full h-[200px] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change service contact</Text>

        <TextInput inputMode='numeric' maxLength={10} className="border-b-[1px]" onChangeText={(value) =>{setServiceContact(value)}} value={serviceContact} />

        <TouchableOpacity disabled={serviceContact.length === 0} onPress={()=>{submit()}} className={`w-full py-2 ${serviceContact.length < 10 ? "bg-orange-300" : "bg-themeOrange"} rounded-full`}>
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Submit</Text>
          }
          
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

const ChangeServiceFax = ({advanceInformation, openModal, setOpenModal, updateService, loading}) => {
  const [serviceFax, setServiceFax] = useState('')

  useEffect(()=>{
    setServiceFax(advanceInformation.ServiceFax)
  },[openModal])

  const submit = () => {
    const update_data = {...advanceInformation, ServiceFax : serviceFax}
    updateService(update_data, 'ServiceFax')
  }
  return (
    <>
    {
      openModal.ServiceFax &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, ServiceFax : false})}>
      <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <TouchableWithoutFeedback>
      <View className="w-full h-[200px] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change service fax</Text>

        <TextInput inputMode='numeric' maxLength={10} className="border-b-[1px]" onChangeText={(value) =>{setServiceFax(value)}} value={serviceFax} />

        <TouchableOpacity onPress={()=>{submit()}} className="w-full py-2 bg-themeOrange rounded-full">
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Submit</Text>
          }
          
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

const ChangeServiceEmail = ({advanceInformation, openModal, setOpenModal, updateService, loading}) => {
  const [serviceEmail, setServiceEmail] = useState('')

  useEffect(()=>{
    setServiceEmail(advanceInformation.ServiceEmail)
  },[openModal])


  const submit = () => {
    const update_data = {...advanceInformation, ServiceEmail : serviceEmail}
    updateService(update_data, 'ServiceContact')
  }
  return (
    <>
    {
      openModal.ServiceEmail &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, ServiceEmail : false})}>
      <View 
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <TouchableWithoutFeedback style={{marginBottom : 0}} onPress={()=>setOpenModal({...openModal, ServiceEmail : true})} >
        <View className={`w-full h-[200px] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3`}> 
        <Text className="text-base font-medium text-gray-500">Change service email</Text>

        <TextInput keyboardType='email-address' className="border-b-[1px]" onChangeText={(value) =>{setServiceEmail(value)}} value={serviceEmail} />

        <TouchableOpacity disabled={serviceEmail.length === 0} onPress={()=>{submit()}} className={`w-full py-2 ${serviceEmail.length === 0 ? "bg-orange-300" : "bg-themeOrange"} rounded-full`}>
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Submit</Text>
          }
          
        </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </View>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

const ChangeServiceCategory = ({categories, openModal, setOpenModal, advanceInformation, updateService, setServiceCategory, setServiceSubCategory}) => {
  const [searchValue, setSearchValue] = useState('')

  const selectCategory  = (category) => {
      const update_data = {...advanceInformation, ServiceCategory : category._id, ServiceSubCategory : null}
      const categoryItem = categories?.find((categoryItem) => categoryItem._id === update_data.ServiceCategory)
      setServiceCategory(categoryItem)
      setServiceSubCategory(null)
      updateService(update_data, "ServiceCategory")
      setOpenModal({...openModal, ServiceCategory : false})
  }
  

  return (
    <>
    {
      openModal.ServiceCategory &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, ServiceCategory : false})} >
      <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <View className="w-full h-[80%] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change service category</Text>

        {/* Search input */}
        <View className="w-full relative mt-3">
          <View className="absolute top-2 left-2">
            <Icon type='material-community' name='magnify' color='#d9d8d7' size={30} />
          </View>
          <TextInput value={searchValue} onChangeText={setSearchValue} placeholderTextColor='#d9d8d7' placeholder='Search category' className="py-2 px-12 border border-gray-200 rounded-md" />
        </View>

        {/* categories container */}
        <ScrollView className="flex-1 mt-3">
        {
          categories?.filter((categoryItem)=> categoryItem.name.toLowerCase().includes(searchValue.toLowerCase())).map((category) => {
            return (
              <TouchableOpacity onPress={()=>selectCategory(category)} key={category._id} className="py-2 px-2">
                <Text>{category.name}</Text>
              </TouchableOpacity>
            )
          })
        }
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

const ChangeServiceSubCategory = ({serviceCategory, openModal, setOpenModal, advanceInformation, updateService, subCategories, setServiceSubCategory}) => {
  const [searchValue, setSearchValue] = useState('')

  const selectSubCategory  = (subCateg) => {
      setServiceSubCategory(subCateg.name)
      const update_data = {...advanceInformation, ServiceSubCategory : subCateg._id}
      updateService(update_data, "ServiceSubCategory")
  }
  

  return (
    <>
    {
      openModal.ServiceSubCategory &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, ServiceSubCategory : false})} >
      <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <View className="w-full h-[80%] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change service sub category</Text>

        {/* Search input */}
        <View className="w-full relative mt-3">
          <View className="absolute top-2 left-2">
            <Icon type='material-community' name='magnify' color='#d9d8d7' size={30} />
          </View>
          <TextInput value={searchValue} onChangeText={setSearchValue} placeholderTextColor='#d9d8d7' placeholder='Search category' className="py-2 px-12 border border-gray-200 rounded-md" />
        </View>

        {/* categories container */}
        <ScrollView className="flex-1 mt-3">
        {
          subCategories?.filter((item) => item.parent_code === serviceCategory.category_code ).filter((subcategoryItem)=> subcategoryItem.name.toLowerCase().includes(searchValue.toLowerCase())).map((subCateg) => {
            return (
              <TouchableOpacity onPress={()=>selectSubCategory(subCateg)} key={subCateg._id} className="py-2 px-2">
                <Text>{subCateg.name}</Text>
              </TouchableOpacity>
            )
          })
        }
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

const ChangeServicOptions = ({ openModal, setOpenModal, advanceInformation, updateService,loading}) => {
  const serviceOptionsArray = [
    {
      title : 'Home Service',
      description : 'Services provided to the clients location'
    },
    {
      title : 'Walk-In Service',
      description : 'Services provided to the providers location'
    },
    {
      title : 'Online Service',
      description : 'Services provided via online'
    },
    {
      title : 'Pick-up and Deliver',
      description : 'Send items for repair or services by arranging pickup from your location and receiving them back after the service is completed. (Not suitable for booking)'
    },
  ]
  const [serviceOptions, setServiceOptions] = useState([])

  useEffect(()=>{
    setServiceOptions(advanceInformation.ServiceOptions)
  },[openModal])

  const handleSelect = (option) => {
    const checkIndex = serviceOptions.findIndex((optionItem) => optionItem === option)
    if(checkIndex === -1)
    {
      setServiceOptions([...serviceOptions, option])
      return
    }
    else{ 
      const newData = [...serviceOptions]
      newData.splice(checkIndex, 1)
      setServiceOptions(newData)
    }
  }

  const submit = () => {
    const update_data = {...advanceInformation, ServiceOptions : serviceOptions}
    updateService(update_data, 'ServiceOptions')
  }

  return (
    <>
    {
      openModal.ServiceOptions &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, ServiceOptions : false})} >
      <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <View className="w-full h-[80%] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change service options</Text>

        {/* categories container */}
        <ScrollView className="flex-1 mt-3">
        {
          serviceOptionsArray.map((option, index) => {
            return (
              <TouchableOpacity onPress={()=>handleSelect(option.title)} key={index} className="py-2 px-2 flex-row">
                <View className="flex-col flex-1">
                  <Text className="text-base">{option.title}</Text>
                  <Text className="text-gray-500">{option.description}</Text>
                </View>
                  <CheckBox onPress={()=>handleSelect(option.title)} iconType="material-community" checkedIcon="checkbox-marked"
                  uncheckedIcon="checkbox-blank-outline" checked={serviceOptions.includes(option.title)} containerStyle={{ flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}} />
              </TouchableOpacity>
            )
          })
        }
        </ScrollView>
        <TouchableOpacity onPress={()=>{submit()}} className="w-full py-2 bg-themeOrange rounded-full">
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Submit</Text>
          }
          
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

const ChangeSocialLink = ({ openModal, setOpenModal, advanceInformation, updateService,loading}) => {
  const [socialLink, setSocialLink] = useState([{media : "Youtube",link : ""}, {media : "Facebook",link : ""}, {media : "Instagram",link : ""}],)
  const [selection, setSelection] = useState({start: 0});

  const handleFocus = () => {
    setSelection(null);
};
const handleBlur = () => {
    setSelection({start: 0});
};

  useEffect(()=>{
    setSocialLink(advanceInformation.SocialLink)
  },[openModal])

  const submit = () => {
    const update_data = {...advanceInformation, SocialLink : socialLink}
    updateService(update_data, 'SocialLink')
  }


  return (
    <>
    {
      openModal.SocialLink &&
      <TouchableWithoutFeedback onPress={()=>setOpenModal({...openModal, SocialLink : false})} >
      <KeyboardAvoidingView 
      style={{backgroundColor : 'rgba(0,0,0,0.3)'}} className="w-full h-full absolute flex-col justify-end z-30">
      <View className="w-full h-[300px] flex-col justify-between bg-white origin-bottom rounded-t-3xl p-3">
        <Text className="text-base font-medium text-gray-500">Change social media links</Text>

        {/* categories container */}
        <ScrollView className="flex-1 mt-3 space-y-4">
          {/* Youtube */}
          <View className="relative">
            <View className="absolute left-1 top-1">
            <Icon type='material-community' name='youtube' size={30} color="lightgray"  />
            </View>
            <TextInput onChangeText={(value)=>{const updatedSocialLinks = [...socialLink]; updatedSocialLinks[0] = { ...updatedSocialLinks[0], link: value };setSocialLink(updatedSocialLinks)}} onBlur={handleBlur} onFocus={handleFocus} selection={selection}  className="border-b-[1px] py-1 border-gray-300 pl-10" value={socialLink[0].link} />
          </View>
          {/* Facebook */}
          <View className="relative">
            <View className="absolute left-1 top-1">
            <Icon type='material-community' name='facebook' size={30} color="lightgray"  />
            </View>
            <TextInput onChangeText={(value)=>{const updatedSocialLinks = [...socialLink]; updatedSocialLinks[1] = { ...updatedSocialLinks[1], link: value };setSocialLink(updatedSocialLinks)}} onBlur={handleBlur} onFocus={handleFocus} selection={selection}  className="border-b-[1px] py-1 border-gray-300 pl-10" value={socialLink[1].link} />
          </View>
          {/* Instagram */}
          <View className="relative">
            <View className="absolute left-1 top-1">
            <Icon type='material-community' name='instagram' size={30} color="lightgray"  />
            </View>
            <TextInput onChangeText={(value)=>{const updatedSocialLinks = [...socialLink]; updatedSocialLinks[1] = { ...updatedSocialLinks[1], link: value };setSocialLink(updatedSocialLinks)}} onBlur={handleBlur} onFocus={handleFocus} selection={selection}  className="border-b-[1px] py-1 border-gray-300 pl-10" value={socialLink[1].link} />
          </View>
        </ScrollView>
        <TouchableOpacity onPress={()=>{submit()}} className="w-full py-2 bg-themeOrange rounded-full">
          {
            loading ? <ActivityIndicator color='white' />
            :
            <Text className="text-center text-white">Submit</Text>
          }
          
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    }
   </>
  )
}

export default AdvanceInformation