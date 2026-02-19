import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import axios from "axios";
import { AlertTriangle, CheckCircle2, Link2, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import QuestionListContainer from "./QuestionListContainer";

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState([]);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', { ...formData });
      const content = result.data?.content;
      if (!content) throw new Error("No content received from AI");

      let cleanedContent = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/^[^{]*/, '')
        .replace(/[^}]*$/, '')
        .trim();

      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) cleanedContent = jsonMatch[0];

      let parsed;
      try {
        parsed = JSON.parse(cleanedContent);
      } catch (parseError) {
        const questionMatches = content.match(/"question":\s*"([^"]+)"/g);
        const typeMatches = content.match(/"type":\s*"([^"]+)"/g);
        if (questionMatches && typeMatches) {
          const questions = questionMatches.map((match, index) => ({
            question: match.match(/"question":\s*"([^"]+)"/)?.[1] || "Question " + (index + 1),
            type: typeMatches[index]?.match(/"type":\s*"([^"]+)"/)?.[1] || "General",
          }));
          setQuestionList(questions);
          return;
        }
        throw new Error("Invalid JSON format received from AI");
      }

      if (!parsed.interviewQuestions || !Array.isArray(parsed.interviewQuestions)) {
        throw new Error("Invalid format: 'interviewQuestions' is missing or not an array.");
      }

      setQuestionList(parsed.interviewQuestions);
    } catch (e) {
      console.error("Error:", e.message || e);
      toast.error(`Failed to generate questions: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    if (questionList.length === 0) {
      toast.error("Please generate questions first");
      return;
    }
    if (!user || !user.email) {
      toast.error("Unable to determine your account. Please log in again and retry.");
      return;
    }

    setSaveLoading(true);
    const interview_id = uuidv4();

    try {
      const { data, error } = await supabase
        .from('Interview')
        .insert([{
          ...formData,
          questionList: questionList,
          userEmail: user.email,
          interview_id: interview_id
        }])
        .select();

      if (error) throw error;
      toast.success("Interview created successfully!");
      onCreateLink(interview_id);
    } catch (error) {
      console.error("Error saving interview:", error);
      toast.error("Failed to save interview");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Loading state */}
      {loading && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-6 animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 animate-gradient-shift" />
          <div className="relative flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-lg animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-7 w-7 text-white animate-spin-slow" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">Generating Interview Questions</h2>
              <p className="text-indigo-600 text-sm mt-1">
                Our AI is crafting personalized questions based on your requirements...
              </p>
              <div className="flex gap-1 mt-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && questionList.length === 0 && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 flex items-center gap-4 animate-scale-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-md flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">No Questions Generated</h2>
            <p className="text-rose-600 text-sm mt-1">
              We couldn't generate questions. Please check your inputs and try again.
            </p>
          </div>
        </div>
      )}

      {/* Success state header */}
      {!loading && questionList.length > 0 && (
        <div className="flex items-center gap-3 animate-fade-in-up">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
            <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">
              {questionList.length} Questions Generated
            </h2>
            <p className="text-gray-500 text-xs">Review and save to create your interview link</p>
          </div>
        </div>
      )}

      {/* Question list */}
      {!loading && questionList.length > 0 && (
        <QuestionListContainer questionList={questionList} />
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4 border-t border-gray-100">
        <button
          onClick={GenerateQuestionList}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <RefreshCw className="h-4 w-4" />
          }
          {loading ? "Generating..." : "Regenerate Questions"}
        </button>

        <button
          onClick={onFinish}
          disabled={saveLoading || questionList.length === 0}
          className="flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl btn-shimmer text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveLoading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Link2 className="h-4 w-4" />
          }
          {saveLoading ? "Creating..." : "Create Interview Link"}
        </button>
      </div>
    </div>
  );
}

export default QuestionList;