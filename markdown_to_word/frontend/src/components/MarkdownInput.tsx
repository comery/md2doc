import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface MarkdownInputProps {
  value: string;
  onChange: (value: string) => void;
  bgColor: string;
}

export const MarkdownInput: React.FC<MarkdownInputProps> = ({ value, onChange, bgColor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onChange(text);
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: bgColor }}>
        <div className="p-2 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Markdown</h2>
            <button onClick={handleUploadClick} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm">
                <UploadIcon />
                Upload File
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".md,.txt"
                className="hidden"
            />
        </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow p-4 w-full h-full resize-none focus:outline-none bg-transparent font-mono text-gray-800 dark:text-gray-200"
        placeholder="Paste your Markdown here or upload a file..."
      />
    </div>
  );
};
