import {create} from 'zustand';

const useStore = create((set) => ({
  selectedFilterState : {
    category : {name : '', category_code : '', category_id : ''},
    subCategory : {name : '', subCategory_id : ''},
    ratings : [],
    searchValue : '',
    coordinates : {latitude : 0, longitude : 0},
    radius : 10
  },
  storeFilter: (value) => set(() => ({ selectedFilterState: value }))
}));

export default useStore;