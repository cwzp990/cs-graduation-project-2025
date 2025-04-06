import { create } from "zustand";

type UserState = {
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
};

const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
}));

export default useUserStore;
