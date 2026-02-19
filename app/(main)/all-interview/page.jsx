"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/InterviewCard";

function AllInterview() {
  const [interviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    let { data: Interview, error } = await supabase
      .from("Interview")
      .select("*")
      .eq("userEmail", user?.email)
      .order("id", { ascending: false });

    setInterviewList(Interview);
  };

  return (
    <div className="my-5 animate-fade-in">
      <h2 className="font-bold text-2xl md:text-3xl text-gray-800 mb-6">
        All Previously Created Interviews
      </h2>

      {interviewList?.length == 0 && (
        <div className="p-8 flex flex-col gap-4 items-center mt-5 bg-white rounded-xl shadow-sm border border-gray-100 text-center max-w-md mx-auto">
          <Video className="h-12 w-12 text-primary bg-blue-50 p-2 rounded-full" />
          <h2 className="text-lg font-medium text-gray-700">
            You don't have any interviews created yet!
          </h2>
          <Button className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 mt-2">
            + Create New Interview
          </Button>
        </div>
      )}

      {interviewList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {interviewList.map((interview, index) => (
            <InterviewCard interview={interview} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllInterview;