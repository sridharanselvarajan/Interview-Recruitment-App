"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/services/supabaseClient";
import { ArrowRight, Briefcase, Clock, Copy, Pencil, Send, Trash2, Users } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

// Gradient pairs for card accents — cycles by index
const gradients = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
];

function InterviewCard({ interview, viewDetail = false, index = 0, onDelete, onUpdate }) {
  const url = process.env.NEXT_PUBLIC_HOST_URL + "/interview/" + interview?.interview_id;
  const gradient = gradients[index % gradients.length];
  const candidateCount = interview?.["interview-feedback"]?.length || 0;

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    jobPosition: interview?.jobPosition || "",
    jobDescription: interview?.jobDescription || "",
    duration: interview?.duration || "",
  });

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Interview link copied!");
  };

  const onSend = () => {
    window.location.href = `mailto:?subject=AiCruiter Interview Link&body=Interview Link: ${url}`;
  };

  const handleDelete = async () => {
    try {
      // Delete associated feedback and answers first
      await supabase.from("interview-feedback").delete().eq("interview_id", interview.interview_id);
      await supabase.from("UserAnswer").delete().eq("interviewId", interview.interview_id);

      const { error } = await supabase
        .from("Interview")
        .delete()
        .eq("interview_id", interview.interview_id);

      if (error) throw error;

      toast.success("Interview deleted successfully!");
      if (onDelete) onDelete(interview.interview_id);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete interview");
    }
  };

  const handleUpdate = async () => {
    if (!editForm.jobPosition.trim()) return toast.error("Job Position is required");
    setEditLoading(true);
    try {
      const { error } = await supabase
        .from("Interview")
        .update({
          jobPosition: editForm.jobPosition,
          jobDescription: editForm.jobDescription,
          duration: editForm.duration,
        })
        .eq("interview_id", interview.interview_id);

      if (error) throw error;

      toast.success("Interview updated successfully!");
      setEditOpen(false);
      if (onUpdate) onUpdate(interview.interview_id, editForm);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update interview");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="group card-premium flex flex-col h-full overflow-hidden">
      {/* Colored top accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header row */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {moment(interview?.created_at).format("DD MMM YYYY")}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${gradient} text-white shadow-sm`}>
              {interview?.duration}
            </span>
            {/* Edit & Delete actions */}
            <button
              onClick={() => setEditOpen(true)}
              className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
              title="Edit Interview"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                  title="Delete Interview"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Interview?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete{" "}
                    <span className="font-semibold text-gray-800">{interview?.jobPosition}</span>{" "}
                    and all associated feedback and answers. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Job title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs">
            <Briefcase className="w-3.5 h-3.5" />
            Position
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 capitalize leading-snug group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
            {interview?.jobPosition?.toLowerCase()}
          </h3>
        </div>

        {/* Candidate count */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${gradient} bg-opacity-10 text-xs font-medium`}
            style={{ background: "rgba(99,102,241,0.08)", color: "#4f46e5" }}
          >
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
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800">Edit Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Job Position</label>
              <Input
                value={editForm.jobPosition}
                onChange={(e) => setEditForm((p) => ({ ...p, jobPosition: e.target.value }))}
                placeholder="e.g. Full Stack Developer"
                className="h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Job Description</label>
              <Textarea
                value={editForm.jobDescription}
                onChange={(e) => setEditForm((p) => ({ ...p, jobDescription: e.target.value }))}
                placeholder="Describe the role..."
                className="min-h-[100px] rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-400 resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Duration</label>
              <Select
                value={editForm.duration}
                onValueChange={(v) => setEditForm((p) => ({ ...p, duration: v }))}
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {["5 Min", "15 Min", "30 Min", "45 Min", "60 Min"].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={editLoading}
                className="flex-1 py-2.5 rounded-xl btn-shimmer text-white text-sm font-semibold hover:scale-[1.02] transition-all disabled:opacity-60"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InterviewCard;