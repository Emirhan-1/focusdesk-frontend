import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ setToken }) {
  const navigate = useNavigate();
  const location = useLocation();

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  const items = [
    { label: "Dashboard", path: "/" },
    { label: "Studiesessies", path: "/studiesessies" },
    { label: "Studiedoelen", path: "/studiedoelen" },
    { label: "Tags", path: "/tags" },
  ];

  return (
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
      top: 0,
      left: 0,
      bottom: 0
    }}>
      <div>
        <h2 style={{ margin: "0 0 40px 0", fontSize: "22px" }}>FocusDesk</h2>
        <nav>
          {items.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: "12px 16px",
                marginBottom: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                background: location.pathname === item.path ? "#374151" : "transparent",
                color: location.pathname === item.path ? "#ffffff" : "#9ca3af",
                fontWeight: location.pathname === item.path ? "bold" : "normal",
                fontSize: "15px"
              }}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </div>
      <button
        onClick={logout}
        style={{
          width: "100%",
          padding: "12px",
          border: "none",
          borderRadius: "8px",
          background: "#ef4444",
          color: "white",
          cursor: "pointer",
          fontSize: "15px"
        }}
      >
        Uitloggen
      </button>
    </aside>
  );
}

export default Sidebar;