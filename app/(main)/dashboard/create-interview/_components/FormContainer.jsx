import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InterviewType } from "@/services/Contants";
import { ArrowRight, Briefcase, Clock, FileText, Layers, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

function FormContainer({ formData, onHandleInputChange, GoToNext }) {
  const [interviewType, setInterviewType] = useState(formData?.type || []);

  useEffect(() => {
    if (interviewType) {
      onHandleInputChange("type", interviewType);
    }
  }, [interviewType]);

  const AddInterviewType = (type) => {
    if (!interviewType.includes(type)) {
      setInterviewType((prev) => [...prev, type]);
    } else {
      const result = interviewType.filter((item) => item !== type);
      setInterviewType(result);
    }
  };

  const typeGradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-rose-500",
    "from-cyan-500 to-blue-500",
  ];

  return (
    <div className="p-6 md:p-8 space-y-7">
      {/* Job Position */}
      <div className="space-y-2 animate-fade-in-up">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          Job Position
        </label>
        <Input
          placeholder="e.g. Full Stack Developer"
          defaultValue={formData?.jobPosition}
          className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 transition-all duration-200 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          onChange={(event) => onHandleInputChange("jobPosition", event.target.value)}
        />
      </div>

      {/* Job Description */}
      <div className="space-y-2 animate-fade-in-up delay-100">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          Job Description
        </label>
        <Textarea
          placeholder="Describe the role, responsibilities, and requirements..."
          defaultValue={formData?.jobDescription}
          className="min-h-[140px] rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 transition-all duration-200 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
          onChange={(event) => onHandleInputChange("jobDescription", event.target.value)}
        />
      </div>

      {/* Interview Duration */}
      <div className="space-y-2 animate-fade-in-up delay-200">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-white" />
          </div>
          Interview Duration
        </label>
        <Select
          value={formData?.duration}
          onValueChange={(value) => onHandleInputChange("duration", value)}
        >
          <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 transition-all duration-200 text-gray-800 dark:text-gray-200">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent className="rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
            {["5 Min", "15 Min", "30 Min", "45 Min", "60 Min"].map((duration) => (
              <SelectItem
                key={duration}
                value={duration}
                className="rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:bg-indigo-50 dark:focus:bg-indigo-900/30 cursor-pointer text-gray-800 dark:text-gray-200"
              >
                {duration}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Interview Type */}
      <div className="space-y-3 animate-fade-in-up delay-300">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-white" />
          </div>
          Interview Type
          <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-1">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          {InterviewType.map((type, index) => {
            const isSelected = interviewType.includes(type.title);
            const gradient = typeGradients[index % typeGradients.length];
            return (
              <button
                key={index}
                type="button"
                onClick={() => AddInterviewType(type.title)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? `bg-gradient-to-r ${gradient} text-white border-transparent shadow-md scale-[1.03]`
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:scale-[1.02]"
                }`}
              >
                <type.icon className="w-4 h-4" />
                <span>{type.title}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-2 animate-fade-in-up delay-400">
        <button
          onClick={GoToNext}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl btn-shimmer text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
        >
          <Sparkles className="w-4 h-4" />
          Generate Questions
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}

export default FormContainer;