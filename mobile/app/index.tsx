import { View, Text, StyleSheet, Button } from 'react-native';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function HomeScreen() {

    return (
        <Redirect href="/sign-in" />)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
