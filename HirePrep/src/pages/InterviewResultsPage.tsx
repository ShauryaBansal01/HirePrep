import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInterview } from '../services/interview';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function InterviewResultsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [interview, setInterview] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                if (id) {
                    const data = await fetchInterview(id);
                    setInterview(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading results...</div>;
    if (!interview || interview.status !== 'completed') return <div className="p-8 text-center text-gray-400">Results not available.</div>;

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-8">
            <Card className="p-8 text-center bg-surface border-border shadow-2xl shadow-primary/10">
                <h1 className="text-3xl font-bold text-foreground mb-4">Interview Complete!</h1>
                <div className="text-7xl font-black text-primary mb-2 drop-shadow-md">{interview.totalScore}%</div>
                <p className="text-gray-400 text-lg">Overall AI Score</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-8 px-8 py-3 text-lg">Return to Dashboard</Button>
            </Card>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">✓</span>
                    Detailed AI Feedback
                </h2>
                {interview.questions.map((q: string, i: number) => {
                    const f = interview.feedback[i] || {};
                    const ans = interview.answers[i] || "No answer provided";
                    return (
                        <Card key={i} className="p-6 border border-border hover:border-primary/50 transition-colors">
                            <div className="flex justify-between items-start mb-6 gap-4">
                                <h3 className="text-lg font-medium text-foreground">
                                    <span className="text-primary mr-2">Q{i + 1}.</span> 
                                    {q}
                                </h3>
                                <span className="bg-primary/20 text-primary px-4 py-2 rounded-lg font-bold whitespace-nowrap text-lg">
                                    {f.score}/10
                                </span>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Your Answer</span>
                                    <p className="text-gray-300 italic">"{ans}"</p>
                                </div>
                                <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">AI Feedback</span>
                                    <p className="text-foreground leading-relaxed">{f.feedback}</p>
                                </div>
                                {f.idealAnswer && (
                                    <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 rounded-lg relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 block">Ideal Answer</span>
                                        <p className="text-foreground leading-relaxed">{f.idealAnswer}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
