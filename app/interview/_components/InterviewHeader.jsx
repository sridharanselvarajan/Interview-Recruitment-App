import Image from "next/image";
import React from "react";

function InterviewHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
                {/* Microphone icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
                  <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.93V20H8a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2h-2v-2.07A7 7 0 0 0 19 11z" />
                </svg>

                {/* Text */}
                <span className="text-xl font-extrabold tracking-tight select-none">
                  <span className="text-blue-600">AI</span>
                  <span className="text-gray-900">cruiter</span>
                </span>
              </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Session</span>
        </div>
      </div>
    </div>
  );
}

export default InterviewHeader;