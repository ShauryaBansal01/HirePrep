import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { generateInterview, getInterviewHistory } from '../services/interview';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Load history
    getInterviewHistory().then(data => setHistory(data)).catch(err => console.error(err));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newInterview = await generateInterview(role, difficulty);
      navigate(`/interview/${newInterview._id}`);
    } catch (err: any) {
      console.error(err);
      alert("Failed to generate interview. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">{user?.name}</span>
          </h1>
          <p className="text-gray-400 mt-2">Ready to crush your next interview?</p>
        </div>
        <Button variant="outline" onClick={logout} className="border-border text-gray-400 hover:text-white">
          Logout
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="p-8 lg:col-span-1 glass-card border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500" />
          <h2 className="text-2xl font-bold mb-6">New Interview</h2>
          
          <form onSubmit={handleGenerate} className="space-y-6">
            <Input 
              label="Job Role" 
              placeholder="e.g. Frontend Engineer" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Difficulty</label>
              <select 
                className="w-full bg-input border border-border text-foreground px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <Button type="submit" fullWidth disabled={loading} className="h-12 text-lg shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              {loading ? 'Generating with AI...' : 'Start Interview'}
            </Button>
          </form>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold">Your History</h2>
          
          {history.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 border-border bg-transparent">
              <p className="text-gray-400">You haven't completed any interviews yet.</p>
              <p className="text-sm mt-2">Generate your first one to get a score!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {history.map((int: any) => (
                <Card key={int._id} className="p-6 flex justify-between items-center hover:border-primary/50 transition-all cursor-pointer group" onClick={() => navigate(`/interview/${int._id}/results`)}>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{int.role}</h3>
                    <p className="text-sm text-gray-400">{int.difficulty} • {new Date(int.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                    {int.totalScore}%
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
