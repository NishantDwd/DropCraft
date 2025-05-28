import React, { useState, useEffect } from "react";
import FieldPalette from "./FieldPalette";
import FormCanvas from "./FormCanvas";
import FieldEditor from "./FieldEditor";
import FormPreview from "./FormPreview";
import { useFormStore } from "~/store/formStore";
import { generateFormId, saveFormToStorage } from "~/store/formStore";
import { useNavigate } from "@remix-run/react";

export default function FormBuilder() {
  const undo = useFormStore((s) => s.undo);
  const redo = useFormStore((s) => s.redo);
  const resetForm = useFormStore((s) => s.resetForm);
  const fields = useFormStore((s) => s.fields);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const navigate = useNavigate();

  // Theme toggle state
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleSave = () => {
    const formId = generateFormId();
    saveFormToStorage(formId, fields, { name: formName || "Untitled Form" });
    setShareUrl(`${window.location.origin}/form/${formId}`);
  };

  return (
    <div className="flex flex-col w-full h-[100vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between px-10 py-5 border-b bg-white/80 dark:bg-gray-900/80 shadow z-10">
        {/* Left: Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold"
            title="Undo"
          >
            ⟲ Undo
          </button>
          <button
            onClick={redo}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold"
            title="Redo"
          >
            ⟳ Redo
          </button>
          <input
            type="text"
            placeholder="Form Name"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            className="ml-4 px-3 py-1 border rounded shadow-inner focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSave}
            className="ml-2 px-4 py-1 bg-gradient-to-r from-green-500 to-green-700 text-white rounded shadow hover:from-green-600 hover:to-green-800 font-bold"
          >
            Save & Share
          </button>
          <button
            onClick={resetForm}
            className="px-4 py-1 bg-red-500 text-white rounded shadow hover:bg-red-700 ml-2 font-bold"
          >
            Clear Form
          </button>
        </div>
        {/* Center: Title */}
        <span
  className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 tracking-tight drop-shadow
    px-6 py-2 border-4 border-blue-300 dark:border-blue-700 rounded-full bg-white/70 dark:bg-gray-900/70 shadow-lg"
>
  Form Builder
</span>
        {/* Right: Theme Toggle + Admin Button */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark((d) => !d)}
            className={`flex items-center justify-center w-11 h-11 rounded-full shadow-lg border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-br ${
              isDark
                ? "from-gray-800 to-blue-900 text-yellow-300"
                : "from-yellow-100 to-blue-100 text-blue-700"
            } hover:scale-105 transition-all duration-200`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              // Moon icon for dark mode
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                />
              </svg>
            ) : (
              // Sun icon for light mode
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                />
              </svg>
            )}
          </button>
          {/* Admin Button */}
          <a
            href="/forms/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-200"
            title="Go to Admin Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4M4 11h16" />
            </svg>
            Admin
          </a>
        </div>
      </div>
      {/* Share Link */}
      {shareUrl && (
        <div className="p-3 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-b text-center font-semibold shadow">
          Share this link:{" "}
          <a
            href={shareUrl}
            className="underline break-all text-blue-700 dark:text-blue-200 hover:text-blue-900"
            target="_blank"
            rel="noopener noreferrer"
            style={{ wordBreak: "break-all" }}
          >
            {shareUrl}
          </a>
        </div>
      )}
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <FieldPalette />
        <FormCanvas />
        <FieldEditor />
        <FormPreview />
      </div>
    </div>
  );
}