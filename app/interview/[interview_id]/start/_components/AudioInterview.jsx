import { Mic, MicOff, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import AlertConfirmation from "./AlertConfirmation";

const AudioInterview = ({
  callStatus,
  isAiSpeaking,
  isUserSpeaking,
  toggleMute,
  isMuted,
  stopInterview,
  startInterview,
  userInitial,
  userName,
  jobPosition
}) => {
  const [audioLevels, setAudioLevels] = useState(Array(7).fill(10));

  // Simulate audio visualizer effect
  useEffect(() => {
    let interval;
    if (callStatus === 'active' && (isAiSpeaking || isUserSpeaking)) {
      interval = setInterval(() => {
        setAudioLevels((prev) => 
          prev.map(() => Math.max(10, Math.random() * 100))
        );
      }, 100);
    } else {
      setAudioLevels(Array(7).fill(10));
    }
    return () => clearInterval(interval);
  }, [callStatus, isAiSpeaking, isUserSpeaking]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto min-h-[500px] gap-8 animate-fade-in-up">
      
      {/* Main Call UI - Phone Style */}
      <div className="relative w-full max-w-md h-[42rem] bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden flex flex-col items-center pt-12 pb-8 px-6 ring-1 ring-gray-200">
        
        {/* Signal Bar (Cosmetic) */}
        <div className="flex justify-between w-full px-6 opacity-40 mb-8">
          <span className="text-gray-900 text-xs font-medium">10:42</span>
          <div className="flex gap-1">
             <div className="w-1 h-2 bg-gray-900 rounded-full"></div>
             <div className="w-1 h-3 bg-gray-900 rounded-full"></div>
             <div className="w-1 h-4 bg-gray-900 rounded-full"></div>
             <div className="w-1 h-3 bg-gray-900/30 rounded-full"></div>
          </div>
        </div>

        {/* Caller Info */}
        <div className="flex flex-col items-center gap-6 z-10 w-full">
          <div className="relative">
            <div className={`absolute inset-0 rounded-full bg-blue-400 blur-3xl opacity-20 animate-pulse ${isAiSpeaking ? 'scale-150' : 'scale-100'}`} />
            <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white z-10 overflow-hidden">
               <span className="text-6xl drop-shadow-sm">🤖</span>
            </div>
            {isAiSpeaking && (
               <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full border-4 border-white animate-bounce shadow-lg z-20 whitespace-nowrap">
                 SPEAKING
               </div>
            )}
          </div>
          
          <div className="text-center space-y-2 w-full">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">AI Recruiter</h2>
            <p className="text-indigo-600 font-semibold text-sm tracking-wide uppercase px-4 py-1.5 bg-indigo-50 rounded-full inline-block shadow-sm">
              {jobPosition || "General"} Interview
            </p>
            <p className="text-gray-500 text-sm mt-1 animate-pulse font-medium">
              {callStatus === 'active' ? "● Connected" : "Ready to connect..."}
            </p>
          </div>
        </div>

        {/* Dynamic Visualizer (Center) */}
        <div className="flex-1 flex items-center justify-center w-full my-6 gap-3 h-32">
           {callStatus === 'active' ? (
             audioLevels.map((height, i) => (
                <div 
                  key={i}
                  className={`w-4 md:w-5 rounded-full transition-all duration-75 ease-in-out ${
                    isAiSpeaking 
                      ? 'bg-gradient-to-t from-indigo-500 to-blue-500 shadow-lg shadow-indigo-200' 
                      : isUserSpeaking 
                        ? 'bg-gradient-to-t from-emerald-500 to-green-400 shadow-lg shadow-green-200' 
                        : 'bg-gray-200'
                  }`}
                  style={{
                    height: `${height * 0.8}%`, // Reduced max height slightly to prevent overflow
                    opacity: isAiSpeaking || isUserSpeaking ? 1 : 0.4
                  }}
                />
             ))
           ) : (
             <span className="text-gray-400 text-sm font-medium animate-pulse">Waiting to start session...</span>
           )}
        </div>

        {/* User Status / Mute Status */}
        <div className="mb-6 w-full px-2">
           <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white shadow-lg shadow-indigo-100/50">
             <div className="flex items-center gap-3 overflow-hidden">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white shadow-md border-2 border-white flex-shrink-0">
                 {userInitial}
               </div>
               <div className="min-w-0">
                  <p className="text-gray-900 text-sm font-bold truncate">{userName || "Candidate"}</p>
                  <p className={`text-xs font-medium truncate ${isMuted ? "text-red-500" : "text-green-600"}`}>
                    {isMuted ? "Microphone Muted" : "Microphone Active"}
                  </p>
               </div>
             </div>
             <div className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${isUserSpeaking ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-current ${isUserSpeaking ? 'animate-ping' : ''}`} />
             </div>
           </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 w-full pb-2">
           
           {/* Mute Button */}
           <button 
             onClick={toggleMute}
             disabled={callStatus !== 'active'}
             className={`p-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg border-2 flex items-center justify-center ${
               isMuted 
                 ? "bg-white text-gray-900 border-gray-100 shadow-gray-200" 
                 : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent"
             }`}
           >
             {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
           </button>

           {/* End Call Button */}
          <div className="relative group flex items-center justify-center">
            {callStatus === 'active' ? (
              <button 
                onClick={stopInterview}
                className="p-5 rounded-full bg-red-500 text-white shadow-xl shadow-red-500/30 transform transition-transform duration-200 hover:scale-110 active:scale-95 border-4 border-white ring-4 ring-red-100 flex items-center justify-center"
              >
                <Phone className="w-8 h-8 fill-current rotate-135" />
              </button>
            ) : (
                <AlertConfirmation 
                    stopInterview={startInterview} 
                    isDisabled={callStatus !== 'idle'} 
                    isStart={true}
                >
                    <button 
                        disabled={callStatus !== 'idle'}
                        className={`p-5 rounded-full text-white shadow-xl transform transition-transform duration-200 hover:scale-110 active:scale-95 border-4 border-white ring-4 flex items-center justify-center ${
                          callStatus === 'starting' 
                            ? 'bg-yellow-500 ring-yellow-100 animate-pulse' 
                            : 'bg-green-500 ring-green-100 shadow-green-500/30'
                        }`}
                    >
                        <Phone className={`w-8 h-8 fill-current ${callStatus === 'starting' ? 'animate-spin' : ''}`} />
                    </button>
                </AlertConfirmation>
            )}
          </div>

           {/* Speaker / Settings Placeholder */}
           <button className="p-4 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center">
             <span className="text-[10px] font-bold w-6 h-6 flex items-center justify-center">SPKR</span>
           </button>

        </div>

      </div>
      
      <p className="text-gray-500 text-sm font-medium text-center max-w-md animate-fade-in-up delay-100">
        <span className="block mb-1">🎧 Use headphones for the best experience.</span>
        The AI Recruiter will guide you through this phone screening.
      </p>

    </div>
  );
};

export default AudioInterview;
