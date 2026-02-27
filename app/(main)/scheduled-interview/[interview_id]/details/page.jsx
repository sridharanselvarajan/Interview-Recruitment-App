"use client";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CandidateList from "./_components/CandidateList";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";

function InterviewDetail() {
    const { interview_id } = useParams();
    const { user } = useUser();
    const [interviewDetail, setInterviewDetail] = useState(null);
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) getInterviewDetail();
    }, [user]);

    const getInterviewDetail = async () => {
        setLoading(true);
        try {
            // 1. Fetch interview details (created by this user)
            const { data: interviewData, error: interviewError } = await supabase
                .from('Interview')
                .select(`
                    jobPosition,
                    jobDescription,
                    type,
                    questionList,
                    duration,
                    created_at,
                    interview_id
                `)
                .eq('userEmail', user?.email)
                .eq('interview_id', interview_id)
                .single();

            if (interviewError) throw interviewError;
            setInterviewDetail(interviewData || null);

            // 2. Fetch candidate feedback separately (avoids broken hyphenated join)
            const { data: feedbackData, error: feedbackError } = await supabase
                .from('interview-feedback')
                .select('userEmail, userName, feedback, created_at')
                .eq('interview_id', interview_id);

            if (feedbackError) {
                console.error("Error fetching feedback:", feedbackError);
            } else {
                setFeedbackList(feedbackData || []);
            }

        } catch (error) {
            console.error("Error fetching interview:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!interviewDetail) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-medium text-gray-600">Interview not found</h2>
                <p className="text-gray-500 mt-2">The requested interview could not be loaded</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Interview Details</h1>
            <InterviewDetailContainer interviewDetail={interviewDetail} />
            <CandidateList CandidateList={feedbackList} />
        </div>
    );
}

export default InterviewDetail;