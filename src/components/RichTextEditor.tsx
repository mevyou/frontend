"use client";

import { useEffect, useRef } from "react";
import type QuillType from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Describe the rules..." }: RichTextEditorProps) {
  const quillRef = useRef<QuillType | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const toolbarContainerRef = useRef<HTMLDivElement>(null);
  const initialisedRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted || initialisedRef.current) return;
      const Quill = (await import("quill")).default as unknown as QuillType & { default?: QuillType };
      if (!editorContainerRef.current || !toolbarContainerRef.current) return;
      const quill = new (Quill as any)(editorContainerRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: toolbarContainerRef.current,
          clipboard: { matchVisual: false },
        },
      });
      quillRef.current = quill as unknown as QuillType;

      // Set initial contents (HTML)
      if (value) {
        (quillRef.current as any).clipboard.dangerouslyPasteHTML(value);
      }

      quill.on("text-change", () => {
        onChange((quillRef.current as any).root.innerHTML);
      });

      initialisedRef.current = true;
    })();
    return () => {
      mounted = false;
    };
  }, [placeholder, onChange]);

  // Sync external value → editor
  useEffect(() => {
    if (quillRef.current) {
      const html = (quillRef.current as any).root.innerHTML;
      if (value !== html) {
        (quillRef.current as any).clipboard.dangerouslyPasteHTML(value || "");
      }
    }
  }, [value]);

  return (
    <div className="rounded-xl border border-neutral-700 bg-[#121214] overflow-hidden">
      {/* Toolbar */}
      <div ref={toolbarContainerRef} className="ql-toolbar ql-snow !bg-[#121214] !border-0 !border-b !border-neutral-700">
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
        </span>
        <span className="ql-formats">
          <button className="ql-link" />
          <button className="ql-blockquote" />
          <button className="ql-code-block" />
          <button className="ql-image" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </span>
      </div>

      {/* Editor */}
      <div
        ref={editorContainerRef}
        className="ql-container ql-snow !border-0"
        style={{ minHeight: 160 }}
      />
    </div>
  );
}


