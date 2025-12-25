import React from "react";
import { patientHistory } from "../data/patientHistory";

export default function ViewHistory({ selectedPatient }) {

  if (!selectedPatient)
    return <h3 style={{ marginTop: "20px" }}>Select a patient to view history.</h3>;

  const filteredHistory = patientHistory.filter(
    (record) => record.patientId === selectedPatient.id
  );

  return (
    <div>
      <h2>Medical History ➜ {selectedPatient.name}</h2>

      {filteredHistory.length === 0 ? (
        <p>No medical history available for this patient.</p>
      ) : (
        <table border="1" width="100%" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Doctor</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.visitDate}</td>
                <td>{item.diagnosis}</td>
                <td>{item.prescription}</td>
                <td>{item.doctorName}</td>
                <td>{item.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
