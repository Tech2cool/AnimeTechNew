// How to Download an Image in React Native from any URL
// https://aboutreact.com/download-image-in-react-native/

// Import React
import React, { useEffect, useState } from 'react';

// Import Required Components
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    PermissionsAndroid,
    Image,
    Platform,
    TextInput,
} from 'react-native';

// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob';

const Download = () => {
    const [url, setUrl]= useState("https://gredirect.info/download.php?url=aHR0cHM6LyAawehyfcghysfdsDGDYdgdsfsdfwstdgdsgtert9URASDGHUSRFSJGYfdsffsderFStewthsfSFtrftesdftZHhwZWhmcW1vLmFuZjU5OC5jb20vdXNlcjEzNDIvZGZhMDAyOTFkODg0MGMzNjM2MzE2ZDFhMzUxODE0ZGQvRVAuNy52MC4xNzA4NDQ5MzA0LjM2MHAubXA0P3Rva2VuPXRlbmx1VWdVa2tONnI1NDVxdlNjUXcmZXhwaXJlcz0xNzA4NTEyODgwJmlkPTIyMDc1MQ==")
    const REMOTE_IMAGE_PATH =
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    const checkPermission = async () => {
        // Function to check the platform
        // If iOS then start downloading
        // If Android then ask for permission

        if (Platform.OS === 'ios') {
            downloadImage();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'App needs access to your storage to download Photos',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Once user grant the permission start downloading
                    //console.log('Storage Permission Granted.');
                    downloadImage();
                } else {
                    // If permission denied then show alert
                    alert('Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.warn(err);
            }
        }
    };

    const downloadImage = () => {
        // Main function to download the image

        // To add the time suffix in filename
        let date = new Date();
        // Image URL which we want to download
        let image_URL = REMOTE_IMAGE_PATH;
        // Getting the extention of the file
        // let ext = getExtention(url);
        let ext = ".mp4";
        // ext = '.' + ext[0];
        // Get config and fs from RNFetchBlob
        // config: To pass the downloading related options
        // fs: Directory path where we want our image to download
        const { config, fs } = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        let options = {
            fileCache: true,
            addAndroidDownloads: {
                // Related to the Android only
                useDownloadManager: true,
                notification: true,
                path:
                    PictureDir +
                    '/video_' +
                    Math.floor(date.getTime() + date.getSeconds() / 2) +
                    ext,
                description: 'Video',
            },
        };
        config(options)
            .fetch('GET', url)
            .then(res => {
                // Showing alert after successful downloading
                //console.log('res -> ', JSON.stringify(res));
                alert('Image Downloaded Successfully.');
            });
    };

    const getExtention = filename => {
        // To get the file extension
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };
    useEffect(()=>{
        // //console.log(url)
    },[url])
    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 30, textAlign: 'center' }}>
                    React Native Image Download Example
                </Text>
                <Text
                    style={{
                        fontSize: 25,
                        marginTop: 20,
                        marginBottom: 30,
                        textAlign: 'center',
                    }}>
                    www.aboutreact.com
                </Text>
            </View>
            <Image
                source={{
                    uri: REMOTE_IMAGE_PATH,
                }}
                style={{
                    width: '100%',
                    height: 100,
                    resizeMode: 'contain',
                    margin: 5,
                }}
            />
            <TextInput 
                placeholderTextColor={"gray"}
                style={{
                    color:"black",
                    borderWidth:1,
                    borderColor:"black",
                    padding:10,
                }}
                onChangeText={text => setUrl(text)}
                placeholder='URL?'
                />
            <TouchableOpacity style={styles.button} onPress={checkPermission}>
                <Text style={styles.text}>Download Image</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Download;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        width: '80%',
        padding: 10,
        backgroundColor: 'orange',
        margin: 10,
    },
    text: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        padding: 5,
    },
});