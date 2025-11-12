import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { EditorConfig } from './types';
import { Sidebar } from './components/Sidebar';
import { MarkdownInput } from './components/MarkdownInput';
import { WordPreview } from './components/WordPreview';
import { Streamlit, withStreamlitConnection, ComponentProps } from "streamlit-component-lib";

declare global {
    interface Window {
        marked: any;
    }
}

const App: React.FC<ComponentProps> = (props) => {
    const { args } = props;
    const initialMarkdownText: string = args.markdown_text;
    const initialConfig: EditorConfig = args.config;
    
    const [markdownText, setMarkdownText] = useState<string>(initialMarkdownText);
    const [config, setConfig] = useState<EditorConfig>(initialConfig);
    const [htmlOutput, setHtmlOutput] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [sidebarWidth, setSidebarWidth] = useState<number>(260);

    // Explicitly mark component as ready ASAP to avoid Streamlit timeout
    useEffect(() => {
        Streamlit.setComponentReady();
        Streamlit.setFrameHeight();
    }, []);

    const sendStateToStreamlit = useCallback(() => {
        Streamlit.setComponentValue({ markdown_text: markdownText, config: config });
    }, [markdownText, config]);

    // Debounce updates to Streamlit
    useEffect(() => {
        const timer = setTimeout(() => {
            // Only send state back if it has changed from initial props to avoid loops
            if (markdownText !== initialMarkdownText || JSON.stringify(config) !== JSON.stringify(initialConfig)) {
                sendStateToStreamlit();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [markdownText, config, initialMarkdownText, initialConfig, sendStateToStreamlit]);
    
    useEffect(() => {
        if (window.marked) {
            setHtmlOutput(window.marked.parse(markdownText));
        }
        Streamlit.setFrameHeight();
    }, [markdownText]);

    useEffect(() => {
        Streamlit.setFrameHeight();
    }, [isSidebarOpen, sidebarWidth]);
    
    // Sync from streamlit to react if props change
    useEffect(() => {
        setMarkdownText(initialMarkdownText);
    }, [initialMarkdownText]);

    useEffect(() => {
        setConfig(initialConfig);
    }, [initialConfig]);


    const generatedCss = useMemo(() => {
        return `
            .word-preview {
                font-family: ${config.fontFamily.english}, ${config.fontFamily.chinese};
                font-size: ${config.fontSize.body}px;
                line-height: 1.6;
                color: #1f2937;
            }
            .word-preview h1 {
                font-size: ${config.fontSize.h1}px;
                font-weight: bold;
                margin-top: 12px;
                margin-bottom: 8px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 2px;
            }
            .word-preview h2 {
                font-size: ${config.fontSize.h2}px;
                font-weight: bold;
                margin-top: 10px;
                margin-bottom: 6px;
            }
            .word-preview h3 {
                font-size: ${config.fontSize.h3}px;
                font-weight: bold;
                margin-top: 8px;
                margin-bottom: 4px;
            }
            .word-preview p {
                margin-bottom: 12px;
            }
            .word-preview ul, .word-preview ol {
                margin-left: 20px;
                margin-bottom: 12px;
            }
            .word-preview table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 12px;
            }
            .word-preview th, .word-preview td {
                border: 1px solid #cbd5e0;
                padding: 6px 10px;
            }
            .word-preview th {
                background-color: #f7fafc;
                font-weight: bold;
            }
            .word-preview code {
                background-color: #e5e7eb;
                padding: 2px 4px;
                border-radius: 4px;
                font-family: monospace;
            }
            .word-preview blockquote {
                border-left: 4px solid #e2e8f0;
                padding-left: 12px;
                color: #4a5568;
                margin-left: 0;
                margin-right: 0;
            }
        `;
    }, [config]);

    return (
        <>
            <style>{generatedCss}</style>
            <div className="h-screen w-screen flex bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    setIsOpen={setIsSidebarOpen} 
                    config={config} 
                    setConfig={setConfig}
                    width={sidebarWidth}
                    setWidth={setSidebarWidth}
                />
                
                <main className="flex-grow flex h-full transition-all duration-300 ease-in-out">
                    <div className="w-1/2 h-full border-r border-gray-300 dark:border-gray-700 shadow-inner">
                        <MarkdownInput
                            value={markdownText}
                            onChange={setMarkdownText}
                            bgColor={config.colors.markdownBg}
                        />
                    </div>
                    <div className="w-1/2 h-full shadow-inner">
                        <WordPreview
                            htmlContent={htmlOutput}
                            bgColor={config.colors.wordBg}
                        />
                    </div>
                </main>
            </div>
        </>
    );
};

export default withStreamlitConnection(App);
