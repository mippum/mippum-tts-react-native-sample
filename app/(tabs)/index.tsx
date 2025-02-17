import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { Platform, SafeAreaView } from 'react-native';
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
    const [text, setText] = useState<string>('Hello. This is TTS example.');
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    const handleSpeak = () => {
        if (text.trim()) {
            setIsSpeaking(true);
            Speech.speak(text, {
                language: 'en', // language setting (example: 'en' = english)
                rate: 0.5,      // speed setting (0.0 ~ 1.0)
                pitch: 1.0,     // voice pitch setting (0.5 ~ 2.0)
            });
        }
    };

    const handleStop = () => {
        Speech.stop().then();
        setIsSpeaking(false);
    };

    const handleTextChange = (input: string) => {
        setText(input);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={'dark'} />

            <Text style={styles.header}>Expo Speech Example</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter text to speak"
                value={text}
                onChangeText={handleTextChange}
            />

            <View style={styles.buttonContainer}>
                <Button title="Speak" onPress={handleSpeak} disabled={isSpeaking} />
                <Button title="Stop" onPress={handleStop} disabled={!isSpeaking} />
            </View>

            <Text style={styles.footer}>
                {isSpeaking ? 'Speaking...' : 'Ready to Speak'}
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? 30:0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff'
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    footer: {
        fontSize: 16,
        color: '#777',
    },
});
