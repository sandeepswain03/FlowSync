import { createContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance, setupAxiosInterceptors } from "@/Instance/axiosInstance";

interface User {
  _id?: string;
  fullname?: {
    firstname: string;
    lastname: string;
  };
  email?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
  isLoading: false,
});

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosInstance.get("/user/userprofile");
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutCallback = () => {
    setUser(null);
    navigate("/sign-in");
  };

  useEffect(() => {
    setupAxiosInterceptors(logoutCallback);
    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
