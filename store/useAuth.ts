"use client";
import { create } from "zustand";

type User = { id: string; name: string } | null;

type AuthState = {
  user: User;
  setUser: (u: User) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  clear: () => set({ user: null }),
}));
