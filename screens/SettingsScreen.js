// screens/SettingsScreen.js
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { WorkoutContext } from './WorkoutContext';
import style from '../Styles/style';
import { LanguageContext } from './LanguageContext';


export default function SettingsScreen() {
    const { unit, setUnit } = useContext(WorkoutContext);
    const { language, setLanguage } = useContext(LanguageContext);

    return (
        <View style={style.container}>
            <Text style={style.screenTitle}>Settings</Text>

            <View style={style.sectionCard}>
                <Text style={style.label}>Choose unit</Text>
                <RadioButton.Group
                    onValueChange={(newUnit) => setUnit(newUnit)}
                    value={unit}
                >
                    <View style={style.radioContainer}>
                        <Text style={style.settingsText}>Kilometers</Text>
                        <RadioButton value="km" />
                    </View>
                    <View style={style.radioContainer}>
                        <Text style={style.settingsText}>Miles</Text>
                        <RadioButton value="miles" />
                    </View>
                </RadioButton.Group>

                <View style={style.sectionCard}>
                    <Text style={style.label}>Select language</Text>

                    <RadioButton.Group
                        onValueChange={(newLang) => setLanguage(newLang)}
                        value={language}
                    >
                        <View style={style.radioContainer}>
                            <Text style={style.settingsText}>Suomi</Text>
                            <RadioButton value="fi" />
                        </View>

                        <View style={style.radioContainer}>
                            <Text style={style.settingsText}>English</Text>
                            <RadioButton value="en" />
                        </View>
                    </RadioButton.Group>
                </View>

            </View>
        </View>
    );
}
