import CreateOptions from "./_components/CreateOptions";
import DashboardStats from "./_components/DashboardStats";
import WelcomeContainer from "./_components/WelcomeContainer";

function Dashboard() {
  return (
    <div className="animate-fade-in p-1">
      <WelcomeContainer />

      {/* Quick Actions */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
        <h2 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-gray-100">
          Quick Actions
        </h2>
      </div>
      <CreateOptions />

      {/* Divider */}
      <div className="my-6 h-px bg-gradient-to-r from-transparent via-indigo-100 dark:via-indigo-900/40 to-transparent" />

      {/* Analytics Dashboard */}
      <DashboardStats />
    </div>
  );
}

export default Dashboard;