import { Calendar, Clock, Tag, ClipboardList } from "lucide-react";
import moment from "moment";
import React from "react";

function InterviewDetailContainer({ interviewDetail }) {
    const interviewTypes = Array.isArray(interviewDetail?.type) 
        ? interviewDetail.type.join(", ")
        : interviewDetail?.type || "N/A";

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">{interviewDetail?.jobPosition}</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    <ClipboardList className="h-4 w-4" />
                    Interview Details
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                            <h4 className="text-xs text-gray-500">Duration</h4>
                            <p className="font-medium">{interviewDetail?.duration || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                            <h4 className="text-xs text-gray-500">Created On</h4>
                            <p className="font-medium">
                                {moment(interviewDetail?.created_at).format("MMM DD, YYYY")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-blue-600" />
                        <div>
                            <h4 className="text-xs text-gray-500">Interview Type</h4>
                            <p className="font-medium">{interviewTypes}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Description */}
            <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Job Description</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">
                        {interviewDetail?.jobDescription || "No description available."}
                    </p>
                </div>
            </div>

            {/* Interview Questions */}
            <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Interview Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {interviewDetail?.questionList?.length > 0 ? (
                        interviewDetail.questionList.map((item, index) => (
                            <div 
                                key={index} 
                                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <p className="text-sm font-medium text-gray-800">
                                    <span className="text-blue-600">{index + 1}.</span> {item?.question}
                                </p>
                                {item.type && (
                                    <p className="text-xs text-gray-500 mt-1">Type: {item.type}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No questions available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default InterviewDetailContainer;