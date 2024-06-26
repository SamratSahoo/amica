import { userSendChat } from "@/actions/user";
import DashboardFooter from "@/components/DashboardFooter";
import BaseOverlay from "@/components/Overlays/BaseOverlay";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Animated } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';

interface BotMessage {
    isUser: boolean;
    message: string;
}

export default function ChatScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fadeInOut = () => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000, // Adjust the duration as needed
                    useNativeDriver: true,
                }),
            ]).start(() => {
                fadeInOut();
            });
        };

        fadeInOut();
    }, [fadeAnim]);
    const [chatMessage, setChatMessage] = useState<string>("")
    const [allMessages, setAllMessages] = useState<BotMessage[]>([{ isUser: false, message: 'how can i help u today' }])
    const [botTyping, setBotTyping] = useState<boolean>(false);
    const submitHandler = async () => {
        setBotTyping(true)
        const oldMessages = allMessages;
        setAllMessages([...allMessages, { isUser: true, message: chatMessage }])
        setChatMessage("")
        const resp = await userSendChat(chatMessage)
        setBotTyping(false)
        setAllMessages([...oldMessages, { isUser: true, message: chatMessage }, { isUser: false, message: resp.message }])
    }
    return (
        <BaseOverlay scrollBodyToBottom={true} header={<View style={styles.logo}>
            <View style={styles.logoTextContainer}>
                <AntDesign name="meho" size={100} />
                <Text style={styles.headerTitle}>ask meh anything .-.</Text>
            </View>
        </View>} body={
            <View style={styles.mainContainer}>
                <View style={styles.messageContainer}>
                    {allMessages.map((message, index) => {
                        return (
                            <View style={!message.isUser ? styles.botMessage : styles.userMessage} key={index}>
                                <Text style={!message.isUser ? styles.whiteText : styles.blackText}>{message.message}</Text>
                            </View>
                        )
                    })}
                </View>

            </View>} footer={

                <View style={styles.footerContainer}>
                    {botTyping && <Animated.View style={[
                        {
                            opacity: fadeAnim,
                        },
                    ]}
                    >
                        <Entypo name="typing" size={24} color="black" />
                    </Animated.View >}
                    <View style={styles.submitContainer}>
                        <TextInput
                            placeholder="message"
                            onChangeText={(text) => setChatMessage(text)}
                            placeholderTextColor="#9da1a6"
                            style={styles.input}
                            value={chatMessage}
                        ></TextInput>
                        <TouchableOpacity style={styles.addButton}><Text style={styles.addText} onPress={async () => await submitHandler()}>submit</Text></TouchableOpacity>
                    </View>
                    <DashboardFooter />
                </View>} />
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontWeight: "bold",
        fontSize: 18
    },
    logo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 10
    },
    footerContainer: {
        flexDirection: "column",
        gap: 10
    },
    submitContainer: {
        flexDirection: "row",
        gap: 10,
        alignItems: 'center',

    },
    mainContainer: {
        flexDirection: 'column',
        justifyContent: "space-between",
        gap: 10
    },
    input: {
        flex: 1,
        flexDirection: "row",
        paddingVertical: 10,
        paddingLeft: 10,
        borderRadius: 10,
        backgroundColor: "white",
    },
    logoTextContainer: {
        flexDirection: "column",
        gap: 20,
        alignItems: "center",
    },
    addButton: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 10,
    },
    addText: {
        color: 'white'

    },
    botMessage: {
        backgroundColor: 'black',
        width: '65%',
        padding: 10,
        borderRadius: 10
    },
    whiteText: {
        color: 'white'
    },
    blackText: {
        color: 'black'
    },
    userMessage: {
        backgroundColor: 'white',
        width: '65%',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-end'
    },
    messageContainer: {
        flexDirection: 'column',
        gap: 10
    }


});
