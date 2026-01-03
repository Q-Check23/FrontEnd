import { createContext, useCallback, useMemo, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* 최소 토스트 UI */}
      <div style={{ position: "fixed", left: 16, bottom: 16 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.75)",
              color: "white",
              fontSize: 14,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
