import { useState, useCallback } from 'react';

interface EditorHistory {
  past: string[];
  present: string;
  future: string[];
}

export function useEditorHistory(initialState: string) {
  const [history, setHistory] = useState<EditorHistory>({
    past: [],
    present: initialState,
    future: [],
  });

  const handleChange = useCallback((value: string) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: value,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1]!;
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0]!;
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  return {
    text: history.present,
    setText: handleChange,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
}