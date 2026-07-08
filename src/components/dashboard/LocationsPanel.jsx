// src/components/dashboard/LocationsPanel.jsx
import { useState } from "react";
import { IconMapPin } from "@tabler/icons-react";
import EmptyState from "../ui/EmptyState";

export default function LocationsPanel() {
  const [name, setName] = useState("");
  const [locations, setLocations] = useState([
    "Engr. Lecture Hall 1", "Engr. Lecture Hall 2", "CPE Lab A",
  ]);

  const addLocation = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLocations([...locations, name.trim()]);
    setName("");
  };

  return (
    <div className="max-w-lg rounded-3xl border border-gray-100 p-8 space-y-5">
      <h2 className="text-lg font-medium">Lecture locations</h2>
      <form onSubmit={addLocation} className="flex gap-3">
        <input
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm"
          placeholder="e.g. New Science Complex 101"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-black text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-gray-800 transition">
          Add
        </button>
      </form>
      {locations.length === 0 ? (
        <EmptyState icon={IconMapPin} label="No locations added yet" />
      ) : (
        <ul className="space-y-2">
          {locations.map((loc, i) => (
            <li key={i} className="flex items-center gap-2 text-sm border border-gray-100 rounded-xl px-4 py-3">
              <IconMapPin size={14} className="text-gray-300" />
              {loc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}