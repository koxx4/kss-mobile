import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import EventsScreen from './screens/EventsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

function AppInner() {
    const { isDarkTheme, themes } = useContext(ThemeContext);
    const theme = isDarkTheme ? themes.dark : themes.light;

    return (
        <NavigationContainer theme={{
            colors: {
                background: theme.background,
                text: theme.text,
                // Dodaj inne kolory z motywu, jeśli potrzebujesz
            }
        }}>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Events" component={EventsScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppInner />
        </ThemeProvider>
    );
}
