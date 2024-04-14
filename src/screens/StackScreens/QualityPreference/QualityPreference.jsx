import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useQualityPref } from '../../../contexts/QualityPrefrenceContext'
import Theme from '../../../utils/Theme';
import NetInfo from "@react-native-community/netinfo";
import SelectedRadioBtn from './SelectedRadioBtn';

const color = Theme.DARK;
const font = Theme.FONTS;
const qualityData = [
    {
        title: "Auto (Recommended)",
        selected: true,
        subTitle: "Best experience for your condtions",
        value:"default"
    },
    {
        title: "1080P",
        selected: false,
        subTitle: "Best quality experience",
        value:"1080p"
    },
    {
        title: "720P",
        selected: false,
        subTitle: "Good quality experience",
        value:"720p"
    },
    {
        title: "480P",
        selected: false,
        subTitle: "Good quality experience and reduce data consumption",
        value:"480p"
    },
    {
        title: "360P",
        selected: false,
        subTitle: "Less quality experience and less data consumption",
        value:"360p"
    },
]
const QualityPreference = () => {
    const { QualityPref, setQuality } = useQualityPref()
    const { isConnected, isWifiEnabled } = NetInfo.useNetInfo();
    // console.log(isConnected)
    // console.log(isWifiEnabled)
    

    return (
        <ScrollView style={styles.container}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 10, }}>
                <Text style={styles.subText}>Select your default streaming quality for all videos.</Text>
                <Text style={styles.subText}>You can change streaming quality in player options for single videos.</Text>
                <Text style={styles.subText}>If Selected Quality unvailable it chooses Auto quality</Text>
            </View>
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: color.LighterGray, paddingVertical: 2, }}></View>

            <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 15, }}>
                <Text style={[styles.Text, { textTransform: "uppercase", paddingVertical: 5 }]}>Video quality on mobile  networks</Text>
                {
                    qualityData.map((item,i) => (
                            <SelectedRadioBtn
                                key={`${item.title}-mobile`}
                                title={item.title}
                                selected={QualityPref?.mobile === item?.value?true:false}
                                subTitle={item.subTitle}
                                onPress={()=>setQuality(item?.value,"mobile")}
                            />
                    ))
                }
            </View>
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: color.LighterGray, paddingVertical: 2, }}></View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 15, }}>
                <Text style={[styles.Text, { textTransform: "uppercase", paddingVertical: 5 }]}>Video quality on wifi</Text>
                {
                    qualityData.map((item) => (
                            <SelectedRadioBtn
                                key={`${item.title}-wifi`}
                                title={item.title}
                                selected={QualityPref?.wifi === item?.value?true:false}
                                subTitle={item.subTitle}
                                onPress={()=>setQuality(item?.value,"wifi")}
                            />
                    ))
                }
            </View>
        </ScrollView>
    )
}

export default QualityPreference

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.DarkBackGround,
    },
    subText: {
        fontFamily: font.OpenSansRegular,
        fontSize: 13,
        color: color.LightGray,
    },
    Text: {
        fontFamily: font.OpenSansSemiBold,
        fontSize: 15,
        color: color.White,
    },
})