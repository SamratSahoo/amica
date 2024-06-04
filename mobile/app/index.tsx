import { View, Text, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import { useState } from 'react';
import { blobToBase64 } from '@/utils/file';
import axios from 'axios';

export default function HomeScreen() {
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
        console.log(await blobToBase64(blob))
        await transcribeRecording(await blobToBase64(blob));
    }

    const transcribeRecording = async (encodedData: unknown) => {
        console.log(encodedData)
        const response = await axios.post('https://8134-136-24-74-186.ngrok-free.app/api/transcribe', {
            'audio': encodedData
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        })
    }

    return (
        <View style={styles.container}>
            <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording}
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
