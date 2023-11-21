import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from "../context/ThemeContext";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen({navigation}) {

    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastChecked, setLastChecked] = useState(null);
    const {isDarkTheme, themes} = useContext(ThemeContext);
    const theme = isDarkTheme ? themes.dark : themes.light;

    const checkConnection = async () => {
        setLastChecked(new Date());
        try {
            const response = await fetch('http://localhost:8080/api/kss/health');
            if (response.status === 200) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        } catch (error) {
            setIsConnected(false);
        }
    };

    const checkUnreadCount = async () => {

        if (!isConnected) return;

        try {
            const response = await fetch('http://localhost:8080/api/kss/events/unread');
            if (response.status === 200) {

                const count = await response.text();

                setUnreadCount(parseInt(count));
            } else {
                setUnreadCount(-1);
            }
        } catch (error) {
            setUnreadCount(-1);
        }
    };

    useEffect(() => {
        const interval = setInterval(checkConnection, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(checkUnreadCount, 2000);

        return () => clearInterval(interval);
    }, [isConnected]);


    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <View style={styles.lastCheckedContainer}>
                {isConnected ? <Ionicons name="md-checkmark-circle" size={32} color="green"/> :
                    <Ionicons name="md-alert-circle" size={32} color="red"/>}
                <Text>{isConnected ? 'Połączono z urządzeniem' : 'Brak połączenia z urządzeniem'}</Text>
                {lastChecked && (
                    <Text style={styles.lastCheckedText}>
                        Ostatnie sprawdzenie: {lastChecked.toLocaleString()}
                    </Text>
                )}
                {!isConnected && <ActivityIndicator size="large" color="#0000ff"/>}
            </View>
            <Text style={[styles.title, {color: theme.text}]}>Witaj w KSS!</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}
                              style={{
                                  padding: 10,
                                  backgroundColor: theme.buttonBackground,
                                  borderRadius: 5,
                                  flex: 1,
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: 10,
                                  maxHeight: 40,
                                  shadowColor: "#000",
                                  shadowOffset: {
                                      width: 0,
                                      height: 1,
                                  },
                                  shadowOpacity: 0.1,
                                  shadowRadius: 1.00,
                                  elevation: 2,
                              }}>
                <Text style={{color: theme.buttonText, backgroundColor: theme.buttonBackground}}>Historia zdarzeń</Text>
                {unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{unreadCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}
                              style={{
                                  padding: 10,
                                  backgroundColor: theme.buttonBackground,
                                  borderRadius: 5,
                                  shadowColor: "#000",
                                  elevation: 2,
                              }}>
                <Text style={{color: theme.buttonText, backgroundColor: theme.buttonBackground}}>Ustawienia</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    lastCheckedText: {
        fontSize: 12,
        marginTop: 5,
    },
    lastCheckedContainer: {
        gap: 5,
        backgroundColor: '#e9f3bc',
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1.00,
        elevation: 2,
    },
    unreadBadge: {
        minWidth: 25,
        height: 25,
        borderRadius: 15,
        backgroundColor: '#CA3C25',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: 'white',
        fontSize: 12,
    }
});
