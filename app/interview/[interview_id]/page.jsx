"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import { supabase } from "@/services/supabaseClient";
import { Clock, Info, Loader2, Loader2Icon, Video } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

function Interview() {
  const { interview_id } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();
  const[userEmail,setUserEmail]=useState();

  useEffect(() => {
    if (interview_id) {
      GetInterviewDetails();
    }
  }, [interview_id]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      const { data: Interview, error } = await supabase
        .from("Interview")
        .select("jobPosition,jobDescription,duration,type,questionList")
        .eq("interview_id", interview_id);

      if (error) throw error;
      if (!Interview || Interview.length === 0) {
        toast.error("Incorrect Interview Link");
        return;
      }

      setInterviewData(Interview[0]);
    } catch (e) {
      toast.error("Failed to fetch interview data");
    } finally {
      setLoading(false);
    }
  };

  const onJoinInterview = async () => {
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const { data: Interview, error } = await supabase
        .from("Interview")
        .select("*")
        .eq("interview_id", interview_id);

      if (error || !Interview || Interview.length === 0) {
        toast.error("Interview not found.");
        return;
      }

      // Verify questions exist
      if (!Interview[0].questionList || Interview[0].questionList.length === 0) {
        toast.error("This interview has no questions configured");
        return;
      }

      setInterviewInfo({
        userName: userName.trim(),
        userEmail:userEmail,
        interviewData: Interview[0]
      });
      router.push(`/interview/${interview_id}/start`);
    } catch (e) {
      toast.error("Failed to join interview");
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-400 p-6 text-center">
          <Image 
            src="/logo.png" 
            alt="logo" 
            width={160} 
            height={80} 
            className="mx-auto mb-2"
          />
          <h1 className="text-xl font-bold text-white">AI-Powered Interview</h1>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                  <Video className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {interviewData?.jobPosition || "Loading Position..."}
                </h2>
                <div className="flex items-center gap-2 text-gray-600 mt-2">
                  <Clock className="h-5 w-5" />
                  <span>{interviewData?.duration || "--"} minute interview</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="fullname"
                    placeholder="John Doe"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    placeholder="john@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <Info className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-2">Before you begin</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li className="flex items-start gap-2">
                        <span>•</span> Ensure you have a stable Internet connection
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span> Test your microphone before starting
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span> Find a quiet place for the interview
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span> Have your answers prepared
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                className="mt-6 w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading || !userName.trim()}
                onClick={onJoinInterview}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                ) : (
                  <Video className="mr-2 h-5 w-5" />
                )}
                Join Interview Now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interview;