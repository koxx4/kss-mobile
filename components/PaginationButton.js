import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const PaginationButton = ({onPress, iconName, text, disabled}) => {
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={styles.button}>
            <View style={styles.buttonContent}>
                <Ionicons name={iconName} size={24} color="blue"/>
                <Text style={styles.buttonText}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        // Styl dla przycisku
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 5,
        color: 'blue',
    },
});

export default PaginationButton;
