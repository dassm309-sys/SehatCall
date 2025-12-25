  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
# 🏥 SehatCall: Digital Healthcare Platform for Rural India

> **A multilingual, offline-first telemedicine application engineered to bridge the healthcare gap in low-connectivity regions.**

![Project Banner](public/banner.png)
## 📄 Project Overview
SehatCall is a progressive web application designed to solve the "last-mile" connectivity problem in rural healthcare. It leverages **Generative AI** for symptom triage and **Web Speech APIs** to provide an accessible interface for non-literate users in their native languages (Hindi, Punjabi, Tamil, English).

## 🧐 The Problem
The Indian healthcare system faces a critical geographic imbalance:
* **80% of doctors** serve only **28% of the population** (urban areas).
* Rural patients often travel **30–50 km** for basic care, leading to significant economic loss.
* Existing digital solutions fail in areas with **spotty internet (2G/3G)** and language barriers.

## 💡 The Solution
I developed SehatCall to be robust, accessible, and resilient.
* **AI-Powered Triage:** Uses the **Gemini Pro API** to analyze symptoms and categorize urgency (Critical, Urgent, Moderate, Mild), reducing the load on human doctors.
* **Offline-First Architecture:** The app functions seamlessly during network dropouts, queueing requests and syncing when connectivity is restored.
* **Inclusive Design:** Features a voice-first interface and multilingual support to ensure usability for all demographic groups.

## 🛠️ Tech Stack

* **Frontend:** React.js, TypeScript, Vite
* **Styling:** Tailwind CSS (Mobile-First Responsive Design)
* **AI Integration:** Google Gemini Pro API (Generative AI)
* **Voice Processing:** Native Web Speech API
* **Icons:** Lucide React
* **State Management:** React Hooks

## ✨ Key Features

* **🤖 AI Symptom Checker:** Real-time analysis of symptoms with localized recommendations.
* **🗣️ Voice Input Support:** Users can speak in Hindi, Punjabi, or Tamil to describe symptoms.
* **📶 Intelligent Offline Mode:** Detects network instability and switches UI to offline mode to prevent data loss.
* **🩺 Tele-Consultation Interface:** Streamlined UI for connecting patients with remote doctors.
* **💊 Pharmacy Locator:** Logic for tracking medicine availability in local centers.

## 🚧 Engineering Challenges & Solutions

### 1. Handling Multilingual UI Layouts
* **Challenge:** Translated text varies significantly in length (e.g., Tamil strings are often 50% longer than English), breaking the grid layout.
* **Solution:** Implemented a flexible CSS architecture using `min-height` and `flex-wrap` strategies to accommodate dynamic text expansion without breaking the UI.

### 2. Network State Fluctuation ("Flickering")
* **Challenge:** In rural network simulations, the connection status would rapidly toggle between online and offline, causing the UI to flash uncontrollably.
* **Solution:** Engineered a **debounce mechanism** for the network status hook. The app now waits for stable connectivity signal before triggering state changes, ensuring a smooth user experience.

### 3. Voice Recognition on Low-End Devices
* **Challenge:** The Web Speech API often timed out or returned `no-speech` errors on lower-end Android devices used in testing.
* **Solution:** I implemented robust error handling and visual feedback loops (pulsing UI indicators) to guide users on exactly when the microphone is active, significantly improving input success rates.

