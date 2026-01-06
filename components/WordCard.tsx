import React from 'react';
import { WordDetail } from '../types';

interface WordCardProps {
  wordData: WordDetail;
  isCompact?: boolean;
}

const WordCard: React.FC<WordCardProps> = ({ wordData, isCompact = false }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">
            {wordData.word}
          </h3>
          <span className="text-slate-500 font-mono text-sm px-2 py-0.5 bg-slate-200/50 rounded-full">
            {wordData.phonetic}
          </span>
          <span className="text-primary-600 text-sm font-semibold italic">
            {wordData.partOfSpeech}
          </span>
        </div>
        <p className="mt-2 text-slate-700 font-medium">
          {wordData.definition}
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Synonyms */}
        {wordData.synonyms.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Synonyms</h4>
            <div className="flex flex-wrap gap-2">
              {wordData.synonyms.map((syn, idx) => (
                <div key={idx} className="inline-flex items-center text-sm border border-slate-200 rounded-md px-2 py-1 bg-white">
                  <span className="font-medium text-slate-700">{syn.term}</span>
                  <span className="mx-1 text-slate-300">·</span>
                  <span className="text-slate-500">{syn.translation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Derivatives */}
        {wordData.derivatives.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Derivatives</h4>
            <p className="text-sm text-slate-600">
              {wordData.derivatives.join(', ')}
            </p>
          </div>
        )}

        {/* Examples */}
        {wordData.examples.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Examples</h4>
            <ul className="space-y-3">
              {wordData.examples.map((ex, idx) => (
                <li key={idx} className="text-sm">
                  <p className="text-slate-800 border-l-2 border-primary-200 pl-3 italic">
                    "{ex.en}"
                  </p>
                  <p className="text-slate-500 pl-3.5 mt-0.5 text-xs">
                    {ex.cn}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCard;