import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Settings, User, Home, Target, BarChart2, BookOpen, Users, CheckSquare, Menu, X, Download } from 'lucide-react';
import NotificationBell from '@/components/notifications/NotificationBell';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${darkMode ? 'dark' : ''}`}>
      {/* Top Navigation Bar */}
      <header className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Masari</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-6">
                <NavLink to="/" icon={<Home className="w-4 h-4" />} label="الرئيسية" />
                <NavLink to="/tasks" icon={<CheckSquare className="w-4 h-4" />} label="المهام" />
                <NavLink to="/habits" icon={<Target className="w-4 h-4" />} label="العادات" />
                <NavLink to="/timeline" icon={<Target className="w-4 h-4" />} label="الأهداف" />
                <NavLink to="/reports" icon={<BarChart2 className="w-4 h-4" />} label="التقارير" />
                <NavLink to="/courses" icon={<BookOpen className="w-4 h-4" />} label="الدورات" />
                <NavLink to="/community" icon={<Users className="w-4 h-4" />} label="المجتمع" />
              </nav>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Trigger PWA install
                    const event = new CustomEvent('show-pwa-install');
                    window.dispatchEvent(event);
                  }}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  title="تثبيت التطبيق"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden lg:inline">تثبيت التطبيق</span>
                </button>
                <NotificationBell />
                <button
                  onClick={handleToggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="تبديل الوضع الليلي"
                >
                  {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>
                <Link to="/settings" className="hidden sm:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Link>
                <Link to="/profile" className="hidden sm:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Link>
                
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="قائمة التنقل"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <nav className="px-4 py-4 space-y-2">
              <MobileNavLink to="/" icon={<Home className="w-5 h-5" />} label="الرئيسية" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/tasks" icon={<CheckSquare className="w-5 h-5" />} label="المهام" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/timeline" icon={<Target className="w-5 h-5" />} label="الأهداف" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/reports" icon={<BarChart2 className="w-5 h-5" />} label="التقارير" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/courses" icon={<BookOpen className="w-5 h-5" />} label="الدورات" onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/community" icon={<Users className="w-5 h-5" />} label="المجتمع" onClick={() => setMobileMenuOpen(false)} />
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <MobileNavLink to="/settings" icon={<Settings className="w-5 h-5" />} label="الإعدادات" onClick={() => setMobileMenuOpen(false)} />
                <MobileNavLink to="/profile" icon={<User className="w-5 h-5" />} label="الملف الشخصي" onClick={() => setMobileMenuOpen(false)} />
              </div>
            </nav>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
};

// Navigation Link Component
const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; onClick: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
        isActive 
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default MainLayout;
