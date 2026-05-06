/**
 * Lightweight demo API for welcome email logging, bulk-mail simulation, birthday sweep.
 * Run: node server/index.mjs  (npm run api)
 */
import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "data");
const REGISTRY = path.join(DATA, "registry.json");

const PORT = Number(process.env.PORT) || 8787;
const ADMIN_SECRET = process.env.MIC_ADMIN_SECRET || "dev-change-me";

function ensureData() {
  if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });
  if (!fs.existsSync(REGISTRY)) fs.writeFileSync(REGISTRY, JSON.stringify({ users: [], welcomeSent: {}, birthdayLogged: {} }, null, 2));
}

function readRegistry() {
  ensureData();
  return JSON.parse(fs.readFileSync(REGISTRY, "utf8"));
}

function writeRegistry(obj) {
  fs.writeFileSync(REGISTRY, JSON.stringify(obj, null, 2));
}

function sendTransactional(event, payload) {
  console.log(`[email:${event}]`, JSON.stringify(payload));
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/registry/signup", (req, res) => {
  const { id, email, displayName, birthdateISO, phone, city, address, memberApprovalStatus } = req.body ?? {};
  if (!id || !email) return res.status(400).json({ ok: false, error: "id and email required" });
  const db = readRegistry();
  const pending = memberApprovalStatus === "pending";
  db.users.push({
    id,
    email,
    displayName,
    birthdateISO: birthdateISO || "",
    phone: phone || "",
    city: city || "",
    address: address || "",
    memberApprovalStatus: pending ? "pending" : memberApprovalStatus || "approved",
    createdAt: new Date().toISOString(),
  });
  if (pending) {
    sendTransactional("admin_pending_member", {
      applicantId: id,
      email,
      displayName,
      phone: phone || "",
      address: address || "",
      note: "Review and approve in Site admin (Directory tab).",
    });
  }
  if (!db.welcomeSent[id]) {
    sendTransactional(pending ? "application_received" : "welcome", { to: email, name: displayName });
    db.welcomeSent[id] = new Date().toISOString();
  }
  writeRegistry(db);
  res.json({ ok: true });
});

app.post("/admin/broadcast", (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== ADMIN_SECRET) return res.status(401).json({ ok: false, error: "unauthorized" });
  const { bccRecipients, subject, htmlBody } = req.body ?? {};
  if (!Array.isArray(bccRecipients) || !subject) {
    return res.status(400).json({ ok: false, error: "bccRecipients[] and subject required" });
  }
  sendTransactional("bulk_bcc", { count: bccRecipients.length, subject, previewHtml: htmlBody?.slice?.(0, 200) });
  res.json({ ok: true, simulated: true, recipientCount: bccRecipients.length });
});

app.post("/admin/notifications", (req, res) => {
  const { kind, title, body, actorName, href, relatedId } = req.body ?? {};
  if (!kind || !title || !body) return res.status(400).json({ ok: false, error: "kind, title, and body required" });
  sendTransactional("admin_notification", {
    kind,
    title,
    body,
    actorName: actorName || "",
    href: href || "",
    relatedId: relatedId || "",
  });
  res.json({ ok: true });
});

app.post("/jobs/birthdays", (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== ADMIN_SECRET) return res.status(401).json({ ok: false, error: "unauthorized" });
  const db = readRegistry();
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const hits = [];
  for (const u of db.users) {
    const iso = u.birthdateISO;
    if (!iso || typeof iso !== "string") continue;
    const parts = iso.split("-");
    if (parts.length < 3) continue;
    if (parts[1] === mm && parts[2] === dd) {
      const key = `${u.id}-${today.getFullYear()}`;
      if (!db.birthdayLogged[key]) {
        sendTransactional("birthday", { to: u.email, name: u.displayName });
        db.birthdayLogged[key] = new Date().toISOString();
        hits.push(u.email);
      }
    }
  }
  writeRegistry(db);
  res.json({ ok: true, birthdayEmails: hits });
});

ensureData();

app.listen(PORT, () => console.log(`My Inner Circle API http://localhost:${PORT}`));
