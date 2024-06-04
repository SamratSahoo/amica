import React from "react";
import { Text, StyleSheet, View } from 'react-native';
import { TodoItem } from "@/utils/types";
import Checkbox from 'expo-checkbox';

export default function TodoItemComponent({ item }: { item: TodoItem }) {
    return (
        <View style={styles.container}>
            <Text>{item.name}</Text>
            <Checkbox value={item.complete} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: 'white'
    }
});
