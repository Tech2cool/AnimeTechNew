import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const DownloadContext = createContext();
const myKey = "anime_Download";

export const DownloadProvider = ({ children }) => {
  const [download, setDownload] = useState([]);

  return (
    <DownloadContext.Provider value={{ download, toggleDownload }}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownload = () => {
  return useContext(DownloadContext);
};
