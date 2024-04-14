import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();
const myKey = "anime_Language";

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const fetchMyLang = async () => {
      const storedLang = await AsyncStorage.getItem(myKey);
      if (storedLang) {
        setCurrentLang(storedLang);
      }

    //   console.log("lang fetch");
    //   console.log(storedLang);
    };

    fetchMyLang();
  }, []);

  const toggleLanguage = async () => {
    setCurrentLang((prevLang) => (prevLang === "en" ? "jp" : "en"));
    await AsyncStorage.setItem(myKey, currentLang === "en" ? "jp" : "en");
  };
  // useEffect(()=>{
  //   console.log(currentLang);
  // },[currentLang])

  return (
    <LanguageContext.Provider value={{ currentLang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
