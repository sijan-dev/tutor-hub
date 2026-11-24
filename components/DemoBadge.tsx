import React from 'react';

interface DemoBadgeProps {
  label?: string;
  className?: string;
}

/**
 * Marks mock profiles, reviews, metrics, and checkout screens as sample data.
 * PRODUCT.md principle 5: demo data never masquerades as proof.
 */
const DemoBadge: React.FC<DemoBadgeProps> = ({ label = 'Demo data', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 border border-line px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-muted ${className}`}
  >
    <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
    {label}
  </span>
);

export default DemoBadge;
