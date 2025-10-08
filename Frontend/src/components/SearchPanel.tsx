import React, { useState } from "react";
import api from "../api";

type Sort = "asc" | "desc" | "";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("");
  const [ignore, setIgnore] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Repo[]>([]);

  const doSearch = async () => {
    setError(null);
    setLoading(true);
    setResults([]);
    try {
      if (!query.trim()) {
        setError("Enter a search term.");
        setLoading(false);
        return;
      }

      const params: Record<string, string> = { query };
      if (sort) params.sort = sort;
      if (ignore) params.ignore = ignore;

      const { data } = await api.get<Repo[]>("/search", { params });
      setResults(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search GitHub Repositories</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 720, marginBottom: 12 }}>
        <label>
          Search
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='e.g. "nestjs"'
          />
        </label>

        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <label>
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
            >
              <option value="">(none)</option>
              <option value="asc">Name A→Z</option>
              <option value="desc">Name Z→A</option>
            </select>
          </label>

          <label style={{ flex: 1 }}>
            Ignore (name contains)
            <input
              type="text"
              value={ignore}
              onChange={(e) => setIgnore(e.target.value)}
              placeholder='e.g. "awesome"'
            />
          </label>

          <button onClick={doSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: 16,
          display: "grid",
          gap: 12,
        }}
      >
        {results.map((repo) => (
          <li
            key={repo.id}
            style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontWeight: 600 }}
                >
                  {repo.full_name}
                </a>
                <div style={{ color: "#666", marginTop: 4 }}>
                  {repo.description || "No description"}
                </div>
                <div style={{ marginTop: 6, fontSize: 14, color: "#333" }}>
                  ⭐ {repo.stargazers_count} &nbsp;·&nbsp;{" "}
                  {repo.language || "Unknown"}
                </div>
              </div>
            </div>
          </li>
        ))}
        {!loading && results.length === 0 && !error && (
          <li style={{ color: "#666" }}>No results yet. Try a search.</li>
        )}
      </ul>
    </div>
  );
}
