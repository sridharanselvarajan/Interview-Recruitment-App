import CreateOptions from "./_components/CreateOptions";
import LatestInterviewsList from "./_components/LatestInterviewsList";
import WelcomeContainer from "./_components/WelcomeContainer";

function Dashboard() {
  return (
    <div className="animate-fade-in p-1">
      <WelcomeContainer />

      {/* Quick Actions */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
        <h2 className="font-bold text-2xl md:text-3xl text-gray-800">
          Quick Actions
        </h2>
      </div>
      <CreateOptions />

      {/* Divider */}
      <div className="my-6 h-px bg-gradient-to-r from-transparent via-indigo-100 to-transparent" />

      <LatestInterviewsList />
    </div>
  );
}

export default Dashboard;