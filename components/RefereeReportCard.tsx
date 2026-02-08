
import React from 'react';
// Changed AIRefereeReport to ConsensusSummary as it's the correct exported member from types.ts
import { ConsensusSummary } from '../types';

interface Props {
  // Updated type to use the existing ConsensusSummary interface
  report: ConsensusSummary;
}

export const RefereeReportCard: React.FC<Props> = ({ report }) => {
  return (
    <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-indigo-50 pb-4">
        <h2 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
          <span className="text-3xl">⚖️</span> AI Referee Report
        </h2>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Consensus Meter</span>
          <div className="w-32 h-3 bg-gray-100 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000"
              // Updated consensusScore to alignmentScore to match ConsensusSummary
              style={{ width: `${report.alignmentScore}%` }}
            />
          </div>
          {/* Updated consensusScore to alignmentScore */}
          <span className="text-sm font-bold text-indigo-600 mt-1">{report.alignmentScore}% Unified</span>
        </div>
      </div>

      <section>
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Theological Synthesis</h3>
        {/* Updated synthesis to unifiedDefinition to match ConsensusSummary */}
        <p className="text-gray-700 leading-relaxed text-lg italic">"{report.unifiedDefinition}"</p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-slate-50 p-4 rounded-xl">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Scripture Key</h3>
          <ul className="space-y-3">
            {/* Updated scriptureReferences to scripturalFoundations to match ConsensusSummary */}
            {report.scripturalFoundations.map((ref, i) => (
              <li key={i} className="text-sm">
                <span className="font-bold text-indigo-800">{ref.reference}:</span>{' '}
                {/* Updated ref.context to ref.summary to match scripturalFoundations item structure */}
                <span className="text-slate-600">{ref.summary}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-slate-50 p-4 rounded-xl">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Etymology & Exegesis</h3>
          <ul className="space-y-3">
            {report.etymologyNotes.map((note, i) => (
              <li key={i} className="text-sm">
                <span className="font-mono bg-indigo-100 px-1 rounded text-indigo-700">{note.term}</span>{' '}
                <span className="text-xs italic text-gray-400">({note.origin})</span>:{' '}
                <span className="text-slate-600">{note.meaning}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-indigo-900 text-indigo-50 p-6 rounded-xl">
        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">Hermeneutical Framework</h3>
        <p className="text-sm leading-relaxed mb-4">{report.hermeneuticalFramework}</p>
        <div className="space-y-2">
          {report.exegeticalInsights.map((insight, i) => (
            <div key={i} className="flex gap-2 text-sm items-start">
              <span className="text-emerald-400">⚡</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
