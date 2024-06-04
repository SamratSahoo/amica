import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import BaseOverlay from '@/components/Overlays/BaseOverlay';
import DashboardFooter from '@/components/DashboardFooter';
import { Ionicons } from '@expo/vector-icons';
import CalendarItemComponent from '@/components/CalendarItem';
import { useEffect, useState } from 'react';
import { CalendarItem } from '@/utils/types';
import { getCalendarItems } from '@/actions/calendar-items';
export default function CalendarScreen() {

    const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);

    useEffect(() => {
        async function calendarItemsGetter() {
            const items = await getCalendarItems()
            setCalendarItems([...items])
        }

        calendarItemsGetter().then().catch()

    }, [])
    return (
        <BaseOverlay header={<View style={styles.logo}>
            <View style={styles.logoTextContainer}>
                <Ionicons name="sad" size={100} color="black" />
                <Text style={styles.headerTitle}>your calendar</Text>
            </View>
            <Text></Text>
        </View>}
            body={<View style={styles.listContainer}>
                {calendarItems.map((item, index) => {
                    return (
                        <CalendarItemComponent item={item} key={index}></CalendarItemComponent>
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
