import { create } from "zustand";
import { nanoid } from "nanoid";

export type FieldType = "text" | "textarea" | "dropdown" | "checkbox" | "date";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  options?: string[]; // for dropdown/checkbox
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  step?: number;
}

interface FormState {
  fields: FormField[];
  selectedFieldId: string | null;
  steps: number;
  currentStep: number;
  history: FormField[][];
  future: FormField[][];
  setSelectedField: (id: string | null) => void;
  addField: (type: FieldType) => void;
  updateField: (id: string, data: Partial<FormField>) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  removeField: (id: string) => void;
  resetForm: () => void;
  setSteps: (steps: number) => void;
  setCurrentStep: (step: number) => void;
  undo: () => void;
  redo: () => void;
  loadTemplate: (fields: FormField[]) => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  fields: [],
  selectedFieldId: null,
  steps: 1,
  currentStep: 1,
  history: [],
  future: [],
  setSelectedField: (id) => set({ selectedFieldId: id }),
  addField: (type) =>
    set((state) => {
      const newField: FormField = {
        id: nanoid(),
        type,
        label: "Untitled",
        placeholder: "",
        required: false,
        helpText: "",
        options: type === "dropdown" || type === "checkbox" ? ["Option 1"] : undefined,
        step: state.currentStep,
      };
      return {
        history: [...state.history, state.fields],
        future: [],
        fields: [...state.fields, newField],
      };
    }),
  updateField: (id, data) =>
    set((state) => ({
      history: [...state.history, state.fields],
      future: [],
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...data } : f)),
    })),
  reorderFields: (fromIndex, toIndex) =>
    set((state) => {
      const updated = [...state.fields];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        history: [...state.history, state.fields],
        future: [],
        fields: updated,
      };
    }),
  removeField: (id) =>
    set((state) => ({
      history: [...state.history, state.fields],
      future: [],
      fields: state.fields.filter((f) => f.id !== id),
    })),
  resetForm: () =>
    set((state) => ({
      history: [...state.history, state.fields],
      future: [],
      fields: [],
      selectedFieldId: null,
      steps: 1,
      currentStep: 1,
    })),
  setSteps: (steps) => set({ steps }),
  setCurrentStep: (step) => set({ currentStep: step }),
  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const prev = state.history[state.history.length - 1];
      return {
        fields: prev,
        history: state.history.slice(0, -1),
        future: [state.fields, ...state.future],
      };
    }),
  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        fields: next,
        history: [...state.history, state.fields],
        future: state.future.slice(1),
      };
    }),
  loadTemplate: (fields) =>
    set((state) => ({
      history: [...state.history, state.fields],
      future: [],
      fields,
    })),
}));


const STORAGE_KEY = "form_builder_state";

// Only subscribe to localStorage in the browser
if (typeof window !== "undefined") {
  useFormStore.subscribe((state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.fields));
  });

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    useFormStore.setState({ fields: JSON.parse(saved) });
  }
}

// Helper for unique form IDs
export function generateFormId() {
  return "form_" + Math.random().toString(36).slice(2, 10);
}

// Save form to localStorage
export function saveFormToStorage(formId: string, fields: FormField[], meta: { name: string }) {
  localStorage.setItem(`form:${formId}`, JSON.stringify({ fields, meta }));
}

// Load form from localStorage
export function loadFormFromStorage(formId: string): { fields: FormField[]; meta: { name: string } } | null {
  const raw = localStorage.getItem(`form:${formId}`);
  if (!raw) return null;
  return JSON.parse(raw);
}

// Save response to localStorage
export function saveResponse(formId: string, response: Record<string, string>) {
  const key = `responses:${formId}`;
  const prev = JSON.parse(localStorage.getItem(key) || "[]");
  prev.push({ response, date: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(prev));
}

// Load responses for a form
export function loadResponses(formId: string): { response: Record<string, string>; date: string }[] {
  return JSON.parse(localStorage.getItem(`responses:${formId}`) || "[]");
}