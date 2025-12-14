import React, { useState, useEffect, useCallback } from 'react';
import { SLIDES } from './constants';
import { SlideType, SlideContent } from './types';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Code, Mic2 } from 'lucide-react';

// --- Sub-components for different slide types ---

const TitleSlide: React.FC<{ slide: SlideContent }> = ({ slide }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in">
    <div className="p-4 bg-blue-50 rounded-full mb-4">
      <Mic2 className="w-16 h-16 text-blue-600" />
    </div>
    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl">
      {slide.title}
    </h1>
    <h2 className="text-2xl md:text-3xl text-slate-500 font-light max-w-3xl">
      {slide.subtitle}
    </h2>
    {slide.content && (
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {slide.content.map((item, idx) => (
          <span key={idx} className="bg-white border border-slate-200 shadow-sm px-6 py-2 rounded-full text-slate-600 text-lg font-medium">
            {item}
          </span>
        ))}
      </div>
    )}
  </div>
);

const TwoColumnSlide: React.FC<{ slide: SlideContent }> = ({ slide }) => (
  <div className="h-full flex flex-col px-12 py-8 animate-fade-in">
    <div className="mb-10 border-b border-slate-200 pb-6">
      <h2 className="text-4xl font-bold text-slate-900">{slide.title}</h2>
      <p className="text-xl text-slate-500 mt-2">{slide.subtitle}</p>
    </div>
    <div className="flex-1 grid grid-cols-2 gap-16">
      {slide.columns && (
        <>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-700 border-l-4 border-blue-600 pl-4">
              {slide.columns.left.title}
            </h3>
            <ul className="space-y-4">
              {slide.columns.left.items.map((item, idx) => (
                <li key={idx} className="flex items-start text-lg text-slate-700 leading-relaxed">
                  <span className="mr-3 text-blue-500 mt-1.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-indigo-700 border-l-4 border-indigo-600 pl-4">
              {slide.columns.right.title}
            </h3>
            <ul className="space-y-4">
              {slide.columns.right.items.map((item, idx) => (
                <li key={idx} className="flex items-start text-lg text-slate-700 leading-relaxed">
                  <span className="mr-3 text-indigo-500 mt-1.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  </div>
);

const ImageCenterSlide: React.FC<{ slide: SlideContent }> = ({ slide }) => (
  <div className="h-full flex flex-col px-12 py-8 animate-fade-in">
    <div className="mb-6">
      <h2 className="text-4xl font-bold text-slate-900">{slide.title}</h2>
      <p className="text-xl text-slate-500 mt-2">{slide.subtitle}</p>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 rounded-xl border border-slate-200 p-4">
      {slide.image && (
        <>
          <img 
            src={slide.image.src} 
            alt={slide.image.caption} 
            className="max-h-[60vh] object-contain shadow-2xl rounded-lg bg-white"
          />
          <p className="mt-6 text-slate-500 italic font-medium bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
            {slide.image.caption}
          </p>
        </>
      )}
    </div>
  </div>
);

const GridCardsSlide: React.FC<{ slide: SlideContent }> = ({ slide }) => (
  <div className="h-full flex flex-col px-12 py-8 animate-fade-in">
    <div className="mb-10 border-b border-slate-200 pb-6">
      <h2 className="text-4xl font-bold text-slate-900">{slide.title}</h2>
      <p className="text-xl text-slate-500 mt-2">{slide.subtitle}</p>
    </div>
    <div className="flex-1 grid grid-cols-2 gap-8 align-content-start">
      {slide.cards && slide.cards.map((card, idx) => {
        const Icon = card.icon || Code;
        return (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">{card.title}</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

const CodeBlockSlide: React.FC<{ slide: SlideContent }> = ({ slide }) => (
  <div className="h-full flex flex-col px-12 py-8 animate-fade-in">
    <div className="mb-8 border-b border-slate-200 pb-6">
      <h2 className="text-4xl font-bold text-slate-900">{slide.title}</h2>
      <p className="text-xl text-slate-500 mt-2">{slide.subtitle}</p>
    </div>
    <div className="flex-1 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="bg-slate-800 px-4 py-2 flex items-center space-x-2 border-b border-slate-700">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-xs text-slate-400 font-mono">bash — linux</span>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="font-mono text-sm md:text-base text-green-400 leading-relaxed whitespace-pre-wrap">
            {slide.code}
          </pre>
        </div>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = SLIDES.length;
  const currentSlide = SLIDES[currentSlideIndex];

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const renderSlideContent = () => {
    switch (currentSlide.type) {
      case SlideType.TITLE:
        return <TitleSlide slide={currentSlide} />;
      case SlideType.TWO_COLUMN:
        return <TwoColumnSlide slide={currentSlide} />;
      case SlideType.IMAGE_CENTER:
        return <ImageCenterSlide slide={currentSlide} />;
      case SlideType.GRID_CARDS:
        return <GridCardsSlide slide={currentSlide} />;
      case SlideType.CODE_BLOCK:
        return <CodeBlockSlide slide={currentSlide} />;
      default:
        return <TitleSlide slide={currentSlide} />; // Fallback
    }
  };

  const progressPercentage = ((currentSlideIndex + 1) / totalSlides) * 100;

  return (
    <div className="flex flex-col h-screen w-screen bg-white text-slate-800 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto overflow-hidden flex flex-col">
        {renderSlideContent()}
      </main>

      {/* Controls / Footer */}
      <footer className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-6 z-20 relative shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
        
        <div className="flex items-center space-x-4">
          <div className="text-sm font-semibold text-slate-500">
            RVC+RMVPE 实验报告
          </div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="text-xs text-slate-400 font-mono">
            {new Date().toISOString().split('T')[0]}
          </div>
        </div>

        <div className="absolute left-0 bottom-0 h-1 bg-blue-600 transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }}></div>

        <div className="flex items-center space-x-6">
           <span className="font-mono text-sm text-slate-500">
            {currentSlideIndex + 1} / {totalSlides}
          </span>
          
          <div className="flex space-x-2">
            <button 
              onClick={goToPrevSlide} 
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToNextSlide} 
              disabled={currentSlideIndex === totalSlides - 1}
              className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button onClick={toggleFullscreen} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;