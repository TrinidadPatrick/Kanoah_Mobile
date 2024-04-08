import {create} from 'zustand';

const useBookingStore = create((set) => ({
  bookingInformation : {
    service : null,
    schedule: null,
    contactAndAddress: null
    
  },
  storeBookingInformation: (value) => set(() => ({ bookingInformation: value }))
}));

export default useBookingStore;