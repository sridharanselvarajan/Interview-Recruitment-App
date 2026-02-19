import { ArrowRight, Briefcase, Clock, Copy, Send, Users } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { toast } from "sonner";

// Gradient pairs for card accents — cycles by index
const gradients = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
];

function InterviewCard({ interview, viewDetail = false, index = 0 }) {
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/interview/" + interview?.interview_id;
  const gradient = gradients[index % gradients.length];
  const candidateCount = interview?.["interview-feedback"]?.length || 0;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Interview link copied!");
  };

  const onSend = () => {
    window.location.href = `mailto:?subject=AiCruiter Interview Link&body=Interview Link: ${url}`;
  };

  return (
    <div className="group card-premium flex flex-col h-full overflow-hidden">
      {/* Colored top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header row */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {moment(interview?.created_at).format("DD MMM YYYY")}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${gradient} text-white shadow-sm`}>
            {interview?.duration}
          </span>
        </div>

        {/* Job title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Briefcase className="w-3.5 h-3.5" />
            Position
          </div>
          <h3 className="text-base font-bold text-gray-800 capitalize leading-snug group-hover:text-indigo-700 transition-colors duration-200">
            {interview?.jobPosition?.toLowerCase()}
          </h3>
        </div>

        {/* Candidate count */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradient} bg-opacity-10 text-xs font-medium`}
            style={{ background: "rgba(99,102,241,0.08)", color: "#4f46e5" }}>
            <Users className="w-3.5 h-3.5" />
            {candidateCount} Candidate{candidateCount !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto">
          {!viewDetail ? (
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
              <button
                onClick={onSend}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </button>
            </div>
          ) : (
            <Link href={"/scheduled-interview/" + interview?.interview_id + "/details"}>
              <button className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r ${gradient} text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn`}>
                View Details
                <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewCard;