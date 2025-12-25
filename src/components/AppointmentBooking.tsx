import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  User, 
  Stethoscope, 
  CheckCircle, 
  AlertCircle, 
  Headphones,
  X,
  FileText,
  Download,
  Pill
} from 'lucide-react';
import { ConsultationModal } from './ConsultationModal';

interface User {
  id: string;
  name: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  phone: string;
  language: 'en' | 'hi' | 'pa' | 'ta'; // Added 'ta'
}

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'video' | 'audio' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  symptoms: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  availability: string[];
  consultationFee: number;
  languages: string[];
}

interface AppointmentBookingProps {
  user: User;
  language: 'en' | 'hi' | 'pa' | 'ta'; // Added 'ta'
  isOnline: boolean;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export function AppointmentBooking({ user, language, isOnline, appointments, setAppointments }: AppointmentBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'video' | 'audio' | 'in-person'>('video');
  const [symptoms, setSymptoms] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // --- STATE FOR RESCHEDULE POPUP ---
  const [rescheduleModal, setRescheduleModal] = useState<{
    isOpen: boolean;
    appointment: Appointment | null;
  }>({ isOpen: false, appointment: null });
  const [newRescheduleDate, setNewRescheduleDate] = useState("");
  const [newRescheduleTime, setNewRescheduleTime] = useState("");

  // --- STATE FOR PRESCRIPTION POPUP ---
  const [prescriptionModal, setPrescriptionModal] = useState<{
    isOpen: boolean;
    appointment: Appointment | null;
  }>({ isOpen: false, appointment: null });

  const [consultationModal, setConsultationModal] = useState<{
    isOpen: boolean;
    appointment: Appointment | null;
  }>({ isOpen: false, appointment: null });

  const translations = {
    en: {
      title: "Appointment Management",
      subtitle: "Book consultations and manage your appointments",
      bookNew: "Book New Appointment",
      upcoming: "Upcoming Appointments",
      past: "Past Appointments",
      selectDoctor: "Select Doctor",
      selectDate: "Select Date",
      selectTime: "Select Time",
      consultType: "Consultation Type",
      video: "Video Call",
      audio: "Audio Call",
      inPerson: "In-Person Visit",
      symptoms: "Describe your symptoms",
      bookAppointment: "Book Appointment",
      booking: "Booking...",
      cancel: "Cancel",
      join: "Join Consultation",
      reschedule: "Reschedule",
      viewPrescription: "View Prescription",
      rating: "Rating",
      experience: "Experience",
      fee: "Consultation Fee",
      languages: "Languages",
      available: "Available",
      unavailable: "Unavailable",
      success: "Appointment booked successfully!",
      error: "Failed to book appointment. Please try again.",
      modalTitle: "Reschedule Appointment",
      confirm: "Confirm New Time",
      rescheduleSuccess: "Appointment rescheduled successfully!",
      rxTitle: "Medical Prescription",
      rxDownload: "Download PDF",
      rxMeds: "Prescribed Medicines",
      rxDosage: "Dosage",
      rxDuration: "Duration",
      rxNotes: "Doctor's Notes"
    },
    hi: {
      title: "अपॉइंटमेंट प्रबंधन",
      subtitle: "परामर्श बुक करें और अपने अपॉइंटमेंट प्रबंधित करें",
      bookNew: "नया अपॉइंटमेंट बुक करें",
      upcoming: "आगामी अपॉइंटमेंट",
      past: "पिछले अपॉइंटमेंट",
      selectDoctor: "डॉक्टर चुनें",
      selectDate: "तारीख चुनें",
      selectTime: "समय चुनें",
      consultType: "परामर्श प्रकार",
      video: "वीडियो कॉल",
      audio: "ऑडियो कॉल",
      inPerson: "व्यक्तिगत मुलाकात",
      symptoms: "अपने लक्षणों का वर्णन करें",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      booking: "बुकिंग...",
      cancel: "रद्द करें",
      join: "परामर्श में शामिल हों",
      reschedule: "पुनर्निर्धारण",
      viewPrescription: "नुस्खा देखें",
      rating: "रेटिंग",
      experience: "अनुभव",
      fee: "परामर्श शुल्क",
      languages: "भाषाएं",
      available: "उपलब्ध",
      unavailable: "अनुपलब्ध",
      success: "अपॉइंटमेंट सफलतापूर्वक बुक हो गया!",
      error: "अपॉइंटमेंट बुक करने में विफल। कृपया पुनः प्रयास करें।",
      modalTitle: "अपॉइंटमेंट पुनर्निर्धारित करें",
      confirm: "पुष्टि करें",
      rescheduleSuccess: "अपॉइंटमेंट सफलतापूर्वक पुनर्निर्धारित किया गया!",
      rxTitle: "चिकित्सा नुस्खा",
      rxDownload: "पीडीएफ डाउनलोड करें",
      rxMeds: "निर्धारित दवाएं",
      rxDosage: "खुराक",
      rxDuration: "अवधि",
      rxNotes: "डॉक्टर के नोट्स"
    },
    pa: {
      title: "ਮੁਲਾਕਾਤ ਪ੍ਰਬੰਧਨ",
      subtitle: "ਸਲਾਹ ਬੁੱਕ ਕਰੋ ਅਤੇ ਆਪਣੀਆਂ ਮੁਲਾਕਾਤਾਂ ਪ੍ਰਬੰਧਿਤ ਕਰੋ",
      bookNew: "ਨਵੀਂ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ",
      upcoming: "ਆਉਣ ਵਾਲੀਆਂ ਮੁਲਾਕਾਤਾਂ",
      past: "ਪਿਛਲੀਆਂ ਮੁਲਾਕਾਤਾਂ",
      selectDoctor: "ਡਾਕਟਰ ਚੁਣੋ",
      selectDate: "ਮਿਤੀ ਚੁਣੋ",
      selectTime: "ਸਮਾਂ ਚੁਣੋ",
      consultType: "ਸਲਾਹ ਦੀ ਕਿਸਮ",
      video: "ਵੀਡੀਓ ਕਾਲ",
      audio: "ਆਡੀਓ ਕਾਲ",
      inPerson: "ਵਿਅਕਤੀਗਤ ਮੁਲਾਕਾਤ",
      symptoms: "ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ",
      bookAppointment: "ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰੋ",
      booking: "ਬੁੱਕਿੰਗ...",
      cancel: "ਰੱਦ ਕਰੋ",
      join: "ਸਲਾਹ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
      reschedule: "ਮੁੜ ਨਿਰਧਾਰਣ",
      viewPrescription: "ਨੁਸਖਾ ਦੇਖੋ",
      rating: "ਰੇਟਿੰਗ",
      experience: "ਤਜਰਬਾ",
      fee: "ਸਲਾਹ ਫੀਸ",
      languages: "ਭਾਸ਼ਾਵਾਂ",
      available: "ਉਪਲਬਧ",
      unavailable: "ਅਣਉਪਲਬਧ",
      success: "ਮੁਲਾਕਾਤ ਸਫਲਤਾਪੂਰਵਕ ਬੁੱਕ ਹੋ ਗਈ!",
      error: "ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
      modalTitle: "ਮੁਲਾਕਾਤ ਦੁਬਾਰਾ ਤਹਿ ਕਰੋ",
      confirm: "ਪੁਸ਼ਟੀ ਕਰੋ",
      rescheduleSuccess: "ਮੁਲਾਕਾਤ ਸਫਲਤਾਪੂਰਵਕ ਦੁਬਾਰਾ ਤਹਿ ਕੀਤੀ ਗਈ!",
      rxTitle: "ਮੈਡੀਕਲ ਨੁਸਖ਼ਾ",
      rxDownload: "PDF ਡਾਊਨਲੋਡ ਕਰੋ",
      rxMeds: "ਤਜਵੀਜ਼ ਕੀਤੀਆਂ ਦਵਾਈਆਂ",
      rxDosage: "ਖੁਰਾਕ",
      rxDuration: "ਮਿਆਦ",
      rxNotes: "ਡਾਕਟਰ ਦੇ ਨੋਟ"
    },
    // ADDED TAMIL TRANSLATIONS
    ta: {
      title: "நியமன மேலாண்மை",
      subtitle: "ஆலோசனைகளை முன்பதிவு செய்து நிர்வகிக்கவும்",
      bookNew: "புதிய நியமனம்",
      upcoming: "வரவிருக்கும் நியமனங்கள்",
      past: "கடந்த நியமனங்கள்",
      selectDoctor: "மருத்துவரைத் தேர்ந்தெடுக்கவும்",
      selectDate: "தேதியைத் தேர்ந்தெடுக்கவும்",
      selectTime: "நேரத்தைத் தேர்ந்தெடுக்கவும்",
      consultType: "ஆலோசனை வகை",
      video: "வீடியோ அழைப்பு",
      audio: "ஆடியோ அழைப்பு",
      inPerson: "நேரில் சந்திப்பு",
      symptoms: "உங்கள் அறிகுறிகளை விவரிக்கவும்",
      bookAppointment: "நியமனம் பதிவு செய்",
      booking: "பதிவு செய்கிறது...",
      cancel: "ரத்து செய்",
      join: "இணையவும்",
      reschedule: "மாற்றி அமைக்கவும்",
      viewPrescription: "மருந்து சீட்டைப் பார்க்கவும்",
      rating: "மதிப்பீடு",
      experience: "அனுபவம்",
      fee: "கட்டணம்",
      languages: "மொழிகள்",
      available: "கிடைக்கிறது",
      unavailable: "கிடைக்கவில்லை",
      success: "நியமனம் வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
      error: "பதிவு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      modalTitle: "நியமனத்தை மாற்றி அமைக்கவும்",
      confirm: "உறுதிப்படுத்தவும்",
      rescheduleSuccess: "வெற்றிகரமாக மாற்றப்பட்டது!",
      rxTitle: "மருத்துவ குறிப்பு",
      rxDownload: "PDF பதிவிறக்கம்",
      rxMeds: "பரிந்துரைக்கப்பட்ட மருந்துகள்",
      rxDosage: "அளவு",
      rxDuration: "கால அளவு",
      rxNotes: "மருத்துவர் குறிப்புகள்"
    }
  };

  const t = translations[language] || translations['en'];

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Priya Sharma',
      specialty: 'General Medicine',
      rating: 4.8,
      experience: '8 years',
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      consultationFee: 200,
      languages: ['English', 'Hindi', 'Punjabi']
    },
    {
      id: '2', 
      name: 'Dr. Rajesh Kumar',
      specialty: 'Pediatrics',
      rating: 4.7,
      experience: '12 years',
      availability: ['10:00', '11:00', '15:00', '16:00', '17:00'],
      consultationFee: 250,
      languages: ['Hindi', 'Punjabi']
    },
    {
      id: '3',
      name: 'Dr. Sunita Patel',
      specialty: 'Gynecology',
      rating: 4.9,
      experience: '15 years',
      availability: ['09:00', '11:00', '14:00', '16:00'],
      consultationFee: 300,
      languages: ['English', 'Hindi']
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !symptoms.trim()) {
      return;
    }

    setIsBooking(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const doctor = doctors.find(d => d.id === selectedDoctor);
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorName: doctor?.name || 'Unknown Doctor',
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      type: consultationType,
      status: 'upcoming',
      symptoms: symptoms
    };

    setAppointments(prev => [...prev, newAppointment]);
    setShowBookingForm(false);
    setSelectedTime('');
    setSymptoms('');
    setIsBooking(false);
  };

  // --- RESCHEDULE HANDLERS ---
  const handleRescheduleClick = (apt: Appointment) => {
    setRescheduleModal({ isOpen: true, appointment: apt });
    setNewRescheduleDate(apt.date);
    setNewRescheduleTime(apt.time);
  };

  const confirmReschedule = () => {
    if (!rescheduleModal.appointment) return;
    setAppointments(prev => prev.map(apt => 
      apt.id === rescheduleModal.appointment?.id 
        ? { ...apt, date: newRescheduleDate, time: newRescheduleTime }
        : apt
    ));
    setRescheduleModal({ isOpen: false, appointment: null });
    alert(t.rescheduleSuccess);
  };

  // --- PRESCRIPTION HANDLER ---
  const handleViewPrescription = (apt: Appointment) => {
    setPrescriptionModal({ isOpen: true, appointment: apt });
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'in-person': return MapPin;
      default: return CalendarIcon;
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'audio': return 'bg-green-100 text-green-800';
      case 'in-person': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJoinConsultation = (appointment: Appointment) => {
    if (!isOnline && appointment.type !== 'in-person') {
      alert('Internet connection required for video/audio consultations');
      return;
    }
    setConsultationModal({ isOpen: true, appointment });
  };

  if (showBookingForm) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t.bookNew}</span>
              <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                {t.cancel}
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.selectDoctor}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDoctor === doctor.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Stethoscope className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doctor.name}</h4>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⭐ {doctor.rating}</span>
                            <span className="text-xs text-gray-500">{doctor.experience}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">₹{doctor.consultationFee}</div>
                        <div className="text-xs text-gray-500">{t.fee}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      {t.languages}: {doctor.languages.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.selectDate}</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {selectedDate && selectedDoctor && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.selectTime}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const doctor = doctors.find(d => d.id === selectedDoctor);
                      const isAvailable = doctor?.availability.includes(time);
                      return (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          disabled={!isAvailable}
                          className="w-full"
                        >
                          {time}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {selectedDate && selectedTime && selectedDoctor && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.consultType}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {(['video', 'audio', 'in-person'] as const).map((type) => {
                    const Icon = getAppointmentIcon(type);
                    return (
                      <button
                        key={type}
                        onClick={() => setConsultationType(type)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          consultationType === type 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium">{t[type]}</div>
                            <div className="text-xs text-gray-500">
                              {type === 'video' && 'High quality video consultation'}
                              {type === 'audio' && 'Audio-only call (low bandwidth)'}
                              {type === 'in-person' && 'Visit Nabha Civil Hospital'}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.symptoms}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms, medical history, and reason for consultation..."
                  className="min-h-32"
                />
                <Button
                  onClick={handleBookAppointment}
                  disabled={!symptoms.trim() || isBooking}
                  className="w-full mt-4"
                >
                  {isBooking ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {t.booking}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t.bookAppointment}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t.title}</span>
            <Button onClick={() => setShowBookingForm(true)}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t.bookNew}
            </Button>
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
      </Card>

      {!isOnline && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You're offline. You can view existing appointments but cannot book new ones.
          </AlertDescription>
        </Alert>
      )}

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>{t.upcoming}</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.filter(apt => apt.status === 'upcoming').length > 0 ? (
            <div className="space-y-4">
              {appointments.filter(apt => apt.status === 'upcoming').map((appointment) => {
                const Icon = getAppointmentIcon(appointment.type);
                return (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-600">
                            {appointment.date} at {appointment.time}
                          </p>
                          <Badge className={getAppointmentTypeColor(appointment.type)}>
                            {t[appointment.type]}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleJoinConsultation(appointment)}>
                          {t.join}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleRescheduleClick(appointment)}>
                            {t.reschedule}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm">{t.symptoms}: {appointment.symptoms}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No upcoming appointments</p>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>{t.past}</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.filter(apt => apt.status === 'completed').length > 0 ? (
            <div className="space-y-4">
              {appointments.filter(apt => apt.status === 'completed').map((appointment) => {
                const Icon = getAppointmentIcon(appointment.type);
                return (
                  <div key={appointment.id} className="border rounded-lg p-4 opacity-75">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <div>
                          <h4 className="font-medium">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-600">
                            {appointment.date} at {appointment.time}
                          </p>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                      </div>
                      {/* VIEW PRESCRIPTION BUTTON */}
                      <Button variant="outline" size="sm" onClick={() => handleViewPrescription(appointment)}>
                        <FileText className="h-4 w-4 mr-2" />
                        {t.viewPrescription}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No past appointments</p>
          )}
        </CardContent>
      </Card>

      <ConsultationModal
        isOpen={consultationModal.isOpen}
        onClose={() => setConsultationModal({ isOpen: false, appointment: null })}
        appointment={consultationModal.appointment}
        user={user}
        language={language}
        isOnline={isOnline}
      />

      {/* --- RESCHEDULE MODAL --- */}
      {rescheduleModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{t.modalTitle}</h3>
                <button onClick={() => setRescheduleModal({ isOpen: false, appointment: null })} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-2">
                    Rescheduling with {rescheduleModal.appointment?.doctorName}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                  <input 
                    type="date" 
                    value={newRescheduleDate} 
                    onChange={(e) => setNewRescheduleDate(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                  <input 
                    type="time" 
                    value={newRescheduleTime} 
                    onChange={(e) => setNewRescheduleTime(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setRescheduleModal({ isOpen: false, appointment: null })}>
                  {t.cancel}
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={confirmReschedule}>
                  {t.confirm}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PRESCRIPTION MODAL (New Feature) --- */}
      {prescriptionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                   <FileText className="h-5 w-5" /> {t.rxTitle}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  SehatCall - Rural Healthcare Initiative
                </p>
              </div>
              <button 
                onClick={() => setPrescriptionModal({ isOpen: false, appointment: null })}
                className="text-blue-100 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 bg-gray-50">
               {/* Doctor & Patient Info Card */}
               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Doctor</p>
                    <p className="font-semibold text-gray-900">{prescriptionModal.appointment?.doctorName}</p>
                    <p className="text-xs text-gray-500">MBBS, MD (General Medicine)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase">Date</p>
                    <p className="font-semibold text-gray-900">{prescriptionModal.appointment?.date}</p>
                    <p className="text-xs text-gray-500">ID: #{prescriptionModal.appointment?.id.slice(-4)}</p>
                  </div>
               </div>

               {/* Medicines List */}
               <div className="mb-6">
                 <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Pill className="h-4 w-4 text-blue-600" /> {t.rxMeds}
                 </h4>
                 <div className="bg-white border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                       <thead className="bg-gray-100 border-b">
                         <tr>
                           <th className="p-3 text-left font-medium text-gray-600">Medicine</th>
                           <th className="p-3 text-left font-medium text-gray-600">{t.rxDosage}</th>
                           <th className="p-3 text-right font-medium text-gray-600">{t.rxDuration}</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y">
                         {/* Dummy Medicine Data */}
                         <tr>
                            <td className="p-3 font-medium">Paracetamol 500mg</td>
                            <td className="p-3">1-0-1 (After Food)</td>
                            <td className="p-3 text-right">5 Days</td>
                         </tr>
                         <tr>
                            <td className="p-3 font-medium">Cetirizine 10mg</td>
                            <td className="p-3">0-0-1 (Night)</td>
                            <td className="p-3 text-right">3 Days</td>
                         </tr>
                         <tr>
                            <td className="p-3 font-medium">Vitamin C</td>
                            <td className="p-3">1-0-0 (Morning)</td>
                            <td className="p-3 text-right">10 Days</td>
                         </tr>
                       </tbody>
                    </table>
                 </div>
               </div>

               {/* Notes */}
               <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
                 <h5 className="text-xs font-bold text-yellow-800 uppercase mb-1">{t.rxNotes}</h5>
                 <p className="text-sm text-yellow-900">
                    Drink plenty of warm water. Avoid oily food. Complete the antibiotic course.
                 </p>
               </div>

               {/* Footer Action */}
               <Button className="w-full bg-gray-900 hover:bg-black text-white gap-2" onClick={() => alert("Downloading PDF...")}>
                 <Download className="h-4 w-4" /> {t.rxDownload}
               </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}