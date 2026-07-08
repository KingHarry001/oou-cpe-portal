// src/components/dashboard/TabNav.jsx
// The vertical list of tab buttons, shared by the desktop sidebar and the
// mobile drawer so the active-pill styling lives in one place.

export default function TabNav({ tabs, active, onSelect }) {
  return (
    <nav className="flex flex-col gap-1">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition text-left ${
            active === key ? "bg-brand-black text-white" : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          <Icon size={18} strokeWidth={1.75} />
          {label}
        </button>
      ))}
    </nav>
  );
}
