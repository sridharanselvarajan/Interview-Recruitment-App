"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { Plus, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/InterviewCard";

function ScheduledInterview() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) getInterviewsList();
    }, [user]);

    const getInterviewsList = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Interview')
                .select(`
                    jobPosition,
                    duration,
                    created_at,
                    interview_id,
                    "interview-feedback" (
                        userEmail
                    )
                `)
                .eq('userEmail', user.email)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInterviewList(data || []);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Interview Feedback Dashboard
                </h1>
                <Link href="/dashboard">
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="h-4 w-4" /> New Interview
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="min-h-[200px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : interviewList.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 text-center max-w-md mx-auto">
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <Video className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-medium text-gray-800">No Interviews Found</h2>
                    <p className="text-gray-600 mt-2 mb-4">
                        You haven't created any interviews yet. Get started by creating your first one!
                    </p>
                    <Link href="/create-interview">
                        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                            <Plus className="h-4 w-4" /> Create Interview
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviewList.map((interview, index) => (
                        <InterviewCard
                            key={index}
                            interview={interview}
                            viewDetail={true}
                            className="hover:shadow-md transition-shadow"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ScheduledInterview;