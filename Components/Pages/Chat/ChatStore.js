import {create} from 'zustand';

const chatStore = create((set) => ({
  userConversations : [{
   conversationId : null,
   chats : []
  }],
  storeConversations: (value) => set((state) => ({ userConversations: value }))
}));

export default chatStore;