import React from 'react';
import { Home, Target, Users, BookOpen, BarChart2, Settings, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  { to: '/', label: 'الرئيسية', icon: <Home size={20} /> },
  { to: '/timeline', label: 'الخط الزمني', icon: <Target size={20} /> },
  { to: '/community', label: 'المجتمعات', icon: <Users size={20} /> },
  { to: '/courses', label: 'الدورات', icon: <BookOpen size={20} /> },
  { to: '/reports', label: 'التقارير', icon: <BarChart2 size={20} /> },
];

const Sidebar: React.FC<{ onToggleTheme?: () => void, darkMode?: boolean }> = ({ onToggleTheme, darkMode }) => {
  const location = useLocation();
  return (
    <aside className="fixed top-0 right-0 h-full w-64 bg-sidebar-background shadow-xl flex flex-col z-40">
      <div className="flex items-center gap-2 px-6 py-8 border-b border-sidebar-border">
        <span className="font-bold text-xl text-sidebar-foreground tracking-tight">Groth</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground transition-all hover:bg-sidebar-accent/30 ${location.pathname === item.to ? 'bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 flex items-center justify-between border-t border-sidebar-border">
        <button
          onClick={onToggleTheme}
          className="rounded-full p-2 bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground transition"
          aria-label="تبديل الوضع الليلي"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Link to="/settings" className="text-sidebar-foreground hover:text-sidebar-accent-foreground">
          <Settings size={20} />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
