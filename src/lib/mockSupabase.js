// src/lib/mockSupabase.js
//
// In-memory stand-in for the Supabase client, used only in local dev when
// VITE_USE_MOCK=true (see supabaseClient.js). It implements the subset of the
// query-builder / auth / realtime API the app actually calls, backed by the
// seed data below. Nothing here ships to production and nothing surfaces in the
// UI — it just lets the /dev/* routes show populated dashboards without a live
// Supabase project.
//
// The seed ids intentionally match src/dev/DevAuthOverride.jsx
// (dev-student / dev-lecturer / dev-admin) so those mock sessions see data.

const uuid = () => crypto.randomUUID();
const iso = (ms) => new Date(ms).toISOString();

const ALWAYS_OPEN = { opens: iso(0), closes: iso(4102444800000) }; // 1970 → 2100

// --- seed tables --------------------------------------------------------------

const db = {
  users: [
    { id: "dev-student", full_name: "King Harrison", email: "king@oouagoiwoye.edu.ng", role: "student", status: "active", level: "200" },
    { id: "dev-lecturer", full_name: "Dr. Adeyemi", email: "adeyemi@oouagoiwoye.edu.ng", role: "lecturer", status: "active" },
    { id: "dev-admin", full_name: "Admin User", email: "admin@oouagoiwoye.edu.ng", role: "admin", status: "active" },
    { id: "lect-2", full_name: "Dr. Okafor", email: "okafor@oouagoiwoye.edu.ng", role: "lecturer", status: "active" },
    { id: "stu-2", full_name: "Ada Lovelace", email: "ada@oouagoiwoye.edu.ng", role: "student", status: "active", level: "200" },
    { id: "stu-3", full_name: "Grace Hopper", email: "grace@oouagoiwoye.edu.ng", role: "student", status: "active", level: "200" },
    { id: "stu-4", full_name: "Alan Turing", email: "alan@oouagoiwoye.edu.ng", role: "student", status: "banned", level: "300" },
  ],
  courses: [
    { id: "crs-1", code: "CPE 201", title: "Circuit Theory I", level: "200", lecturer_id: "dev-lecturer" },
    { id: "crs-2", code: "CPE 205", title: "Digital Systems", level: "200", lecturer_id: "dev-lecturer" },
    { id: "crs-3", code: "MTH 201", title: "Linear Algebra", level: "200", lecturer_id: "lect-2" },
    { id: "crs-4", code: "GNS 201", title: "Use of English", level: "200", lecturer_id: "lect-2" },
  ],
  classes: [
    { id: "cls-1", course_id: "crs-1", day: "Monday", start_time: "08:00", end_time: "10:00", location: "Engr. Lecture Hall 1" },
    { id: "cls-2", course_id: "crs-2", day: "Wednesday", start_time: "10:00", end_time: "12:00", location: "CPE Lab A" },
    { id: "cls-3", course_id: "crs-3", day: "Friday", start_time: "12:00", end_time: "14:00", location: "New Science Complex 101" },
    { id: "cls-4", course_id: "crs-4", day: "Tuesday", start_time: "14:00", end_time: "16:00", location: "GNS Hall" },
  ],
  // One always-open session on CPE 201 so the student attendance tab shows a
  // window to check into immediately.
  attendance_sessions: [
    { id: "ses-1", class_id: "cls-1", is_test: false, opens_at: ALWAYS_OPEN.opens, closes_at: ALWAYS_OPEN.closes },
  ],
  attendance_records: [],
  // Enrollment rows only feed the "x / total" denominator, so the shape barely
  // matters — seed 24 for CPE 201.
  enrollments: Array.from({ length: 24 }, (_, i) => ({ id: `enr-${i}`, class_id: "cls-1", student_id: `seed-${i}` })),
  assignments: [
    { id: "asn-1", course_id: "crs-1", title: "Assignment 1 — Nodal analysis", description: "Solve problems 1–8 from chapter 3.", deadline: iso(Date.now() + 3 * 864e5), created_at: iso(Date.now() - 2 * 864e5) },
    { id: "asn-2", course_id: "crs-2", title: "Lab report — Flip-flops", description: "Write up the D/JK flip-flop lab.", deadline: iso(Date.now() + 7 * 864e5), created_at: iso(Date.now() - 1 * 864e5) },
  ],
};

// classes and assignments both carry a joined `courses` object in the real
// queries the app runs.
const COURSE_JOIN_TABLES = ["classes", "assignments"];
const hydrateCourse = (row) => ({ ...row, courses: db.courses.find((c) => c.id === row.course_id) || null });
const needsCourseJoin = (table, select, filters) =>
  COURSE_JOIN_TABLES.includes(table) && (/courses/.test(select) || filters.some(([, col]) => col.startsWith("courses.")));

const readCol = (row, col) => (col.includes(".") ? col.split(".").reduce((o, k) => o?.[k], row) : row[col]);

const applyFilters = (rows, filters) =>
  rows.filter((row) =>
    filters.every(([op, col, val]) => {
      const actual = readCol(row, col);
      if (op === "eq") return actual === val;
      if (op === "in") return val.includes(actual);
      if (op === "lte") return actual <= val;
      if (op === "gte") return actual >= val;
      return true;
    })
  );

// --- realtime (single-page pub/sub) ------------------------------------------

const channels = [];
const matchesFilter = (filter, row) => {
  if (!filter) return true;
  const m = /^(\w+)=eq\.(.+)$/.exec(filter); // e.g. "session_id=eq.ses-1"
  return m ? String(row[m[1]]) === m[2] : true;
};
const emitInsert = (table, row) => {
  channels.forEach((ch) =>
    ch.subs.forEach((s) => {
      if (s.cfg.table === table && matchesFilter(s.cfg.filter, row)) s.cb({ new: row });
    })
  );
};

// --- query builder ------------------------------------------------------------

class MockQuery {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this._select = "*";
    this._order = null;
    this._limit = null;
    this._count = false;
    this._head = false;
    this._op = "select";
    this._rows = null;
    this._vals = null;
  }

  select(sel = "*", opts = {}) {
    this._select = sel;
    if (opts.count) this._count = true;
    if (opts.head) this._head = true;
    return this;
  }
  insert(rows) { this._op = "insert"; this._rows = Array.isArray(rows) ? rows : [rows]; return this; }
  update(vals) { this._op = "update"; this._vals = vals; return this; }
  eq(col, val) { this.filters.push(["eq", col, val]); return this; }
  in(col, val) { this.filters.push(["in", col, val]); return this; }
  lte(col, val) { this.filters.push(["lte", col, val]); return this; }
  gte(col, val) { this.filters.push(["gte", col, val]); return this; }
  order(col, opts = {}) { this._order = [col, opts]; return this; }
  limit(n) { this._limit = n; return this; }

  single() { this._single = true; return this._run(); }
  maybeSingle() { this._maybe = true; return this._run(); }
  then(resolve, reject) { return this._run().then(resolve, reject); }

  _result(data, error = null, count = null) {
    return Promise.resolve({ data, error, count });
  }

  async _run() {
    const store = db[this.table] || [];

    if (this._op === "insert") {
      // unique (session_id, student_id) on attendance_records
      if (this.table === "attendance_records") {
        const r = this._rows[0];
        if (store.some((x) => x.session_id === r.session_id && x.student_id === r.student_id)) {
          return this._result(null, { code: "23505", message: "duplicate key value" });
        }
      }
      const inserted = this._rows.map((r) => ({ id: uuid(), ...r }));
      store.push(...inserted);
      inserted.forEach((r) => emitInsert(this.table, r));
      const shaped = COURSE_JOIN_TABLES.includes(this.table) ? inserted.map(hydrateCourse) : inserted;
      const one = shaped[0];
      return this._result(this._single || this._maybe ? one : shaped);
    }

    if (this._op === "update") {
      applyFilters(store, this.filters).forEach((row) => Object.assign(row, this._vals));
      return this._result(null);
    }

    // select
    let rows = needsCourseJoin(this.table, this._select, this.filters) ? store.map(hydrateCourse) : store.slice();
    rows = applyFilters(rows, this.filters);

    if (this._head || this._count) return this._result(this._head ? null : rows, null, rows.length);

    if (this._order) {
      const [col, opts] = this._order;
      rows.sort((a, b) => (a[col] > b[col] ? 1 : -1) * (opts.ascending === false ? -1 : 1));
    }
    if (this._limit != null) rows = rows.slice(0, this._limit);
    if (this._single) return this._result(rows[0] ?? null);
    if (this._maybe) return this._result(rows[0] ?? null);
    return this._result(rows);
  }
}

// --- client -------------------------------------------------------------------

const authError = { message: "Mock mode: use the /dev routes to sign in." };

export const mockSupabase = {
  from: (table) => new MockQuery(table),
  channel: (name) => {
    const subs = [];
    const ch = {
      on: (_event, cfg, cb) => { subs.push({ cfg, cb }); return ch; },
      subscribe: () => { channels.push({ name, subs }); return ch; },
    };
    return ch;
  },
  removeChannel: (ch) => {
    const i = channels.findIndex((c) => c === ch);
    if (i !== -1) channels.splice(i, 1);
  },
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: (cb) => {
      cb("INITIAL_SESSION", null);
      return { data: { subscription: { unsubscribe() {} } } };
    },
    signInWithPassword: async () => ({ data: { user: null }, error: authError }),
    signUp: async () => ({ data: { user: null }, error: authError }),
    signInWithOAuth: async () => ({ data: null, error: authError }),
    signOut: async () => ({ error: null }),
  },
};
