/// <reference types="vite/client" />
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Mic, 
  MicOff, 
  Send, 
  Info, 
  CheckCircle,
  Clock,
  Heart,
  Activity,
  Brain,
  Ambulance,
  Building2,
  Video,
  MessageCircle,
} from 'lucide-react';

// --- TypeScript Definitions for Web Speech API ---
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  phone: string;
  language: 'en' | 'hi' | 'pa' | 'ta'; // Added 'ta'
}

interface SymptomCheckerProps {
  user: User;
  language: 'en' | 'hi' | 'pa' | 'ta'; // Added 'ta'
  isOnline: boolean;
}

interface SymptomResult {
  tier: 1 | 2 | 3 | 4; // 1: Red, 2: In-Person, 3: Teledoctor, 4: Intern
  assessment: string;
  urgencyColor: string;
  recommendations: string[];
  confidence: number;
  actionButton: {
    label: string;
    icon: any;
    action: () => void;
    variant: "default" | "destructive" | "outline" | "secondary";
  };
}

export function SymptomChecker({ user, language, isOnline }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceHint, setVoiceHint] = useState<string | null>(null);
  const recognitionRef = React.useRef<any>(null);

  // Translations
  const translations = {
    en: {
      title: "AI Triage Assistant",
      subtitle: "Voice-enabled symptom analysis for immediate guidance",
      describe: "Describe Symptoms",
      placeholder: "Tap the microphone and speak in Punjabi, Hindi, Tamil or English...",
      startListening: "Tap to Speak",
      stopListening: "Stop",
      analyze: "Analyze Priority",
      analyzing: "AI Analyzing...",
      bodyMap: "Quick Select Area",
      disclaimer: "AI Advice Only. For emergencies, call 108 immediately.",
      redAlert: "CRITICAL EMERGENCY",
      orangeAlert: "Requires Doctor Visit",
      yellowAlert: "Tele-Consultation Recommended",
      greenAlert: "Home Care / Health Worker",
      callAmbulance: "Call Ambulance (108)",
      bookHospital: "Book Hospital Visit",
      connectDoctor: "Connect Teledoctor",
      chatIntern: "Chat with Health Intern",
    },
    hi: {
      title: "AI ट्राइएज सहायक",
      subtitle: "तत्काल मार्गदर्शन के लिए आवाज-सक्षम लक्षण विश्लेषण",
      describe: "लक्षण बताएं",
      placeholder: "माइक दबाएं और हिंदी, पंजाबी या अंग्रेजी में बोलें...",
      startListening: "बोलने के लिए टैप करें",
      stopListening: "रुकें",
      analyze: "प्राथमिकता जांचें",
      analyzing: "AI विश्लेषण कर रहा है...",
      bodyMap: "शरीर क्षेत्र चुनें",
      disclaimer: "यह केवल AI सलाह है। आपात स्थिति में तुरंत 108 पर कॉल करें।",
      redAlert: "गंभीर आपातकाल",
      orangeAlert: "डॉक्टर के पास जाना आवश्यक",
      yellowAlert: "टेली-परामर्श की सलाह",
      greenAlert: "घरेलू देखभाल / स्वास्थ्य कार्यकर्ता",
      callAmbulance: "एम्बुलेंस बुलाएं (108)",
      bookHospital: "अस्पताल में दिखाएं",
      connectDoctor: "डॉक्टर से बात करें",
      chatIntern: "स्वास्थ्य मित्र से चैट करें",
    },
    pa: {
      title: "AI ਟ੍ਰਾਈਜ ਸਹਾਇਕ",
      subtitle: "ਤੁਰੰਤ ਮਾਰਗਦਰਸ਼ਨ ਲਈ ਆਵਾਜ਼-ਅਧਾਰਤ ਲੱਛਣ ਵਿਸ਼ਲੇਸ਼ਣ",
      describe: "ਲੱਛਣ ਦੱਸੋ",
      placeholder: "ਮਾਈਕ ਦਬਾਓ ਅਤੇ ਪੰਜਾਬੀ, ਹਿੰਦੀ ਜਾਂ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬੋਲੋ...",
      startListening: "ਬੋਲਣ ਲਈ ਦਬਾਓ",
      stopListening: "ਰੁਕੋ",
      analyze: "ਤਰਜੀਹ ਦੀ ਜਾਂਚ ਕਰੋ",
      analyzing: "AI ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
      bodyMap: "ਸਰੀਰ ਦਾ ਹਿੱਸਾ ਚੁਣੋ",
      disclaimer: "ਇਹ ਸਿਰਫ AI ਸਲਾਹ ਹੈ। ਐਮਰਜੈਂਸੀ ਲਈ ਤੁਰੰਤ 108 'ਤੇ ਕਾਲ ਕਰੋ।",
      redAlert: "ਗੰਭੀਰ ਐਮਰਜੈਂਸੀ",
      orangeAlert: "ਡਾਕਟਰ ਕੋਲ ਜਾਣਾ ਜ਼ਰੂਰੀ",
      yellowAlert: "ਟੈਲੀ-ਸਲਾਹ ਦੀ ਸਿਫਾਰਸ਼",
      greenAlert: "ਘਰੇਲੂ ਦੇਖਭਾਲ / ਸਿਹਤ ਵਰਕਰ",
      callAmbulance: "ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ (108)",
      bookHospital: "ਹਸਪਤਾਲ ਜਾਓ",
      connectDoctor: "ਡਾਕਟਰ ਨਾਲ ਗੱਲ ਕਰੋ",
      chatIntern: "ਸਿਹਤ ਸਹਾਇਕ ਨਾਲ ਗੱਲ ਕਰੋ",
    },
    // ADDED TAMIL TRANSLATIONS
    ta: {
      title: "AI மருத்துவ உதவியாளர்",
      subtitle: "உடனடி வழிகாட்டுதலுக்கு குரல் வழி அறிகுறி ஆய்வு",
      describe: "அறிகுறிகளை விவரிக்கவும்",
      placeholder: "மைக்கை தட்டி தமிழ், இந்தி அல்லது ஆங்கிலத்தில் பேசவும்...",
      startListening: "பேச தட்டவும்",
      stopListening: "நிறுத்து",
      analyze: "முன்னுரிமையை ஆராய்க",
      analyzing: "AI ஆய்வு செய்கிறது...",
      bodyMap: "உடல் பகுதியைத் தேர்ந்தெடுக்கவும்",
      disclaimer: "இது AI ஆலோசனை மட்டுமே. அவசரத்திற்கு உடனே 108 ஐ அழைக்கவும்.",
      redAlert: "மிக அவசரம்",
      orangeAlert: "மருத்துவரை நேரில் பார்க்கவும்",
      yellowAlert: "தொலைபேசி ஆலோசனை பரிந்துரைக்கப்படுகிறது",
      greenAlert: "வீட்டு பராமரிப்பு / சுகாதார ஊழியர்",
      callAmbulance: "ஆம்புலன்ஸ் (108)",
      bookHospital: "மருத்துவமனை பதிவு",
      connectDoctor: "மருத்துவரை அழைக்கவும்",
      chatIntern: "சுகாதார உதவியாளருடன் அரட்டை",
    }
  };

  const t = translations[language] || translations['en'];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // --- Real Voice Input Logic ---
  const requestMicPermission = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      return true; // Some browsers grant permission implicitly
    }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (err) {
      console.error("Mic permission denied", err);
      setVoiceError("Microphone access is blocked. Please allow mic permissions in your browser.");
      return false;
    }
  };

  const startVoiceInput = async () => {
    setVoiceError(null);
    setVoiceHint("Ensure mic is unmuted and speak within 5 seconds after the beep.");

    // If already listening, stop it
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // 1. Check Browser Support
    const speechSupported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

    if (!speechSupported) {
      setVoiceError("Voice input is not supported in this browser. Please use Chrome on desktop or Android.");
      return;
    }

    if (!window.isSecureContext && window.location.hostname !== "localhost") {
      setVoiceError("Voice input needs HTTPS. Please use localhost during development or a secure (https) URL.");
      return;
    }

    const hasPermission = await requestMicPermission();
    if (!hasPermission) return;

    // 2. Initialize API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // 3. Set Language dynamically based on user selection (Updated for Tamil)
    let langCode = 'en-US';
    if (language === 'hi') langCode = 'hi-IN';
    if (language === 'pa') langCode = 'pa-IN';
    if (language === 'ta') langCode = 'ta-IN'; // Added Tamil Support
    
    recognition.lang = langCode;
    
    recognition.continuous = false; // Stop listening after one phrase
    recognition.interimResults = false;

    // 4. Handle Results
    recognition.onstart = () => {
      setVoiceHint("Listening... speak clearly, keep background noise low.");
    };

    recognition.onresult = (event: any) => {
      if (event.results && event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        console.debug("Speech recognition result:", transcript);
        setSymptoms((prev: string) => prev ? prev + " " + transcript : transcript);
      }
      setIsListening(false);
      setVoiceHint(null);
    };

    recognition.onerror = (event: any) => {
      console.error("Voice Error:", event.error);
      if (event.error === "no-speech") {
        setVoiceError("We didn't catch any speech. Unmute your mic, reduce background noise, and speak within 5 seconds.");
      } else if (event.error === "audio-capture") {
        setVoiceError("No microphone detected. Plug in or enable a mic, then try again.");
      } else if (event.error === "not-allowed") {
        setVoiceError("Microphone permission denied. Please allow access and try again.");
      } else {
        setVoiceError(`Voice error: ${event.error}. Please try again.`);
      }
      setIsListening(false);
      setVoiceHint(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoiceHint(null);
    };

    setIsListening(true);
    recognition.start();
  };

  // --- AI Triage Logic (Hybrid: Gemini API + Rule-Based Fallback) ---
  
  // 1. AI System Prompt (Updated to handle Tamil language name)
  const langName = language === 'hi' ? 'Hindi' : language === 'pa' ? 'Punjabi' : language === 'ta' ? 'Tamil' : 'English';
  
  const SYSTEM_PROMPT = `
    You are an AI Medical Triage Assistant for Rural India. 
    Analyze the patient's symptoms and classify them into one of 4 Tiers:
    
    Tier 1 (Red): Critical/Life-Threatening (Heart attack, stroke, severe trauma, difficulty breathing). Action: Ambulance.
    Tier 2 (Orange): Severe/Urgent (High fever >103F, broken bones, severe abdominal pain). Action: Hospital/PHC Visit.
    Tier 3 (Yellow): Moderate (Flu, mild fever, rash, chronic pain). Action: Tele-doctor.
    Tier 4 (Green): Mild (Cold, cough, general inquiry, nutrition). Action: Health Worker/Home Care.

    Output ONLY valid JSON in this format:
    {
      "tier": number,
      "assessment": "Short title in ${langName}",
      "recommendations": ["rec1", "rec2", "rec3"] (in ${langName}),
      "confidence": number (0-100)
    }
  `;

  // 2. Helper to map AI/Rule data to UI
  const mapAiToResult = (aiData: any): SymptomResult => {
    const tiers = {
      1: { color: "bg-red-100 text-red-800 border-red-500", icon: Ambulance, label: t.callAmbulance, variant: "destructive" as const },
      2: { color: "bg-orange-100 text-orange-800 border-orange-500", icon: Building2, label: t.bookHospital, variant: "default" as const },
      3: { color: "bg-yellow-100 text-yellow-800 border-yellow-500", icon: Video, label: t.connectDoctor, variant: "default" as const },
      4: { color: "bg-green-100 text-green-800 border-green-500", icon: MessageCircle, label: t.chatIntern, variant: "outline" as const },
    };

    const tInfo = tiers[aiData.tier as 1|2|3|4] || tiers[4];

    return {
      tier: aiData.tier,
      assessment: aiData.assessment,
      urgencyColor: tInfo.color,
      recommendations: aiData.recommendations,
      confidence: aiData.confidence || 80,
      actionButton: {
        label: tInfo.label,
        icon: tInfo.icon,
        action: () => alert(`Action: ${tInfo.label}`),
        variant: tInfo.variant
      }
    };
  };

  // 3. Fallback Logic (Your original keyword logic + Tamil)
  const runRuleBasedFallback = () => {
    const text = symptoms.toLowerCase();
    let triageResult: SymptomResult;

    if (
      text.includes('chest pain') || text.includes('breathing') || text.includes('unconscious') || 
      text.includes('heart') || text.includes('bleeding') || text.includes('accident') ||
      text.includes('सांस') || text.includes('सीने') || text.includes('खून') || // Hindi
      text.includes('ਸਾਹ') || text.includes('ਛਾਤੀ') || text.includes('ਖੂਨ') || // Punjabi
      text.includes('நெஞ்சு') || text.includes('மூச்சு') || text.includes('இரத்தம்') // Tamil (Nenju, Moochu, Ratham)
    ) {
      triageResult = mapAiToResult({
        tier: 1,
        assessment: t.redAlert,
        recommendations: ["Do not drive yourself", "Keep patient lying down", "Call 108"],
        confidence: 90
      });
    }
    else if (
      text.includes('stomach') || text.includes('fracture') || text.includes('high fever') || 
      text.includes('vomit') || text.includes('abdominal') || text.includes('injury') ||
      text.includes('पेट') || text.includes('तेज बुखार') || text.includes('उल्टी') || // Hindi
      text.includes('ਪੇਟ') || text.includes('ਤੇਜ਼ ਬੁਖਾਰ') || text.includes('ਉਲਟੀਆਂ') || // Punjabi
      text.includes('வயிறு') || text.includes('காய்ச்சல்') || text.includes('வாந்தி') // Tamil (Vayiru, Kaichal, Vanghi)
    ) {
      triageResult = mapAiToResult({
        tier: 2,
        assessment: t.orangeAlert,
        recommendations: ["Visit PHC immediately", "Do not eat/drink", "Carry ID"],
        confidence: 85
      });
    }
    else if (
      text.includes('fever') || text.includes('cough') || text.includes('rash') || 
      text.includes('cold') || text.includes('flu') || text.includes('headache') ||
      text.includes('बुखार') || text.includes('खांसी') || text.includes('सर दर्द') || // Hindi
      text.includes('ਬੁਖਾਰ') || text.includes('ਖੰਘ') || text.includes('ਸਿਰ ਦਰਦ') || // Punjabi
      text.includes('தலைவலி') || text.includes('இருமல்') || text.includes('சளி') // Tamil (Thalaivali, Irumal, Sali)
    ) {
      triageResult = mapAiToResult({
        tier: 3,
        assessment: t.yellowAlert,
        recommendations: ["Video consult doctor", "Keep hydrated", "Monitor temp"],
        confidence: 80
      });
    }
    else {
      triageResult = mapAiToResult({
        tier: 4,
        assessment: t.greenAlert,
        recommendations: ["Rest at home", "Talk to Health Intern", "Monitor for 24h"],
        confidence: 70
      });
    }
    setResult(triageResult);
  };

  // 4. Main Analysis Function
  const analyzeSymptoms = async () => {
    if (!symptoms) return;
    setIsAnalyzing(true);

    try {
      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      if (API_KEY) {
        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: SYSTEM_PROMPT + `\n\nPatient Symptoms: "${symptoms}"` }] }]
          })
        });

        const data = await aiResponse.json();
        
        if (data.error) {
           throw new Error(data.error.message);
        }

        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiText) {
          // Clean the string in case AI adds markdown blocks
          const jsonString = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsedAI = JSON.parse(jsonString);
          setResult(mapAiToResult(parsedAI));
        } else {
          throw new Error("No output from AI");
        }
      } else {
        console.warn("No API Key found, using Rule-Based Fallback");
        runRuleBasedFallback();
      }

    } catch (error) {
      console.error("AI Analysis Failed:", error);
      // Fallback to rules if AI fails
      runRuleBasedFallback();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const bodyParts = [
    { id: 'head', name: 'Head', icon: Brain },
    { id: 'chest', name: 'Chest', icon: Heart },
    { id: 'abdomen', name: 'Stomach', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Activity className="h-6 w-6 text-blue-600" />
            <span>{t.title}</span>
          </CardTitle>
          <CardDescription className="text-gray-600">{t.subtitle}</CardDescription>
        </CardHeader>
      </Card>

      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 font-medium">
          {t.disclaimer}
        </AlertDescription>
      </Alert>

      {voiceError && (
        <Alert variant="destructive">
          <AlertDescription>{voiceError}</AlertDescription>
        </Alert>
      )}
      {voiceHint && !voiceError && (
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <AlertDescription>{voiceHint}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase text-gray-500">{t.describe}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t.placeholder}
                  className="min-h-32 text-lg p-4 bg-gray-50 focus:bg-white transition-colors"
                />
                <div className="mt-2 text-xs text-gray-500">
                  <strong>Preview:</strong> {symptoms || <span className="italic text-gray-400">(empty)</span>}
                </div>
                {isListening && (
                  <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs animate-pulse">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    <span>Listening...</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant={isListening ? "destructive" : "secondary"}
                  size="lg"
                  className={`flex-1 ${isListening ? 'animate-pulse' : ''}`}
                  onClick={startVoiceInput}
                >
                  {isListening ? <MicOff className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
                  {isListening ? t.stopListening : t.startListening}
                </Button>

                <Button 
                  size="lg"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={analyzeSymptoms}
                  disabled={!symptoms.trim() || isAnalyzing}
                >
                  {isAnalyzing ? <Clock className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                  {isAnalyzing ? "..." : t.analyze}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Body Select */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase text-gray-500">{t.bodyMap}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around py-4">
                {bodyParts.map((part) => {
                  const Icon = part.icon;
                  return (
                    <Button
                      key={part.id}
                      variant="outline"
                      className={`h-auto flex-col gap-2 p-4 ${selectedBodyPart === part.id ? 'border-blue-600 bg-blue-50 text-blue-700' : ''}`}
                      onClick={() => {
                        setSelectedBodyPart(part.id);
                        setSymptoms(prev => prev + (prev ? ", " : "") + part.name + " pain");
                      }}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs">{part.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          {result ? (
            <Card className={`border-2 shadow-lg transition-all duration-500 ${result.urgencyColor} bg-white`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      {result.tier === 1 && <Ambulance className="h-8 w-8 text-red-600" />}
                      {result.tier === 2 && <Building2 className="h-8 w-8 text-orange-600" />}
                      {result.tier === 3 && <Video className="h-8 w-8 text-yellow-600" />}
                      {result.tier === 4 && <MessageCircle className="h-8 w-8 text-green-600" />}
                      {result.assessment}
                    </CardTitle>
                    <CardDescription className="mt-1 font-medium opacity-90">
                      Based on AI analysis of your reported symptoms
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-white/50 backdrop-blur">
                    {result.confidence}% Confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Action Button */}
                <Button 
                  size="lg" 
                  variant={result.actionButton.variant}
                  className="w-full h-14 text-lg shadow-sm"
                  onClick={result.actionButton.action}
                >
                  <result.actionButton.icon className="mr-2 h-6 w-6" />
                  {result.actionButton.label}
                </Button>

                {/* Recommendations */}
                <div className="bg-white/60 rounded-xl p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-8 border-2 border-dashed rounded-xl bg-gray-50/50">
              <div className="text-center space-y-3 opacity-50">
                <Brain className="h-16 w-16 mx-auto" />
                <p className="font-medium">Waiting for symptoms...</p>
                <p className="text-sm">Speak or type symptoms to get AI-powered triage guidance</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}