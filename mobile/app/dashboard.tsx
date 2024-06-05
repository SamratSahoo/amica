import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput } from 'react-native';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { blobToBase64 } from '@/utils/file';
import axios from 'axios';
import { getBaseUrl } from '@/utils/urls';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import DashboardFooter from '@/components/DashboardFooter';
import { User } from '@/utils/types';
import { appendCategoryToUser, getUser } from '@/actions/user';

export default function AudioScreen() {
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [category, setCategory] = useState<string>("")
    async function getUserData() {
        const user = await getUser();
        setCurrentUser(user);
    }

    useEffect(() => {

        getUserData().then().catch()
    }, [])

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

    const categoryAddHandler = async () => {
        await appendCategoryToUser(category);
        setCategory("")
        await getUserData()
    }

    return (
        <BaseOverlay header={<View style={styles.logo}>
            <View style={styles.logoTextContainer}>
                {!recording && <AntDesign name="meh" size={100} color={!recording ? "black" : 'red'} />}
                {recording && <Fontisto name="mad" size={100} color={!recording ? "black" : 'red'} />}
                <Text style={!recording ? styles.headerTitle : styles.headerTitleRed}>dashboard</Text>
            </View>
        </View>}
            body={<View style={styles.bodyContainer}>
                <TouchableOpacity
                    onPress={recording ? stopRecording : startRecording}
                    accessibilityLabel="Learn more about this purple button"
                    style={!recording ? styles.recordButton : styles.recordButtonActive}
                ><Text style={styles.recordButtonText}>start recording</Text></TouchableOpacity>
                <Text style={styles.dashboardHeader}>categories</Text>
                <View style={styles.categoryContainer}>
                    {currentUser?.categories.map((category, index) => {
                        return (
                            <View style={styles.roundPill} key={index}>
                                <Text style={styles.categoryPill}>{category}</Text>
                            </View>
                        )
                    })}
                </View>
                <View style={styles.categoryAddContainer}>
                    <TextInput
                        placeholder="new category"
                        onChangeText={(text) => setCategory(text)}
                        placeholderTextColor="#9da1a6"
                        style={styles.input}
                        value={category}
                    ></TextInput>
                    <TouchableOpacity style={styles.addButton}><Text style={styles.addText} onPress={async () => await categoryAddHandler()}>add</Text></TouchableOpacity>
                </View>

            </View>

            } footer={<DashboardFooter />}>
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
        paddingTop: 30,
        gap: 15
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
    },
    input: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 10,
        paddingLeft: 10,
        borderRadius: 10,
        backgroundColor: "white",
    },
    dashboardHeader: {
        fontWeight: "bold",
        fontSize: 14
    },
    categoryContainer: {
        flexDirection: "row",
        gap: 10,
        flexWrap: 'wrap'
    },
    categoryPill: {
        color: 'white'
    },
    roundPill: {
        backgroundColor: "black",
        borderRadius: 10,
        padding: 10,
    },
    addButton: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
    },
    addText: {
        color: 'white'

    },
    categoryAddContainer: {
        flexDirection: "row",
        gap: 10,
        alignItems: 'center',

    },
    headerTitle: {
        fontWeight: "bold",
        fontSize: 18
    },
    headerTitleRed: {
        fontWeight: "bold",
        fontSize: 18,
        color: 'red'
    }

});
