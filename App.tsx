import React, { useState, useEffect } from 'react';
import { analyzeText } from './services/geminiService';
import WordCard from './components/WordCard';
import WordList from './components/WordList';
import { AnalysisResult, WordDetail } from './types';
import { BookOpenIcon, SparklesIcon, LoaderIcon, SearchIcon } from './components/Icons';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Persistent vocabulary list
  const [vocabularyList, setVocabularyList] = useState<WordDetail[]>(() => {
    const saved = localStorage.getItem('linguist_vocab');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('linguist_vocab', JSON.stringify(vocabularyList));
  }, [vocabularyList]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeText(inputText);
      setResult(analysis);
      
      // Automatically add new unique words to vocabulary list
      setVocabularyList(prev => {
        const newWords = analysis.vocabulary.filter(
            newWord => !prev.some(existing => existing.word.toLowerCase() === newWord.word.toLowerCase())
        );
        return [...newWords, ...prev];
      });

    } catch (err: any) {
      setError("Unable to analyze text. Please check your connection or try a shorter text.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleAnalyze();
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to delete all saved words?")) {
      setVocabularyList([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Linguist AI</h1>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm"
          >
            <span>My Vocabulary</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
              {vocabularyList.length}
            </span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        
        {/* Input Section */}
        <section className="mb-12 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">
                Master vocabulary in context
            </h2>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto leading-relaxed">
                Enter a single word to get a deep dive, or paste a paragraph to translate and extract the most valuable vocabulary automatically.
            </p>

            <div className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur transition duration-500 group-hover:opacity-100 opacity-50`}></div>
                <div className="relative bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 overflow-hidden">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a word (e.g., 'ephemeral') or paste a sentence..."
                        className="w-full min-h-[120px] p-5 text-lg text-slate-800 placeholder:text-slate-300 resize-none border-none outline-none focus:ring-0 bg-transparent"
                    />
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium">Cmd + Enter to submit</span>
                        <button 
                            onClick={handleAnalyze}
                            disabled={loading || !inputText.trim()}
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95"
                        >
                            {loading ? (
                                <>
                                    <LoaderIcon className="w-4 h-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <SparklesIcon className="w-4 h-4 text-yellow-300" />
                                    Analyze Text
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 animate-fade-in">
                {error}
              </div>
            )}
        </section>

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in space-y-12">
            
            {/* Translation (if sentence) */}
            {result.isSentenceOrParagraph && (
              <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <SearchIcon className="w-3 h-3" />
                    Translation
                </h3>
                <p className="text-xl sm:text-2xl text-slate-800 font-serif leading-relaxed">
                  {result.mainTranslation}
                </p>
              </section>
            )}

            {/* Vocabulary Cards */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-xl font-bold text-slate-900">
                        {result.isSentenceOrParagraph ? 'Extracted Vocabulary' : 'Word Analysis'}
                    </h3>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.vocabulary.map((wordData, index) => (
                        <WordCard key={index} wordData={wordData} />
                    ))}
                </div>
            </section>
          </div>
        )}
      </main>

      {/* Sidebar Overlay */}
      <WordList 
        words={vocabularyList} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onClear={clearHistory}
      />
      
      {/* CSS for simple fade in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;