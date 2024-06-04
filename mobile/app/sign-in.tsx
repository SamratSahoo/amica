import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import { Fontisto, SimpleLineIcons } from "@expo/vector-icons";
import ErrorBox from '@/components/ErrorBox';
import AntDesign from '@expo/vector-icons/AntDesign';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ErrorWrapper } from '@/utils/error';
import { auth } from '@/utils/firebase';
import { EndExecutionError } from '@/utils/types';

export default function HomeScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loginDisabled, setLoginDisable] = useState(false);

    const handleLogin = async () => {
        try {
            setErrorMessage("");
            await signOut(auth).then().catch();
            await ErrorWrapper({
                functionToExecute: signInWithEmailAndPassword,
                errorHandler: setErrorMessage,
                parameters: [auth, email, password],
                customErrors: {
                    "Firebase: Error (auth/invalid-email).": "This email is invalid",
                    "Firebase: Error (auth/user-not-found).":
                        "There is no user record corresponding to this email",
                    "Firebase: Error (auth/internal-error).":
                        "An error occurred when trying to authenticate",
                    "Firebase: Error (auth/wrong-password).":
                        "Invalid email/password combination",
                },
            });
            router.push('/record')
            // const user = await ErrorWrapper({
            //   functionToExecute: userGetUserInfo,
            //   errorHandler: setErrorMessage,
            // });
            // return user;
        } catch (error) {
            if (error instanceof EndExecutionError) {
                return;
            } else {
                throw error;
            }
        }
    }
    return (
        <BaseOverlay
            header={<View style={styles.logo}>
                <View style={styles.logoTextContainer}>
                    <Text>say hi to meh:</Text>
                    <AntDesign name="meh" size={100} color="black" />
                    <Text>your (kinda) intelligent secretary.</Text>
                </View>
                <Text></Text>
            </View>}
            body={<TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                <View>
                    <KeyboardAvoidingView style={styles.container}>
                        <View style={styles.bodyContainer}>
                            <View>
                                <View style={styles.inputContainer}>
                                    <Fontisto name="email" size={20} color="grey" />
                                    <TextInput
                                        placeholder="email"
                                        placeholderTextColor="#9da1a6"
                                        onChangeText={(text) => setEmail(text)}
                                        style={styles.input}
                                    ></TextInput>
                                </View>
                                <View style={styles.inputContainer}>
                                    <SimpleLineIcons name="lock" size={20} color="grey" />
                                    <TextInput
                                        placeholder="password"
                                        onChangeText={(text) => setPassword(text)}
                                        placeholderTextColor="#9da1a6"
                                        style={styles.input}
                                        secureTextEntry
                                    ></TextInput>
                                </View>
                            </View>
                            <ErrorBox errorMessage={errorMessage} />
                            <View
                                style={[
                                    styles.buttonContainer,
                                    loginDisabled
                                        ? styles.disabledButton
                                        : styles.buttonContainer,
                                ]}
                            >
                                <TouchableOpacity
                                    disabled={loginDisabled}
                                    onPress={async () => {
                                        setLoginDisable(true);
                                        const result = await handleLogin();
                                        setLoginDisable(false);
                                    }}
                                    style={styles.button}
                                >
                                    <Text style={styles.btnText}>sign in</Text>
                                </TouchableOpacity>
                                <View style={styles.forgotContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            router.push('/sign-up')
                                        }}
                                    >
                                        <Text style={styles.forgotText}>create an account</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F2F2F2",
        marginBottom: 10,
    },

    headerContainer: {
        flex: 2,
        marginTop: 75,
    },

    bodyContainer: {
        flex: 3,
        marginTop: 25,
        alignItems: "center",
    },

    footerContainer: {
        flex: 1,
        marginTop: 225,
    },

    loginText: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 15,
    },

    inputContainer: {
        flexDirection: "row",
        marginTop: 15,
        paddingVertical: 10,
        paddingLeft: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        minWidth: "100%",
        backgroundColor: "white",
    },

    input: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 5,
        paddingLeft: 10,
        borderRadius: 10,
        backgroundColor: "white",
    },

    buttonContainer: {
        marginTop: 15,
        alignItems: "center",
    },

    button: {
        marginTop: 10,
        padding: 15,
        alignItems: "center",
        borderRadius: 10,
        minWidth: "100%",
        backgroundColor: "black",
    },

    btnText: {
        color: "white",
    },

    forgotContainer: {
        marginTop: 20,
        alignItems: "center",
    },

    forgotText: {
        color: "#666666",
        fontWeight: "400",
    },

    failedContainer: {
        marginTop: 24,
        alignItems: "center",
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        minWidth: "100%",
        backgroundColor: "#FF8E8E50",
        borderColor: "#C63636",
    },

    failedText: {
        fontSize: 12,
        fontWeight: "400",
        color: "#C63636",
    },

    footerTextContainer: {
        alignItems: "center",
        justifyContent: "center",
    },

    footerText: {
        fontWeight: "200",
    },

    signupText: {
        fontWeight: "400",
    },
    disabledButton: {
        opacity: 0.5,
    },
    logo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    logoTextContainer: {
        flexDirection: "column",
        gap: 20,
        alignItems: "center"
    }
});
