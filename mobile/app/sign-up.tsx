import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import { Fontisto, SimpleLineIcons } from "@expo/vector-icons";
import ErrorBox from '@/components/ErrorBox';
import AntDesign from '@expo/vector-icons/AntDesign';
import { validateEmail } from '@/utils/string';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ErrorWrapper } from '@/utils/error';
import { auth } from '@/utils/firebase';
import { EndExecutionError } from '@/utils/types';
import { createUser } from '@/actions/user';

export default function HomeScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loginDisabled, setLoginDisable] = useState(false);
    const validateInput = () => {
        setErrorMessage("");
        if (!validateEmail(email)) {
            setErrorMessage("Registration Failed — Invalid email");
            return false;
        }

        if (password.trim() === "") {
            setErrorMessage("Registration Failed — Password cannot be empty");
            return false;
        }

        if (confirmPassword !== password) {
            setErrorMessage("Registration Failed — Passwords don't match");
            return false;
        }

        return true;
    };

    const handleSignUp = async () => {
        try {
            await auth.signOut().then().catch();
            const userCredentials = await ErrorWrapper({
                functionToExecute: createUserWithEmailAndPassword,
                errorHandler: setErrorMessage,
                parameters: [auth, email, password],
                customErrors: {
                    "Firebase: Error (auth/email-already-in-use).":
                        "This email is already in use",
                    "Firebase: Password should be at least 6 characters (auth/weak-password).":
                        "Your password must be at least 6 characters",
                },
            });

            await createUser(email, userCredentials.user.uid)
            router.push('/dashboard')
        } catch (error) {
            if (error instanceof EndExecutionError) {
                return;
            } else {
                throw error;
            }
        }
    }; return (
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
                                <View style={styles.inputContainer}>
                                    <SimpleLineIcons name="lock" size={20} color="grey" />
                                    <TextInput
                                        placeholder="confirm password"
                                        onChangeText={(text) => setConfirmPassword(text)}
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
                                        const result = await handleSignUp();
                                        setLoginDisable(false);
                                    }}
                                    style={styles.button}
                                >
                                    <Text style={styles.btnText}>sign up</Text>
                                </TouchableOpacity>
                                <View style={styles.forgotContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            router.replace('/sign-in')
                                        }}
                                    >
                                        <Text style={styles.forgotText}>login to account</Text>
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
