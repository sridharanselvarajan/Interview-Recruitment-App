"use client";
import { useUser } from "@/app/provider";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/services/supabaseClient";
import moment from "moment";
import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

/* ── animated count-up ───────────────────────────────────────────────── */
function useCountUp(target, duration = 1000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let n = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      setVal(Math.round(n));
      if (n >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return val;
}

/* ── KPI stat card ───────────────────────────────────────────────────── */
function StatCard({ icon, label, value, rawValue, sub, gradient, delay }) {
  const animated = useCountUp(typeof rawValue === "number" ? rawValue : 0);
  const display =
    typeof rawValue === "number"
      ? value.replace(String(rawValue), String(animated))
      : value;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-5 shadow-lg cursor-default animate-fade-in-up ${delay ?? ""} hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5`}
      style={{ background: gradient }}
    >
      {/* shimmer sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-white/65 text-[10px] font-semibold uppercase tracking-widest">{label}</p>
          <p className="text-3xl font-extrabold text-white leading-tight mt-1">{display}</p>
          {sub && <p className="text-white/55 text-xs mt-1 font-medium">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

/* ── "expand" card — clickable summary that opens a dialog ──────────── */
function ExpandCard({ icon, label, summary, onClick, accent = "indigo" }) {
  const accents = {
    indigo: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50",
    emerald:"bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50",
    amber:  "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50",
  };
  return (
    <button
      onClick={onClick}
      className="card-premium p-5 flex items-center gap-4 w-full text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl shrink-0 transition-colors duration-200 ${accents[accent]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mt-0.5 truncate">{summary}</p>
      </div>
      <div className="text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 transition-colors duration-200 text-xs font-semibold shrink-0">
        View →
      </div>
    </button>
  );
}

/* ── tooltip helpers ─────────────────────────────────────────────────── */
const tipBox = "bg-white dark:bg-gray-900 border border-indigo-100 dark:border-gray-700 shadow-xl rounded-xl p-3 text-xs";
function AreaTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className={tipBox}><p className="font-bold text-gray-600 dark:text-gray-300 mb-0.5">{label}</p><p className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">{payload[0].value} session{payload[0].value !== 1 ? "s" : ""}</p></div>;
}
function BarTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className={tipBox}><p className="font-bold text-gray-600 dark:text-gray-300 mb-0.5">{label}</p><p className="text-purple-600 dark:text-purple-400 font-extrabold text-sm">{payload[0].value}% avg</p></div>;
}
function PieTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return <div className={tipBox}><p className="font-semibold text-gray-700 dark:text-gray-200">{payload[0].name}</p><p className="text-indigo-600 dark:text-indigo-400 font-bold">{payload[0].value}</p></div>;
}

/* ── constants ───────────────────────────────────────────────────────── */
const LEVEL_COLORS = { Excellent:"#6366f1", Good:"#22c55e", Average:"#f59e0b", "Needs Work":"#f43f5e" };

/* ── skeleton ────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 rounded-xl bg-gray-100 dark:bg-gray-800" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
      </div>
      <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800" />
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════ MAIN ══════════════════════════════════ */
export default function DashboardStats() {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(null); // "types" | "positions" | "passfail" | "scores"

  useEffect(() => { if (user) loadStats(); }, [user]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data: interviews } = await supabase
        .from("Interview")
        .select("interview_id, created_at, jobPosition, type")
        .eq("userEmail", user.email)
        .order("created_at", { ascending: true });

      const ids = (interviews || []).map((i) => i.interview_id);
      const { data: feedbacks } = ids.length
        ? await supabase.from("interview-feedback").select("interview_id, feedback, created_at").in("interview_id", ids)
        : { data: [] };

      /* parse scores */
      const scoredFeedbacks = [];
      (feedbacks || []).forEach((fb) => {
        try {
          const p = typeof fb.feedback === "string" ? JSON.parse(fb.feedback) : fb.feedback;
          const r = p?.feedback?.rating || p?.rating || {};
          const vals = [r.technicalSkills, r.communication, r.problemSolving, r.experience].filter((v) => typeof v === "number");
          if (vals.length) scoredFeedbacks.push({ score: Math.round((vals.reduce((a,b)=>a+b,0)/vals.length/10)*100), created_at: fb.created_at });
        } catch (_) {}
      });

      const scores = scoredFeedbacks.map((f) => f.score);
      const totalInterviews  = (interviews || []).length;
      const totalCandidates  = (feedbacks  || []).length;
      const avgScore  = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
      const bestScore = scores.length ? Math.max(...scores) : 0;
      const lastDate  = (interviews||[]).at?.(-1)?.created_at ? moment((interviews||[]).at(-1).created_at).fromNow() : "—";

      /* improvement */
      const cutoff = moment().subtract(30,"days");
      const recent = scoredFeedbacks.filter((f)=>moment(f.created_at).isAfter(cutoff)).map(f=>f.score);
      const older  = scoredFeedbacks.filter((f)=>!moment(f.created_at).isAfter(cutoff)).map(f=>f.score);
      const rAvg = recent.length ? recent.reduce((a,b)=>a+b,0)/recent.length : null;
      const oAvg = older.length  ? older.reduce((a,b)=>a+b,0)/older.length   : null;
      const improvement = rAvg !== null && oAvg !== null && oAvg > 0 ? Math.round(((rAvg-oAvg)/oAvg)*100) : null;

      const levelLabel = avgScore>=80?"Excellent":avgScore>=60?"Good":avgScore>=40?"Average":"Needs Work";

      /* monthly area */
      const monthBuckets = {};
      for (let i=5;i>=0;i--) monthBuckets[moment().subtract(i,"months").format("MMM YY")]=0;
      (interviews||[]).forEach((iv)=>{ const k=moment(iv.created_at).format("MMM YY"); if(k in monthBuckets) monthBuckets[k]++; });
      const areaData = Object.entries(monthBuckets).map(([month,count])=>({month,count}));

      /* avg score by month */
      const sbm = {};
      scoredFeedbacks.forEach((f)=>{ const k=moment(f.created_at).format("MMM YY"); sbm[k]=[...(sbm[k]||[]),f.score]; });
      const scoreBarData = Object.entries(monthBuckets).map(([month])=>({ month, avg: sbm[month] ? Math.round(sbm[month].reduce((a,b)=>a+b,0)/sbm[month].length) : 0 }));

      /* pie */
      const lm = {Excellent:0,Good:0,Average:0,"Needs Work":0};
      scores.forEach((s)=>{ if(s>=80) lm.Excellent++; else if(s>=60) lm.Good++; else if(s>=40) lm.Average++; else lm["Needs Work"]++; });
      const pieData = Object.entries(lm).filter(([,v])=>v>0).map(([name,value])=>({name,value}));

      /* type split */
      const tmap = {};
      (interviews||[]).forEach((iv)=>{ (Array.isArray(iv.type)?iv.type:[iv.type||"Other"]).forEach((t)=>{ const k=t||"Other"; tmap[k]=(tmap[k]||0)+1; }); });
      const typeData = Object.entries(tmap).map(([name,value])=>({name,value}));

      /* top positions */
      const pmap = {};
      (interviews||[]).forEach((iv)=>{ const p=iv.jobPosition?.trim()||"Unknown"; pmap[p]=(pmap[p]||0)+1; });
      const topPositions = Object.entries(pmap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,count])=>({name,count}));

      const passCount = scores.filter((s)=>s>=60).length;
      const failCount = scores.length - passCount;

      setStats({ totalInterviews, totalCandidates, avgScore, bestScore, levelLabel, lastDate, improvement, passCount, failCount, areaData, scoreBarData, pieData, typeData, topPositions });
    } catch (e) {
      console.error("Stats error:", e);
      setStats({ totalInterviews:0,totalCandidates:0,avgScore:0,bestScore:0,levelLabel:"Needs Work",lastDate:"—",improvement:null,passCount:0,failCount:0,areaData:[],scoreBarData:[],pieData:[],typeData:[],topPositions:[] });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Skeleton />;
  if (!stats)  return null;

  const { totalInterviews=0,totalCandidates=0,avgScore=0,bestScore=0,levelLabel="Needs Work",lastDate="—",improvement=null,passCount=0,failCount=0,areaData=[],scoreBarData=[],pieData=[],typeData=[],topPositions=[] } = stats ?? {};

  const improvStr = improvement===null?"N/A":improvement>0?`+${improvement}%`:`${improvement}%`;
  const improvSub = improvement===null?"no prior data":improvement>0?"↑ vs last 30 days":improvement<0?"↓ vs last 30 days":"no change";

  const topType = typeData.sort((a,b)=>b.value-a.value)[0]?.name || "—";
  const topPos  = topPositions[0]?.name || "—";
  const passRate = (passCount+failCount)>0 ? Math.round((passCount/(passCount+failCount))*100) : 0;

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
          <h2 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-gray-100">Performance Overview</h2>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
          {moment().format("D MMM, h:mm a")}
        </span>
      </div>

      {/* ── 5 KPI CARDS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon="🎤" label="Total Interviews" value={String(totalInterviews)} rawValue={totalInterviews} sub="sessions created" gradient="linear-gradient(135deg,#6366f1,#8b5cf6)" delay="delay-[50ms]" />
        <StatCard icon="👥" label="Candidates" value={String(totalCandidates)} rawValue={totalCandidates} sub="feedback received" gradient="linear-gradient(135deg,#0ea5e9,#6366f1)" delay="delay-[100ms]" />
        <StatCard icon="📊" label="Avg Score" value={avgScore?`${avgScore}%`:"—"} rawValue={avgScore} sub={levelLabel} gradient="linear-gradient(135deg,#7c3aed,#c026d3)" delay="delay-[150ms]" />
        <StatCard icon="🏆" label="Best Score" value={bestScore?`${bestScore}%`:"—"} rawValue={bestScore} sub="personal best" gradient="linear-gradient(135deg,#f59e0b,#ef4444)" delay="delay-[200ms]" />
        <StatCard icon="📈" label="Improvement" value={improvStr} rawValue={null} sub={improvSub} gradient="linear-gradient(135deg,#10b981,#0ea5e9)" delay="delay-[250ms]" />
      </div>

      {/* ── MAIN CHART: Interviews over time ── */}
      <div className="card-premium p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100">Interviews Over Time</h3>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">Sessions created per month (last 6 months)</p>
          </div>
          <span className="text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">{totalInterviews} total</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={areaData} margin={{top:4,right:8,left:-18,bottom:0}}>
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
            <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
            <YAxis allowDecimals={false} tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
            <Tooltip content={<AreaTip/>}/>
            <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fill="url(#ag)"
              dot={{r:4,fill:"#6366f1",strokeWidth:2,stroke:"#fff"}}
              activeDot={{r:6,fill:"#4f46e5",stroke:"#fff",strokeWidth:2}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── 4 EXPAND CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ExpandCard icon="🏷️" label="Interview Types" summary={`Most used: ${topType}`} onClick={()=>setDialog("types")} accent="indigo" />
        <ExpandCard icon="🥇" label="Top Job Positions" summary={topPos !== "—" ? `#1: ${topPos}` : "No data yet"} onClick={()=>setDialog("positions")} accent="purple" />
        <ExpandCard icon="✅" label="Pass / Fail Ratio" summary={`${passRate}% pass rate · ${passCount} passed`} onClick={()=>setDialog("passfail")} accent="emerald" />
        <ExpandCard icon="📉" label="Score Trend" summary={`Avg score by month — ${avgScore || "—"}% overall`} onClick={()=>setDialog("scores")} accent="amber" />
      </div>

      {/* ── last session + level badge ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-premium p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shrink-0">⏳</div>
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-widest">Last Session</p>
            <p className="font-bold text-gray-800 dark:text-gray-100">{lastDate}</p>
          </div>
        </div>
        <div className={`card-premium p-4 flex items-center gap-4 ${
          levelLabel==="Excellent"?"bg-indigo-50/60 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800":
          levelLabel==="Good"?"bg-green-50/60 dark:bg-green-900/20 border-green-200 dark:border-green-800":
          levelLabel==="Average"?"bg-amber-50/60 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800":
          "bg-rose-50/60 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800"}`}>
          <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-white/10 border border-white/60 shadow-sm flex items-center justify-center text-xl">
            {levelLabel==="Excellent"?"🏆":levelLabel==="Good"?"⭐":levelLabel==="Average"?"📊":"💪"}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-50">Performance Level</p>
            <p className="font-extrabold text-gray-800 dark:text-gray-100">{levelLabel}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Avg score: {avgScore||"—"}%</p>
          </div>
        </div>
      </div>

      {/* ════════════ DIALOGS ════════════ */}

      {/* Interview Types dialog */}
      <Dialog open={dialog==="types"} onOpenChange={(o)=>!o&&setDialog(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="text-lg font-bold">Interview Types Breakdown</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            {typeData.length===0 ? <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">No data yet</p> : typeData.map((t,i)=>{
              const pct = Math.round((t.value/totalInterviews)*100);
              const colors=[
                {bar:"bg-gradient-to-r from-indigo-500 to-purple-500",chip:"bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800"},
                {bar:"bg-gradient-to-r from-blue-500 to-cyan-500",chip:"bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800"},
                {bar:"bg-gradient-to-r from-pink-500 to-rose-500",chip:"bg-pink-50 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border-pink-100 dark:border-pink-800"},
                {bar:"bg-gradient-to-r from-amber-500 to-orange-500",chip:"bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800"},
              ];
              const c = colors[i%colors.length];
              return (
                <div key={t.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-semibold px-2.5 py-0.5 rounded-lg border text-xs ${c.chip}`}>{t.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 tabular-nums">{t.value} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.bar} transition-all duration-700`} style={{width:`${pct}%`}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Top Positions dialog */}
      <Dialog open={dialog==="positions"} onOpenChange={(o)=>!o&&setDialog(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="text-lg font-bold">Top Job Positions</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            {topPositions.length===0 ? <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">No data yet</p>
            : topPositions.map((p,i)=>{
              const pct = Math.round((p.count/totalInterviews)*100);
              const medals=["🥇","🥈","🥉","4️⃣","5️⃣"];
              return (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{medals[i]??"•"}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{p.name.toLowerCase()}</span>
                      <span className="text-gray-400 dark:text-gray-500 tabular-nums">{p.count} session{p.count!==1?"s":""}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" style={{width:`${pct}%`}}/>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 w-9 text-right tabular-nums">{pct}%</span>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Pass / Fail dialog */}
      <Dialog open={dialog==="passfail"} onOpenChange={(o)=>!o&&setDialog(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader><DialogTitle className="text-lg font-bold">Pass / Fail Ratio</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">Candidates scoring ≥ 60% are considered Passed.</p>
            {(passCount+failCount)===0 ? <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">No feedback yet</p> : <>
              {/* big donut visual */}
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={[{name:"Passed",value:passCount},{name:"Needs Work",value:failCount}]}
                    cx="50%" cy="50%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    <Cell fill="#22c55e"/>
                    <Cell fill="#f43f5e"/>
                  </Pie>
                  <Tooltip content={<PieTip/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 p-4 text-center">
                  <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">{passCount}</p>
                  <p className="text-[10px] font-semibold text-green-500 dark:text-green-500 uppercase tracking-wide mt-1">Passed</p>
                </div>
                <div className="rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 p-4 text-center">
                  <p className="text-3xl font-extrabold text-rose-500 dark:text-rose-400">{failCount}</p>
                  <p className="text-[10px] font-semibold text-rose-400 dark:text-rose-400 uppercase tracking-wide mt-1">Needs Work</p>
                </div>
              </div>
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-3 text-center">
                <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{passRate}%</p>
                <p className="text-xs text-indigo-400 dark:text-indigo-500 font-medium mt-0.5">overall pass rate</p>
              </div>
            </>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Score Trend dialog */}
      <Dialog open={dialog==="scores"} onOpenChange={(o)=>!o&&setDialog(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader><DialogTitle className="text-lg font-bold">Avg Score by Month</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">Average candidate score per month over the last 6 months.</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scoreBarData} margin={{top:4,right:4,left:-22,bottom:0}}>
                <defs>
                  <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#a78bfa"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,100]} tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                <Tooltip content={<BarTip/>}/>
                <Bar dataKey="avg" fill="url(#barG)" radius={[6,6,0,0]} maxBarSize={40}/>
              </BarChart>
            </ResponsiveContainer>
            {/* score distribution mini */}
            {pieData.length>0 && (
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Score Distribution</p>
                {pieData.map((e)=>(
                  <div key={e.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{background:LEVEL_COLORS[e.name]??"#a5b4fc"}}/>
                      <span className="text-gray-600 dark:text-gray-300 font-medium">{e.name}</span>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-100">{e.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
