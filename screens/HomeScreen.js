import React, {useContext, useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ThemeContext} from "../context/ThemeContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import {KSS_SERVER_URL} from "../util/Config";
import Animated, {useSharedValue, useAnimatedStyle, withSequence, withTiming} from 'react-native-reanimated';

export default function HomeScreen({navigation}) {

    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastChecked, setLastChecked] = useState(null);
    const {isDarkTheme, themes} = useContext(ThemeContext);
    const theme = isDarkTheme ? themes.dark : themes.light;
    const unreadCountAnimation = useSharedValue(0);

    const checkConnection = async () => {
        setLastChecked(new Date());
        try {
            const response = await fetch(`${KSS_SERVER_URL}/api/kss/health`);
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
            const response = await fetch(`${KSS_SERVER_URL}/api/kss/events/unread`);
            if (response.status === 200) {

                const count = await response.text();
                const newCount = parseInt(count);

                if (newCount > 0) {
                    triggerShakeAnimation();
                }
                setUnreadCount(newCount);
            } else {
                setUnreadCount(-1);
            }
        } catch (error) {
            setUnreadCount(-1);
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: unreadCountAnimation.value }]
        };
    });

    const triggerShakeAnimation = () => {
        unreadCountAnimation.value = withSequence(
            withTiming(10, { duration: 100 }),
            withTiming(-10, { duration: 100 }),
            withTiming(10, { duration: 100 }),
            withTiming(0, { duration: 100 })
        );
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
            <Text style={[styles.title, {color: theme.text}]}>Witaj w KSS!</Text>
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
            {isConnected && <View style={styles.controlsContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}
                                                  style={{
                                                      padding: 10,
                                                      backgroundColor: theme.buttonBackground,
                                                      borderRadius: 5,
                                                      shadowColor: "#000",
                                                      elevation: 2,
                                                  }}>
                    <Text style={{color: theme.buttonText, backgroundColor: theme.buttonBackground}}>Włącz</Text>
                </TouchableOpacity>
                <Animated.View style={animatedStyle}>
                    <TouchableOpacity onPress={() => navigation.navigate('Events')}
                                      style={{...styles.eventsButton, backgroundColor: theme.buttonBackground}}>
                        <Text style={{ color: theme.buttonText, backgroundColor: theme.buttonBackground }}>
                            Historia zdarzeń
                        </Text>
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{unreadCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </Animated.View>
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
            </View> }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 200,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    controlsContainer: {
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
    },
    eventsButton: {
        padding: 10,
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
    },
});
