import * as duckdb from "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/+esm";

const runBtn = document.getElementById("run");
const status = document.getElementById("status");
const results = document.getElementById("results");
const sqlBox = document.getElementById("sql");
const TABLES = ["vehicles", "mot_tests", "defects"];
const MAX_ROWS = 50000;
let conn;

async function init() {
  const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
  const workerUrl = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" })
  );
  const db = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), new Worker(workerUrl));
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(workerUrl);

  const c = await db.connect();
  for (const t of TABLES) {
    const res = await fetch(`data/lambos/${t}.parquet`);
    if (!res.ok) throw new Error(`could not load ${t}.parquet (${res.status})`);
    await db.registerFileBuffer(`${t}.parquet`, new Uint8Array(await res.arrayBuffer()));
    await c.query(`CREATE VIEW ${t} AS SELECT * FROM '${t}.parquet'`);
  }
  return c;
}

const esc = v => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

function render(table) {
  const cols = table.schema.fields.map(f => f.name);
  const rows = table.toArray().slice(0, MAX_ROWS);
  let html = "<table><thead><tr>" + cols.map(c => `<th>${esc(c)}</th>`).join("") + "</tr></thead><tbody>";
  for (const r of rows) html += "<tr>" + cols.map(c => `<td>${esc(r[c])}</td>`).join("") + "</tr>";
  results.innerHTML = html + "</tbody></table>";
  return `${table.numRows} rows` + (table.numRows > MAX_ROWS ? ` (showing first ${MAX_ROWS})` : "");
}

async function run() {
  if (!conn) return;
  runBtn.disabled = true;
  status.textContent = "Running…";
  const t0 = performance.now();
  try {
    const summary = render(await conn.query(sqlBox.value));
    status.textContent = `${summary} in ${Math.round(performance.now() - t0)} ms`;
  } catch (e) {
    results.innerHTML = "";
    status.textContent = "Error: " + e.message;
  }
  runBtn.disabled = false;
}

runBtn.addEventListener("click", run);
sqlBox.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") run();
});

try {
  conn = await init();
  runBtn.textContent = "Run (⌘+Enter)";
  runBtn.disabled = false;
  status.textContent = "Ready.";
} catch (e) {
  status.textContent = "Failed to load: " + e.message;
}