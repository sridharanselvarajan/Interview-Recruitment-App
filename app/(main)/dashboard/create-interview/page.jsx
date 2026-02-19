"use client";
import { useUser } from "@/app/provider";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, FileText, Link2, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import FormContainer from "./_components/FormContainer";
import InterViewLink from "./_components/InterViewLink";
import QuestionList from "./_components/QuestionList";

const steps = [
  { num: 1, label: "Job Details", icon: FileText },
  { num: 2, label: "Questions", icon: List },
  { num: 3, label: "Share Link", icon: Link2 },
];

function CreateInterview() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <CreateInterviewContent />
    </Suspense>
  );
}

function CreateInterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type');
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: defaultType ? [defaultType] : []
  });
  const [interviewId, setInterviewId] = useState();

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push('/auth');
    }
  }, [user]);

  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onGoToNext = () => {
    const { jobPosition, jobDescription, duration, type } = formData;
    if (!jobPosition) return toast.error("Please enter Job Position!");
    if (!jobDescription) return toast.error("Please enter Job Description!");
    if (!duration) return toast.error("Please select Interview Duration!");
    if (!type || type.length === 0) return toast.error("Please select at least one Interview Type!");
    setStep(step + 1);
  };

  const onCreateLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(step + 1);
  };

  const progressValue = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10 animate-fade-in-down">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Create New Interview</h1>
            <p className="text-gray-500 text-sm mt-0.5">Set up your AI-powered interview in 3 steps</p>
          </div>
        </div>

        {/* Step indicators + progress bar — unified block */}
        <div className="mb-8 animate-fade-in-up">
          {/* Step row */}
          <div className="relative flex items-start justify-between">
            {/* Background connector line (sits behind icons) */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200 -z-0" />
            {/* Active connector line */}
            <div
              className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 -z-0"
              style={{ width: `calc(${progressValue}% * (100% - 40px) / 100)` }}
            />

            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-2 z-10">
                  {/* Icon circle */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isDone
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-200'
                      : isActive
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200 scale-110'
                        : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}>
                    {isDone
                      ? <CheckCircle className="w-5 h-5" />
                      : <Icon className="w-4 h-4" />
                    }
                  </div>
                  {/* Label */}
                  <span className={`text-xs font-semibold text-center ${
                    isActive ? 'text-indigo-600' : isDone ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar below steps */}
          <div className="mt-5">
            <Progress
              value={progressValue}
              className="h-1.5 bg-gray-100 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-600 [&>div]:transition-all [&>div]:duration-500 [&>div]:rounded-full"
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-gray-400">Step {step} of {steps.length}</span>
              <span className="text-xs text-indigo-600 font-medium">{Math.round(progressValue)}% complete</span>
            </div>
          </div>
        </div>

        {/* Content card */}
        <div className="card-premium overflow-hidden animate-scale-in">
          {step === 1 ? (
            <FormContainer
              formData={formData}
              onHandleInputChange={onHandleInputChange}
              GoToNext={onGoToNext}
            />
          ) : step === 2 ? (
            <QuestionList
              formData={formData}
              onCreateLink={(interview_id) => onCreateLink(interview_id)}
            />
          ) : step === 3 ? (
            <InterViewLink interview_id={interviewId} formData={formData} />
          ) : null}
        </div>

      </div>
    </div>
  );
}

export default CreateInterview;