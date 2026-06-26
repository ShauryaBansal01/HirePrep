import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getInterviewHistory } from '../services/interview';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function InsightsPage() {
  const { logout } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getInterviewHistory()
      .then(data => {
        // Sort chronologically
        const sorted = data.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        // Map to chart format
        const chartData = sorted.map((int: any, index: number) => ({
          name: `Int ${index + 1}`,
          date: new Date(int.createdAt).toLocaleDateString(),
          score: int.totalScore,
          role: int.role
        }));
        setHistory(chartData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
      {/* Top Navigation */}
      <nav className="relative z-10 w-full px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-display-lg-mobile text-[#d0bcff] tracking-tight">HirePrep</h1>
          <div className="hidden md:flex items-center gap-8 text-body-md text-gray-300">
            <Link to="/dashboard" className="hover:text-white transition-colors">Practice</Link>
            <Link to="/insights" className="text-white border-b-2 border-primary pb-1 font-medium">Insights</Link>
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
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-display-lg text-white">Your Progress</h2>
          <p className="text-body-lg text-gray-400">Track your interview scores over time.</p>
        </div>

        <div className="w-full max-w-4xl h-[400px] glass-card p-8 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-primary animate-pulse text-lg font-medium">Loading insights...</div>
            </div>
          ) : history.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400 text-lg">Complete some interviews to see your progress!</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.3)" 
                  tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'var(--font-geist)'}} 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'var(--font-geist)'}} 
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(23, 31, 51, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', backdropFilter: 'blur(12px)' }}
                  itemStyle={{ color: '#d0bcff' }}
                  labelStyle={{ color: '#dae2fd', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#d0bcff" 
                  strokeWidth={3} 
                  dot={{ fill: '#d0bcff', r: 4, strokeWidth: 2, stroke: '#3c0091' }} 
                  activeDot={{ r: 6, fill: '#4cd7f6', stroke: '#003640' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </main>
    </div>
  );
}
