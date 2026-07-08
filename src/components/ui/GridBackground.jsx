// src/components/ui/GridBackground.jsx
// Faint grid decoration layered behind the dark hero/panels.

export default function GridBackground({ size = 48 }) {
  return (
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
