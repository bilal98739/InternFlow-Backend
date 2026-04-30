import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "", description: "", internId: "", priority: "Medium", deadline: "", status: "Pending"
  });

  useEffect(() => {
    fetchTasks();
    fetchInterns();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterns = async () => {
    try {
      const res = await API.get("/api/interns");
      setInterns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/api/tasks/${editingId}`, formData);
      } else {
        await API.post("/api/tasks", formData);
      }
      setModalOpen(false);
      resetForm();
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.msg || "Error saving task");
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", internId: "", priority: "Medium", deadline: "", status: "Pending" });
    setEditingId(null);
  };

  const handleEdit = (task) => {
    setFormData({ 
      title: task.title, 
      description: task.description || "", 
      internId: task.internId?._id || "", 
      priority: task.priority, 
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
      status: task.status
    });
    setEditingId(task._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
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
          <h1 className="page-title">Task Management</h1>
          <p className="page-sub">Assign and track tasks across all interns.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => { resetForm(); setModalOpen(true); }}
        >
          <Plus size={18} /> Assign Task
        </button>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="flex justify-center p-12"><div className="spinner"></div></div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-12 text-slate-500">No tasks found. Create one to assign it to an intern.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header w-1/3">Task</th>
                <th className="table-header">Assigned To</th>
                <th className="table-header">Status & Priority</th>
                <th className="table-header">Submission</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="table-cell">
                    <div className="font-semibold text-slate-100 mb-1">{task.title}</div>
                    {task.deadline && (
                      <div className="text-xs text-slate-400">
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="font-medium text-slate-300">
                      {task.internId ? task.internId.name : <span className="text-red-400">Unassigned</span>}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2 items-center">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </td>
                  <td className="table-cell">
                    {task.submittedLink ? (
                      <a href={task.submittedLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 font-medium transition-colors">
                        <ExternalLink size={14} /> View Link
                      </a>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      {task.status === "Submitted" && (
                        <>
                          <button onClick={() => {
                            API.put(`/api/tasks/${task._id}`, { ...task, status: "Completed", internId: task.internId?._id }).then(fetchTasks);
                          }} className="btn btn-sm btn-success">Approve</button>
                          
                          <button onClick={() => {
                             API.put(`/api/tasks/${task._id}`, { ...task, status: "Rejected", internId: task.internId?._id }).then(fetchTasks);
                          }} className="btn btn-sm btn-danger">Reject</button>
                        </>
                      )}
                      
                      <button onClick={() => handleEdit(task)} className="btn btn-sm btn-ghost">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(task._id)} className="btn btn-sm btn-danger">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{editingId ? 'Edit Task' : 'Assign New Task'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input required type="text" className="form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Build login page" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input min-h-[100px] resize-y" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Detailed requirements..." />
              </div>

              <div className="form-group">
                <label className="form-label">Assign To Intern</label>
                <select required className="form-input" value={formData.internId} onChange={e => setFormData({...formData, internId: e.target.value})}>
                  <option value="">-- Select Intern --</option>
                  {interns.map(intern => (
                    <option key={intern._id} value={intern._id}>{intern.name} ({intern.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-input" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input type="date" className="form-input" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                </div>
              </div>

              {editingId && (
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'} Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
