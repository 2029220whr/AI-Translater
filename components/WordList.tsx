import React, { useMemo } from 'react';
import { WordDetail } from '../types';
import { DownloadIcon, TrashIcon, XIcon } from './Icons';

interface WordListProps {
  words: WordDetail[];
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const WordList: React.FC<WordListProps> = ({ words, onClear, isOpen, onClose }) => {
  
  const handleExport = () => {
    if (words.length === 0) return;

    // Create CSV content
    const headers = ['Word', 'Phonetic', 'Part of Speech', 'Definition', 'Synonyms', 'Derivatives', 'Example (EN)', 'Example (CN)'];
    const rows = words.map(w => {
      const syns = w.synonyms.map(s => `${s.term} (${s.translation})`).join('; ');
      const derivs = w.derivatives.join('; ');
      const exEn = w.examples[0]?.en || '';
      const exCn = w.examples[0]?.cn || '';
      
      return [
        `"${w.word}"`,
        `"${w.phonetic}"`,
        `"${w.partOfSpeech}"`,
        `"${w.definition}"`,
        `"${syns}"`,
        `"${derivs}"`,
        `"${exEn}"`,
        `"${exCn}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vocabulary_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerClass = `fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`;

  return (
    <>
        {/* Backdrop */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />
        )}
        
        <div className={containerClass}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">My Vocabulary</h2>
                    <p className="text-xs text-slate-500">{words.length} words saved</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {words.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <DownloadIcon className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm">No words collected yet.</p>
                        <p className="text-xs mt-1">Analyze text to add words automatically.</p>
                    </div>
                ) : (
                    words.map((word, idx) => (
                        <div key={idx} className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-slate-800">{word.word}</span>
                                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 rounded">{word.partOfSpeech}</span>
                            </div>
                            <div className="text-sm text-slate-600 mt-1 truncate">{word.definition}</div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                    onClick={onClear}
                    disabled={words.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <TrashIcon className="w-4 h-4" />
                    Clear
                </button>
                <button 
                    onClick={handleExport}
                    disabled={words.length === 0}
                    className="flex-[2] flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <DownloadIcon className="w-4 h-4" />
                    Export CSV
                </button>
            </div>
        </div>
    </>
  );
};

export default WordList;