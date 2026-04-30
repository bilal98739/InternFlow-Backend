import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
import { Plus, Edit2, Trash2, Mail, Phone, Code } from "lucide-react";

export default function InternList() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", skills: "", phone: ""
  });

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const res = await API.get("/api/interns");
      setInterns(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/api/interns/${editingId}`, formData);
      } else {
        await API.post("/api/interns", formData);
      }
      setModalOpen(false);
      setFormData({ name: "", email: "", password: "", skills: "", phone: "" });
      setEditingId(null);
      fetchInterns();
    } catch (err) {
      alert(err.response?.data?.msg || "Error saving intern");
    }
  };

  const handleEdit = (intern) => {
    setFormData({ 
      name: intern.name, 
      email: intern.email, 
      password: "", 
      skills: intern.skills || "", 
      phone: intern.phone || "" 
    });
    setEditingId(intern._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this intern?")) return;
    try {
      await API.delete(`/api/interns/${id}`);
      fetchInterns();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Interns Directory</h1>
          <p className="page-sub">Manage interns, update details, or remove them.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setFormData({ name: "", email: "", password: "", skills: "", phone: "" });
            setEditingId(null);
            setModalOpen(true);
          }}
        >
          <Plus size={18} /> Add Intern
        </button>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="flex justify-center p-12"><div className="spinner"></div></div>
        ) : interns.length === 0 ? (
          <div className="text-center p-12 text-slate-500">No interns found. Add one to get started.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Skills</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {interns.map((intern) => (
                <tr key={intern._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="table-cell">
                    <div className="font-semibold text-slate-100">{intern.name}</div>
                  </td>
                  <td className="table-cell">
                    <div className="flex flex-col gap-1.5 text-slate-400">
                      <div className="flex items-center gap-2"><Mail size={14} className="text-primary-400" /> {intern.email}</div>
                      {intern.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-primary-400" /> {intern.phone}</div>}
                    </div>
                  </td>
                  <td className="table-cell">
                    {intern.skills ? (
                      <div className="flex items-center gap-2">
                        <Code size={14} className="text-violet-400" />
                        <span>{intern.skills}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(intern)} className="btn btn-sm btn-ghost">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(intern._id)} className="btn btn-sm btn-danger">
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
            <h2 className="modal-title">{editingId ? 'Edit Intern' : 'Add New Intern'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input required type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Password {editingId && <span className="text-slate-500 normal-case font-normal ml-2">(Leave blank to keep current)</span>}</label>
                <input type="password" required={!editingId} className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 890" />
                </div>
                <div className="form-group">
                  <label className="form-label">Skills</label>
                  <input type="text" className="form-input" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="React, Node.js" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/10">
                <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'} Intern</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
