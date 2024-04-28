import {create} from 'zustand';

const authStore = create((set) => ({
  authState : null,
  setAuthState: (value) => set((state) => ({ authState: value }))
}));

export default authStore;