import {create} from 'zustand';

const serviceStore = create((set) => ({
  service : null,
  setService: (value) => set((state) => ({ service: value }))
}));

export default serviceStore;