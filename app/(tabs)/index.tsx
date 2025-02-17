import React, { useState, useEffect  } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { Platform, SafeAreaView } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { Picker } from '@react-native-picker/picker';
import wait from "waait";

export default function HomeScreen() {
    const [text, setText] = useState<string>('Hello. This is TTS example.');
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [availableVoices, setAvailableVoices] = useState<Speech.Voice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>('');

    useEffect(() => {
        const fetchVoices = async () => {
            const voices = await Speech.getAvailableVoicesAsync();
            if(voices.length > 0) {
                setAvailableVoices(voices);
                setSelectedVoice(voices[0].identifier);
            } else {
                console.log('The voices are empty.');
                await wait(100);
                const voicesReloaded = await Speech.getAvailableVoicesAsync();
                setAvailableVoices(voicesReloaded);
                if (voicesReloaded.length > 0) {
                    setSelectedVoice(voicesReloaded[0].identifier);
                }
            }
        };
        fetchVoices().then();
    }, []);

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

    const handleVoiceChange = (voice: string) => {
        setSelectedVoice(voice);
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

                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Select Voice:</Text>
                    <Picker
                        selectedValue={selectedVoice}
                        onValueChange={handleVoiceChange}
                        style={styles.picker}
                    >
                        {availableVoices.map((voice) => (
                            <Picker.Item key={voice.identifier} label={voice.name} value={voice.identifier} />
                        ))}
                    </Picker>
                </View>

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
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerContainer: {
        width: '100%',
        marginBottom: 20,
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
