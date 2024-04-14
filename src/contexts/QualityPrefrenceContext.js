import { createContext, useContext, useEffect, useState } from "react";
import { getAsyncData, setAsyncData } from "../utils/functions";
import { qualityPrefs } from "../utils/contstant";

const QPrefrenceContext = createContext();
const qwKey = `selectedQualityPref_wifi`
const qmKey = `selectedQualityPref_mobile`
export const QualityPrefrenceContext = ({ children }) => {
  const [QualityPref, setQualityPref] = useState({
    wifi:qualityPrefs._default,
    mobile:qualityPrefs._default,
  });

  
  useEffect(()=>{
    getAsyncData(qwKey)
    .then((res)=>{
      const resp = JSON.parse(res)
      // console.log(res)
      setQualityPref(prev=>({
        ...prev,
        wifi:resp?resp?.quality:qualityPrefs._default,
      }))
    })
    .catch((err)=>{
      // console.log(err)
    })
    getAsyncData(qmKey)
    .then((res)=>{
      const resp = JSON.parse(res)
      setQualityPref(prev=>({
        ...prev,
        mobile:resp?resp?.quality:qualityPrefs._default,
      }))
    })
    .catch((err)=>{
      // console.log(err)
    })
  },[])

  const setQuality =(quality,type)=>{
    const data={
      type:type,
      quality:quality
    }
    const qmKey = `selectedQualityPref_${type}`

    setAsyncData(qmKey, JSON.stringify(data))
    setQualityPref(prev=>({...prev, [type]:quality}))

  }
  return (
    <QPrefrenceContext.Provider value={{ QualityPref, setQuality }}>
      {children}
    </QPrefrenceContext.Provider>
  );
};

export const useQualityPref = () => {
  return useContext(QPrefrenceContext);
};
