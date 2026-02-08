
import React from 'react';
import { ConsensusSummary } from '../types';

interface Props {
  summary: ConsensusSummary;
  historyCount: number;
}

export const ConsensusCard: React.FC<Props> = ({ summary, historyCount }) => {
  return (
    <div className="bg-[#fdfaf3] border-4 border-[#c5a059] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-700 relative mb-20">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"></div>
      
      {/* Council Header */}
      <div className="bg-[#1e1e2e] px-8 md:px-16 py-10 flex flex-col md:flex-row justify-between items-center border-b-4 border-[#c5a059] relative z-10 gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-[9px] font-black text-[#c5a059] uppercase tracking-[0.6em] mb-2">Council Verdict v{summary.version}.0</h3>
          <div className="text-[#f4f1ea] font-serif-theology text-3xl md:text-4xl italic">Consensus of the 100 Voices</div>
        </div>
        <div className="text-center md:text-right">
          <div className="text-5xl md:text-7xl font-serif-theology font-black text-[#c5a059] tracking-tighter illuminate-text">{summary.alignmentScore}%</div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Harmonic Alignment</div>
        </div>
      </div>

      <div className="p-8 md:p-20 space-y-16 relative z-10">
        {/* The Unified Definition */}
        <section className="text-center space-y-8">
          <div className="text-3xl md:text-6xl font-serif-theology font-bold text-[#1e1e2e] leading-tight tracking-tight">
            "{summary.unifiedDefinition}"
          </div>
          <div className="flex items-center justify-center gap-4">
             <div className="h-px w-12 bg-[#c5a059]/30"></div>
             <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.4em] italic">
               Established Synthesis
             </p>
             <div className="h-px w-12 bg-[#c5a059]/30"></div>
          </div>
        </section>

        {/* Schools of Thought */}
        <section>
           <h4 className="text-[10px] font-black text-[#1e1e2e] uppercase tracking-[0.5em] mb-8 text-center flex items-center justify-center gap-4">
             <span className="w-8 h-px bg-[#c5a059]"></span>
             Perspective Groups Identified
             <span className="w-8 h-px bg-[#c5a059]"></span>
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {summary.schoolsOfThought.map((school, i) => (
               <div key={i} className="bg-white p-6 rounded-3xl border border-[#c5a059]/10 shadow-sm hover:shadow-md transition-all group">
                 <div className="flex justify-between items-start mb-3">
                    <span className="text-[8px] font-black text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/5 px-2 py-1 rounded-full border border-[#c5a059]/10">
                      {school.prevalence}
                    </span>
                 </div>
                 <h5 className="font-serif-theology text-xl font-bold text-[#1e1e2e] mb-2 group-hover:text-[#c5a059] transition-colors">{school.name}</h5>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">{school.description}</p>
               </div>
             ))}
           </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div>
              <h4 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em] mb-6 border-b border-[#c5a059]/20 pb-3">Etymological Anchors</h4>
              <div className="space-y-6">
                {summary.etymologyNotes.map((note, i) => (
                  <div key={i} className="flex items-baseline gap-4">
                    <span className="font-serif-theology text-2xl italic font-black text-[#1e1e2e] min-w-[80px]">{note.term}</span>
                    <div className="flex-1">
                      <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">{note.origin}</span>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{note.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1e1e2e] text-[#f4f1ea] p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-5xl">♰</div>
               <h4 className="text-[9px] font-black text-[#c5a059] uppercase tracking-[0.4em] mb-4">Interpretive Framework</h4>
               <p className="text-lg font-serif-theology italic leading-relaxed text-[#f4f1ea]/90">{summary.hermeneuticalFramework}</p>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h4 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em] mb-6 border-b border-[#c5a059]/20 pb-3">Scriptural Foundations</h4>
              <div className="space-y-6">
                {summary.scripturalFoundations.map((ref, i) => (
                  <div key={i} className="group">
                    <div className="text-xs font-black text-[#1e1e2e] mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full"></span>
                      {ref.reference}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed pl-3 border-l-2 border-[#c5a059]/10 italic">{ref.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em] mb-6 border-b border-[#c5a059]/20 pb-3">Pillars of Unity</h4>
              <div className="grid grid-cols-1 gap-3">
                {summary.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 bg-[#f4f1ea] rounded-xl flex items-center justify-center font-black text-[#c5a059] text-[10px]">{i+1}</div>
                    <span className="text-xs font-bold text-slate-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-[#f4f1ea] px-8 md:px-16 py-6 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] border-t border-[#c5a059]/20">
        <div className="flex items-center gap-6">
           <span>Versions Scribed: {summary.version}</span>
        </div>
        <div>Date: {new Date(summary.syncedAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
};
