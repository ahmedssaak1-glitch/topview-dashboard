/*
ERP Dashboard - Single-file React component (Tailwind)
Filename: ERP-Dashboard-RealEstate-and-Fitout.jsx

How to use:
1) Create a React project (Vite recommended):
   npm create vite@latest my-app --template react
   cd my-app
   npm install
   npm install tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   // configure tailwind per docs and add the tailwind directives to index.css
2) Copy this file into src/components/ERP-Dashboard.jsx
3) Import and render <ERPApp /> in src/App.jsx
4) Start: npm run dev

Notes:
- This is a client-side mock with in-memory sample data to iterate UI quickly.
- Replace data/state with API calls when backend is ready.
- Uses Tailwind utility classes for layout. Keep it simple and modular.

Features included here (MVP):
- Responsive dashboard layout (sidebar + main)
- Language toggle (EN / AR)
- Simple auth simulation (login modal)
- Employee / Projects / Finance lists with filters
- Role-based view simulation (Admin / Accountant / Engineer / Worker)
- Modals for Add Employee / Add Project / Add Transaction (front-end only)
- Export CSV buttons (front-end utility)

You asked for a modern look; this uses cards, tables and clear CTA buttons.
*/

import React, { useState, useMemo } from 'react';

export default function ERPApp() {
  // --- sample users and roles ---
  const sampleUsers = [
    { id: 1, name: 'Ahmed Salah', role: 'Admin', email: 'ahmed@company.com' },
    { id: 2, name: 'Mona Khaled', role: 'Accountant', email: 'mona@company.com' },
    { id: 3, name: 'Omar Fahmy', role: 'Engineer', email: 'omar@company.com' },
    { id: 4, name: 'Yousef Ali', role: 'Worker', email: 'yousef@company.com' }
  ];

  const sampleProjects = [
    { id: 101, name: 'Flat 12B - Fitout', client: 'Mr. Hassan', status: 'In Progress', budget: 40000, start: '2025-09-10', end: '2025-11-20', engineer: 'Omar Fahmy' },
    { id: 102, name: 'Building Unit Sale - Unit 7', client: 'Ms. Salma', status: 'Completed', budget: 250000, start: '2024-03-01', end: '2024-08-15', engineer: 'Omar Fahmy' },
  ];

  const sampleTransactions = [
    { id: 5001, type: 'Expense', category: 'Materials', amount: 12000, date: '2025-10-20', note: 'Tiles + adhesives', projectId: 101 },
    { id: 5002, type: 'Income', category: 'Client Payment', amount: 20000, date: '2025-10-25', note: 'Milestone 2 payment', projectId: 101 },
  ];

  // --- state ---
  const [lang, setLang] = useState('en'); // 'en' or 'ar'
  const [currentUser, setCurrentUser] = useState(sampleUsers[0]);
  const [users, setUsers] = useState(sampleUsers);
  const [projects, setProjects] = useState(sampleProjects);
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // modals
  const [showLogin, setShowLogin] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // small helpers
  const translate = (en, ar) => (lang === 'en' ? en : ar);

  // permissions simulation
  const can = (action) => {
    if (!currentUser) return false;
    const role = currentUser.role;
    const perms = {
      Admin: ['view_all', 'edit_all', 'finance', 'manage_users'],
      Accountant: ['finance', 'view_projects'],
      Engineer: ['view_projects', 'edit_projects'],
      Worker: ['view_own_tasks']
    };
    return perms[role] && perms[role].includes(action);
  };

  // dashboard summaries
  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + t.amount, 0);
    const profit = income - expense;
    return { income, expense, profit, projects: projects.length, employees: users.length };
  }, [transactions, projects, users]);

  // add handlers (front-end only)
  const addEmployee = (emp) => {
    emp.id = Date.now();
    setUsers(u => [emp, ...u]);
    setShowAddEmployee(false);
  };
  const addProject = (p) => {
    p.id = Date.now();
    setProjects(ps => [p, ...ps]);
    setShowAddProject(false);
  };
  const addTransaction = (tr) => {
    tr.id = Date.now();
    setTransactions(ts => [tr, ...ts]);
    setShowAddTransaction(false);
  };

  // simple CSV export util
  const exportCSV = (arr, filename = 'export.csv') => {
    const keys = Object.keys(arr[0] || {});
    const csv = [keys.join(','), ...arr.map(r => keys.map(k => `"${(r[k] ?? '')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${lang === 'ar' ? 'direction-rtl' : ''} bg-gray-50 text-gray-800`}>
      {/* Topbar */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(s => !s)} className="p-2 rounded-md hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="font-semibold text-lg">{translate('Nile Properties & Fitout', 'نيل للعقارات والتشطيب')}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} className="px-3 py-1 border rounded-full text-sm">
              {lang.toUpperCase()}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-sm">{currentUser.name}</div>
                <div className="text-xs text-gray-500">{currentUser.role}</div>
                <button onClick={() => setShowLogin(true)} className="px-3 py-1 bg-white border rounded">{translate('Switch','تبديل')}</button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="px-3 py-1 bg-blue-600 text-white rounded">{translate('Login','تسجيل الدخول')}</button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r min-h-[calc(100vh-64px)] transition-all` }>
          <nav className="p-3">
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab==='dashboard'? 'bg-blue-50': 'hover:bg-gray-50'}`}>
                  <span className="material-icons">dashboard</span>
                  <span className="flex-1">{translate('Dashboard','لوحة التحكم')}</span>
                  <span className="text-xs text-gray-500">{totals.projects} / {totals.employees}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('employees')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab==='employees'? 'bg-blue-50': 'hover:bg-gray-50'}`}>
                  <span className="material-icons">people</span>
                  <span className="flex-1">{translate('Employees','الموظفين')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('projects')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab==='projects'? 'bg-blue-50': 'hover:bg-gray-50'}`}>
                  <span className="material-icons">work</span>
                  <span className="flex-1">{translate('Projects','المشاريع')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('finance')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab==='finance'? 'bg-blue-50': 'hover:bg-gray-50'}`}>
                  <span className="material-icons">account_balance_wallet</span>
                  <span className="flex-1">{translate('Finance','المالية')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('inventory')} className={`w-full text-left p-2 rounded-md flex items-center gap-3 ${activeTab==='inventory'? 'bg-blue-50': 'hover:bg-gray-50'}`}>
                  <span className="material-icons">inventory_2</span>
                  <span className="flex-1">{translate('Inventory','المخزون')}</span>
                </button>
              </li>
            </ul>

            <div className="mt-6 border-t pt-4">
              <div className="text-xs text-gray-500">{translate('User Role','دور المستخدم')}</div>
              <select value={currentUser?.id} onChange={(e)=>{
                const u = users.find(x => x.id === Number(e.target.value));
                setCurrentUser(u);
              }} className="mt-2 w-full border p-2 rounded">
                {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.role}</option>)}
              </select>

              {can('manage_users') && (
                <button onClick={() => setShowAddEmployee(true)} className="mt-3 w-full bg-green-600 text-white px-3 py-2 rounded">{translate('Add Employee','إضافة موظف')}</button>
              )}
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card title={translate('Income','الإيرادات')} value={`AED ${totals.income.toLocaleString()}`} />
                <Card title={translate('Expense','المصروفات')} value={`AED ${totals.expense.toLocaleString()}`} />
                <Card title={translate('Profit','الربح')} value={`AED ${totals.profit.toLocaleString()}`} />
                <Card title={translate('Projects','المشاريع')} value={totals.projects} />
              </div>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-white p-4 rounded shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{translate('Active Projects','المشاريع النشطة')}</h3>
                    <div className="flex gap-2">
                      {can('edit_projects') && <button onClick={() => setShowAddProject(true)} className="px-3 py-1 border rounded">{translate('New Project','مشروع جديد')}</button>}
                      <button onClick={()=>exportCSV(projects,'projects.csv')} className="px-3 py-1 border rounded">Export</button>
                    </div>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500">
                        <th className="py-2">ID</th>
                        <th>Name</th>
                        <th>Client</th>
                        <th>Status</th>
                        <th>Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p.id} className="border-t">
                          <td className="py-2">{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.client}</td>
                          <td>{p.status}</td>
                          <td>AED {p.budget.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white p-4 rounded shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{translate('Recent Transactions','الحركات الأخيرة')}</h3>
                    <div className="flex gap-2">
                      {can('finance') && <button onClick={() => setShowAddTransaction(true)} className="px-3 py-1 border rounded">{translate('Add Transaction','إضافة حركة')}</button>}
                      <button onClick={()=>exportCSV(transactions,'transactions.csv')} className="px-3 py-1 border rounded">Export</button>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {transactions.map(t => (
                      <li key={t.id} className="flex items-center justify-between border rounded p-2">
                        <div>
                          <div className="font-medium">{t.category} — {t.type}</div>
                          <div className="text-xs text-gray-500">{t.note}</div>
                        </div>
                        <div className="text-right">
                          <div>AED {t.amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{t.date}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employees' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">{translate('Employees','الموظفين')}</h2>
                <div className="flex gap-2">
                  {can('manage_users') && <button onClick={() => setShowAddEmployee(true)} className="px-3 py-1 bg-green-600 text-white rounded">{translate('Add','إضافة')}</button>}
                  <button onClick={()=>exportCSV(users,'employees.csv')} className="px-3 py-1 border rounded">Export</button>
                </div>
              </div>

              <table className="w-full bg-white rounded shadow text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="p-2">ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.role}</td>
                      <td>{u.email}</td>
                      <td>
                        <div className="flex gap-2">
                          {can('manage_users') && <button className="px-2 py-1 border rounded text-xs">Edit</button>}
                          <button className="px-2 py-1 border rounded text-xs">Profile</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">{translate('Projects & Clients','المشاريع والعملاء')}</h2>
                <div className="flex gap-2">
                  {can('edit_projects') && <button onClick={() => setShowAddProject(true)} className="px-3 py-1 bg-blue-600 text-white rounded">{translate('New Project','مشروع جديد')}</button>}
                  <button onClick={()=>exportCSV(projects,'projects.csv')} className="px-3 py-1 border rounded">Export</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.client} • {p.engineer}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{p.status}</div>
                        <div className="text-sm font-medium">AED {p.budget.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600">
                      <div>{translate('Start','بداية')}: {p.start}</div>
                      <div>{translate('End','نهاية')}: {p.end}</div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button className="px-2 py-1 border rounded text-sm">{translate('Details','تفاصيل')}</button>
                      {can('edit_projects') && <button className="px-2 py-1 border rounded text-sm">{translate('Edit','تعديل')}</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">{translate('Finance','المالية')}</h2>
                <div className="flex gap-2">
                  {can('finance') && <button onClick={() => setShowAddTransaction(true)} className="px-3 py-1 bg-green-600 text-white rounded">{translate('Add Transaction','إضافة حركة')}</button>}
                  <button onClick={()=>exportCSV(transactions,'transactions.csv')} className="px-3 py-1 border rounded">Export</button>
                </div>
              </div>

              <table className="w-full bg-white rounded shadow text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="p-2">ID</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Project</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{t.id}</td>
                      <td>{t.type}</td>
                      <td>{t.category}</td>
                      <td>AED {t.amount.toLocaleString()}</td>
                      <td>{t.date}</td>
                      <td>{projects.find(p => p.id === t.projectId)?.name ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="bg-white p-4 rounded shadow text-sm">
              <h3 className="font-semibold mb-3">{translate('Inventory (Simple)','المخزون (بسيط)')}</h3>
              <p className="text-xs text-gray-500">{translate('Add inventory tracking later. For MVP we keep a simple material log inside Projects or Transactions.','نضيف تتبع المخزون لاحقًا. للنسخة المبدئية نستخدم سجل مواد في المشاريع أو الحركات.')}</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showLogin && (
        <Modal onClose={()=>setShowLogin(false)} title={translate('Switch User','تبديل المستخدم')}>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">{translate('Choose a simulated user to act as for testing.','اختر مستخدم للتجربة.')}</div>
            {users.map(u=> (
              <button key={u.id} onClick={()=>{setCurrentUser(u); setShowLogin(false);}} className="w-full text-left p-2 border rounded">{u.name} — {u.role}</button>
            ))}
            <div className="pt-2 text-xs text-gray-500">{translate('This is a demo switcher for the mock. In production you will have real auth.','هذا مجرد تبديل تجريبي. في النسخة الحقيقية سيكون هناك تسجيل دخول.')}</div>
          </div>
        </Modal>
      )}

      {showAddEmployee && (
        <Modal onClose={()=>setShowAddEmployee(false)} title={translate('Add Employee','إضافة موظف')}>
          <AddEmployeeForm onAdd={addEmployee} onCancel={()=>setShowAddEmployee(false)} />
        </Modal>
      )}

      {showAddProject && (
        <Modal onClose={()=>setShowAddProject(false)} title={translate('Add Project','إضافة مشروع')}>
          <AddProjectForm onAdd={addProject} users={users} onCancel={()=>setShowAddProject(false)} />
        </Modal>
      )}

      {showAddTransaction && (
        <Modal onClose={()=>setShowAddTransaction(false)} title={translate('Add Transaction','إضافة حركة')}>
          <AddTransactionForm onAdd={addTransaction} projects={projects} onCancel={()=>setShowAddTransaction(false)} />
        </Modal>
      )}

    </div>
  );
}

// ---------- UI subcomponents ----------
function Card({ title, value }){
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-2 font-semibold text-xl">{value}</div>
    </div>
  );
}

function Modal({ children, onClose, title }){
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded w-full max-w-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="px-2 py-1 border rounded">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function AddEmployeeForm({ onAdd, onCancel }){
  const [name, setName] = useState('');
  const [role, setRole] = useState('Worker');
  const [email, setEmail] = useState('');
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onAdd({name,role,email});}} className="space-y-3">
      <div>
        <label className="block text-xs">Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-xs">Role</label>
        <select value={role} onChange={e=>setRole(e.target.value)} className="w-full border p-2 rounded">
          <option>Admin</option>
          <option>Accountant</option>
          <option>Engineer</option>
          <option>Worker</option>
        </select>
      </div>
      <div>
        <label className="block text-xs">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
        <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
      </div>
    </form>
  );
}

function AddProjectForm({ onAdd, users, onCancel }){
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [status, setStatus] = useState('Planned');
  const [budget, setBudget] = useState(0);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [engineer, setEngineer] = useState(users.find(u=>u.role==='Engineer')?.name || '');

  return (
    <form onSubmit={(e)=>{e.preventDefault(); onAdd({name,client,status,budget:Number(budget),start,end,engineer});}} className="space-y-3">
      <div>
        <label className="block text-xs">Project Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div>
        <label className="block text-xs">Client</label>
        <input value={client} onChange={e=>setClient(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs">Start</label>
          <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-xs">End</label>
          <input type="date" value={end} onChange={e=>setEnd(e.target.value)} className="w-full border p-2 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs">Budget (AED)</label>
          <input type="number" value={budget} onChange={e=>setBudget(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-xs">Engineer</label>
          <select value={engineer} onChange={e=>setEngineer(e.target.value)} className="w-full border p-2 rounded">
            {users.map(u=> <option key={u.id} value={u.name}>{u.name} — {u.role}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Create</button>
      </div>
    </form>
  );
}

function AddTransactionForm({ onAdd, projects, onCancel }){
  const [type, setType] = useState('Expense');
  const [category, setCategory] = useState('Materials');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || null);

  return (
    <form onSubmit={(e)=>{e.preventDefault(); onAdd({type,category,amount:Number(amount),date,note,projectId});}} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs">Type</label>
          <select value={type} onChange={e=>setType(e.target.value)} className="w-full border p-2 rounded">
            <option>Expense</option>
            <option>Income</option>
          </select>
        </div>
        <div>
          <label className="block text-xs">Category</label>
          <input value={category} onChange={e=>setCategory(e.target.value)} className="w-full border p-2 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs">Amount (AED)</label>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-xs">Date</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full border p-2 rounded" />
        </div>
      </div>
      <div>
        <label className="block text-xs">Project (optional)</label>
        <select value={projectId} onChange={e=>setProjectId(Number(e.target.value))} className="w-full border p-2 rounded">
          <option value="">-- none --</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs">Note</label>
        <input value={note} onChange={e=>setNote(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
        <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Add</button>
      </div>
    </form>
  );
}

/*
End of file.

Next steps I can do for you if you want:
- Connect these UI components to a real backend (Node/Express + PostgreSQL or Firebase).
- Add authentication (JWT) + password reset + user management.
- Add attendance (QR or fingerprint) and mobile-friendly forms for workers.
- Create printable invoices and contracts (PDF generation).

قول أي حاجة عايز أعملها بعد كدا وابدأ أطبقها.
*/
