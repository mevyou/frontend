"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";

export type UserProfileData = {
  user: string; // address
  name: string;
  username: string;
  description: string;
  image: string; // data URL or remote URL
  createdAt: number;
  timestamp: number;
};

const getProfileStorageKey = (address: string) => `profile:${address.toLowerCase()}`;

export function useAuth() {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    if (!isConnected || !address) {
      setProfile(null);
      setHasLoaded(true);
      return;
    }
    try {
      const raw = localStorage.getItem(getProfileStorageKey(address));
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfileData;
        setProfile(parsed);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    } finally {
      setHasLoaded(true);
    }
  }, [address, isConnected]);

  const isFirstTime = useMemo(() => {
    if (!isConnected || !address) return false;
    // First time if no profile found
    return hasLoaded && profile === null;
  }, [address, isConnected, hasLoaded, profile]);

  const saveProfile = useCallback(
    (data: Omit<UserProfileData, "createdAt" | "timestamp" | "user">) => {
      if (!address) return null;
      const now = Date.now();
      const existingRaw = localStorage.getItem(getProfileStorageKey(address));
      let createdAt = now;
      if (existingRaw) {
        try {
          const existing = JSON.parse(existingRaw) as UserProfileData;
          if (existing.createdAt) createdAt = existing.createdAt;
        } catch {
          // ignore
        }
      }
      const toSave: UserProfileData = {
        user: address,
        name: data.name?.trim() || "New",
        username: data.username?.trim() || `user_${address.slice(2, 8)}`,
        description: data.description?.trim() || "New",
        image: data.image || "",
        createdAt,
        timestamp: now,
      };
      localStorage.setItem(getProfileStorageKey(address), JSON.stringify(toSave));
      setProfile(toSave);
      return toSave;
    },
    [address]
  );

  const clearProfile = useCallback(() => {
    if (!address) return;
    localStorage.removeItem(getProfileStorageKey(address));
    setProfile(null);
  }, [address]);

  return {
    address,
    isConnected,
    profile,
    isFirstTime,
    saveProfile,
    clearProfile,
    hasLoaded,
  } as const;
}


