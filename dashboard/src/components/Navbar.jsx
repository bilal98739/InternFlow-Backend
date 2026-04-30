import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Search, Loader2, CheckSquare, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Navbar({ setIsOpen }) {
  const name = localStorage.getItem("name") || "User";
  const role = localStorage.getItem("role") || "intern";
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ interns: [], tasks: [] });
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults({ interns: [], tasks: [] });
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setShowDropdown(true);
      try {
        const res = await API.get(`/api/dashboard/search?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleResultClick = (type) => {
    setShowDropdown(false);
    setQuery("");
    if (type === "intern") {
      navigate("/interns");
    } else {
      navigate(role === "admin" ? "/tasks" : "/intern");
    }
  };

  return (
    <header className="h-16 bg-[#131628] border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} />
        </button>
        
        {/* Search Bar with Dropdown */}
        <div className="hidden md:flex flex-col relative" ref={dropdownRef}>
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search tasks, interns..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (query.trim()) setShowDropdown(true); }}
              className="bg-[#0d0f1a] border border-[rgba(255,255,255,0.05)] rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-300 outline-none focus:border-indigo-500/50 transition-colors w-72"
            />
            {loading && <Loader2 size={14} className="absolute right-3 text-indigo-400 animate-spin" />}
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && (query.trim().length > 0) && (
            <div className="absolute top-full left-0 mt-2 w-full bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-[slideUp_0.15s_ease-out]">
              {results.tasks.length === 0 && results.interns.length === 0 && !loading && (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
              )}

              {results.tasks.length > 0 && (
                <div className="mb-1">
                  <div className="px-4 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider bg-white/[0.02]">Tasks</div>
                  {results.tasks.map(task => (
                    <div 
                      key={task._id} 
                      onClick={() => handleResultClick("task")}
                      className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <CheckSquare size={14} className="text-blue-400 shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-slate-200 truncate">{task.title}</span>
                        <span className="text-xs text-slate-500">{task.status} • {task.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {results.interns.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider bg-white/[0.02] border-t border-white/5">Interns</div>
                  {results.interns.map(intern => (
                    <div 
                      key={intern._id} 
                      onClick={() => handleResultClick("intern")}
                      className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <Users size={14} className="text-violet-400 shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-slate-200 truncate">{intern.name}</span>
                        <span className="text-xs text-slate-500 truncate">{intern.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#131628]"></span>
        </button>
        
        <div className="h-8 w-px bg-[rgba(255,255,255,0.1)] mx-1"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{name}</div>
            <div className="text-xs text-slate-500 capitalize">{role}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}