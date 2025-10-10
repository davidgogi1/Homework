import React, { useState } from "react";
import api from "../api";
import "./SearchPanel.css";

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
    <div className="search-container">
      <h2>Search GitHub Repositories</h2>

      <div className="search-controls">
        <label>
          Search
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='e.g. "nestjs"'
          />
        </label>

        <div className="search-filters">
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

          <label className="ignore-field">
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

      {error && <div className="search-error">{error}</div>}

      <ul className="repo-list">
        {results.map((repo) => (
          <li key={repo.id} className="repo-item">
            <div className="repo-info">
              <div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="repo-link"
                >
                  {repo.full_name}
                </a>
                <div className="repo-description">
                  {repo.description || "No description"}
                </div>
                <div className="repo-meta">
                  ⭐ {repo.stargazers_count} &nbsp;·&nbsp;{" "}
                  {repo.language || "Unknown"}
                </div>
              </div>
            </div>
          </li>
        ))}
        {!loading && results.length === 0 && !error && (
          <li className="repo-empty">No results yet. Try a search.</li>
        )}
      </ul>
    </div>
  );
}
