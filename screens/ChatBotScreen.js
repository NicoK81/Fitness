// screens/ChatBotScreen.js
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import style from '../Styles/style';
import { WorkoutContext } from './WorkoutContext';
import { LanguageContext } from './LanguageContext';

// VAIHDA TÄHÄN oma IPv4-osoite (ipconfig), esim. 192.168.1.72
const API_URL = 'http://192.168.1.72:3000';

// Alkuviestit kielen mukaan
const getInitialMessages = (language) => [
  {
    id: '1',
    from: 'bot',
    text:
      language === 'fi'
        ? 'Moikka! Olen treenibottisi 👋 Aloitetaan parilla kysymyksellä.'
        : "Hi! I'm your workout coach bot 👋 Let's start with a couple of questions.",
  },
  {
    id: '2',
    from: 'bot',
    text:
      language === 'fi'
        ? 'Mikä on ikäsi?'
        : 'What is your age?',
  },
];

// Yksi viestibubble animaatiolla
function AnimatedMessage({ isUser, text }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
    Animated.timing(translateY, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        style.messageRow,
        isUser ? style.messageUser : style.messageBot,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={style.messageText}>{text}</Text>
    </Animated.View>
  );
}

export default function ChatBotScreen() {
  const { workouts } = useContext(WorkoutContext);
  const { language } = useContext(LanguageContext); // fi / en

  const [messages, setMessages] = useState(() =>
    getInitialMessages(language)
  );

  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState(null);
  const [goal, setGoal] = useState(null);
  const [months, setMonths] = useState(null);
  const [plan, setPlan] = useState(null);

  // 0: ikä, 1: paino, 2: kuntotaso, 3: tavoite, 4: kuukausimäärä, 5: vapaa chat
  const [step, setStep] = useState(0);

  const [input, setInput] = useState('');
  const [numericInput, setNumericInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Jos kieli vaihtuu Settingsistä, nollataan keskustelu
  useEffect(() => {
    setMessages(getInitialMessages(language));
    setAge('');
    setWeight('');
    setFitnessLevel(null);
    setGoal(null);
    setMonths(null);
    setPlan(null);
    setStep(0);
    setInput('');
    setNumericInput('');
  }, [language]);

  const pushMessage = (from, text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), from, text },
    ]);
  };

  // ---------- IKÄ / PAINO ----------

  const handleNumericAnswer = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const num = parseInt(trimmed, 10);
    if (isNaN(num) || num <= 0) {
      pushMessage(
        'bot',
        language === 'fi'
          ? 'Syötäthän positiivisen numeron 😊'
          : 'Please enter a positive number 😊'
      );
      return;
    }

    pushMessage('user', trimmed);

    if (step === 0) {
      setAge(trimmed);
      pushMessage(
        'bot',
        language === 'fi'
          ? 'Kiitos! Mikä on painosi (kg)?'
          : 'Thanks! What is your weight (kg)?'
      );
      setStep(1);
    } else if (step === 1) {
      setWeight(trimmed);
      pushMessage(
        'bot',
        language === 'fi'
          ? 'Hyvä! Valitse kuntotasosi: Aloittelija, Keskitaso vai Edistynyt?'
          : 'Great! Choose your fitness level: Beginner, Intermediate or Advanced.'
      );
      setStep(2);
    }

    setNumericInput(''); // tyhjennä kenttä aina
  };

  // ---------- KUNTOTASO / TAVOITE / KUUKAUDET ----------

  const handleSelectFitness = (value) => {
    setFitnessLevel(value);
    pushMessage('user', value);
    pushMessage(
      'bot',
      language === 'fi'
        ? 'Hienoa! Mikä on tärkein tavoitteesi: Lihasmassa, Laihtuminen vai Kunto?'
        : 'Nice! What is your main goal: muscle gain, fat loss or general fitness?'
    );
    setStep(3);
  };

  const handleSelectGoal = (value) => {
    setGoal(value);
    pushMessage('user', value);
    pushMessage(
      'bot',
      language === 'fi'
        ? 'Monenko kuukauden ohjelman haluat? Valitse 1, 2 tai 3 kuukautta.'
        : 'How many months do you want your plan for? Choose 1, 2 or 3 months.'
    );
    setStep(4);
  };

  const handleSelectMonths = async (value) => {
    setMonths(value);
    pushMessage(
      'user',
      language === 'fi' ? `${value} kk ohjelma` : `${value} month plan`
    );
    pushMessage(
      'bot',
      language === 'fi'
        ? 'Laadin sinulle ohjelmaa, odota pieni hetki...'
        : 'Creating your plan, just a moment...'
    );
    await requestPlan(value);
    setStep(5);
  };

  // ---------- VAPAA CHAT /chat ----------

  const handleFreeChatSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();

    pushMessage('user', text);
    setInput('');

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          profile: { age, weight, fitnessLevel, goal },
          plan,
          language,
        }),
      });

      const data = await res.json();

      pushMessage(
        'bot',
        data.reply ||
          (language === 'fi'
            ? 'En saanut vastausta palvelimelta, tarkista backend.'
            : 'I did not get a reply from the server, please check the backend.')
      );
    } catch (err) {
      console.log('Chat fetch error:', err);
      pushMessage(
        'bot',
        language === 'fi'
          ? 'En saanut yhteyttä palvelimeen. Onko backend käynnissä?'
          : 'Could not reach the server. Is the backend running?'
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------- /plan – OHJELMA KORTTEINA ----------

  const requestPlan = async (monthsValue) => {
    try {
      setLoadingPlan(true);

      const res = await fetch(`${API_URL}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          months: monthsValue,
          profile: { age, weight, fitnessLevel, goal },
          workouts,
          language,
        }),
      });

      const data = await res.json();

      if (!data.plan) {
        pushMessage(
          'bot',
          language === 'fi'
            ? 'En saanut ohjelmaa palvelimelta. Tarkista backend tai kokeile myöhemmin uudelleen.'
            : 'I could not get a plan from the server. Check the backend or try again later.'
        );
        return;
      }

      setPlan(data.plan); // tallennetaan ohjelma korttinäkymää varten

      pushMessage(
        'bot',
        language === 'fi'
          ? 'Tässä sinulle ohjelmakortit alle. Kerro jos haluat muuttaa jotain.'
          : 'Here are your workout plan cards below. Tell me if you want to change anything.'
      );
    } catch (err) {
      console.log('Plan fetch error:', err);
      pushMessage(
        'bot',
        language === 'fi'
          ? 'En saanut yhteyttä ohjelmapalvelimeen. Onko backend varmasti käynnissä ja samaan verkkoon yhdistettynä?'
          : 'Could not reach the plan server. Is the backend running and on the same network?'
      );
    } finally {
      setLoadingPlan(false);
    }
  };

  // ---------- UI-APUFUNKTIOT ----------

  const renderItem = ({ item }) => {
    const isUser = item.from === 'user';
    return <AnimatedMessage isUser={isUser} text={item.text} />;
  };

  const SelectButton = ({ label, value, selected, onPress }) => (
    <TouchableOpacity
      onPress={() => onPress(value)}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        margin: 5,
        backgroundColor: selected ? '#2962ff' : '#333',
        borderRadius: 10,
      }}
    >
      <Text style={{ color: '#fff' }}>{label}</Text>
    </TouchableOpacity>
  );

  const currentPlaceholder =
    step === 0
      ? language === 'fi'
        ? 'Kirjoita ikäsi'
        : 'Type your age'
      : language === 'fi'
      ? 'Kirjoita painosi (kg)'
      : 'Type your weight (kg)';

  const currentLabel =
    step === 0
      ? language === 'fi'
        ? 'Ikä:'
        : 'Age:'
      : language === 'fi'
      ? 'Paino (kg):'
      : 'Weight (kg):';

  // ---------- RENDER ----------

  return (
    <KeyboardAvoidingView
      style={style.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* CHAT-VIESTIT */}
      <FlatList
        style={style.chatMessages}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ flexDirection: 'column-reverse' }}
      />

      {/* OHJELMA-KORTIT */}
      {plan && (
        <ScrollView style={style.planContainer}>
          {(plan.weeks || []).map((week) => (
            <View
              key={week.weekNumber}
              style={style.planWeekCard}
            >
              <Text style={style.planWeekTitle}>
                {language === 'fi'
                  ? `Viikko ${week.weekNumber}`
                  : `Week ${week.weekNumber}`}
              </Text>

              {(week.sessions || []).map((session, i) => (
                <View
                  key={i}
                  style={style.planSessionRow}
                >
                  <Text style={style.planSessionDay}>
                    {session.day} ({session.focus})
                  </Text>
                  {session.notes ? (
                    <Text style={style.planSessionFocus}>
                      {session.notes}
                    </Text>
                  ) : null}
                  {(session.exercises || []).map((ex, j) => (
                    <Text
                      key={j}
                      style={style.planExerciseText}
                    >
                      • {ex.name}{' '}
                      {ex.sets ? `${ex.sets} x ${ex.reps}` : ex.reps}{' '}
                      {ex.restSeconds
                        ? language === 'fi'
                          ? `(${ex.restSeconds}s palautus)`
                          : `(${ex.restSeconds}s rest)`
                        : ''}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* IKÄ / PAINO */}
      {(step === 0 || step === 1) && (
        <View style={{ paddingBottom: 10 }}>
          <Text style={style.label}>{currentLabel}</Text>
          <View style={style.chatInputRow}>
            <TextInput
              style={style.chatInput}
              keyboardType="numeric"
              placeholder={currentPlaceholder}
              placeholderTextColor="#888"
              value={numericInput}
              onChangeText={setNumericInput}
              onSubmitEditing={() =>
                handleNumericAnswer(numericInput)
              }
              returnKeyType="send"
            />
          </View>
          <Text style={{ color: '#777', marginTop: 4 }}>
            {language === 'fi'
              ? 'Kirjoita vastaus ja paina Enter / send.'
              : 'Type your answer and press Enter / send.'}
          </Text>
        </View>
      )}

      {/* KUNTOTASO */}
      {step === 2 && (
        <View style={{ paddingBottom: 10 }}>
          <Text style={style.label}>
            {language === 'fi'
              ? 'Valitse kuntotaso:'
              : 'Choose fitness level:'}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <SelectButton
              label={language === 'fi' ? 'Aloittelija' : 'Beginner'}
              value={language === 'fi' ? 'Aloittelija' : 'Beginner'}
              selected={
                fitnessLevel === 'Aloittelija' ||
                fitnessLevel === 'Beginner'
              }
              onPress={handleSelectFitness}
            />
            <SelectButton
              label={language === 'fi' ? 'Keskitaso' : 'Intermediate'}
              value={language === 'fi' ? 'Keskitaso' : 'Intermediate'}
              selected={
                fitnessLevel === 'Keskitaso' ||
                fitnessLevel === 'Intermediate'
              }
              onPress={handleSelectFitness}
            />
            <SelectButton
              label={language === 'fi' ? 'Edistynyt' : 'Advanced'}
              value={language === 'fi' ? 'Edistynyt' : 'Advanced'}
              selected={
                fitnessLevel === 'Edistynyt' ||
                fitnessLevel === 'Advanced'
              }
              onPress={handleSelectFitness}
            />
          </View>
        </View>
      )}

      {/* TAVOITE */}
      {step === 3 && (
        <View style={{ paddingBottom: 10 }}>
          <Text style={style.label}>
            {language === 'fi'
              ? 'Valitse tavoite:'
              : 'Choose goal:'}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <SelectButton
              label={language === 'fi' ? 'Lihasmassa' : 'Muscle gain'}
              value={language === 'fi' ? 'Lihasmassa' : 'Muscle gain'}
              selected={
                goal === 'Lihasmassa' || goal === 'Muscle gain'
              }
              onPress={handleSelectGoal}
            />
            <SelectButton
              label={language === 'fi' ? 'Laihtuminen' : 'Fat loss'}
              value={language === 'fi' ? 'Laihtuminen' : 'Fat loss'}
              selected={
                goal === 'Laihtuminen' || goal === 'Fat loss'
              }
              onPress={handleSelectGoal}
            />
            <SelectButton
              label={language === 'fi' ? 'Kunto' : 'Fitness'}
              value={language === 'fi' ? 'Kunto' : 'Fitness'}
              selected={goal === 'Kunto' || goal === 'Fitness'}
              onPress={handleSelectGoal}
            />
          </View>
        </View>
      )}

      {/* KUUKAUDET */}
      {step === 4 && (
        <View style={{ paddingBottom: 10 }}>
          <Text style={style.label}>
            {language === 'fi'
              ? 'Kuinka monta kuukautta?'
              : 'How many months?'}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <SelectButton
              label={language === 'fi' ? '1 kk' : '1 month'}
              value={1}
              selected={months === 1}
              onPress={handleSelectMonths}
            />
            <SelectButton
              label={language === 'fi' ? '2 kk' : '2 months'}
              value={2}
              selected={months === 2}
              onPress={handleSelectMonths}
            />
            <SelectButton
              label={language === 'fi' ? '3 kk' : '3 months'}
              value={3}
              selected={months === 3}
              onPress={handleSelectMonths}
            />
          </View>
          {loadingPlan && (
            <Text style={{ color: '#fff', marginTop: 4 }}>
              {language === 'fi'
                ? 'Laadin ohjelmaa...'
                : 'Generating plan...'}
            </Text>
          )}
        </View>
      )}

      {/* VAPAA CHAT */}
      {step === 5 && (
        <View style={style.chatInputRow}>
          <TextInput
            style={style.chatInput}
            value={input}
            onChangeText={setInput}
            placeholder={
              language === 'fi'
                ? 'Kirjoita viesti...'
                : 'Type a message...'
            }
            placeholderTextColor="#888"
            onSubmitEditing={handleFreeChatSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={style.sendButton}
            onPress={handleFreeChatSend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <MaterialCommunityIcons
                name="send-circle"
                size={32}
                color="#2962ff"
              />
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
