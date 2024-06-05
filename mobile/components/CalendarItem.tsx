import React from "react";
import { Text, StyleSheet, View } from 'react-native';
import { CalendarItem } from "@/utils/types";

export default function CalendarItemComponent({ item }: { item: CalendarItem }) {
    return (
        <View style={styles.container}>
            <View>
                <Text>{item.event}</Text>
                <Text>{`${item.month}/${item.day}/${item.year}`}</Text>
            </View>
            <Text>{item.time}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: "center"
    }
});
