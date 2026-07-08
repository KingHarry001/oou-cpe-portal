// src/components/ui/EmptyState.jsx
// The muted icon + label placeholder shown when a list has no items.

export default function EmptyState({ icon: Icon, label, iconSize = 28, className = "py-10" }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <Icon size={iconSize} className="text-gray-200 mb-3" strokeWidth={1.5} />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
