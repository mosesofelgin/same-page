
import React, { useState, useEffect, useRef } from 'react';
import { Topic, Contribution, ConsensusSummary } from './types';
import { generateConsensus } from './services/geminiService';
import { ConsensusCard } from './components/ConsensusCard';

const STORAGE_KEY = 'samepage_scriptorium_data';

const BIBLICAL_SAMPLES: Contribution[] = [
  {
    id: 'b1',
    author: 'Apostle Matthew',
    content: '"Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit." (Matthew 28:19). This establishes the triune name.',
    timestamp: Date.now() - 5000000
  },
  {
    id: 'b2',
    author: 'Apostle John',
    content: '"In the beginning was the Word, and the Word was with God, and the Word was God." (John 1:1). Clearly showing the divinity of Christ and His distinction from the Father.',
    timestamp: Date.now() - 4000000
  },
  {
    id: 'b3',
    author: 'Moses',
    content: '"Hear, O Israel: The Lord our God, the Lord is one." (Deuteronomy 6:4). We must reconcile this absolute oneness with the plurality mentioned elsewhere.',
    timestamp: Date.now() - 3000000
  },
  {
    id: 'b4',
    author: 'Apostle Paul',
    content: '"The grace of the Lord Jesus Christ and the love of God and the fellowship of the Holy Spirit be with you all." (2 Corinthians 13:14).',
    timestamp: Date.now() - 2000000
  },
  {
    id: 'b5',
    author: 'Theology Researcher',
    content: '[REBUTTAL]: If we take John 1:1 and Deut 6:4 together, we must reject any idea that Jesus is a lesser created being. He must be of the same "ousia" (substance) as the Father.',
    timestamp: Date.now() - 1000000
  }
];

const INITIAL_TOPIC: Topic = {
  title: 'The Holy Trinity',
  initialStatement: 'How do we reconcile the Oneness of God with the distinctness of Father, Son, and Holy Spirit?',
  contributions: BIBLICAL_SAMPLES,
  consensusHistory: [],
  lastUpdated: Date.now()
};

const App: React.FC = () => {
  const [topic, setTopic] = useState<Topic>(INITIAL_TOPIC);
  const [newContent, setNewContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [inputType, setInputType] = useState<'insight' | 'rebuttal'>('insight');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [viewingVerdict, setViewingVerdict] = useState(false);
  
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicStatement, setNewTopicStatement] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTopic(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load scriptorium data", e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(topic));
    }
  }, [topic, isLoading]);

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    const contribution: Contribution = {
      id: Math.random().toString(36).substring(2, 11),
      author: authorName,
      content: inputType === 'rebuttal' ? `[REBUTTAL]: ${newContent}` : newContent,
      timestamp: Date.now()
    };

    setTopic(prev => ({
      ...prev,
      contributions: [...prev.contributions, contribution],
      lastUpdated: Date.now()
    }));

    setNewContent('');
    setIsSubmitting(false);
    
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEstablishConsensus = async () => {
    if (topic.contributions.length === 0) return;
    setIsSyncing(true);
    try {
      const summary = await generateConsensus(topic);
      setTopic(prev => ({
        ...prev,
        currentConsensus: summary,
        consensusHistory: [...(prev.consensusHistory || []), summary],
        lastUpdated: Date.now()
      }));
      setViewingVerdict(true);
    } catch (err) {
      console.error("Arbitration Error:", err);
      alert("The Grand Arbiter failed to reach a verdict. Ensure entries are meaningful.");
    } finally {
      setIsSyncing(false);
    }
  };

  const createNewTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicStatement.trim()) return;
    
    const newTopic: Topic = {
      title: newTopicTitle,
      initialStatement: newTopicStatement,
      contributions: [],
      consensusHistory: [],
      lastUpdated: Date.now()
    };
    
    setTopic(newTopic);
    setNewTopicTitle('');
    setNewTopicStatement('');
    setShowTopicModal(false);
    setViewingVerdict(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1e1e2e] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.5em] animate-pulse">Consulting the Scriptorium...</p>
        </div>
      </div>
    );
  }

  const voiceCount = topic.contributions.length;

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#c5a059] selection:text-white max-h-screen overflow-hidden">
      {/* HEADER: Unified Action Bar */}
      <header className="bg-[#1e1e2e] text-[#f4f1ea] py-4 px-8 flex justify-between items-center z-[100] border-b-2 border-[#c5a059] shadow-xl shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-3xl">📜</div>
          <div>
            <h1 className="text-lg font-serif-theology font-black tracking-tight leading-none text-white">Same Page</h1>
            <p className="text-[7px] font-bold text-[#c5a059] uppercase tracking-[0.3em] mt-1 opacity-70">Theological Alignment</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowTopicModal(true)}
            className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all"
          >
            ✨ New Topic
          </button>
          
          <button 
            onClick={handleEstablishConsensus}
            disabled={isSyncing || voiceCount === 0}
            className={`px-5 py-2 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-lg ${
              isSyncing ? 'bg-slate-700 text-slate-400' : 'bg-[#c5a059] text-[#1e1e2e] hover:scale-105 active:scale-95'
            }`}
          >
            {isSyncing ? (
              <span className="w-3 h-3 border-2 border-[#1e1e2e] border-t-transparent rounded-full animate-spin"></span>
            ) : '⚖️ Initiate AI Referee'}
          </button>

          {topic.currentConsensus && !viewingVerdict && (
            <button 
              onClick={() => setViewingVerdict(true)}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-emerald-500 transition-all"
            >
              👁️ View Verdict
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* THE VOICES SCROLL (Main Content) */}
        <section className={`flex-1 flex flex-col bg-[#f4f1ea] relative transition-all duration-500 ${viewingVerdict ? 'opacity-20 blur-sm pointer-events-none scale-95' : 'opacity-100'}`}>
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar relative z-10">
            <div className="max-w-3xl mx-auto w-full space-y-12">
              <div className="text-center space-y-6 pt-10 pb-16">
                 <h2 className="text-[11px] font-black text-[#c5a059] uppercase tracking-[0.6em]">{topic.title}</h2>
                 <p className="text-3xl lg:text-5xl font-serif-theology font-bold text-[#1e1e2e] italic leading-tight">
                    "{topic.initialStatement}"
                 </p>
                 <div className="flex items-center justify-center gap-6">
                    <span className="h-px w-16 bg-[#c5a059]/30"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{voiceCount} Voices Scribed</span>
                    <span className="h-px w-16 bg-[#c5a059]/30"></span>
                 </div>
              </div>

              <div className="space-y-8">
                {topic.contributions.map((c, i) => (
                  <div key={c.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-[#c5a059]/10 hover:border-[#c5a059]/40 hover:shadow-xl transition-all relative">
                      <div className="absolute -left-3 md:-left-4 top-8 w-8 h-8 md:w-10 md:h-10 bg-[#1e1e2e] border-2 border-[#c5a059] rounded-full flex items-center justify-center font-black text-[9px] md:text-[10px] text-[#c5a059] shadow-xl">
                        {i + 1}
                      </div>
                      <div className="flex justify-between items-center mb-4 ml-6">
                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${c.content.includes('[REBUTTAL]') ? 'text-red-500' : 'text-[#c5a059]'}`}>
                          <span className={`w-2 h-2 rounded-full ${c.content.includes('[REBUTTAL]') ? 'bg-red-500' : 'bg-[#c5a059]'}`}></span>
                          {c.author} {c.content.includes('[REBUTTAL]') && <span>(Rebuttal)</span>}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300 font-mono">
                          {new Date(c.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-base md:text-lg text-[#1e1e2e] leading-relaxed font-serif-theology ml-6">
                        {c.content.replace('[REBUTTAL]: ', '')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div ref={chatEndRef} className="h-32" />
            </div>
          </div>

          {/* FLOATING SUBMISSION BAR */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f4f1ea] via-[#f4f1ea] to-transparent z-30">
            <form onSubmit={handleAddContribution} className="max-w-4xl mx-auto bg-white p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-2 border-[#c5a059]/20 flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-48">
                <input 
                  type="text"
                  placeholder="Your Name..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#f4f1ea] p-3 rounded-xl font-bold text-[11px] border-2 border-transparent focus:border-[#c5a059] outline-none transition-all"
                  required
                />
              </div>
              <div className="flex-1 relative w-full flex items-center gap-3">
                 <div className="flex flex-col shrink-0 gap-1">
                    <button 
                      type="button" 
                      onClick={() => setInputType('insight')}
                      className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest transition-all ${inputType === 'insight' ? 'bg-[#c5a059] text-white' : 'text-slate-300 hover:text-slate-400'}`}
                    >
                      Insight
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setInputType('rebuttal')}
                      className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest transition-all ${inputType === 'rebuttal' ? 'bg-red-500 text-white' : 'text-slate-300 hover:text-slate-400'}`}
                    >
                      Rebut
                    </button>
                 </div>
                 <textarea 
                  placeholder={inputType === 'insight' ? "Enter scriptural insight..." : "Offer a theological rebuttal..."}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddContribution(e as any);
                    }
                  }}
                  className="flex-1 bg-[#f4f1ea] p-3 pr-12 rounded-xl font-medium border-2 border-transparent focus:border-[#c5a059] outline-none transition-all text-xs resize-none"
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`absolute right-1 bottom-1 w-10 h-10 text-white rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 ${inputType === 'rebuttal' ? 'bg-red-500' : 'bg-[#1e1e2e]'}`}
                >
                  {isSubmitting ? '...' : '🖋️'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* VERDICT OVERLAY (Appears when viewingVerdict is true) */}
        {viewingVerdict && topic.currentConsensus && (
          <div className="absolute inset-0 z-[110] flex flex-col bg-[#1e1e2e]/95 backdrop-blur-md p-4 md:p-8 overflow-y-auto animate-in fade-in slide-in-from-top-10 duration-500">
            <div className="max-w-6xl mx-auto w-full">
              <div className="flex justify-between items-center mb-8">
                <button 
                  onClick={() => setViewingVerdict(false)}
                  className="text-[#c5a059] font-black text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2"
                >
                  ← Back to Scroll
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const c = topic.currentConsensus;
                      if (!c) return;
                      const content = `THE SAME PAGE VERDICT: ${topic.title.toUpperCase()}\n\n${c.unifiedDefinition}`;
                      const element = document.createElement("a");
                      const file = new Blob([content], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = `Verdict_${topic.title}.txt`;
                      element.click();
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all"
                  >
                    📥 Export Verdict
                  </button>
                </div>
              </div>

              <ConsensusCard 
                summary={topic.currentConsensus} 
                historyCount={topic.consensusHistory.length} 
              />
            </div>
          </div>
        )}
      </main>

      {/* NEW TOPIC MODAL */}
      {showTopicModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#1e1e2e]/90 backdrop-blur-xl p-6">
           <div className="bg-[#f4f1ea] w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl border-4 border-[#c5a059] animate-in zoom-in-95 fade-in duration-300">
              <h2 className="text-2xl font-serif-theology font-black text-[#1e1e2e] mb-2">Engage a New Mystery</h2>
              <p className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mb-8 text-center">Establish a new inquiry for the Scriptorium</p>
              
              <form onSubmit={createNewTopic} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Topic Title</label>
                    <input 
                      type="text"
                      placeholder="e.g. The Nature of Salvation"
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 p-4 rounded-xl outline-none focus:border-[#c5a059] transition-all font-bold text-sm"
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">Initial Statement</label>
                    <textarea 
                      placeholder="e.g. Is salvation by faith alone or do works play a role?"
                      value={newTopicStatement}
                      onChange={(e) => setNewTopicStatement(e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 p-4 rounded-xl outline-none focus:border-[#c5a059] transition-all font-medium h-32 text-sm"
                      required
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowTopicModal(false)}
                      className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] py-4 bg-[#1e1e2e] text-[#c5a059] rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                      📜 Open the Scroll
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
