import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import "./App.css";
import { API_ENDPOINTS, type ApiEndpoint, type ApiField } from "./endpoints";

type ApiResponseState = {
  status: number;
  statusText: string;
  elapsedMs: number;
  headers: Record<string, string>;
  body: unknown;
} | null;

const pretty = (value: unknown) => JSON.stringify(value, null, 2);

type FormState = Record<string, string>;

const toInitialState = (fields?: ApiField[]): FormState => {
  if (!fields?.length) return {};
  return Object.fromEntries(
    fields.map((field) => [field.key, field.defaultValue ?? ""])
  );
};

const toPayload = (fields: ApiField[] | undefined, values: FormState) => {
  if (!fields?.length) return {};
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const raw = values[field.key] ?? "";
    if (!raw.trim().length) continue;

    if (field.type === "number") {
      payload[field.key] = Number(raw);
      continue;
    }
    if (field.type === "boolean") {
      payload[field.key] = raw === "true";
      continue;
    }
    if (field.key === "phoneNumbers" || field.key === "notificationEmails") {
      payload[field.key] = raw
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      continue;
    }
    payload[field.key] = raw;
  }

  return payload;
};

const renderField = (
  field: ApiField,
  value: string,
  onChange: (key: string, value: string) => void
) => {
  const label = `${field.label}${field.required ? " *" : ""}`;

  if (field.type === "textarea") {
    return (
      <label key={field.key}>
        {label}
        <textarea
          className="textarea"
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label key={field.key}>
        {label}
        <select
          className="input"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    );
  }

  const type = field.type === "boolean" ? "text" : field.type;
  return (
    <label key={field.key}>
      {label}
      <input
        className="input"
        type={type}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
    </label>
  );
};

function App() {
  const [baseUrl, setBaseUrl] = useState("http://localhost:5001");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ApiEndpoint>(API_ENDPOINTS[0]);

  const [paramsForm, setParamsForm] = useState<FormState>(toInitialState(API_ENDPOINTS[0].params));
  const [queryForm, setQueryForm] = useState<FormState>(toInitialState(API_ENDPOINTS[0].query));
  const [headersForm, setHeadersForm] = useState<FormState>(toInitialState(API_ENDPOINTS[0].headers));
  const [bodyForm, setBodyForm] = useState<FormState>(toInitialState(API_ENDPOINTS[0].body));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<ApiResponseState>(null);

  const filteredEndpoints = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return API_ENDPOINTS;
    return API_ENDPOINTS.filter((ep) =>
      `${ep.method} ${ep.path} ${ep.module} ${ep.description}`
        .toLowerCase()
        .includes(q)
    );
  }, [search]);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelected(ep);
    setParamsForm(toInitialState(ep.params));
    setQueryForm(toInitialState(ep.query));
    setHeadersForm(toInitialState(ep.headers));
    setBodyForm(toInitialState(ep.body));
    setError("");
    setResponse(null);
  };

  const updateFormField = (
    setter: Dispatch<SetStateAction<FormState>>,
    key: string,
    value: string
  ) => {
    setter((prev) => ({ ...prev, [key]: value }));
  };

  const buildUrl = (
    params: Record<string, unknown>,
    query: Record<string, unknown>
  ) => {
    const normalizedBase = baseUrl.replace(/\/+$/, "");
    let path = selected.path;
    for (const [key, value] of Object.entries(params)) {
      path = path.replaceAll(`:${key}`, encodeURIComponent(String(value ?? "")));
    }
    const url = new URL(`${normalizedBase}${path}`);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && String(value).length > 0) {
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  };

  const sendRequest = async () => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const params = toPayload(selected.params, paramsForm);
      const query = toPayload(selected.query, queryForm);
      const headers = toPayload(selected.headers, headersForm) as Record<string, unknown>;
      const body = toPayload(selected.body, bodyForm);

      const url = buildUrl(params, query);
      const startedAt = performance.now();

      const requestHeaders = Object.fromEntries(
        Object.entries(headers).map(([k, v]) => [k, String(v)])
      );
      if (selected.body?.length && !requestHeaders["Content-Type"]) {
        requestHeaders["Content-Type"] = "application/json";
      }

      const res = await fetch(url, {
        method: selected.method,
        headers: requestHeaders,
        body: selected.body?.length ? JSON.stringify(body) : undefined,
      });

      const elapsedMs = Math.round(performance.now() - startedAt);

      let parsedBody: unknown;
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        parsedBody = await res.json();
      } else {
        parsedBody = await res.text();
      }

      const responseHeaders = Object.fromEntries(res.headers.entries());
      setResponse({
        status: res.status,
        statusText: res.statusText,
        elapsedMs,
        headers: responseHeaders,
        body: parsedBody,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>API Docs</h1>
        <p className="muted">Interactive tester for `backent` APIs</p>
        <input
          className="input"
          placeholder="Search endpoint..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="endpoint-list">
          {filteredEndpoints.map((ep) => (
            <button
              key={ep.id}
              className={`endpoint-item ${selected.id === ep.id ? "active" : ""}`}
              onClick={() => handleSelectEndpoint(ep)}
            >
              <span className={`method method-${ep.method.toLowerCase()}`}>{ep.method}</span>
              <span className="path">{ep.path}</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="main">
        <section className="panel">
          <h2>Request</h2>
          <div className="grid">
            <label>
              Base URL
              <input
                className="input"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="http://localhost:5001"
              />
            </label>
            <label>
              Module
              <input className="input" value={selected.module} readOnly />
            </label>
            <label>
              Endpoint
              <input className="input" value={`${selected.method} ${selected.path}`} readOnly />
            </label>
            <label>
              Protected
              <input className="input" value={selected.protected ? "Yes" : "No"} readOnly />
            </label>
          </div>

          <label>
            Description
            <input className="input" value={selected.description} readOnly />
          </label>

          {selected.params?.length ? (
            <>
              <h3>Path Params</h3>
              <div className="grid">
                {selected.params.map((field) =>
                  renderField(field, paramsForm[field.key] ?? "", (k, v) =>
                    updateFormField(setParamsForm, k, v)
                  )
                )}
              </div>
            </>
          ) : null}

          {selected.query?.length ? (
            <>
              <h3>Query</h3>
              <div className="grid">
                {selected.query.map((field) =>
                  renderField(field, queryForm[field.key] ?? "", (k, v) =>
                    updateFormField(setQueryForm, k, v)
                  )
                )}
              </div>
            </>
          ) : null}

          {selected.headers?.length ? (
            <>
              <h3>Headers</h3>
              <div className="grid">
                {selected.headers.map((field) =>
                  renderField(field, headersForm[field.key] ?? "", (k, v) =>
                    updateFormField(setHeadersForm, k, v)
                  )
                )}
              </div>
            </>
          ) : null}

          {selected.body?.length ? (
            <>
              <h3>Body</h3>
              <div className="grid">
                {selected.body.map((field) =>
                  renderField(field, bodyForm[field.key] ?? "", (k, v) =>
                    updateFormField(setBodyForm, k, v)
                  )
                )}
              </div>
            </>
          ) : null}

          {selected.note ? <p className="muted">{selected.note}</p> : null}

          <button className="send" onClick={sendRequest} disabled={loading}>
            {loading ? "Sending..." : "Send Request"}
          </button>
          {error ? <p className="error">{error}</p> : null}
        </section>

        <section className="panel">
          <h2>Response</h2>
          {!response ? (
            <p className="muted">Send a request to see response details.</p>
          ) : (
            <>
              <div className="meta">
                <span>Status: {response.status}</span>
                <span>{response.statusText}</span>
                <span>{response.elapsedMs} ms</span>
              </div>
              <h3>Headers</h3>
              <pre>{pretty(response.headers)}</pre>
              <h3>Body</h3>
              <pre>{typeof response.body === "string" ? response.body : pretty(response.body)}</pre>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
