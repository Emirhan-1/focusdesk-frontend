import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function DashboardPage({ token, setToken }) {
  const [studiesessies, setStudiesessies] = useState([]);
  const [doelen, setDoelen] = useState([]);

  const api = "http://localhost:5235/api";
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { laadData(); }, []);

  async function laadData() {
    try {
      const res = await axios.get(`${api}/Studiesessie`, { headers });
      setStudiesessies(res.data);
    } catch (e) { console.error(e); }

    try {
      const res = await axios.get(`${api}/StudieDoel`, { headers });
      setDoelen(res.data);
    } catch (e) { console.error(e); }
  }

  const totaleTijd = studiesessies.reduce((t, s) => t + s.duur, 0);
  const recenteSessies = [...studiesessies].reverse().slice(0, 4);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8", fontFamily: "Arial" }}>
      <Sidebar setToken={setToken} />
      <main style={{ flex: 1, padding: "40px", marginLeft: "240px" }}>
        <h1 style={{ margin: "0 0 6px 0" }}>Dashboard</h1>
        <p style={{ color: "gray", marginBottom: "30px" }}>Overzicht van je studieactiviteiten</p>

        <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
          <StatCard title="Totale studietijd" value={`${totaleTijd} min`} />
          <StatCard title="Studiesessies" value={studiesessies.length} sub="Deze week" />
          <StatCard title="Studiedoelen" value={doelen.length} sub="Actief" />
        </div>

        <div style={{ display: "flex", gap: "30px" }}>
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <h2 style={{ margin: 0 }}>Recente studiesessies</h2>
            </div>
            {recenteSessies.length === 0 && <p style={{ color: "gray" }}>Nog geen sessies.</p>}
            {recenteSessies.map((s) => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div>
                  <strong>{s.duur} min</strong>
                  <p style={{ margin: 0, color: "gray", fontSize: "13px" }}>{new Date(s.starttijd).toLocaleString()}</p>
                </div>
                {s.tag && <span style={{ background: s.tag.kleur || "#e5e7eb", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>{s.tag.naam}</span>}
              </div>
            ))}
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 16px 0" }}>Voortgang doelen</h2>
            {doelen.length === 0 && <p style={{ color: "gray" }}>Nog geen doelen.</p>}
            {doelen.map((d) => (
              <div key={d.id} style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "500" }}>{d.titel}</span>
                  <span style={{ color: "#2563eb", fontWeight: "bold" }}>{d.voortgangPercentage || 0}%</span>
                </div>
                <div style={{ background: "#e5e7eb", height: "8px", borderRadius: "20px", marginTop: "8px" }}>
                  <div style={{ width: `${d.voortgangPercentage || 0}%`, background: "#2563eb", height: "100%", borderRadius: "20px", transition: "width 0.3s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, sub }) {
  return (
    <div style={{ background: "white", padding: "25px", borderRadius: "12px", flex: 1, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <p style={{ margin: "0 0 8px 0", color: "gray", fontSize: "14px" }}>{title}</p>
      <h2 style={{ margin: "0 0 4px 0", fontSize: "32px" }}>{value}</h2>
      {sub && <p style={{ margin: 0, color: "gray", fontSize: "13px" }}>{sub}</p>}
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  flex: 1,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
};

export default DashboardPage;