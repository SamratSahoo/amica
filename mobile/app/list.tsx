import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { blobToBase64 } from '@/utils/file';
import axios from 'axios';
import { getBaseUrl } from '@/utils/urls';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import { AntDesign, Fontisto } from '@expo/vector-icons';
import DashboardFooter from '@/components/DashboardFooter';
import { FontAwesome5 } from '@expo/vector-icons';
import TodoItemComponent from '@/components/TodoItem';
import { getTodoItems } from '@/actions/todo-items';
import { TodoItem } from '@/utils/types';
export default function ListScreen() {

    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
    useEffect(() => {
        async function todoItemsGetter() {
            const items = await getTodoItems()
            setTodoItems([...items])
        }

        todoItemsGetter().then().catch()

    }, [])

    return (
        <BaseOverlay header={<View style={styles.logo}>
            <View style={styles.logoTextContainer}>
                <FontAwesome5 name="sad-cry" size={100} color="black" />
                <Text style={styles.headerTitle}>your to-do list</Text>
            </View>
            <Text></Text>
        </View>}
            body={<View style={styles.listContainer}>
                {todoItems.map((item, index) => {
                    return (
                        <TodoItemComponent item={item} key={index}></TodoItemComponent>
                    )
                })}
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
    listContainer: {
        flexDirection: "column",
        gap: 10,
        paddingTop: 10
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
        paddingTop: 40
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
    headerTitle: {
        fontWeight: "bold",
        fontSize: 18
    }
});
