import moment from "moment";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";

function CandidateList({ CandidateList = [] }) {
    return (
        <div className="space-y-4">
            <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-6">Candidate Feedback ({CandidateList.length})</h2>
            
            {CandidateList?.map((candidate, index) => {
                const rating = candidate?.feedback?.feedback?.rating || {};
                const technical = rating.technicalSkills || 0;
                const communication = rating.communication || 0;
                const problemSolving = rating.problemSolving || 0;
                const experience = rating.experience || 0;
                const average = ((technical + communication + problemSolving + experience) / 4).toFixed(1);
                
                return (
                    <div 
                        key={index} 
                        className="p-4 flex gap-4 items-center justify-between bg-white dark:bg-gray-900 rounded-xl shadow-xs hover:shadow-sm transition-shadow border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-700/50"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 px-4 font-bold rounded-2xl text-white">
                                {candidate.userName[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-800 dark:text-gray-100">{candidate.userName}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Completed: {moment(candidate?.created_at).format('MMM DD, YYYY, h:mm A')}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                average >= 8 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                                average >= 5 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                                'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400'
                            }`}>
                                {average}/10
                            </div>
                            <CandidateFeedbackDialog candidate={candidate}/>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default CandidateList;