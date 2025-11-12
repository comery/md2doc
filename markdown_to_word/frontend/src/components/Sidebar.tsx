import React, { useCallback, useEffect, useRef } from 'react';
import type { EditorConfig } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  config: EditorConfig;
  setConfig: (config: EditorConfig) => void;
  width: number;
  setWidth: (width: number) => void;
}

const MIN_WIDTH = 280;
const MAX_WIDTH = 500;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, config, setConfig, width, setWidth }) => {
  const isResizing = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseUp = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      const newWidth = e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
      }
    }
  }, [setWidth]);

  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);
    const mouseUpHandler = () => handleMouseUp();

    if (isResizing.current) {
      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }
    
    return () => {
      window.removeEventListener('mousemove', mouseMoveHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [handleMouseMove, handleMouseUp, isResizing.current]);


  const handleConfigChange = (field: keyof EditorConfig, subField: any, value: any) => {
    setConfig({
      ...config,
      [field]: {
        ...(config as any)[field],
        [subField]: value,
      },
    });
  };
  
  const handleColorChange = (panel: 'markdownBg' | 'wordBg', value: string) => {
    setConfig({
      ...config,
      colors: {
        ...config.colors,
        [panel]: value,
      },
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-1/2 -translate-y-1/2 left-0 z-20 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Open sidebar"
      >
        <ChevronRightIcon />
      </button>
    );
  }

  return (
    <div
      className="h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-lg flex flex-shrink-0 relative"
      style={{ width: `${width}px` }}
    >
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Configuration</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <ChevronLeftIcon />
          </button>
        </div>
        
        <div className="space-y-6">
            {/* Font Settings */}
            <section>
              <h3 className="text-lg font-semibold mb-2 border-b border-gray-300 dark:border-gray-600 pb-1">Fonts</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="font-en" className="block text-sm font-medium text-gray-600 dark:text-gray-400">English Font</label>
                  <input type="text" id="font-en" value={config.fontFamily.english} onChange={(e) => handleConfigChange('fontFamily', 'english', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="font-cn" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Chinese Font</label>
                  <input type="text" id="font-cn" value={config.fontFamily.chinese} onChange={(e) => handleConfigChange('fontFamily', 'chinese', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
              </div>
            </section>
  
            {/* Font Size Settings */}
            <section>
              <h3 className="text-lg font-semibold mb-2 border-b border-gray-300 dark:border-gray-600 pb-1">Font Sizes (px)</h3>
              <div className="space-y-3">
                {(Object.keys(config.fontSize) as Array<keyof typeof config.fontSize>).map((key) => (
                  <div key={key}>
                    <label htmlFor={`fs-${String(key)}`} className="block text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">{key}</label>
                    <input type="number" id={`fs-${String(key)}`} value={config.fontSize[key]} onChange={(e) => handleConfigChange('fontSize', key, parseInt(e.target.value, 10) || 0)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                ))}
              </div>
            </section>

            {/* Background Colors */}
            <section>
              <h3 className="text-lg font-semibold mb-2 border-b border-gray-300 dark:border-gray-600 pb-1">Background Colors</h3>
              <div className="space-y-3">
                <div>
                    <label htmlFor="bg-md" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Markdown Panel</label>
                    <input type="color" id="bg-md" value={config.colors.markdownBg} onChange={(e) => handleColorChange('markdownBg', e.target.value)} className="mt-1 h-10 w-full block border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
                <div>
                    <label htmlFor="bg-word" className="block text-sm font-medium text-gray-600 dark:text-gray-400">Word Panel</label>
                    <input type="color" id="bg-word" value={config.colors.wordBg} onChange={(e) => handleColorChange('wordBg', e.target.value)} className="mt-1 h-10 w-full block border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
              </div>
            </section>
        </div>
      </div>
       <div
        className="w-1.5 h-full cursor-col-resize bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 transition-colors"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
