import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database
const db = new Database("users.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Seed Admin User if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password, full_name, email, role) VALUES (?, ?, ?, ?, ?)")
    .run("admin", "admin123", "مدير النظام", "admin@userhub.com", "admin");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth: Login
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }
  });

  // Auth: Register
  app.post("/api/auth/register", (req, res) => {
    const { username, password, full_name, email, role } = req.body;
    
    // التحقق من وجود البيانات الأساسية
    if (!username || !password || !full_name || !email) {
      return res.status(400).json({ success: false, message: "يرجى ملء جميع الحقول المطلوبة" });
    }

    try {
      const info = db.prepare("INSERT INTO users (username, password, full_name, email, role) VALUES (?, ?, ?, ?, ?)")
        .run(username, password, full_name, email, role || 'user');
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (error: any) {
      console.error("Registration Error:", error);
      
      // التحقق من نوع الخطأ (تكرار اسم المستخدم)
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ success: false, message: "اسم المستخدم أو البريد الإلكتروني موجود مسبقاً" });
      } else {
        res.status(500).json({ success: false, message: "حدث خطأ داخلي في النظام، يرجى المحاولة لاحقاً" });
      }
    }
  });

  // Users: List
  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT id, username, full_name, email, role, created_at FROM users").all();
    res.json(users);
  });

  // Users: Delete
  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Users: Update
  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { full_name, email, role } = req.body;
    db.prepare("UPDATE users SET full_name = ?, email = ?, role = ? WHERE id = ?")
      .run(full_name, email, role, id);
    res.json({ success: true });
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
