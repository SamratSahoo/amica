import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import DashboardFooter from '@/components/DashboardFooter';
import { Ionicons } from '@expo/vector-icons';
import CalendarItem from '@/components/CalendarItem';
export default function CalendarScreen() {
    const calendarItems = [
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
        { name: "do the laundry", date: new Date() }, { name: "walk the dog", date: new Date() }, { name: "eat tarantulas", date: new Date() },
    ]
    return (
        <BaseOverlay header={<View style={styles.logo}>
            <View style={styles.logoTextContainer}>
                <Ionicons name="sad" size={100} color="black" />
            </View>
            <Text></Text>
        </View>}
            body={<View style={styles.listContainer}>
                {calendarItems.map((item, index) => {
                    return (
                        <CalendarItem item={item} key={index}></CalendarItem>
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
    }
});
