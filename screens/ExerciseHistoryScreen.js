// screens/ExerciseHistoryScreen.js
import React, { useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { WorkoutContext } from './WorkoutContext';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import style from '../Styles/style';

export default function ExerciseHistoryScreen() {
  const { workouts, unit } = useContext(WorkoutContext);

  const convertDistance = (distance) => {
    return unit === 'miles'
      ? (distance / 1.60934).toFixed(2)
      : distance.toFixed(2);
  };

  const sumDistancesBySport = (sport) => {
    return workouts
      .filter((workout) => workout.sport === sport)
      .reduce(
        (sum, workout) =>
          sum +
          (unit === 'miles'
            ? workout.distance / 1.60934
            : workout.distance),
        0
      )
      .toFixed(2);
  };

  const getSportIcon = (sport) => {
    switch (sport) {
      case 'Running':
        return <FontAwesome5 name="running" size={24} color="#3b82f6" />;
      case 'Cycling':
        return <FontAwesome name="bicycle" size={24} color="#3b82f6" />;
      case 'Swimming':
        return <FontAwesome5 name="swimmer" size={24} color="#3b82f6" />;
      case 'Walking':
        return <FontAwesome5 name="walking" size={24} color="#3b82f6" />;
      default:
        return null;
    }
  };

  const renderWorkout = ({ item }) => (
    <View style={style.workoutItem}>
      <View style={style.iconContainer}>{getSportIcon(item.sport)}</View>
      <View>
        <Text style={style.historyText}>Sport: {item.sport}</Text>
        <Text style={style.historyText}>
          Distance: {convertDistance(item.distance)} {unit}
        </Text>
        <Text style={style.historyText}>
          Duration: {item.duration} minutes
        </Text>
        <Text style={style.historyText}>
          Date: {new Date(item.date).toDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={style.container}>
      <Text style={style.screenTitle}>History</Text>

      <View style={style.statsContainer}>
        <Text style={style.statsText}>
          Total Running Distance: {sumDistancesBySport('Running')} {unit}
        </Text>
        <Text style={style.statsText}>
          Total Cycling Distance: {sumDistancesBySport('Cycling')} {unit}
        </Text>
        <Text style={style.statsText}>
          Total Swimming Distance: {sumDistancesBySport('Swimming')} {unit}
        </Text>
        <Text style={style.statsText}>
          Total Walking Distance: {sumDistancesBySport('Walking')} {unit}
        </Text>
      </View>

      <FlatList
        data={workouts}
        renderItem={renderWorkout}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
