import React, { useState, useEffect } from "react";
import ResponsesViewer from "~/components/ResponsesViewer";

export default function ViewResponsesRoute() {
  const [formId, setFormId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("formId");
    if (id) setFormId(id);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">View Form Responses</h1>
      <input
        type="text"
        placeholder="Enter Form ID (e.g. form_xxxxxxxx)"
        value={formId}
        onChange={e => setFormId(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      {formId && <ResponsesViewer formId={formId} />}
    </div>
  );
}