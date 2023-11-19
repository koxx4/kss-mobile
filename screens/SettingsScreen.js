import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

export default function SettingsScreen() {
    const { isDarkTheme, setIsDarkTheme, themes } = useContext(ThemeContext);
    const theme = isDarkTheme ? themes.dark : themes.light;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Ustawienia</Text>
            <View style={styles.settingItem}>
                <Text style={[styles.settingText, { color: theme.text }]}>Tryb ciemny</Text>
                <Switch
                    value={isDarkTheme}
                    onValueChange={(value) => setIsDarkTheme(value)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        padding: 10,
        marginBottom: 10
    },
    settingText: {
        fontSize: 18,
    },
});
