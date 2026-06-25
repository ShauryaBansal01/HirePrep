import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 lg:px-12 z-10 glass sticky top-0">
        <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
          HirePrep.AI
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/login')}>Log In</Button>
          <Button onClick={() => navigate('/register')} className="shadow-[0_0_20px_rgba(139,92,246,0.3)]">Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 z-10">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium backdrop-blur-md">
          ✨ Powered by Google Gemini 2.5
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
          Master Your Next <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            Technical Interview
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Experience hyper-realistic mock interviews tailored to your exact role and seniority. Speak your answers, get instantly graded by AI, and land your dream job.
        </p>
        <div className="flex gap-6">
          <Button onClick={() => navigate('/register')} className="h-14 px-8 text-lg shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-all">
            Start Practicing Free
          </Button>
        </div>
      </main>

      {/* Features grid */}
      <section className="py-24 px-6 lg:px-12 z-10">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass-card p-8 rounded-2xl hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-2xl mb-6">🎯</div>
            <h3 className="text-xl font-bold mb-3">Role-Specific Generation</h3>
            <p className="text-gray-400">Enter any job title, and Gemini instantly crafts 10 customized technical questions used by top companies.</p>
          </div>
          <div className="glass-card p-8 rounded-2xl hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center text-2xl mb-6">🎤</div>
            <h3 className="text-xl font-bold mb-3">Voice Recognition</h3>
            <p className="text-gray-400">Practice your verbal delivery. Speak your answers naturally and watch them transcribe in real-time.</p>
          </div>
          <div className="glass-card p-8 rounded-2xl hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-2xl mb-6">📊</div>
            <h3 className="text-xl font-bold mb-3">Harsh AI Grading</h3>
            <p className="text-gray-400">Receive strict, constructive feedback and an overall percentage score to know exactly where you stand.</p>
          </div>
        </div>
      </section>
    </div>
  );
}