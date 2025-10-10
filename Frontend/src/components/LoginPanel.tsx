import { useState } from "react";
import api, { setToken } from "../api";
import "./LoginPanel.css";

export default function LoginPanel({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      if (mode === "register") {
        await api.post("/auth/register", { username, password });
        setMsg("Registered! Now log in.");
        setMode("login");
      } else {
        const { data } = await api.post("/auth/login", { username, password });
        if (data?.token) {
          setToken(data.token);
          onAuthed();
        }
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-heading">
        {mode === "login" ? "Login" : "Register"}
      </h2>

      <div className="login-form">
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="alice"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </label>

        <button
          onClick={submit}
          disabled={busy || !username || !password}
          className="login-btn"
        >
          {busy ? "Please wait…" : mode === "login" ? "Login" : "Register"}
        </button>

        <small>
          {mode === "login" ? (
            <>
              New user?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("register");
                  setErr(null);
                  setMsg(null);
                }}
              >
                Create an account
              </a>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("login");
                  setErr(null);
                  setMsg(null);
                }}
              >
                Log in
              </a>
            </>
          )}
        </small>

        {msg && <div className="login-msg success">{msg}</div>}
        {err && <div className="login-msg error">{err}</div>}
      </div>
    </div>
  );
}
