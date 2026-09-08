import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function StudiesessiesPage({ token, setToken }) {
  const [sessies, setSessies] = useState([]);
  const [doelen, setDoelen] = useState([]);
  const [tags, setTags] = useState([]);
  const [duur, setDuur] = useState("");
  const [tagId, setTagId] = useState("");
  const [doelId, setDoelId] = useState("");
  const [bewerkId, setBewerkId] = useState(null);
  const [bewerkDuur, setBewerkDuur] = useState("");
  const [bewerkTagId, setBewerkTagId] = useState("");
  const [bewerkDoelId, setBewerkDoelId] = useState("");

  const api = "http://localhost:5235/api";
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { laadData(); }, []);

  async function laadData() {
    try {
      const res = await axios.get(`${api}/Studiesessie`, { headers });
      setSessies(res.data);
    } catch (e) { console.error(e); }
    try {
      const res = await axios.get(`${api}/StudieDoel`, { headers });
      setDoelen(res.data);
    } catch (e) { console.error(e); }
    try {
      const res = await axios.get(`${api}/Tag`, { headers });
      setTags(res.data);
    } catch (e) { console.error(e); }
  }

  async function voegToe(e) {
    e.preventDefault();
    try {
      await axios.post(`${api}/Studiesessie`, {
        starttijd: new Date(),
        eindtijd: null,
        duur: parseInt(duur),
        gebruikerId: 1,
        tagId: tagId ? parseInt(tagId) : null,
        studieDoelId: doelId ? parseInt(doelId) : null
      }, { headers });
      setDuur(""); setTagId(""); setDoelId("");
      laadData();
    } catch (e) { console.error(e); }
  }

  async function verwijder(id) {
    try {
      await axios.delete(`${api}/Studiesessie/${id}`, { headers });
      laadData();
    } catch (e) { console.error(e); }
  }

  function startBewerk(sessie) {
    setBewerkId(sessie.id);
    setBewerkDuur(sessie.duur);
    setBewerkTagId(sessie.tagId || "");
    setBewerkDoelId(sessie.studieDoelId || "");
  }

  async function slaBewerk(id) {
    try {
      await axios.put(`${api}/Studiesessie/${id}`, {
        starttijd: new Date(),
        eindtijd: null,
        duur: parseInt(bewerkDuur),
        tagId: bewerkTagId ? parseInt(bewerkTagId) : null,
        studieDoelId: bewerkDoelId ? parseInt(bewerkDoelId) : null
      }, { headers });
      setBewerkId(null);
      laadData();
    } catch (e) { console.error(e); }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8", fontFamily: "Arial" }}>
      <Sidebar setToken={setToken} />
      <main style={{ flex: 1, padding: "40px", marginLeft: "240px" }}>
        <h1 style={{ margin: "0 0 6px 0" }}>Studiesessies</h1>
        <p style={{ color: "gray", marginBottom: "30px" }}>Bekijk en beheer je studiesessies</p>

        <div style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h2 style={{ margin: "0 0 16px 0" }}>Nieuwe studiesessie</h2>
          <form onSubmit={voegToe} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input type="number" placeholder="Duur in minuten" value={duur} onChange={e => setDuur(e.target.value)} style={inputStyle} required />
            <select value={tagId} onChange={e => setTagId(e.target.value)} style={inputStyle}>
              <option value="">Geen tag</option>
              {tags.map(t => <option key={t.id} value={t.id}>{t.naam}</option>)}
            </select>
            <select value={doelId} onChange={e => setDoelId(e.target.value)} style={inputStyle}>
              <option value="">Geen doel</option>
              {doelen.map(d => <option key={d.id} value={d.id}>{d.titel}</option>)}
            </select>
            <button type="submit" style={buttonStyle}>+ Nieuwe sessie</button>
          </form>
        </div>

        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {sessies.length === 0 && <p style={{ padding: "25px", color: "gray" }}>Nog geen sessies.</p>}
          {[...sessies].reverse().map((s) => (
            <div key={s.id} style={{ padding: "16px 25px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {bewerkId === s.id ? (
                <div style={{ display: "flex", gap: "10px", flex: 1, flexWrap: "wrap" }}>
                  <input type="number" value={bewerkDuur} onChange={e => setBewerkDuur(e.target.value)} style={{ ...inputStyle, width: "120px" }} />
                  <select value={bewerkTagId} onChange={e => setBewerkTagId(e.target.value)} style={inputStyle}>
                    <option value="">Geen tag</option>
                    {tags.map(t => <option key={t.id} value={t.id}>{t.naam}</option>)}
                  </select>
                  <select value={bewerkDoelId} onChange={e => setBewerkDoelId(e.target.value)} style={inputStyle}>
                    <option value="">Geen doel</option>
                    {doelen.map(d => <option key={d.id} value={d.id}>{d.titel}</option>)}
                  </select>
                  <button onClick={() => slaBewerk(s.id)} style={buttonStyle}>Opslaan</button>
                  <button onClick={() => setBewerkId(null)} style={{ ...buttonStyle, background: "#6b7280" }}>Annuleren</button>
                </div>
              ) : (
                <>
                  <div>
                    <strong>{s.duur} min</strong>
                    <p style={{ margin: 0, color: "gray", fontSize: "13px" }}>{new Date(s.starttijd).toLocaleString()}</p>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {s.tag && <span style={{ background: s.tag.kleur || "#e5e7eb", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>{s.tag.naam}</span>}
                    <button onClick={() => startBewerk(s)} style={iconBtn}>✏️</button>
                    <button onClick={() => verwijder(s.id)} style={{ ...iconBtn, color: "#ef4444" }}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const inputStyle = { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" };
const buttonStyle = { padding: "10px 20px", border: "none", background: "#2563eb", color: "white", borderRadius: "8px", cursor: "pointer", fontSize: "14px" };
const iconBtn = { background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "4px 8px" };

export default StudiesessiesPage;