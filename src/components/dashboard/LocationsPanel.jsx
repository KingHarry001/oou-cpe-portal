// src/components/dashboard/LocationsPanel.jsx
import { useEffect, useState } from "react";
import { IconMapPin } from "@tabler/icons-react";
import { supabase } from "../../lib/supabaseClient";
import EmptyState from "../ui/EmptyState";

export default function LocationsPanel() {
  const [name, setName] = useState("");
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("locations").select("*").order("name");
      setLocations(data || []);
    };
    load();
  }, []);

  const addLocation = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;

    const { data, error: insertError } = await supabase
      .from("locations")
      .insert({ name: name.trim() })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setLocations([...locations, data]);
    setName("");
  };

  return (
    <div className="max-w-lg rounded-3xl border border-gray-100 p-8 space-y-5">
      <h2 className="text-lg font-medium">Lecture locations</h2>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

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
          {locations.map((loc) => (
            <li key={loc.id} className="flex items-center gap-2 text-sm border border-gray-100 rounded-xl px-4 py-3">
              <IconMapPin size={14} className="text-gray-300" />
              {loc.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
