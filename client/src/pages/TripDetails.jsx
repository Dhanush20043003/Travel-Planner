// client/src/pages/TripDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CHECK_CATEGORIES = ["Packing", "Documents", "Tasks"];

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", destination: "", description: "", imageUrl: "" });

  // checklist state
  const [newCheckText, setNewCheckText] = useState("");
  const [newCheckCategory, setNewCheckCategory] = useState(CHECK_CATEGORIES[0]);

  // expense state
  const [expenseForm, setExpenseForm] = useState({ category: "Transportation", name: "", amount: "", date: "" });

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line
  }, [id]);

  async function fetchTrip() {
    setLoading(true);
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
      setEditForm({
        title: res.data.title || "",
        destination: res.data.destination || "",
        description: res.data.description || "",
        imageUrl: res.data.imageUrl || ""
      });
    } catch (err) {
      console.error("fetchTrip", err);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  // generic save helper (sends only changed fields)
  async function saveTrip(partial) {
    try {
      const res = await api.put(`/trips/${id}`, partial);
      setTrip(res.data);
    } catch (err) {
      console.error("saveTrip error", err);
      alert("Save failed");
    }
  }

  // Edit modal actions
  function openEdit() {
    setEditOpen(true);
  }
  async function saveEdit() {
    const payload = {
      title: editForm.title,
      destination: editForm.destination,
      description: editForm.description,
      imageUrl: editForm.imageUrl
    };
    await saveTrip(payload);
    setEditOpen(false);
  }

  // Checklist actions (we store checklist as array of {category,text,done})
  function addChecklist() {
    const text = newCheckText.trim();
    if (!text) return;
    const list = [...(trip.checklist || []), { category: newCheckCategory, text, done: false }];
    saveTrip({ checklist: list });
    setNewCheckText("");
  }

  function toggleChecklist(index) {
    const list = (trip.checklist || []).map((it, i) => i === index ? { ...it, done: !it.done } : it);
    saveTrip({ checklist: list });
  }

  function deleteChecklist(index) {
    const list = (trip.checklist || []).filter((_, i) => i !== index);
    saveTrip({ checklist: list });
  }

  // Expense actions
  function addExpense() {
    const amount = parseFloat(expenseForm.amount || 0);
    if (!expenseForm.name.trim() || !expenseForm.category || !amount) return alert("Enter valid expense name and amount");
    const ex = {
      category: expenseForm.category,
      name: expenseForm.name.trim(),
      amount,
      description: expenseForm.description || "",
      date: expenseForm.date || new Date().toISOString().slice(0,10)
    };
    const list = [...(trip.expenses || []), ex];
    saveTrip({ expenses: list });
    setExpenseForm({ category: "Transportation", name: "", amount: "", description: "", date: "" });
  }

  function deleteExpense(index) {
    const list = (trip.expenses || []).filter((_, i) => i !== index);
    saveTrip({ expenses: list });
  }

  async function deleteTrip() {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await api.delete(`/trips/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("deleteTrip", err);
      alert("Failed to delete");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!trip) return <div className="p-6">Trip not found</div>;

  // derived values
  const totalExpenses = (trip.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0);
  const budget = Number(trip.budget || 0);
  const percentUsed = budget ? Math.round((totalExpenses / budget) * 100) : 0;
  const percentSafe = Math.max(0, Math.min(100, percentUsed));

  // checklist grouped
  const grouped = CHECK_CATEGORIES.reduce((acc, c) => { acc[c] = (trip.checklist || []).filter(i => i.category === c); return acc; }, {});

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* banner */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-start gap-6">
          <div>
            <h1 className="text-2xl font-bold">{trip.title}</h1>
            <div className="text-sm text-gray-600">{trip.destination}</div>
            <div className="text-sm text-gray-500 mt-1">{trip.startDate && trip.endDate ? `${new Date(trip.startDate).toLocaleDateString()} → ${new Date(trip.endDate).toLocaleDateString()}` : "Dates not set"}</div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={openEdit} className="px-3 py-2 bg-indigo-600 text-white rounded">Edit</button>
            <button onClick={deleteTrip} className="px-3 py-2 bg-red-500 text-white rounded">Delete</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex gap-3">
          {["Overview","Checklist","Budget"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-full ${activeTab===t ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6">
          {activeTab === "Overview" && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-2">Overview</h2>
              <p className="text-gray-700 mb-3">{trip.description || "No description"}</p>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-semibold">{trip.startDate && trip.endDate ? `${Math.max(0, Math.round((new Date(trip.endDate)-new Date(trip.startDate))/(1000*60*60*24))) } days` : "—"}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Travelers</div>
                  <div className="font-semibold">{trip.travelers || 1}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Budget</div>
                  <div className="font-semibold">${budget || 0}</div>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Tasks Done</div>
                  <div className="font-semibold">{(trip.checklist||[]).filter(i=>i.done).length}/{(trip.checklist||[]).length}</div>
                </div>
              </div>

              {/* budget progress */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <div>Budget used</div>
                  <div className="font-medium">${totalExpenses} / ${budget || 0}</div>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div
                    className={percentSafe > 80 ? "h-3 bg-red-500" : percentSafe > 50 ? "h-3 bg-yellow-500" : "h-3 bg-green-500"}
                    style={{ width: `${percentSafe}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">{percentSafe}% used</div>
              </div>
            </div>
          )}

          {activeTab === "Checklist" && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Checklist</h2>

              <div className="mb-4 flex gap-3">
                <input value={newCheckText} onChange={(e)=>setNewCheckText(e.target.value)} className="flex-1 border px-3 py-2 rounded" placeholder="New checklist item"/>
                <select value={newCheckCategory} onChange={(e)=>setNewCheckCategory(e.target.value)} className="border px-3 py-2 rounded">
                  {CHECK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={addChecklist} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {CHECK_CATEGORIES.map(cat => {
                  const list = (trip.checklist||[]).filter(i=>i.category===cat);
                  return (
                    <div key={cat} className="p-4 bg-gray-50 rounded">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold">{cat}</h4>
                          <div className="text-sm text-gray-500">{list.filter(i=>i.done).length}/{list.length} done</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {list.length === 0 && <div className="text-gray-500">No items</div>}
                        {list.map((it, idx) => {
                          // find index in original array to operate
                          const globalIndex = (trip.checklist||[]).findIndex(x => x === it);
                          return (
                            <div key={idx} className="flex items-center justify-between bg-white p-2 rounded">
                              <label className="flex items-center gap-3">
                                <input type="checkbox" checked={it.done} onChange={()=>toggleChecklist(globalIndex)} />
                                <span className={it.done ? "line-through text-gray-500" : ""}>{it.text}</span>
                              </label>
                              <button onClick={()=>deleteChecklist(globalIndex)} className="text-red-500">x</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "Budget" && (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-lg font-semibold mb-4">Budget & Expenses</h2>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-2">Add Expense</div>
                  <div className="grid gap-2">
                    <select className="border px-3 py-2 rounded" value={expenseForm.category} onChange={(e)=>setExpenseForm({...expenseForm, category: e.target.value})}>
                      <option>Transportation</option>
                      <option>Food</option>
                      <option>Accommodation</option>
                      <option>Misc</option>
                    </select>
                    <input className="border px-3 py-2 rounded" placeholder="Name" value={expenseForm.name} onChange={(e)=>setExpenseForm({...expenseForm, name: e.target.value})} />
                    <input className="border px-3 py-2 rounded" placeholder="Amount" value={expenseForm.amount} onChange={(e)=>setExpenseForm({...expenseForm, amount: e.target.value})} type="number" />
                    <input className="border px-3 py-2 rounded" placeholder="Date" value={expenseForm.date} onChange={(e)=>setExpenseForm({...expenseForm, date: e.target.value})} type="date" />
                    <div className="flex gap-2">
                      <button onClick={addExpense} className="px-4 py-2 bg-green-600 text-white rounded">Add Expense</button>
                      <button onClick={()=>setExpenseForm({category:"Transportation",name:"",amount:"",date:""})} className="px-4 py-2 bg-gray-200 rounded">Clear</button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-2">Summary</div>
                  <div className="p-4 bg-gray-50 rounded">
                    <div className="flex justify-between"><div>Total spent</div><div className="font-semibold">${totalExpenses}</div></div>
                    <div className="flex justify-between mt-2"><div>Budget</div><div className="font-semibold">${budget || 0}</div></div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-500">Breakdown</div>
                      {(trip.expenses || []).length === 0 && <div className="text-gray-500 mt-2">No expenses</div>}
                      {(trip.expenses || []).length > 0 && (
                        <div className="mt-2 space-y-2">
                          {["Transportation","Food","Accommodation","Misc"].map(cat => {
                            const sum = (trip.expenses||[]).filter(e=>e.category===cat).reduce((s,e)=>s+Number(e.amount||0),0);
                            return (
                              <div key={cat} className="flex justify-between items-center">
                                <div className="text-sm">{cat}</div>
                                <div className="text-sm font-medium">${sum}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">All Expenses</h4>
                <div className="space-y-2">
                  {(trip.expenses || []).length === 0 && <div className="text-gray-500">No expenses yet</div>}
                  {(trip.expenses || []).map((ex, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div>
                        <div className="font-medium">{ex.name}</div>
                        <div className="text-sm text-gray-500">{ex.category} • {ex.date || ""} {ex.description ? `• ${ex.description}` : ""}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-semibold">${ex.amount}</div>
                        <button onClick={()=>deleteExpense(idx)} className="text-red-500">x</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow w-full max-w-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Trip</h3>
            <div className="grid gap-3">
              <input className="border px-3 py-2 rounded" value={editForm.title} onChange={(e)=>setEditForm({...editForm, title: e.target.value})} />
              <input className="border px-3 py-2 rounded" value={editForm.destination} onChange={(e)=>setEditForm({...editForm, destination: e.target.value})} />
              <input className="border px-3 py-2 rounded" value={editForm.imageUrl} onChange={(e)=>setEditForm({...editForm, imageUrl: e.target.value})} placeholder="Image URL" />
              <textarea className="border px-3 py-2 rounded" rows={4} value={editForm.description} onChange={(e)=>setEditForm({...editForm, description: e.target.value})} />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={()=>setEditOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={saveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
