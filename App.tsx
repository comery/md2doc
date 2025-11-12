
import React, { useState, useEffect, useMemo } from 'react';
import type { EditorConfig } from './types';
import { Sidebar } from './components/Sidebar';
import { MarkdownInput } from './components/MarkdownInput';
import { WordPreview } from './components/WordPreview';

declare global {
    interface Window {
        marked: any;
    }
}

const DEFAULT_MARKDOWN = `# Markdown to Word Converter

This is a demo of a real-time Markdown to Word converter.

## Features

- **Side-by-side view**: Edit Markdown on the left and see the styled, editable preview on the right.
- **Customizable Styles**: Use the sidebar to change fonts and font sizes for headings.
- **Editable Preview**: Fine-tune the output directly in the right panel using the editor toolbar.

### How to use

1.  Type or paste Markdown in this panel.
2.  Upload a \`.md\` file.
3.  Open the sidebar on the left to configure styles.
4.  Use the toolbar above the right panel to make final edits.

---

### Example Table

| Feature         | Status      | Priority |
|-----------------|-------------|----------|
| Markdown Parsing| Done        | High     |
| Style Config    | Done        | High     |
| Editable Output | Done        | Medium   |
| Export to .docx | Not planned | Low      |

### Example List

- Bullet item 1
- Bullet item 2
  - Nested item
`;

const App: React.FC = () => {
    const [markdownText, setMarkdownText] = useState<string>(DEFAULT_MARKDOWN);
    const [htmlOutput, setHtmlOutput] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [sidebarWidth, setSidebarWidth] = useState<number>(320);

    const [config, setConfig] = useState<EditorConfig>({
        fontFamily: {
            english: 'Times New Roman, serif',
            chinese: '"Microsoft YaHei", "微软雅黑", sans-serif',
        },
        fontSize: {
            h1: 32,
            h2: 24,
            h3: 20,
            body: 16,
        },
        colors: {
            markdownBg: '#ffffff',
            wordBg: '#ffffff',
        },
    });

    useEffect(() => {
        if (window.marked) {
            setHtmlOutput(window.marked.parse(markdownText));
        }
    }, [markdownText]);

    const generatedCss = useMemo(() => {
        return `
            .word-preview {
                font-family: ${config.fontFamily.english}, ${config.fontFamily.chinese};
                font-size: ${config.fontSize.body}px;
                line-height: 1.6;
            }
            .word-preview h1 {
                font-size: ${config.fontSize.h1}px;
                font-weight: bold;
                margin-top: 24px;
                margin-bottom: 12px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 4px;
            }
            .word-preview h2 {
                font-size: ${config.fontSize.h2}px;
                font-weight: bold;
                margin-top: 20px;
                margin-bottom: 10px;
            }
            .word-preview h3 {
                font-size: ${config.fontSize.h3}px;
                font-weight: bold;
                margin-top: 16px;
                margin-bottom: 8px;
            }
            .word-preview p {
                margin-bottom: 16px;
            }
            .word-preview ul, .word-preview ol {
                margin-left: 24px;
                margin-bottom: 16px;
            }
            .word-preview table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 16px;
            }
            .word-preview th, .word-preview td {
                border: 1px solid #cbd5e0;
                padding: 8px 12px;
            }
            .word-preview th {
                background-color: #f7fafc;
                font-weight: bold;
            }
            .word-preview code {
                background-color: #edf2f7;
                padding: 2px 4px;
                border-radius: 4px;
                font-family: monospace;
            }
            .word-preview blockquote {
                border-left: 4px solid #e2e8f0;
                padding-left: 16px;
                color: #718096;
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
                
                <main className="flex-grow flex h-full transition-all duration-300 ease-in-out" style={{ marginLeft: isSidebarOpen ? '0px' : '0px' }}>
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

export default App;
