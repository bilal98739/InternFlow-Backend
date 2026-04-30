import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";
import { Clock, Send, CheckCircle, AlertCircle, RefreshCw, X } from "lucide-react";

export default function InternDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLink, setSubmitLink] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decoded = jwtDecode(token);
      
      const res = await API.get(`/api/tasks/intern/${decoded.id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, taskId) => {
    e.preventDefault();
    if (!submitLink) return;
    
    setSubmitting(true);
    try {
      await API.put(`/api/tasks/${taskId}`, { submittedLink: submitLink });
      setSubmitLink("");
      setActiveTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return <span className="badge badge-pending">Pending</span>;
      case "In Progress": return <span className="badge badge-progress">In Progress</span>;
      case "Submitted": return <span className="badge badge-submitted">Submitted</span>;
      case "Completed": return <span className="badge badge-completed">Completed</span>;
      case "Rejected": return <span className="badge badge-rejected">Rejected</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High": return <span className="badge badge-high">High</span>;
      case "Medium": return <span className="badge badge-medium">Medium</span>;
      case "Low": return <span className="badge badge-low">Low</span>;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-sub">View and submit your assigned tasks</p>
        </div>
        <button onClick={() => { setLoading(true); fetchTasks(); }} className="btn btn-ghost group">
          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="spinner"></div></div>
      ) : tasks.length === 0 ? (
        <div className="card text-center py-20 flex flex-col items-center border border-dashed border-white/20 bg-transparent shadow-none">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">You're all caught up!</h3>
          <p className="text-slate-400 font-medium">No tasks have been assigned to you yet. Enjoy your day!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task._id} className="card flex flex-col h-full hover:-translate-y-1">
              <div className="flex justify-between items-start mb-5">
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
                {task.deadline && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold bg-black/30 px-2.5 py-1 rounded-full border border-white/5">
                    <Clock size={13} className="text-amber-400" />
                    {new Date(task.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-100 mb-3 leading-tight tracking-tight">{task.title}</h3>
              <p className="text-sm text-slate-400 mb-8 flex-1 leading-relaxed">
                {task.description || "No description provided."}
              </p>

              <div className="pt-5 border-t border-white/10 mt-auto">
                {task.status === "Pending" || task.status === "In Progress" ? (
                  activeTask === task._id ? (
                    <form onSubmit={(e) => handleSubmit(e, task._id)} className="flex flex-col gap-3 animate-[fadeIn_0.2s_ease-out]">
                      <input 
                        type="url"
                        placeholder="Paste your submission link..."
                        className="form-input text-sm"
                        value={submitLink}
                        onChange={(e) => setSubmitLink(e.target.value)}
                        required
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button 
                          type="submit" 
                          className="btn btn-primary flex-1 justify-center"
                          disabled={submitting}
                        >
                          {submitting ? <div className="spinner"></div> : <><Send size={16} /> Submit Work</>}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-ghost px-3 text-slate-400"
                          onClick={() => setActiveTask(null)}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button 
                      onClick={() => setActiveTask(task._id)}
                      className="btn btn-primary w-full justify-center group"
                    >
                      <span>Submit Assignment</span>
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  )
                ) : task.status === "Submitted" ? (
                  <div className="flex items-center gap-2 text-primary-400 text-sm font-bold justify-center py-3 bg-primary-500/10 rounded-xl border border-primary-500/20">
                    <Clock size={16} /> Pending Admin Review
                  </div>
                ) : task.status === "Rejected" ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-bold justify-center py-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
                      <AlertCircle size={16} /> Submission Rejected
                    </div>
                    <button 
                      onClick={() => setActiveTask(task._id)}
                      className="btn btn-ghost w-full justify-center text-sm"
                    >
                      Resubmit Work
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold justify-center py-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <CheckCircle size={18} /> Task Approved & Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
