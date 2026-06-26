import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { generateInterview } from '../services/interview';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Code, 
  PieChart, 
  BarChart, 
  PenTool,
  UserCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleGenerate = async (selectedRole: string = role) => {
    if (!selectedRole.trim()) return;
    setLoading(true);

    try {
      const newInterview = await generateInterview(selectedRole, 'Intermediate');
      navigate(`/interview/${newInterview._id}`);
    } catch (err: any) {
      console.error(err);
      alert("Failed to generate interview. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGenerate(role);
  };

  const popularRoles = [
    { name: "Software Engineering", icon: Code },
    { name: "Product Management", icon: PieChart },
    { name: "Data Science", icon: BarChart },
    { name: "UX Design", icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
      {/* Top Navigation */}
      <nav className="relative z-10 w-full px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-display-lg-mobile text-[#d0bcff] tracking-tight">HirePrep</h1>
          <div className="hidden md:flex items-center gap-8 text-body-md text-gray-300">
            <Link to="/dashboard" className="text-white border-b-2 border-primary pb-1 font-medium">Practice</Link>
            <Link to="/insights" className="hover:text-white transition-colors">Insights</Link>
            <a href="#" className="hover:text-white transition-colors">Roles</a>
          </div>
        </div>
        
        <div className="flex items-center gap-6 relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)} 
            className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <UserCircle className="w-6 h-6" />
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-40 glass-card rounded-lg overflow-hidden flex flex-col z-50">
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-display-lg text-white">Define Your Trajectory</h2>
          <p className="text-body-lg text-gray-400">What role are you preparing for?</p>
        </div>

        {/* Search / Input Area */}
        <div className="w-full max-w-3xl relative mb-16">
          <form onSubmit={handleFormSubmit} className="relative group">
            {/* The Glow Effect */}
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="relative glass-card rounded-xl flex items-center p-2 focus-within:border-primary/40 transition-colors duration-300 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <div className="pl-4 pr-3 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Machine Learning Engineer"
                className="flex-1 bg-transparent border-none text-body-lg text-white placeholder-gray-500 focus:outline-none py-3"
              />
              <Button 
                type="submit" 
                variant="secondary"
                disabled={loading || !role.trim()}
                className="ml-2 pr-5 pl-5 h-12 !bg-[rgba(208,188,255,0.15)] !border-[rgba(208,188,255,0.2)] hover:!bg-[rgba(208,188,255,0.25)] transition-all"
              >
                {loading ? 'Starting...' : 'Begin Session'}
                {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </form>
        </div>

        {/* Popular Trajectories */}
        <div className="w-full max-w-3xl text-center">
          <h3 className="text-label-caps text-gray-500 mb-6">Popular Trajectories</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {popularRoles.map((pr) => (
              <button
                key={pr.name}
                onClick={() => {
                  setRole(pr.name);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/5 text-gray-300 hover:text-white hover:border-primary/30 hover:shadow-[0_0_15px_rgba(208,188,255,0.15)] transition-all duration-300 text-sm bg-[rgba(23,31,51,0.6)]"
              >
                <pr.icon className="w-4 h-4 text-cyan-400" />
                <span>{pr.name}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
