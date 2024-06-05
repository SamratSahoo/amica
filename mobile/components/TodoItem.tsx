import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { TodoItem } from "@/utils/types";
import Checkbox from 'expo-checkbox';
import { invertTodoItemCompletion } from "@/actions/todo-items";

export default function TodoItemComponent({ item }: { item: TodoItem }) {
    const [itemStatus, setItemsStatus] = useState<boolean>(false);

    useEffect(() => {
        setItemsStatus(item.complete)
    }, [])
    return (
        <TouchableOpacity style={styles.container} onPress={async () => {
            await invertTodoItemCompletion(item.id ?? "")
            setItemsStatus(!itemStatus)
        }}>
            <View style={styles.taskContainer}>
                <Text>{item.task}</Text>
            </View>

            <View style={styles.checkCategoryContainer}>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Checkbox value={itemStatus}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    checkCategoryContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    categoryContainer: {
        padding: 5,
        backgroundColor: 'black',
        borderRadius: 10
    },
    categoryText: {
        color: 'white'
    },
    taskContainer: {
        width: 250
    }
});
