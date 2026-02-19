import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle, Clock, Copy, ExternalLink, List, Mail, Plus, Share2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function InterViewLink({ interview_id, formData }) {
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/interview/${interview_id}`;

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast.success("Interview link copied to clipboard!");
  };

  const onEmailShare = () => {
    const subject = encodeURIComponent("AI Interview Invitation");
    const body = encodeURIComponent(
      `Hi,\n\nYou are invited to participate in an AI interview. Please use the following link:\n${url}\n\nBest regards!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const onWhatsAppShare = () => {
    const text = encodeURIComponent(`Join this AI interview! Use the link: ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const onTwitterShare = () => {
    const tweetText = encodeURIComponent("Join this AI interview!");
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${tweetText}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="p-6 md:p-8 flex flex-col items-center gap-6">
      {/* Success hero */}
      <div className="text-center animate-fade-in-up">
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping scale-150" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30 z-10">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <h2 className="font-bold text-2xl text-gray-800">Your AI Interview is Ready!</h2>
        <p className="mt-2 text-gray-500 text-sm max-w-sm mx-auto">
          Share this link with your candidates to start the interview process
        </p>
      </div>

      {/* Interview Link Card */}
      <div className="w-full card-premium p-6 animate-fade-in-up delay-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-indigo-500" />
            Interview Link
          </h3>
          <span className="px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
            Valid 30 days
          </span>
        </div>

        <div className="flex gap-2">
          <Input
            value={url}
            readOnly
            className="flex-1 h-11 rounded-xl border-gray-200 bg-gray-50 text-gray-600 text-sm"
          />
          <button
            onClick={onCopyLink}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-shimmer text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>

        {/* Meta info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
          {formData?.duration && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
              </div>
              {formData.duration}
            </div>
          )}
          {formData?.type?.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                <List className="h-3.5 w-3.5 text-purple-500" />
              </div>
              {formData.type.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Share Via */}
      <div className="w-full card-premium p-6 animate-fade-in-up delay-200">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-indigo-500" />
          Share Via
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Email */}
          <button
            onClick={onEmailShare}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium text-sm hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:scale-[1.02] transition-all duration-200"
          >
            <Mail className="h-4 w-4" />
            Email
          </button>

          {/* WhatsApp */}
          <button
            onClick={onWhatsAppShare}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium text-sm hover:border-green-300 hover:bg-green-50 hover:text-green-700 hover:scale-[1.02] transition-all duration-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>

          {/* Twitter/X */}
          <button
            onClick={onTwitterShare}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium text-sm hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 hover:scale-[1.02] transition-all duration-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
            Twitter / X
          </button>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="w-full flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-300">
        <Link href="/dashboard" className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:scale-[1.01] transition-all duration-200">
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
        </Link>
        <Link href="/dashboard/create-interview" className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm shadow-md shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
            <Plus className="h-4 w-4" />
            New Interview
          </button>
        </Link>
      </div>
    </div>
  );
}

export default InterViewLink;
