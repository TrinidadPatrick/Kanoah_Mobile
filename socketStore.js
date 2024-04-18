import {create} from 'zustand';

const socketStore = create((set) => ({
  socket : null,
  setSocket: (value) => set((state) => ({ socket: value }))
}));

export default socketStore;