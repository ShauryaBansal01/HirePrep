import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInterview, submitInterviewAnswers } from '../services/interview';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Tell TypeScript about the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function InterviewSessionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [interview, setInterview] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [answers, setAnswers] = useState<string[]>([]);

    // Speech Recognition State
    const [isRecording, setIsRecording] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        // Setup Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const r = new SpeechRecognition();
            r.continuous = true;
            r.interimResults = true;
            
            r.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    }
                }
                
                if (finalTranscript) {
                    // Append the spoken text to whatever the user has already typed/spoken
                    setAnswer(prev => prev + finalTranscript);
                }
            };
            
            r.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };

            r.onend = () => {
                // If it stops automatically, just sync state
                setIsRecording(false);
            };

            setRecognition(r);
        }

        const loadInterview = async () => {
            try {
                if (id) {
                    const data = await fetchInterview(id);
                    if (data.status === 'completed') {
                        navigate(`/interview/${id}/results`);
                        return;
                    }
                    setInterview(data);
                }
            } catch (err: any) {
                console.error(err);
                setError("Failed to load interview.");
            } finally {
                setLoading(false);
            }
        };
        loadInterview();
    }, [id, navigate]);

    const toggleRecording = () => {
        if (!recognition) {
            alert("Speech recognition is not supported in this browser. Try Google Chrome or Microsoft Edge.");
            return;
        }

        if (isRecording) {
            recognition.stop();
            setIsRecording(false);
        } else {
            recognition.start();
            setIsRecording(true);
        }
    };

    const handleNext = async () => {
        // Stop recording if moving to next question
        if (isRecording && recognition) {
            recognition.stop();
            setIsRecording(false);
        }

        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);

        if (currentQuestionIndex < interview.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setAnswer(newAnswers[currentQuestionIndex + 1] || '');
        } else {
            setSubmitting(true);
            try {
                await submitInterviewAnswers(id as string, newAnswers);
                navigate(`/interview/${id}/results`);
            } catch (err: any) {
                console.error(err);
                alert("Failed to submit interview for grading.");
                setSubmitting(false);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading interview...</div>;
    if (submitting) return <div className="p-8 text-center text-primary animate-pulse font-bold text-xl">Grading your answers with AI... Please wait!</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!interview) return <div className="p-8 text-center text-gray-400">Interview not found.</div>;

    const currentQuestion = interview.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;

    return (
        <div className="min-h-screen p-8 max-w-3xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground">
                    {interview.role} Interview
                </h1>
                <span className="text-sm text-gray-400 bg-surface px-3 py-1 rounded-full border border-border shadow-sm">
                    Question {currentQuestionIndex + 1} of {interview.questions.length}
                </span>
            </div>

            <Card className="p-6">
                <h2 className="text-xl font-medium text-foreground mb-6 leading-relaxed">
                    {currentQuestion}
                </h2>
                
                <div className="relative">
                    <textarea 
                        className="w-full h-48 bg-surface border border-border text-foreground p-4 pb-16 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner"
                        placeholder="Type your answer here or click the microphone to speak..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={submitting}
                    />
                    
                    <button 
                        onClick={toggleRecording}
                        className={`absolute bottom-4 right-4 p-4 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 ${
                            isRecording 
                                ? 'bg-red-500 text-white animate-pulse shadow-red-500/50' 
                                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                        }`}
                        title={isRecording ? "Stop Recording" : "Start Recording"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="22"></line>
                        </svg>
                    </button>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button onClick={handleNext} disabled={!answer.trim() || submitting}>
                        {isLastQuestion ? 'Submit Interview' : 'Next Question'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
