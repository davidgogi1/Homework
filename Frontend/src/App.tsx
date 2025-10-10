import { useEffect, useState } from "react";
import SearchPanel from "./components/SearchPanel";
import LoginPanel from "./components/LoginPanel";
import { setToken } from "./api";
import "./App.css";

export default function App() {
  const [hasToken, setHasToken] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      setToken(token);
      setHasToken(true);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  if (!hasToken) {
    return (
      <div className="container">
        <h1>Homework – GitHub Repo Search</h1>
        <p>Login to continue</p>

        <LoginPanel onAuthed={() => setHasToken(true)} />

        <div className="divider">
          <span>or</span>
        </div>

        <a href="http://localhost:5000/auth/github" className="github-login">
          <span>🐙</span> Login with GitHub
        </a>
      </div>
    );
  }

  return (
    <div className="main-container">
      <h1>GitHub Repo Search</h1>
      <div className="logout-wrapper">
        <button
          onClick={() => {
            setToken(null);
            setHasToken(false);
          }}
        >
          Logout
        </button>
      </div>
      <SearchPanel />
    </div>
  );
}
