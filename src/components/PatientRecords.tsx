import React from "react";
// CRITICAL: Ensure this path is correct relative to the component file location.
import { patientRecords } from "../data/patientRecords"; 

interface PatientRecordsProps {
  language: 'en' | 'hi' | 'pa' | 'ta';
}

const PatientRecords = ({ language }: PatientRecordsProps) => {
    
    const translations = {
        en: {
            name: "Name",
            age: "Age",
            phone: "Phone",
            disease: "Disease",
            priority: "Priority",
            date: "Date",
            high: "High",
            medium: "Medium",
            low: "Low",
            noRecords: "No patient records found.",
            checkData: "Please ensure the data file at 'src/data/patientRecords' is correctly populated."
        },
        hi: {
            name: "नाम",
            age: "उम्र",
            phone: "फोन",
            disease: "बीमारी",
            priority: "प्राथमिकता",
            date: "तारीख",
            high: "उच्च",
            medium: "मध्यम",
            low: "कम",
            noRecords: "कोई रोगी रिकॉर्ड नहीं मिला।",
            checkData: "कृपया सुनिश्चित करें कि डेटा फ़ाइल सही है।"
        },
        pa: {
            name: "ਨਾਮ",
            age: "ਉਮਰ",
            phone: "ਫੋਨ",
            disease: "ਬਿਮਾਰੀ",
            priority: "ਤਰਜੀਹ",
            date: "ਮਿਤੀ",
            high: "ਉੱਚ",
            medium: "ਦਰਮਿਆਨਾ",
            low: "ਘੱਟ",
            noRecords: "ਕੋਈ ਮਰੀਜ਼ ਰਿਕਾਰਡ ਨਹੀਂ ਮਿਲਿਆ।",
            checkData: "ਕਿਰਪਾ ਕਰਕੇ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਡੇਟਾ ਫਾਈਲ ਸਹੀ ਹੈ।"
        },
        ta: {
            name: "பெயர்",
            age: "வயது",
            phone: "தொலைபேசி",
            disease: "நோய்",
            priority: "முன்னுரிமை",
            date: "தேதி",
            high: "உயர்",
            medium: "நடுத்தரம்",
            low: "குறைவு",
            noRecords: "நோயாளி பதிவுகள் எதுவும் இல்லை.",
            checkData: "தரவு கோப்பு சரியாக உள்ளதா என்பதை உறுதிப்படுத்தவும்."
        }
    };

    const t = translations[language] || translations['en'];

    // Check if data is available before rendering
    if (!patientRecords || patientRecords.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">{t.noRecords}</p>
                <p className="text-sm">{t.checkData}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 hidden">Patient Records</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.name}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.age}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.phone}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.disease}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.priority}</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.date}</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {patientRecords.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{patient.disease}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    patient.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                    patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-green-100 text-green-800'
                                }`}>
                                    {/* Translate priority if it matches High/Medium/Low, otherwise show original */}
                                    {patient.priority === 'High' ? t.high : 
                                     patient.priority === 'Medium' ? t.medium : 
                                     patient.priority === 'Low' ? t.low : patient.priority}
                                </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{patient.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatientRecords;