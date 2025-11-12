
import React from 'react';
import { BoldIcon, ItalicIcon, UnderlineIcon, BulletListIcon, NumberListIcon, BrushIcon } from './icons';

interface WordPreviewProps {
  htmlContent: string;
  bgColor: string;
}

const EditorToolbar: React.FC = () => {
    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
    };

    const FONT_SIZES = ['1', '2', '3', '4', '5', '6', '7']; // Corresponds to <font size="...">
    const FONT_FAMILIES = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'sans-serif'];

    // Note: Format painter is complex to implement robustly. This is a placeholder.
    const handleFormatPainter = () => {
        alert("Format Painter is a complex feature and not fully implemented in this demo.");
    }
    
    return (
        <div className="p-2 border-b border-gray-300 dark:border-gray-700 flex items-center flex-wrap gap-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <select onChange={(e) => executeCommand('fontName', e.target.value)} className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none">
                <option>Font</option>
                {FONT_FAMILIES.map(font => <option key={font} value={font}>{font}</option>)}
            </select>
            <select onChange={(e) => executeCommand('fontSize', e.target.value)} className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none">
                <option>Size</option>
                {FONT_SIZES.map(size => <option key={size} value={size}>{size} (HTML)</option>)}
            </select>

            <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>

            <button onClick={() => executeCommand('bold')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><BoldIcon /></button>
            <button onClick={() => executeCommand('italic')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><ItalicIcon /></button>
            <button onClick={() => executeCommand('underline')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><UnderlineIcon /></button>
            
            <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
            
            <div className="flex items-center">
              <label htmlFor="font-color" className="sr-only">Font Color</label>
              <input type="color" id="font-color" onChange={(e) => executeCommand('foreColor', e.target.value)} className="w-6 h-6 border-none bg-transparent" title="Font Color"/>
            </div>
            
            <button onClick={handleFormatPainter} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><BrushIcon /></button>
            
            <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>

            <button onClick={() => executeCommand('insertUnorderedList')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><BulletListIcon /></button>
            <button onClick={() => executeCommand('insertOrderedList')} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><NumberListIcon /></button>
        </div>
    );
};

export const WordPreview: React.FC<WordPreviewProps> = ({ htmlContent, bgColor }) => {
    
    // Using the 'key' prop on the contentEditable div is a React pattern to force a re-mount
    // when the source 'htmlContent' changes. This ensures the preview updates correctly
    // from the markdown source, while still allowing subsequent user edits to persist
    // within that component instance until the next source change.
    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: bgColor }}>
            <EditorToolbar />
            <div
                key={htmlContent} 
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="word-preview flex-grow p-8 w-full h-full focus:outline-none bg-transparent text-gray-800 dark:text-gray-200 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </div>
    );
};
