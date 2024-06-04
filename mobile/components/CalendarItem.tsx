import React from "react";
import { Text, StyleSheet, View } from 'react-native';
import { CalendarItem } from "@/utils/types";
import { getFormattedDate } from "@/utils/string";

export default function CalendarItemComponent({ item }: { item: CalendarItem }) {
    return (
        <View style={styles.container}>
            <View>
                <Text>{item.name}</Text>
                <Text>{getFormattedDate(item.date.seconds)}</Text>
            </View>
            <Text>{new Date(item.date.seconds * 1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
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