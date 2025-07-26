import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Bell, Globe } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="w-full h-16 bg-background/80 backdrop-blur shadow flex items-center justify-between px-8 fixed top-0 right-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg text-primary tracking-tight">Masari</Link>
      </div>
      <nav className="flex items-center gap-6">
        <button className="relative p-2 hover:bg-accent rounded-full transition">
          <Bell size={20} />
          {/* إشعار جديد */}
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-accent rounded-full transition">
          <Globe size={20} />
        </button>
        <Link to="/profile" className="flex items-center gap-2">
          <UserCircle size={24} className="text-primary" />
          <span className="font-medium text-foreground">حسابي</span>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
