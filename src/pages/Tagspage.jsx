import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function TagsPage({ token, setToken }) {
  const [tags, setTags] = useState([]);
  const [naam, setNaam] = useState("");
  const [kleur, setKleur] = useState("#3b82f6");
  const [bewerkId, setBewerkId] = useState(null);
  const [bewerkNaam, setBewerkNaam] = useState("");
  const [bewerkKleur, setBewerkKleur] = useState("#3b82f6");

  const api = "http://localhost:5235/api";
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { laadData(); }, []);

  async function laadData() {
    try {
      const res = await axios.get(`${api}/Tag`, { headers });
      setTags(res.data);
    } catch (e) { console.error(e); }
  }

  async function voegToe(e) {
    e.preventDefault();
    try {
      await axios.post(`${api}/Tag`, { naam, kleur }, { headers });
      setNaam(""); setKleur("#3b82f6");
      laadData();
    } catch (e) { console.error(e); }
  }

  async function verwijder(id) {
    try {
      await axios.delete(`${api}/Tag/${id}`, { headers });
      laadData();
    } catch (e) { console.error(e); }
  }

  function startBewerk(tag) {
    setBewerkId(tag.id);
    setBewerkNaam(tag.naam);
    setBewerkKleur(tag.kleur);
  }

  async function slaBewerk(id) {
    try {
      await axios.put(`${api}/Tag/${id}`, { naam: bewerkNaam, kleur: bewerkKleur }, { headers });
      setBewerkId(null);
      laadData();
    } catch (e) { console.error(e); }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8", fontFamily: "Arial" }}>
      <Sidebar setToken={setToken} />
      <main style={{ flex: 1, padding: "40px", marginLeft: "240px" }}>
        <h1 style={{ margin: "0 0 6px 0" }}>Tags</h1>
        <p style={{ color: "gray", marginBottom: "30px" }}>Beheer je tags en kleuren</p>

        <div style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h2 style={{ margin: "0 0 16px 0" }}>Nieuwe tag</h2>
          <form onSubmit={voegToe} style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <input type="text" placeholder="Naam" value={naam} onChange={e => setNaam(e.target.value)} style={inputStyle} required />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "14px", color: "gray" }}>Kleur:</label>
              <input type="color" value={kleur} onChange={e => setKleur(e.target.value)} style={{ width: "44px", height: "38px", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer", padding: "2px" }} />
            </div>
            <button type="submit" style={buttonStyle}>+ Nieuwe tag</button>
          </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {tags.length === 0 && <p style={{ color: "gray" }}>Nog geen tags.</p>}
          {tags.map((t) => (
            <div key={t.id} style={{ background: "white", padding: "20px 25px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {bewerkId === t.id ? (
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1, flexWrap: "wrap" }}>
                  <input type="text" value={bewerkNaam} onChange={e => setBewerkNaam(e.target.value)} style={inputStyle} />
                  <input type="color" value={bewerkKleur} onChange={e => setBewerkKleur(e.target.value)} style={{ width: "44px", height: "38px", borderRadius: "8px", border: "1px solid #ddd", cursor: "pointer", padding: "2px" }} />
                  <button onClick={() => slaBewerk(t.id)} style={buttonStyle}>Opslaan</button>
                  <button onClick={() => setBewerkId(null)} style={{ ...buttonStyle, background: "#6b7280" }}>Annuleren</button>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: t.kleur }} />
                    <span style={{ fontWeight: "500", fontSize: "16px" }}>{t.naam}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => startBewerk(t)} style={iconBtn}>✏️</button>
                    <button onClick={() => verwijder(t.id)} style={{ ...iconBtn, color: "#ef4444" }}>🗑️</button>
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

export default TagsPage;