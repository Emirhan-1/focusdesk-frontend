import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function StudiedoelenPage({ token, setToken }) {
  const [doelen, setDoelen] = useState([]);
  const [titel, setTitel] = useState("");
  const [doelUren, setDoelUren] = useState("");
  const [bewerkId, setBewerkId] = useState(null);
  const [bewerkTitel, setBewerkTitel] = useState("");
  const [bewerkUren, setBewerkUren] = useState("");

  const api = "http://localhost:5235/api";
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { laadData(); }, []);

  async function laadData() {
    try {
      const res = await axios.get(`${api}/StudieDoel`, { headers });
      setDoelen(res.data);
    } catch (e) { console.error(e); }
  }

  async function voegToe(e) {
    e.preventDefault();
    try {
      await axios.post(`${api}/StudieDoel`, {
        titel, doelUren: parseInt(doelUren), gebruikerId: 1
      }, { headers });
      setTitel(""); setDoelUren("");
      laadData();
    } catch (e) { console.error(e); }
  }

  async function verwijder(id) {
    try {
      await axios.delete(`${api}/StudieDoel/${id}`, { headers });
      laadData();
    } catch (e) { console.error(e); }
  }

  function startBewerk(doel) {
    setBewerkId(doel.id);
    setBewerkTitel(doel.titel);
    setBewerkUren(doel.doelUren);
  }

  async function slaBewerk(id) {
    try {
      await axios.put(`${api}/StudieDoel/${id}`, {
        titel: bewerkTitel, doelUren: parseInt(bewerkUren)
      }, { headers });
      setBewerkId(null);
      laadData();
    } catch (e) { console.error(e); }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8", fontFamily: "Arial" }}>
      <Sidebar setToken={setToken} />
      <main style={{ flex: 1, padding: "40px", marginLeft: "240px" }}>
        <h1 style={{ margin: "0 0 6px 0" }}>Studiedoelen</h1>
        <p style={{ color: "gray", marginBottom: "30px" }}>Beheer je studiedoelen en volg je voortgang</p>

        <div style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h2 style={{ margin: "0 0 16px 0" }}>Nieuw studiedoel</h2>
          <form onSubmit={voegToe} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input type="text" placeholder="Titel" value={titel} onChange={e => setTitel(e.target.value)} style={inputStyle} required />
            <input type="number" placeholder="Aantal uren" value={doelUren} onChange={e => setDoelUren(e.target.value)} style={inputStyle} required />
            <button type="submit" style={buttonStyle}>+ Nieuw doel</button>
          </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {doelen.length === 0 && <p style={{ color: "gray" }}>Nog geen doelen.</p>}
          {doelen.map((d) => (
            <div key={d.id} style={{ background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              {bewerkId === d.id ? (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                  <input type="text" value={bewerkTitel} onChange={e => setBewerkTitel(e.target.value)} style={inputStyle} />
                  <input type="number" value={bewerkUren} onChange={e => setBewerkUren(e.target.value)} style={inputStyle} />
                  <button onClick={() => slaBewerk(d.id)} style={buttonStyle}>Opslaan</button>
                  <button onClick={() => setBewerkId(null)} style={{ ...buttonStyle, background: "#6b7280" }}>Annuleren</button>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <strong style={{ fontSize: "17px" }}>{d.titel}</strong>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ color: "#2563eb", fontWeight: "bold", fontSize: "17px" }}>{d.voortgangPercentage || 0}%</span>
                    <button onClick={() => startBewerk(d)} style={iconBtn}>✏️</button>
                    <button onClick={() => verwijder(d.id)} style={{ ...iconBtn, color: "#ef4444" }}>🗑️</button>
                  </div>
                </div>
              )}
              <div style={{ background: "#e5e7eb", height: "10px", borderRadius: "20px" }}>
                <div style={{ width: `${d.voortgangPercentage || 0}%`, background: "#2563eb", height: "100%", borderRadius: "20px", transition: "width 0.3s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", color: "gray", fontSize: "14px" }}>
                <span>Doel: {d.doelUren} uur</span>
                <span>Besteed: {d.bestedeUren} uur</span>
              </div>
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

export default StudiedoelenPage;