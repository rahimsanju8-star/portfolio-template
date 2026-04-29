"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: number;
  name: string;
  phone: string;
  course: string;
  message?: string;
  created_at: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  async function loadLeads() {
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Login/parol noto‘g‘ri yoki server ishlamayapti.");
      const data = await res.json();
      setLeads(data);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (token) loadLeads();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-3xl bg-white/10 p-6">
          <h1 className="text-3xl font-black">Admin panel</h1>
          <p className="mt-2 text-slate-300">Demo token: <b>demo-admin-token</b></p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none"
              placeholder="Admin token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button onClick={loadLeads} className="rounded-2xl bg-emerald-500 px-6 py-3 font-bold text-slate-950">
              Arizalarni ko‘rish
            </button>
          </div>
          {error && <p className="mt-3 text-red-300">{error}</p>}
        </div>

        <div className="grid gap-4">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-3xl border border-white/10 bg-white/10 p-5">
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <h2 className="text-xl font-bold">{lead.name}</h2>
                <span className="text-sm text-slate-300">{new Date(lead.created_at).toLocaleString()}</span>
              </div>
              <p className="mt-2">Telefon: <b>{lead.phone}</b></p>
              <p>Kurs: <b>{lead.course}</b></p>
              {lead.message && <p className="mt-2 text-slate-300">{lead.message}</p>}
            </div>
          ))}

          {leads.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center text-slate-300">
              Hali arizalar yo‘q yoki token kiritilmagan.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
