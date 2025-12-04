# 💪 Fitness App — AI Workout Coach

A modern fitness tracking and workout coaching application built with **React Native (Expo)** and powered by **OpenAI AI Coach**.  
The app provides personalized workout plans, smart chat-based coaching, exercise history tracking, and multi-language support.

---

## 🚀 Features

### 🤖 AI Personal Coach
- Chat with an intelligent AI fitness coach  
- Ask questions about training, nutrition, recovery  
- Coach adapts to your age, weight, fitness level, and goals  
- Fully supports **Finnish 🇫🇮 and English 🇬🇧**

### 🏋️ Personalized Workout Plans
- Automatically generates **1–3 month structured training programs**
- Includes weeks, sessions, exercises, reps, sets & rest times
- Custom plans for goals:  
  - Muscle Gain  
  - Fat Loss  
  - General Fitness  
- Plans adapt dynamically to history & user level

### 📆 Workout History
- Track your completed exercises  
- Easy-to-use logbook  
- Data stored locally

### ⚙️ Multi-language Settings
- Change app language in the settings menu  
- Entire UI + AI responses adapt instantly

### 💬 Smooth Chat UI
- Animated message bubbles  
- Controlled input field  
- Real-time responses from backend

---

## 🛠️ Tech Stack

### **Frontend**
- React Native (Expo)
- Context API (State management)
- Custom UI components
- i18n with custom translation module

### **Backend**
- Node.js + Express  
- OpenAI API (GPT-4.1-mini)  
- JSON-based structured plan generator  

---

## 📡 API Endpoints

### `POST /chat`
Used for AI conversation (training questions, advice, plan adjustments).

### `POST /plan`
Generates a full structured training plan (JSON).

---

## 📷 Screenshots
_Add screenshots here later for Play Store / App Store look._

---

## 🔧 Installation (Dev)

```bash
git clone https://github.com/YOUR-USERNAME/Fitness.git
cd Fitness
npm install
npx expo start
