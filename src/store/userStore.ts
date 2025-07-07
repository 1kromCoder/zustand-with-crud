import { create } from "zustand";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserStore {
  users: User[];
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: number, updatedUser: Omit<User, "id">) => void;
  deleteUser: (id: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  fetchUsers: async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/users?_limit=6");
    set({ users: res.data });
  },
  addUser: (user) => {
    const users = get().users;
    const newUser = { ...user, id: Date.now() };
    const updatedUsers = [...users, newUser];
    console.log("Updated users array:", updatedUsers);
    set({ users: updatedUsers });
  },

  updateUser: (id, updatedUser) => {
    const users = get().users.map((u) =>
      u.id === id ? { ...u, ...updatedUser } : u
    );
    set({ users });
  },
  deleteUser: (id) => {
    const users = get().users.filter((u) => u.id !== id);
    set({ users });
  },
}));
