import { create } from "zustand";

const useStore = create((set) => ({
  isTodayOpened: true,
  setIsTodayOpened: (value) => {set(() => ({ isTodayOpened: value }))},
  
  isTodayClosed: true,
  setIsTodayClosed: (value) => set(() => ({ isTodayClosed: value })),

  notifyIsTodayQueue: true,
  setNotifyIsTodayQueue: (value) => set(() => ({ notifyIsTodayQueue: value })),

  notifyQueue: true,
  setNotifyQueue: (value) => set(() => ({ notifyQueue: value })),

  notifyQueueDone: true,
  setNotifyQueueDone: (value) => set(() => ({ notifyQueueDone: value })),

  activeMenu: 'Home',
  setActiveMenu: (value) => set(() => ({ activeMenu: value })),

  transactionSummary: [],
  setTransactionSummary: (value) => set(() => ({ transactionSummary: value })),

  userId: 0,
  setUserId: (value) => set(() => ({ userId: value })),
}))

export { useStore }