import { Calendar, ClipboardList, Clock, Tag } from "lucide-react";
import moment from "moment";

function InterviewDetailContainer({ interviewDetail }) {
    const interviewTypes = Array.isArray(interviewDetail?.type) 
        ? interviewDetail.type.join(", ")
        : interviewDetail?.type || "N/A";

    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{interviewDetail?.jobPosition}</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800/40">
                    <ClipboardList className="h-4 w-4" />
                    Interview Details
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h4 className="text-xs text-gray-500 dark:text-gray-400">Duration</h4>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{interviewDetail?.duration || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h4 className="text-xs text-gray-500 dark:text-gray-400">Created On</h4>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                {moment(interviewDetail?.created_at).format("MMM DD, YYYY")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                            <h4 className="text-xs text-gray-500 dark:text-gray-400">Interview Type</h4>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{interviewTypes}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Description */}
            <div className="mt-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Job Description</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/50">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {interviewDetail?.jobDescription || "No description available."}
                    </p>
                </div>
            </div>

            {/* Interview Questions */}
            <div className="mt-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Interview Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {interviewDetail?.questionList?.length > 0 ? (
                        interviewDetail.questionList.map((item, index) => (
                            <div 
                                key={index} 
                                className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-indigo-400/40 dark:hover:border-indigo-500/40 transition-colors"
                            >
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    <span className="text-blue-600 dark:text-blue-400">{index + 1}.</span> {item?.question}
                                </p>
                                {item.type && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Type: {item.type}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No questions available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InterviewDetailContainer;