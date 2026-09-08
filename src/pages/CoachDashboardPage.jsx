import { useEffect, useState } from "react";
import axios from "axios";

function CoachDashboardPage({ token, setToken }) {
  const [studenten, setStudenten] = useState([]);
  const [geselecteerd, setGeselecteerd] = useState(null);

  const api = "http://localhost:5235/api";
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { laadStudenten(); }, []);

  async function laadStudenten() {
    try {
      const res = await axios.get(`${api}/Coach/studenten`, { headers });
      setStudenten(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  function logout() {
    setToken();
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f8", fontFamily: "Arial" }}>
      <aside style={{
        width: "240px",
        minHeight: "100vh",
        background: "#1f2937",
        color: "white",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "fixed",
        top: 0, left: 0, bottom: 0
      }}>
        <div>
          <h2 style={{ margin: "0 0 10px 0" }}>FocusDesk</h2>
          <p style={{ color: "#9ca3af", fontSize: "13px" }}>Coach-omgeving</p>
        </div>
        <button
          onClick={logout}
          style={{
            width: "100%", padding: "12px", border: "none",
            borderRadius: "8px", background: "#ef4444", color: "white", cursor: "pointer"
          }}
        >
          Uitloggen
        </button>
      </aside>

      <main style={{ flex: 1, padding: "40px", marginLeft: "240px" }}>
        <h1 style={{ margin: "0 0 6px 0" }}>Studentoverzicht</h1>
        <p style={{ color: "gray", marginBottom: "30px" }}>Bekijk de voortgang van je studenten</p>

        <div style={{ display: "flex", gap: "30px" }}>
          {/* Lijst studenten */}
          <div style={{ flex: 1, background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {studenten.length === 0 && <p style={{ padding: "25px", color: "gray" }}>Nog geen studenten gevonden.</p>}
            {studenten.map((s) => (
              <div
                key={s.gebruikerId}
                onClick={() => setGeselecteerd(s)}
                style={{
                  padding: "18px 25px",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  background: geselecteerd?.gebruikerId === s.gebruikerId ? "#eff6ff" : "white",
                  display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
              >
                <div>
                  <strong>{s.email}</strong>
                  <p style={{ margin: "4px 0 0 0", color: "gray", fontSize: "13px" }}>
                    {s.aantalSessies} sessies · {s.totaleStudietijd} min totaal
                  </p>
                </div>
                <span style={{ color: "#2563eb", fontSize: "13px" }}>{s.studiedoelen.length} doelen</span>
              </div>
            ))}
          </div>

          {/* Detail geselecteerde student */}
          <div style={{ flex: 1, background: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            {!geselecteerd && <p style={{ color: "gray" }}>Selecteer een student om de details te bekijken.</p>}
            {geselecteerd && (
              <>
                <h2 style={{ margin: "0 0 4px 0" }}>{geselecteerd.email}</h2>
                <p style={{ color: "gray", marginBottom: "20px" }}>
                  {geselecteerd.aantalSessies} sessies · {geselecteerd.totaleStudietijd} minuten totaal
                </p>

                <h3 style={{ margin: "0 0 12px 0" }}>Studiedoelen</h3>
                {geselecteerd.studiedoelen.length === 0 && <p style={{ color: "gray" }}>Geen studiedoelen.</p>}
                {geselecteerd.studiedoelen.map((d) => (
                  <div key={d.id} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: "500" }}>{d.titel}</span>
                      <span style={{ color: "#2563eb", fontWeight: "bold" }}>{d.voortgangPercentage}%</span>
                    </div>
                    <div style={{ background: "#e5e7eb", height: "8px", borderRadius: "20px", marginTop: "6px" }}>
                      <div style={{
                        width: `${d.voortgangPercentage}%`,
                        background: "#2563eb", height: "100%", borderRadius: "20px"
                      }} />
                    </div>
                    <p style={{ margin: "6px 0 0 0", color: "gray", fontSize: "13px" }}>
                      {d.bestedeUren} / {d.doelUren} uur
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CoachDashboardPage;