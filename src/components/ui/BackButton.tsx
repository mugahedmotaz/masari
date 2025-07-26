import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BackButtonProps {
  className?: string;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '', label = 'رجوع' }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="رجوع"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border text-primary shadow hover:bg-accent/30 transition-all text-base font-medium rtl:flex-row-reverse ${className}`}
      style={{ minWidth: 100 }}
    >
      <ArrowRight className="w-5 h-5 text-primary" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
