import { createContext, useContext, useEffect, useState } from "react";
import { getAsyncData, setAsyncData } from "../utils/functions";
import { qualityPrefs } from "../utils/contstant";
import { ToastAndroid } from "react-native";

const GeneralContext = createContext();
const rmbKey = `remind_to_take_break_key`
const themKey = `theme_key`
export const GeneralContextProvider = ({ children }) => {
  const [generalOption, setGeneralOption] = useState({
    remind_to_take_break: 0,
    theme: "dark",
  });

  useEffect(() => {

    getAsyncData(rmbKey)
      .then((res) => {
        // console.log(res)
        if(res){
          const resp = JSON.parse(res)
          // console.log(resp)

          setGeneralOption({ ...generalOption, remind_to_take_break: resp ? resp : 0 })
        }else{
          setAsyncData(rmbKey,JSON.stringify(0))
        }
      })
      .catch((err)=>{
        console.log(err)
      })
    getAsyncData(themKey)
      .then((res) => {
        // console.log(res)
        if(res){
          const resp = JSON.parse(res)
          // console.log(resp)
          setGeneralOption({ ...generalOption, theme: resp ? resp?.theme : "dark" })
        }else{
          setAsyncData(themKey,JSON.stringify({theme:"dark"}))
        }
      })
      .catch((err)=>{
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (generalOption.remind_to_take_break === 0) return
    const sid = setInterval(() => {
      showReminderModal()
    }, generalOption.remind_to_take_break * 1000);

    return () => clearInterval(sid)

  }, [generalOption.remind_to_take_break])

  const setRemindMeTime = (time) => {
    setAsyncData(rmbKey, JSON.stringify(time))
    setGeneralOption({ ...generalOption, remind_to_take_break: time })
  }
  const setTheme = (theme) => {
    setAsyncData(themKey, JSON.stringify(theme))
    setGeneralOption({ ...generalOption, theme: theme })
  }
  const showReminderModal = () => {
    ToastAndroid.show("Reminder: Take a Break", ToastAndroid.LONG);
    setRemindMeTime(generalOption.remind_to_take_break)
  }

  return (
    <GeneralContext.Provider value={{ generalOption, setRemindMeTime,setTheme }}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneralOps = () => {
  return useContext(GeneralContext);
};
