import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Mail, Star } from "lucide-react";

function CandidateFeedbackDialog({ candidate }) {
  const feedback = candidate?.feedback?.feedback || {};
  const rating = feedback?.rating || {};
  
  // Handle both new "summary" and old "summery" keys
  const summaryText = feedback?.summary || feedback?.summery || "No detailed summary available.";
  const strengths = feedback?.strengths || [];
  const improvements = feedback?.areasForImprovement || [];
  
  const technical = rating.technicalSkills || 0;
  const communication = rating.communication || 0;
  const problemSolving = rating.problemSolving || 0;
  const experience = rating.experience || 0;

  const average = (technical + communication + problemSolving + experience) / 4;

  // Enhanced color configuration
  const colorConfig = {
    excellent: {
      min: 8,
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      progress: "bg-green-500",
      icon: <Star className="h-5 w-5 text-green-500 fill-green-200" />,
      label: "Excellent Fit",
      message: "This candidate exceeds expectations and is highly recommended for the role."
    },
    good: {
      min: 5,
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      progress: "bg-blue-500",
      icon: <Star className="h-5 w-5 text-blue-500 fill-blue-200" />,
      label: "Good Potential",
      message: "Candidate shows promise and could be a good fit with some training."
    },
    poor: {
      min: 0,
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-200",
      progress: "bg-orange-500",
      icon: <Star className="h-5 w-5 text-orange-500 fill-orange-200" />,
      label: "Needs Improvement",
      message: "Candidate may not meet the current requirements for this position."
    }
  };

  const getRatingCategory = () => {
    if (average >= 8) return "excellent";
    if (average >= 5) return "good";
    return "poor";
  };

  const category = getRatingCategory();
  const colors = colorConfig[category];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary hover:bg-blue-50 hover:text-primary/90">
          View Full Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">Candidate Evaluation</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-5 space-y-6">
              {/* Candidate Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 px-4 font-bold rounded-2xl text-white text-xl">
                    {candidate.userName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">{candidate.userName || 'Unknown Candidate'}</h2>
                    <p className="text-sm text-gray-500">{candidate.userEmail || 'No email provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full ${colors.bg} ${colors.text} font-medium flex items-center gap-1`}>
                    {colors.icon}
                    {average.toFixed(1)}/10
                  </div>
                </div>
              </div>

              {/* Skill Assessment */}
              <div className="space-y-4">
                <h2 className="font-bold text-gray-800 text-lg">Skill Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Technical Skills", value: technical },
                    { label: "Communication", value: communication },
                    { label: "Problem Solving", value: problemSolving },
                    { label: "Relevant Experience", value: experience }
                  ].map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">{skill.label}</span>
                        <span className="font-semibold">{skill.value}/10</span>
                      </div>
                      <Progress 
                        value={skill.value * 10} 
                        className={`h-2 ${colors.progress} bg-opacity-20`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Summary */}
              <div className="space-y-2">
                <h2 className="font-bold text-gray-800 text-lg">Interview Summary</h2>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{summaryText}</p>
                </div>
              </div>

              {/* Strengths & Improvements */}
              {(strengths.length > 0 || improvements.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-700 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Key Strengths
                    </h3>
                    <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-100">
                      {strengths.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-700 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 8.586 14.586 5H12z" clipRule="evenodd" />
                      </svg>
                      Areas for Improvement
                    </h3>
                    <ul className="list-disc list-outside pl-5 space-y-1 text-sm text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-100">
                      {improvements.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className={`p-4 rounded-lg border ${colors.border} ${colors.bg} space-y-3`}>
                <div className="flex items-center gap-2">
                  {colors.icon}
                  <h3 className={`font-bold ${colors.text}`}>{colors.label}</h3>
                </div>
                <p className={colors.text}>{feedback.RecommendationMsg || colors.message}</p>
                <div className="flex justify-end">
                  <Button
                    className={`gap-2 ${colors.text} bg-white hover:bg-gray-50 border ${colors.border}`}
                    onClick={() => {
                      window.location.href = "mailto:";
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    Contact Candidate
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;