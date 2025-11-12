import React, { useEffect, useRef, useState } from 'react';
import { BoldIcon, ItalicIcon, UnderlineIcon, BrushIcon, DownloadIcon, CopyIcon, IndentIcon, OutdentIcon } from './icons';

interface WordPreviewProps {
  htmlContent: string;
  bgColor: string;
}

const EditorToolbar: React.FC<{ onCopy: () => void; onDownload: () => void; onFormatPainterClick: () => void; onFormatPainterLock: () => void; painterActive: boolean; painterLocked: boolean; bulletStyle: string; onBulletStyleChange: (v: string) => void; onApplyBullet: () => void; numberStyle: string; onNumberStyleChange: (v: string) => void; onApplyNumber: () => void; }> = ({ onCopy, onDownload, onFormatPainterClick, onFormatPainterLock, painterActive, painterLocked, bulletStyle, onBulletStyleChange, onApplyBullet, numberStyle, onNumberStyleChange, onApplyNumber }) => {
    const executeCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
    };

    const FONT_SIZES = ['1', '2', '3', '4', '5', '6', '7']; // Corresponds to <font size="...">
    const FONT_FAMILIES = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'sans-serif'];

    return (
        <div className="p-2 border-b border-gray-300 dark:border-gray-700 flex items-center flex-wrap gap-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <button onClick={onDownload} title="Download" className="p-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"><DownloadIcon /></button>
            <button onClick={onCopy} title="Copy" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><CopyIcon /></button>
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
            
            <button onClick={onFormatPainterClick} onDoubleClick={onFormatPainterLock} title={painterLocked ? 'Format Painter (locked)' : 'Format Painter'} className={`p-2 rounded ${painterActive ? 'bg-indigo-100 dark:bg-indigo-900' : ''} hover:bg-gray-200 dark:hover:bg-gray-700`}><BrushIcon /></button>
            
            <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
            <label className="text-xs text-gray-600 dark:text-gray-300">Bullet</label>
            <select value={bulletStyle} onChange={(e) => onBulletStyleChange(e.target.value)} className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none">
                <option value="disc">• Disc</option>
                <option value="circle">○ Circle</option>
                <option value="square">■ Square</option>
                <option value="diamond">◆ Diamond</option>
            </select>
            <button onClick={onApplyBullet} className="px-2 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700">Apply</button>
            <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-1"></div>
            <label className="text-xs text-gray-600 dark:text-gray-300">Number</label>
            <select value={numberStyle} onChange={(e) => onNumberStyleChange(e.target.value)} className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:outline-none">
                <option value="decimal">1, 2, 3</option>
                <option value="lower-alpha">a, b, c</option>
                <option value="upper-alpha">A, B, C</option>
                <option value="lower-roman">i, ii, iii</option>
                <option value="upper-roman">I, II, III</option>
            </select>
            <button onClick={onApplyNumber} className="px-2 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700">Apply</button>
            <button onClick={() => executeCommand('indent')} title="Increase Indent" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><IndentIcon /></button>
            <button onClick={() => executeCommand('outdent')} title="Decrease Indent" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><OutdentIcon /></button>
        </div>
    );
};

export const WordPreview: React.FC<WordPreviewProps> = ({ htmlContent, bgColor }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [painterStyle, setPainterStyle] = useState<Record<string, string> | null>(null);
    const [painterLocked, setPainterLocked] = useState<boolean>(false);
    const [bulletStyle, setBulletStyle] = useState<string>('disc');
    const [numberStyle, setNumberStyle] = useState<string>('decimal');

    const downloadDoc = () => {
        const content = editorRef.current?.innerHTML || '';
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${content}</body></html>`;
        const blob = new Blob([html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyContent = async () => {
        const el = editorRef.current;
        if (!el) return;
        try {
            const text = el.innerText || '';
            await navigator.clipboard.writeText(text);
        } catch {
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
            document.execCommand('copy');
            sel?.removeAllRanges();
        }
    };

    const capturePainter = () => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const node = sel.anchorNode as HTMLElement | null;
        const el = node && node.nodeType === 1 ? (node as HTMLElement) : node?.parentElement || null;
        if (!el) return;
        const styles = window.getComputedStyle(el);
        const s: Record<string, string> = {
            fontWeight: styles.fontWeight,
            fontStyle: styles.fontStyle,
            textDecorationLine: styles.textDecorationLine,
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing,
        };
        setPainterStyle(s);
    };

    const applyPainterToSelection = () => {
        if (!painterStyle) return;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        if (range.collapsed) return;
        const span = document.createElement('span');
        Object.entries(painterStyle).forEach(([k, v]) => { (span.style as any)[k] = v; });
        try {
            range.surroundContents(span);
        } catch {
            const styleStr = Object.entries(painterStyle).map(([k, v]) => `${k}:${v}`).join(';');
            const selected = range.toString();
            document.execCommand('insertHTML', false, `<span style="${styleStr}">${selected}</span>`);
        }
        if (!painterLocked) setPainterStyle(null);
    };

    useEffect(() => {
        const handler = () => applyPainterToSelection();
        const el = editorRef.current;
        if (!el) return;
        el.addEventListener('mouseup', handler);
        return () => {
            el.removeEventListener('mouseup', handler);
        };
    }, [painterStyle, painterLocked]);

    const getNearestList = (tag: 'UL' | 'OL') => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        const node = sel.anchorNode;
        let el = node && node.nodeType === 1 ? (node as HTMLElement) : node?.parentElement || null;
        while (el && el !== editorRef.current) {
            if (el.tagName === tag) return el;
            el = el.parentElement as HTMLElement;
        }
        return null;
    };

    const applyUnorderedList = (style: string) => {
        document.execCommand('insertUnorderedList');
        const list = getNearestList('UL');
        if (!list) return;
        if (style === 'diamond') {
            list.setAttribute('data-marker', 'diamond');
            (list.style as any).listStyleType = 'none';
        } else {
            list.removeAttribute('data-marker');
            (list.style as any).listStyleType = style;
        }
    };

    const applyOrderedList = (style: string) => {
        document.execCommand('insertOrderedList');
        const list = getNearestList('OL');
        if (!list) return;
        (list.style as any).listStyleType = style;
    };

    const updateCurrentListStyle = () => {
        const ul = getNearestList('UL');
        const ol = getNearestList('OL');
        if (ul) {
            if (bulletStyle === 'diamond') {
                ul.setAttribute('data-marker', 'diamond');
                (ul.style as any).listStyleType = 'none';
            } else {
                ul.removeAttribute('data-marker');
                (ul.style as any).listStyleType = bulletStyle;
            }
        }
        if (ol) {
            (ol.style as any).listStyleType = numberStyle;
        }
    };

    return (
        <div className="h-full flex flex-col" style={{ backgroundColor: bgColor }}>
            <style>{`.word-preview ul[data-marker="diamond"] > li::marker{content:'◆ ';}`}</style>
            <EditorToolbar
              onDownload={downloadDoc}
              onCopy={copyContent}
              onFormatPainterClick={() => { if (painterStyle) { setPainterStyle(null); setPainterLocked(false); } else { capturePainter(); setPainterLocked(false); } }}
              onFormatPainterLock={() => { capturePainter(); setPainterLocked(true); }}
              painterActive={!!painterStyle}
              painterLocked={painterLocked}
              bulletStyle={bulletStyle}
              onBulletStyleChange={(v) => { setBulletStyle(v); updateCurrentListStyle(); }}
              onApplyBullet={() => applyUnorderedList(bulletStyle)}
              numberStyle={numberStyle}
              onNumberStyleChange={(v) => { setNumberStyle(v); updateCurrentListStyle(); }}
              onApplyNumber={() => applyOrderedList(numberStyle)}
            />
            <div
                key={htmlContent}
                ref={editorRef}
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="word-preview flex-grow p-4 w-full h-full focus:outline-none bg-transparent text-gray-800 dark:text-gray-200 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            
        </div>
    );
};
