"use client";
import React, { useState } from "react";
import InterviewHeader from "./_components/InterviewHeader";
import { InterviewDataContext } from "@/context/InterviewDataContext";

function InterviewLayout({ children }) {
  const [interviewInfo, setInterviewInfo] = useState();
  
  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <InterviewHeader />
        <main className="flex-1">
          {children}
        </main>
        {/* Footer can be added here if needed */}
      </div>
    </InterviewDataContext.Provider>
  );
}

export default InterviewLayout;