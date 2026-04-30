import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { Users, CheckSquare, Clock, CheckCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/api/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-[70vh]">
        <div className="spinner"></div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-sub">Overview of your intern management system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<Users size={24} />} value={stats?.totalInterns} label="Total Interns" color="text-violet-400" bg="bg-violet-500/10" shadow="shadow-violet-500/10" />
        <StatCard icon={<CheckSquare size={24} />} value={stats?.totalTasks} label="Total Tasks" color="text-blue-400" bg="bg-blue-500/10" shadow="shadow-blue-500/10" />
        <StatCard icon={<Clock size={24} />} value={stats?.pending} label="Pending Tasks" color="text-amber-400" bg="bg-amber-500/10" shadow="shadow-amber-500/10" />
        <StatCard icon={<CheckCircle size={24} />} value={stats?.completed} label="Completed Tasks" color="text-emerald-400" bg="bg-emerald-500/10" shadow="shadow-emerald-500/10" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-white mb-6">Task Completion (Last 6 Months)</h3>
          <div className="h-[300px] w-full">
            {stats?.monthlyData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  />
                  <Bar dataKey="tasks" name="Assigned" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 text-sm border border-dashed border-white/10 rounded-xl">
                No data available to display
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-white mb-6">Task Status Distribution</h3>
          <div className="space-y-6">
            <StatusRow label="Pending" count={stats?.pending} total={stats?.totalTasks} color="bg-amber-400" glow="shadow-amber-400/50" />
            <StatusRow label="In Progress" count={stats?.inProgress} total={stats?.totalTasks} color="bg-blue-400" glow="shadow-blue-400/50" />
            <StatusRow label="Submitted" count={stats?.submitted} total={stats?.totalTasks} color="bg-primary-400" glow="shadow-primary-400/50" />
            <StatusRow label="Completed" count={stats?.completed} total={stats?.totalTasks} color="bg-emerald-400" glow="shadow-emerald-400/50" />
            <StatusRow label="Rejected" count={stats?.rejected} total={stats?.totalTasks} color="bg-red-400" glow="shadow-red-400/50" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, value, label, color, bg, shadow }) {
  return (
    <div className={`card flex items-center gap-5 hover:-translate-y-1 ${shadow} transition-all duration-300`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-black text-white leading-none mb-1 tracking-tight">{value || 0}</div>
        <div className="text-sm font-medium text-slate-400">{label}</div>
      </div>
    </div>
  );
}

function StatusRow({ label, count, total, color, glow }) {
  const percentage = total > 0 ? Math.round(((count || 0) / total) * 100) : 0;
  
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="font-semibold text-slate-200">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium text-sm">{count || 0}</span>
          <span className="text-slate-500 text-xs w-10 text-right font-bold">{percentage}%</span>
        </div>
      </div>
      <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} ${glow} shadow-lg rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}