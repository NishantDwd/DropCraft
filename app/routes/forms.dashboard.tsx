import React, { useEffect, useState } from "react";

export default function FormsDashboard() {
  const [forms, setForms] = useState<{ id: string; name: string }[]>([]);

  // Load forms from localStorage
  const loadForms = () => {
    const allForms: { id: string; name: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)!;
      if (key.startsWith("form:")) {
        const formId = key.replace("form:", "");
        try {
          const data = JSON.parse(localStorage.getItem(key)!);
          allForms.push({ id: formId, name: data.meta?.name || formId });
        } catch {}
      }
    }
    setForms(allForms);
  };

  useEffect(() => {
    loadForms();
  }, []);

  // Delete form and its responses
  const handleDelete = (formId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this form and all its responses? This cannot be undone."
      )
    ) {
      localStorage.removeItem(`form:${formId}`);
      localStorage.removeItem(`responses:${formId}`);
      loadForms();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-8 text-center tracking-tight text-blue-700 dark:text-blue-300">
        <span className="inline-flex items-center gap-2">
          <svg className="w-8 h-8 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2v-6a2 2 0 00-2-2h-2a2 2 0 00-2 2v6a2 2 0 002 2z" />
          </svg>
           Admin Dashboard
        </span>
      </h2>
      {forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <p className="text-gray-500 text-lg">No forms found. Start building your first form!</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white dark:bg-gray-900">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-blue-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider">Form Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider">Share Link</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider">User Response</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 dark:text-blue-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {forms.map((f) => (
                <tr key={f.id} className="hover:bg-blue-50 dark:hover:bg-gray-800 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800 dark:text-gray-100">
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0M12 17v-2m0 0a4 4 0 01-4-4V7a4 4 0 018 0v4a4 4 0 01-4 4z" />
                      </svg>
                      {f.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`/form/${f.id}`}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h6m0 0v6m0-6L10 19l-7-7" />
                      </svg>
                      /form/{f.id}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center">
                      <a
                        href={`/view-responses?formId=${encodeURIComponent(f.id)}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-lg shadow hover:from-green-500 hover:to-blue-700 transition font-semibold"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View all responses for this form"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        View Responses
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition font-semibold"
                      title="Delete this form and its responses"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}