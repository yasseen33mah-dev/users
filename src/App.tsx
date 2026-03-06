import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogIn, UserPlus, Users, LogOut, ShieldCheck, User as UserIcon } from "lucide-react";

// --- Types ---
interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

// --- Components ---

const Login = ({ onLogin, onSwitch }: { onLogin: (user: User) => void; onSwitch: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 glass rounded-3xl"
      dir="rtl"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
          <ShieldCheck className="text-white w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">تسجيل الدخول</h1>
        <p className="text-slate-500 mt-2">مرحباً بك مجدداً في نظام إدارة المستخدمين</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">اسم المستخدم</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="أدخل اسم المستخدم"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
        >
          {loading ? "جاري التحميل..." : <><LogIn size={18} /> دخول</>}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={onSwitch} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          ليس لديك حساب؟ سجل الآن
        </button>
      </div>
    </motion.div>
  );
};

const Register = ({ onSwitch }: { onSwitch: () => void }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    role: "user" as const
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(onSwitch, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md p-8 glass rounded-3xl"
      dir="rtl"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 mb-4">
          <UserPlus className="text-white w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">إنشاء حساب جديد</h1>
        <p className="text-slate-500 mt-2">انضم إلينا اليوم وابدأ إدارة فريقك</p>
      </div>

      {success ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck />
          </div>
          <h2 className="text-xl font-bold text-emerald-600">تم التسجيل بنجاح!</h2>
          <p className="text-slate-500 mt-2">جاري تحويلك لصفحة الدخول...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all"
          >
            {loading ? "جاري التسجيل..." : "إنشاء الحساب"}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <button onClick={onSwitch} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          لديك حساب بالفعل؟ سجل دخولك
        </button>
      </div>
    </motion.div>
  );
};

const Dashboard = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert("فشل الحذف");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 glass p-6 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <UserIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">أهلاً بك، {user.full_name}</h2>
            <p className="text-sm text-slate-500">{user.role === 'admin' ? 'مدير النظام' : 'مستخدم'}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
        >
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">إجمالي</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{users.length}</h3>
          <p className="text-slate-500 text-sm mt-1">مستخدم مسجل</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">نشط</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{users.filter(u => u.role === 'admin').length}</h3>
          <p className="text-slate-500 text-sm mt-1">مديرين</p>
        </div>
        <div className="glass p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <UserIcon size={20} />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">عادي</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{users.filter(u => u.role === 'user').length}</h3>
          <p className="text-slate-500 text-sm mt-1">مستخدمين عاديين</p>
        </div>
      </div>

      {/* User Table */}
      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">قائمة المستخدمين</h3>
          <button 
            onClick={fetchUsers}
            className="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            تحديث البيانات
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">المستخدم</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">الدور</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">تاريخ الانضمام</th>
                {user.role === 'admin' && <th className="px-6 py-4 text-sm font-semibold text-slate-600">الإجراءات</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">جاري تحميل البيانات...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">لا يوجد مستخدمين مسجلين</td>
                </tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/30 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                        {u.full_name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800">{u.full_name}</div>
                        <div className="text-xs text-slate-500">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.role === 'admin' ? 'مدير' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(u.created_at).toLocaleDateString('ar-SA')}
                  </td>
                  {user.role === 'admin' && (
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDelete(u.id)}
                        disabled={u.id === user.id}
                        className={`text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all ${u.id === user.id ? 'opacity-20 cursor-not-allowed' : ''}`}
                      >
                        حذف
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'register'>('login');

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("userhub_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("userhub_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("userhub_user");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 selection:bg-indigo-100 selection:text-indigo-700">
      <AnimatePresence mode="wait">
        {!currentUser ? (
          <div key="auth" className="w-full flex justify-center p-4">
            {view === 'login' ? (
              <Login onLogin={handleLogin} onSwitch={() => setView('register')} />
            ) : (
              <Register onSwitch={() => setView('login')} />
            )}
          </div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Dashboard user={currentUser} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
