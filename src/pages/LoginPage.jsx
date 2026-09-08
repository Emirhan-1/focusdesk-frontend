import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function LoginPage({ setToken, setRol }) {
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5235/api/Auth/login",
        { email, wachtwoord }
      );

      const token = response.data.token;
      const decoded = jwtDecode(token);
      const rol = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      setToken(token);
      setRol(rol);
    } catch {
      setError("Login mislukt");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f4f6f8",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "350px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h1>FocusDesk</h1>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "15px" }}
          />

          <input
            type="password"
            placeholder="Wachtwoord"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            style={{ width: "100%", padding: "12px", marginTop: "15px" }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            Inloggen
          </button>

          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;