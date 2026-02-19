import { ArrowRight, Phone, Video } from "lucide-react";
import Link from "next/link";

const options = [
  {
    href: "/dashboard/create-interview",
    icon: Video,
    iconBg: "from-blue-500 to-indigo-600",
    glowColor: "rgba(99,102,241,0.3)",
    badge: "Most Popular",
    badgeColor: "bg-indigo-100 text-indigo-700",
    title: "Create New Interview",
    description: "Create AI-powered video interviews and schedule them with candidates seamlessly.",
    cta: "Get Started",
    delay: "delay-100",
  },
  {
    href: "/dashboard/create-interview?type=Phone Screening",
    icon: Phone,
    iconBg: "from-purple-500 to-pink-600",
    glowColor: "rgba(168,85,247,0.3)",
    badge: "Audio Only",
    badgeColor: "bg-purple-100 text-purple-700",
    title: "Phone Screening Call",
    description: "Schedule AI-driven phone screening calls with candidates — no video required.",
    cta: "Get Started",
    delay: "delay-200",
  },
];

function CreateOptions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {options.map((opt) => {
        const Icon = opt.icon;
        return (
          <Link
            key={opt.href}
            href={opt.href}
            className={`group relative card-premium p-6 flex flex-col gap-4 cursor-pointer animate-fade-in-up ${opt.delay} overflow-hidden`}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[1.25rem] pointer-events-none"
              style={{ boxShadow: `inset 0 0 60px ${opt.glowColor}` }}
            />

            {/* Top row: icon + badge */}
            <div className="flex items-start justify-between">
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${opt.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {/* Icon glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${opt.iconBg} opacity-50 blur-md group-hover:blur-lg transition-all duration-300`} />
                <Icon className="w-6 h-6 text-white relative z-10" />
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${opt.badgeColor}`}>
                {opt.badge}
              </span>
            </div>

            {/* Text */}
            <div className="space-y-1.5">
              <h2 className="font-bold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors duration-200">
                {opt.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                {opt.description}
              </p>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 group-hover:gap-3 transition-all duration-200 mt-auto">
              <span>{opt.cta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>

            {/* Bottom decorative gradient line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${opt.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Link>
        );
      })}
    </div>
  );
}

export default CreateOptions;