// src/components/PrescriptionModal.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface PatientData {
    id: string;
    name: string;
    age: number;
    symptoms: string;
    doctorName: string; // Used for saving the record
}

// 📌 NEW: Defines the structure of the data sent back to the dashboard
interface SavedPrescriptionPartial {
    patientId: string;
    patientName: string;
    date: string; 
    doctorName: string;
    medicationDetails: string; 
    symptoms: string;
}

interface PrescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    // 📌 NEW: Callback function to save data in the parent component
    onSave: (prescription: SavedPrescriptionPartial) => void; 
    patient: PatientData;
    language: 'en' | 'hi' | 'pa';
}

export function PrescriptionModal({ isOpen, onClose, onSave, patient, language }: PrescriptionModalProps) {
    const [prescriptionText, setPrescriptionText] = useState(''); // State for Textarea content

    const t = {
        en: { 
            title: "Write Prescription", 
            patientInfo: `Patient: ${patient.name}, Age: ${patient.age}`, 
            symptomsLabel: "Reported Symptoms:",
            prescriptionArea: "Type prescription details (Medication, Dosage, Instructions) here...",
            save: "Save & Send",
            cancel: "Cancel",
            alertEmpty: "Please write the prescription details before saving."
        },
        // ... (Hindi and Punjabi translations remain the same, adding alertEmpty if desired)
        hi: {
            title: "नुस्खा लिखें",
            patientInfo: `रोगी: ${patient.name}, आयु: ${patient.age}`,
            symptomsLabel: "बताए गए लक्षण:",
            prescriptionArea: "नुस्खे का विवरण (दवा, खुराक, निर्देश) यहां लिखें...",
            save: "सहेजें और भेजें",
            cancel: "रद्द करें",
            alertEmpty: "कृपया सहेजने से पहले नुस्खे का विवरण लिखें।"
        },
        pa: {
            title: "ਨੁਸਖਾ ਲਿਖੋ",
            patientInfo: `ਮਰੀਜ਼: ${patient.name}, ਉਮਰ: ${patient.age}`,
            symptomsLabel: "ਦੱਸੇ ਗਏ ਲੱਛਣ:",
            prescriptionArea: "ਨੁਸਖੇ ਦਾ ਵੇਰਵਾ (ਦਵਾਈ, ਖੁਰਾਕ, ਨਿਰਦੇਸ਼) ਇੱਥੇ ਲਿਖੋ...",
            save: "ਸੇਵ ਕਰੋ ਅਤੇ ਭੇਜੋ",
            cancel: "ਰੱਦ ਕਰੋ",
            alertEmpty: "ਕਿਰਪਾ ਕਰਕੇ ਸੇਵ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਨੁਸਖੇ ਦਾ ਵੇਰਵਾ ਲਿਖੋ।"
        }
    };
    
    const translations = t[language as keyof typeof t] || t.en;
    
    // 📌 NEW: Handler to save and close the modal
    const handleSave = () => {
        if (!prescriptionText.trim()) {
            alert(translations.alertEmpty);
            return;
        }

        const prescriptionData: SavedPrescriptionPartial = {
            patientId: patient.id,
            patientName: patient.name,
            // Format the date for consistent display
            date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }), 
            doctorName: patient.doctorName,
            medicationDetails: prescriptionText.trim(),
            symptoms: patient.symptoms,
        };
        
        onSave(prescriptionData); // 🚨 Critical: Call the parent handler to save the data
        setPrescriptionText(''); // Clear the textarea content
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]"> 
                <DialogHeader>
                    <DialogTitle>{translations.title}</DialogTitle>
                    <DialogDescription className="text-base font-semibold">
                        {translations.patientInfo}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    {/* Patient Symptoms Box */}
                    <div className="p-3 border rounded-md bg-yellow-50/50">
                        <h4 className="font-semibold text-sm mb-1 text-gray-700">{translations.symptomsLabel}</h4>
                        <p className="text-sm text-gray-900">{patient.symptoms}</p>
                    </div>

                    {/* Prescription Write-up Area */}
                    <Textarea
                        rows={12}
                        placeholder={translations.prescriptionArea}
                        className="min-h-[200px]"
                        value={prescriptionText}
                        onChange={(e) => setPrescriptionText(e.target.value)} // Update state
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        {translations.cancel}
                    </Button>
                    <Button onClick={handleSave}> 
                        {translations.save}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}