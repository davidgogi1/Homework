import { useState } from "react";
import AuthPanel from "./components/AuthPanel";
import SearchPanel from "./components/SearchPanel";
import { setToken } from "./api";
import "./App.css";

type Tab = "auth" | "search";

export default function App() {
  const [tab, setTab] = useState<Tab>("auth");
  const [authed, setAuthed] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    setToken(null);
    setAuthed(false);
    setTab("auth");
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        maxWidth: 900,
        margin: "40px auto",
        padding: 16,
      }}
    >
      <h1>GitHub Repo Search (Client)</h1>

      <nav style={{ display: "flex", gap: 12, margin: "12px 0" }}>
        <button onClick={() => setTab("auth")} disabled={tab === "auth"}>
          Auth
        </button>
        <button onClick={() => setTab("search")} disabled={tab === "search"}>
          Search
        </button>
        {authed && (
          <button onClick={handleLogout} style={{ marginLeft: "auto" }}>
            Logout
          </button>
        )}
      </nav>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
        {tab === "auth" ? (
          <AuthPanel
            onAuthed={() => {
              setAuthed(true);
              setTab("search");
            }}
          />
        ) : (
          <SearchPanel />
        )}
      </div>

      <footer style={{ marginTop: 24, color: "#666" }}>
        API: {"http://localhost:3000"}
      </footer>
    </div>
  );
}
