import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

interface User {
  username: string;
  email: string;
  updated_at: string;
  created_at: string;
  id: number;
}

interface UseUser {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

export const useUser = (): UseUser => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getCookie("token");
    const storedUser = getCookie("user");

    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken as string);
    } else {
      setIsLoggedIn(false);
      setToken(null);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser as string));
      } catch (error) {
        console.error("Error parsing user data from cookie:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return { isLoggedIn, user, token };
};
