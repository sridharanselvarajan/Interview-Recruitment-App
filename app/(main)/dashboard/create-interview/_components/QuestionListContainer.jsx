
const typeColors = {
  Technical: "from-blue-500 to-indigo-600",
  Behavioral: "from-purple-500 to-pink-600",
  Leadership: "from-orange-500 to-rose-600",
  General: "from-gray-400 to-gray-600",
  "Problem Solving": "from-emerald-500 to-teal-600",
  "System Design": "from-cyan-500 to-blue-600",
};

function QuestionListContainer({ questionList }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Generated Interview Questions
        </h2>
      </div>

      <div className="space-y-3">
        {questionList.map((item, index) => {
          const gradient = typeColors[item?.type] || "from-indigo-500 to-purple-600";
          return (
            <div
              key={index}
              className="group relative p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/60 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-700/50 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full bg-gradient-to-b ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />

              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Question number */}
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
                    {index + 1}
                  </div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{item.question}</p>
                </div>
                {item?.type && (
                  <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${gradient} text-white shadow-sm`}>
                    {item.type}
                  </span>
                )}
              </div>

              {item?.guidance && (
                <div className="mt-3 ml-10 p-3 bg-gray-50 dark:bg-gray-900/60 rounded-lg border border-gray-100 dark:border-gray-700/40">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Evaluation Guidance</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.guidance}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionListContainer;