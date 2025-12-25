// src/components/HistoryModal.tsx

import React from "react";
import { patientHistory } from "../data/patientHistory";
import { Button } from "./ui/button";

export function HistoryModal({ isOpen, onClose, patientId, patientName }: any) {
  if (!isOpen) return null;
  if (!patientId) return <div>Error: Missing patientId</div>;

  const records = patientHistory.filter(r => r.patientId === patientId);

  return (
    <div style={{position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,.5)", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <div style={{background:"white", padding:"20px", width:"600px", borderRadius:"6px"}}>
        <h2>Medical History — {patientName}</h2>

        {records.length === 0 ? (
          <p>No records found</p>
        ) : (
          <ul>
            {records.map(r => (
              <li key={r.id}>{r.visitDate} — {r.diagnosis}</li>
            ))}
          </ul>
        )}

        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
