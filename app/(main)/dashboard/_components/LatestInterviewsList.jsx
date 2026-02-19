"use client";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { Plus, Sparkles, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard";

function LatestInterviewsList() {
  const [interviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    let { data: Interview, error } = await supabase
      .from("Interview")
      .select('*, "interview-feedback"(id)')
      .eq("userEmail", user?.email)
      .order("id", { ascending: false })
      .limit(6);

    setInterviewList(Interview);
  };

  return (
    <div className="mt-2 animate-fade-in-up delay-300">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
          <h2 className="font-bold text-2xl md:text-3xl text-gray-800">
            Recent Interviews
          </h2>
        </div>
        <Link href="/dashboard/create-interview">
          <button className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            New
          </button>
        </Link>
      </div>

      {/* Empty state */}
      {interviewList?.length === 0 && (
        <div className="card-premium p-10 flex flex-col gap-5 items-center text-center max-w-sm mx-auto animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Video className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-800">No interviews yet</h2>
            <p className="text-gray-500 text-sm">Create your first AI interview to get started</p>
          </div>
          <Link href="/dashboard/create-interview" passHref>
            <button className="flex items-center gap-2 py-3 px-6 rounded-2xl btn-shimmer text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
              <Sparkles className="w-4 h-4" />
              Create Interview
            </button>
          </Link>
        </div>
      )}

      {/* Interview grid */}
      {interviewList && interviewList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {interviewList.map((interview, index) => (
            <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
              <InterviewCard interview={interview} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestInterviewsList;