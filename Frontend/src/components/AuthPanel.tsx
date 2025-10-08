import React, { useState } from "react";
import api, { setToken } from "../api";

interface Props {
  onAuthed: () => void;
}

export default function AuthPanel({ onAuthed }: Props) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setMsg(null);
    setErr(null);
    setLoading(true);
    try {
      if (mode === "register") {
        await api.post("/auth/register", { username, password });
        setMsg("Registered! Now log in.");
        setMode("login");
      } else {
        const { data } = await api.post("/auth/login", { username, password });
        if (data?.token) {
          setToken(data.token);
          setMsg("Logged in!");
          onAuthed();
        }
      }
    } catch (e: any) {
      setErr(e?.response?.data?.message || e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const disabled = !username || !password || loading;

  return (
    <div>
      <h2>{mode === "register" ? "Register" : "Login"}</h2>
      <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <label>
          Username
          <input
            type="text"
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
            placeholder="******"
          />
        </label>

        <button onClick={submit} disabled={disabled}>
          {loading
            ? "Please wait..."
            : mode === "register"
            ? "Register"
            : "Login"}
        </button>

        <small>
          {mode === "register" ? (
            <>
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("login");
                  setMsg(null);
                  setErr(null);
                }}
              >
                Switch to Login
              </a>
            </>
          ) : (
            <>
              New user?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setMode("register");
                  setMsg(null);
                  setErr(null);
                }}
              >
                Switch to Register
              </a>
            </>
          )}
        </small>

        {msg && <div style={{ color: "green" }}>{msg}</div>}
        {err && <div style={{ color: "crimson" }}>{err}</div>}
      </div>
    </div>
  );
}
