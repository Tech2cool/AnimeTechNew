import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId:null,
    userName:null,
    userEmail:null,
    userListData:[],
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
