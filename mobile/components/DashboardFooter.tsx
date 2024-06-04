import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { FOOTER_TABS } from "@/utils/constants";
import { usePathname } from "expo-router";

export default function DashboardFooter() {
    const pathName = usePathname();
    return (
        <View style={styles.container}>
            {FOOTER_TABS.map((tab, index) => {
                return (
                    <View>
                        {tab && <TouchableOpacity style={styles.tabContainer} key={index} onPress={() => {
                            if (tab.callback && pathName !== tab.url) {
                                tab.callback();
                            }
                        }}>
                            <tab.logoClass name={tab.logoName as any} size={24}></tab.logoClass>
                            <Text>{tab?.label}</Text>
                        </TouchableOpacity>}
                    </View>
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-around",
        paddingTop: 10
    },
    tabContainer: {
        flexDirection: "column",
        gap: 8,
        alignItems: 'center'
    }
});
