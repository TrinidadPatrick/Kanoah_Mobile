import {create} from 'zustand';

const useStore = create((set) => ({
  selectedFilterState : {
    category : {name : '', category_code : '', category_id : ''},
    subCategory : {name : '', subCategory_id : ''},
    ratings : [],
    searchValue : ''
  },
  storeFilter: (value) => set(() => ({ selectedFilterState: value }))
}));

export default useStore;