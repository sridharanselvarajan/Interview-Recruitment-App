"use client";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { supabase } from "@/services/supabaseClient";
import Vapi from "@vapi-ai/web";
import axios from "axios";
import { Camera, Mic, MicOff, Phone, Timer } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import AlertConfirmation from "./_components/AlertConfirmation";
import AudioInterview from "./_components/AudioInterview";
function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [callStatus, setCallStatus] = useState("idle");
  const [timer, setTimer] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const {interview_id} = useParams();
  const router = useRouter();
  
  const conversationRef = useRef([]);
  const userInitial =
    interviewInfo?.userName && interviewInfo.userName.length > 0
      ? interviewInfo.userName[0].toUpperCase()
      : "?";

  const vapi = useMemo(() => new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ''), []);

  useEffect(() => {
    if (interviewInfo) {
      startCall();
    }

    return () => {
      if (callStatus === 'active') {
        vapi.stop().catch(console.error);
      }
    };
  }, [interviewInfo]);

  useEffect(() => {
    let interval;
    if (callStatus === 'active') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    if (!interviewInfo?.interviewData?.questionList) {
      toast.error("No interview questions found");
      return;
    }

    setCallStatus('starting');
    setFeedback(null);
    setConversation([]);
    setConversation([]);
    conversationRef.current = [];
    isFeedbackGenerated.current = false;
    
    try {
      const questions = interviewInfo.interviewData.questionList
        .map(item => item?.question)
        .filter(Boolean)
        .join('\n');

      const assistantOptions = {
        name: "AI Recruiter",
        firstMessage: `Hi ${interviewInfo.userName}, how are you? Ready for your interview for ${interviewInfo.interviewData.jobPosition} position?`,
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        voice: {
          provider: "openai",
          voiceId: "alloy",
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `
You are an AI voice assistant conducting interviews. 
Your job is to ask candidates provided interview questions and assess their responses.

Begin with a friendly introduction:
"Hello ${interviewInfo.userName}! Welcome to your ${interviewInfo.interviewData.jobPosition} interview. I'll be asking you a series of questions. Let's begin!"

Interview Questions:
${questions}

Guidelines:
1. Ask one question at a time
2. Wait for complete responses before continuing
3. Provide subtle hints if needed
4. Give brief feedback after each answer
5. Keep the conversation natural and engaging
6. After all questions, provide a summary and close politely

Example closing:
"That concludes our interview. Thank you for your time, ${interviewInfo.userName}! Your responses were insightful. Good luck with the process!"
              `.trim(),
            },
          ],
        },
        silenceTimeoutSeconds: 600,
      };

      // Event listeners
      vapi.on('call-start', () => {
        console.log('Call started');
        setCallStatus('active');
        setTimer(0);
      });

      vapi.on('call-end', () => {
        console.log('Call ended', { conversation: conversationRef.current });
        setCallStatus('idle');
        setTimeout(() => generateFeedback(), 500); // Small delay to ensure state updates
      });

      vapi.on('error', (error) => {
        console.error('VAPI error:', JSON.stringify(error, null, 2));
        setCallStatus('idle');
        toast.error("Interview session error: " + (error?.message || "Unknown error"));
      });

      vapi.on('speech-start', () => setIsAiSpeaking(true));
      vapi.on('speech-end', () => setIsAiSpeaking(false));
      vapi.on('user-speech-start', () => setIsUserSpeaking(true));
      vapi.on('user-speech-end', () => setIsUserSpeaking(false));

      vapi.on("message", (message) => {
        console.log("New message:", message);
        if (message?.role === "assistant" || message?.role === "user") {
          const newMessage = {
            role: message.role,
            content: message.content,
            timestamp: new Date().toISOString()
          };
          conversationRef.current = [...conversationRef.current, newMessage];
          setConversation(prev => [...prev, newMessage]);
        }
      });

      await vapi.start(assistantOptions);

    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus('idle');
      toast.error("Failed to start interview session");
    }
  };

  const stopInterview = async () => {
    setCallStatus('ending');
    try {
      await vapi.stop();
    } catch (error) {
      console.error("Failed to stop call:", error);
      toast.error("Failed to end interview properly");
    }
  };

  const toggleMute = () => {
    if (callStatus !== 'active') return;
    const newMutedState = !isMuted;
    vapi.setMuted(newMutedState);
    setIsMuted(newMutedState);
  };
  const processedAnswersRef = useRef(new Set());

  // Rolling Evaluation: Check for completed Q&A pairs
  useEffect(() => {
    if (conversation.length > 2) {
      const lastMsg = conversation[conversation.length - 1];
      const prevMsg = conversation[conversation.length - 2];
      const prevPrevMsg = conversation[conversation.length - 3];

      // Trigger condition: Assistant speaks (lastMsg), implying User (prevMsg) has finished answering Question (prevPrevMsg)
      if (lastMsg.role === 'assistant' && prevMsg?.role === 'user' && prevPrevMsg?.role === 'assistant') {
        if (!processedAnswersRef.current.has(prevMsg.timestamp)) {
          processedAnswersRef.current.add(prevMsg.timestamp);
          evaluateAnswer(prevPrevMsg.content, prevMsg.content);
        }
      }
    }
  }, [conversation]);

  const evaluateAnswer = async (question, userAnswer) => {
    try {
      // 1. Get AI Evaluation
      const response = await axios.post('/api/evaluate-answer', {
        question,
        userAnswer,
        interviewId: interview_id,
        jobPosition: interviewInfo?.interviewData?.jobPosition
      });

      const aiFeedback = response.data;

      // 2. Store in Supabase
      if (aiFeedback) {
        const { error } = await supabase
          .from('UserAnswer')
          .insert([
            {
              interviewId: interview_id,
              question,
              userAnswer,
              feedback: aiFeedback,
              created_at: new Date().toISOString()
            }
          ]);
        
        if (error) console.error("Failed to save answer:", error);
      }
    } catch (error) {
      console.error("Evaluation failed:", error);
    }
  };

  const isFeedbackGenerated = useRef(false);

  const generateFeedback = async () => {
    if (isFeedbackGenerated.current) return;
    isFeedbackGenerated.current = true;

    setIsGeneratingFeedback(true);
  
  try {
    // Rolling Evaluation Mode: We fetch the aggregated stats from 'UserAnswer' table via the API
      const response = await axios.post('/api/ai-feedback', {
        interviewId: interview_id,
        conversation: conversationRef.current, // Send conversation directly
        jobPosition: interviewInfo?.interviewData?.jobPosition,
        userName: interviewInfo?.userName
      });

    if (response.data?.content) {
      try {
        const content = response.data.content.replace(/```json|```/g, '');
        const parsedFeedback = JSON.parse(content);

        const feedbackToStore = {
          feedback: {
            rating: {
              technicalSkills: parsedFeedback.feedback?.rating?.technicalSkills || 0,
              communication: parsedFeedback.feedback?.rating?.communication || 0,
              problemSolving: parsedFeedback.feedback?.rating?.problemSolving || 0,
              experience: parsedFeedback.feedback?.rating?.experience || 0
            },
            summary: parsedFeedback.feedback?.summary || parsedFeedback.feedback?.summery || "No summary provided",
            strengths: parsedFeedback.feedback?.strengths || [],
            areasForImprovement: parsedFeedback.feedback?.areasForImprovement || [],
            Recommendation: parsedFeedback.feedback?.Recommendation || "No recommendation",
            RecommendationMsg: parsedFeedback.feedback?.RecommendationMsg || ""
          }
        };

        const { data, error } = await supabase
          .from('interview-feedback')
          .insert([
            { 
              userName: interviewInfo?.userName, 
              userEmail: interviewInfo?.userEmail,
              interview_id: interview_id,
              feedback: feedbackToStore,
              recommended: parsedFeedback.feedback?.Recommendation === "Recommended",
              created_at: new Date().toISOString()
            }
          ])
          .select();

        if (error) throw error;

      } catch (parseError) {
        console.error("Failed to parse feedback:", parseError);
        toast.error("Failed to process feedback response");
      }
    } else {
      toast.error("No feedback content received");
    }
  } catch (error) {
    console.error("Feedback generation error:", error);
    toast.error("Failed to generate feedback");
  } finally {
    setIsGeneratingFeedback(false);
    router.push('/interview/'+interview_id+'/completed');
  }
};
    // Determine if it's a phone screening
  const isPhoneScreening = useMemo(() => {
    return interviewInfo?.interviewData?.type?.includes("Phone Screening");
  }, [interviewInfo]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-10">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8 animate-fade-in-down">
        <div className="flex items-center gap-3">
           <div className="bg-white p-2 rounded-lg shadow-sm">
             <Image src="/logo.png" alt="logo" width={40} height={40} className="object-contain" />
           </div>
           <h1 className="text-2xl font-bold text-gray-800">
             {isPhoneScreening ? "AI Phone Screening" : "AI Interview Session"}
           </h1>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
           <Timer className="text-blue-600 w-5 h-5" />
           <span className="text-xl font-mono font-semibold text-gray-700">{formatTime(timer)}</span>
        </div>
      </div>

      {isPhoneScreening ? (
         <AudioInterview
           callStatus={callStatus}
           isAiSpeaking={isAiSpeaking}
           isUserSpeaking={isUserSpeaking}
           toggleMute={toggleMute}
           isMuted={isMuted}
           stopInterview={stopInterview}
           startInterview={startCall}
           userInitial={userInitial}
           userName={interviewInfo?.userName}
           jobPosition={interviewInfo?.interviewData?.jobPosition}
         />
      ) : (
        <>
          {/* Main Video Grid */}
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 flex-1 min-h-[500px]">
            
            {/* AI Recruiter Card */}
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group transition-all duration-300 hover:shadow-2xl flex flex-col">
               {/* Header/Status Bar */}
               <div className="absolute top-4 left-4 z-10 flex gap-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${
                   isAiSpeaking 
                     ? "bg-blue-500/20 text-blue-700 border-blue-200" 
                     : "bg-gray-100/80 text-gray-600 border-gray-200"
                 }`}>
                   AI Recruiter
                 </span>
                 {callStatus === 'active' && (
                   <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-700 border border-green-200 backdrop-blur-md">
                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     Live
                   </span>
                 )}
               </div>

               {/* Main Content Area */}
               <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white relative">
                 <div className="relative w-40 h-40 md:w-56 md:h-56">
                    {/* Speaking Ripples */}
                    {isAiSpeaking && (
                      <>
                        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping" />
                        <div className="absolute inset-0 bg-blue-400 rounded-full opacity-10 animate-ping delay-150" />
                      </>
                    )}
                    {/* Avatar */}
                    <div className="relative w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden z-10 p-1 bg-white">
                      <Image
                        src="/ai.png"
                        alt="AI Recruiter"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                 </div>
                 
                 {/* Dynamic Status Text */}
                 <div className="mt-8 text-center px-6">
                    <p className={`text-lg font-medium transition-colors duration-300 ${isAiSpeaking ? 'text-blue-600' : 'text-gray-500'}`}>
                      {callStatus === 'starting' && "Connecting..."}
                      {callStatus === 'active' && isAiSpeaking && "Speaking..."}
                      {callStatus === 'active' && !isAiSpeaking && "Listening..."}
                      {callStatus === 'idle' && "Ready to start"}
                      {callStatus === 'ending' && "Session ended"}
                    </p>
                 </div>
               </div>
            </div>

            {/* User Card */}
            <div className="relative bg-black rounded-2xl shadow-xl overflow-hidden group transition-all duration-300 hover:shadow-2xl flex flex-col">
                {/* Webcam Feed - Fills Container */}
                {webcamEnabled ? (
                   <Webcam
                     onUserMedia={() => setWebcamEnabled(true)}
                     onUserMediaError={() => setWebcamEnabled(false)}
                     mirrored={true}
                     className="absolute inset-0 w-full h-full object-cover"
                   />
                ) : (
                   /* Fallback Avatar state */
                   <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                      <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-full bg-gray-700 border-4 border-gray-600 shadow-inner">
                         <span className="text-5xl md:text-6xl font-bold text-gray-300 select-none">
                           {userInitial}
                         </span>
                         {isUserSpeaking && (
                           <div className="absolute inset-0 rounded-full border-4 border-green-500 opacity-50 animate-pulse" />
                         )}
                      </div>
                      <p className="mt-6 text-gray-400 font-medium">Camera is off</p>
                   </div>
                )}

                {/* Overlay Gradient for Visibility */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                {/* User Info Overlay */}
                <div className="absolute bottom-6 left-6 z-20">
                   <div className="flex items-center gap-3">
                     <h2 className="text-white text-xl font-bold shadow-black drop-shadow-md">
                       {interviewInfo?.userName || "Candidate"}
                     </h2>
                     {isUserSpeaking && (
                       <span className="px-2.5 py-0.5 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm animate-pulse">
                         Speaking
                       </span>
                     )}
                   </div>
                   <p className="text-gray-300 text-sm font-medium mt-1 drop-shadow-sm">
                      {interviewInfo?.interviewData?.jobPosition} Candidate
                   </p>
                </div>

                {/* Mic Status Indicator (Corner) */}
                <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md p-2 rounded-full">
                   <Mic className={`w-5 h-5 ${isUserSpeaking ? 'text-green-400' : 'text-gray-400'}`} />
                </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="mt-10 bg-white px-8 py-4 rounded-full shadow-lg border border-gray-100 flex items-center gap-8 animate-fade-in-up">
             {/* Webcam Toggle */}
             <button 
               onClick={() => setWebcamEnabled(!webcamEnabled)}
               className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm ${
                 webcamEnabled 
                   ? "bg-gray-100 text-gray-900 hover:bg-gray-200" 
                   : "bg-red-50 text-red-600 hover:bg-red-100"
               }`}
               title={webcamEnabled ? "Turn Off Camera" : "Turn On Camera"}
             >
               <Camera className="w-6 h-6" />
             </button>

             {/* Call Action Button */}
             <div className="relative group">
               {callStatus === 'active' ? (
                 <button 
                   onClick={stopInterview}
                   className="p-5 rounded-full bg-red-600 text-white shadow-red-200 shadow-xl transform transition-transform duration-300 hover:scale-110 hover:bg-red-700 hover:rotate-3"
                   title="End Interview"
                 >
                   <Phone className="w-8 h-8 fill-current rotate-135" />
                 </button>
               ) : (
                <AlertConfirmation 
                  stopInterview={stopInterview}
                  isDisabled={callStatus !== 'active'}
                  isStart={true}
                >
                 <button 
                   className={`p-5 rounded-full shadow-xl transform transition-transform duration-300 hover:scale-110 ${
                     callStatus === 'starting'
                       ? "bg-yellow-500 animate-pulse text-white cursor-wait"
                       : "bg-green-600 text-white shadow-green-200 hover:bg-green-700"
                   }`}
                   title="Start Interview"
                 >
                   <Phone className="w-8 h-8 fill-current" />
                 </button>
                </AlertConfirmation>
               )}
             </div>

             {/* Mic Toggle */}
             <button 
                onClick={toggleMute}
                disabled={callStatus !== 'active'}
                className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm ${
                 isMuted 
                   ? "bg-red-50 text-red-600 hover:bg-red-100" 
                   : "bg-gray-100 text-gray-900 hover:bg-gray-200"
               }`}
                title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
             >
               {isMuted ? (
                 <MicOff className="w-6 h-6" />
               ) : (
                 <Mic className={`w-6 h-6 ${isUserSpeaking ? "text-green-600" : "text-gray-700"}`} />
               )}
             </button>
          </div>

           {/* Footer Status */}
           <p className="mt-6 text-gray-400 text-sm font-medium">
             {callStatus === 'idle' && "Click the phone button to allow microphone access"}
             {callStatus === 'starting' && "Establishing secure connection..."}
             {callStatus === 'active' && "Session is being recorded for evaluation"}
           </p>
        </>
      )}
    </div>
  );
}

export default StartInterview;