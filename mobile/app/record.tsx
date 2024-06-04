import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useState } from 'react';
import { blobToBase64 } from '@/utils/file';
import axios from 'axios';
import { getBaseUrl } from '@/utils/urls';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import DashboardFooter from '@/components/DashboardFooter';

export default function AudioScreen() {
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);

    const startRecording = async () => {
        if (permissionResponse?.status !== 'granted') {
            await requestPermission();
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true
        });


        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
        setRecording(recording);

    }

    const stopRecording = async () => {
        await recording?.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
            {
                allowsRecordingIOS: false,
            }
        );
        const uri = recording?.getURI();
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri as string, true);
            xhr.send(null);
        });

        setRecording(undefined);
        await transcribeRecording(await blobToBase64(blob));
    }

    const transcribeRecording = async (encodedData: unknown) => {
        const response = await axios.post(getBaseUrl() + '/api/transcribe', {
            'audio': encodedData
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        })
    }

    return (
        <BaseOverlay header={<View style={styles.logo}>
            <View style={styles.logoTextContainer}>
                {!recording && <AntDesign name="meh" size={100} color={!recording ? "black" : 'red'} />}
                {recording && <Fontisto name="mad" size={100} color={!recording ? "black" : 'red'} />}
            </View>
            <Text></Text>
        </View>}
            body={<View style={styles.bodyContainer}>
                <TouchableOpacity
                    onPress={recording ? stopRecording : startRecording}
                    accessibilityLabel="Learn more about this purple button"
                    style={!recording ? styles.recordButton : styles.recordButtonActive}
                ><Text style={styles.recordButtonText}>Start Recording</Text></TouchableOpacity>
            </View>} footer={<DashboardFooter />}>
        </BaseOverlay>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 10
    },
    logoTextContainer: {
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
    },
    bodyContainer: {
        height: "100%",
        flexDirection: "column",
        paddingTop: 30
    },
    recordButton: {
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 50,
    },
    recordButtonActive: {
        backgroundColor: 'red',
        padding: 20,
        borderRadius: 50,

    },
    recordButtonText: {
        color: 'white',
        textAlign: 'center'
    }
});
