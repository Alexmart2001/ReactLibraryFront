import React from "react";

function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // o usa navigate de react-router si quieres
  };

  return (
      <button onClick={handleLogout} className="logout-button">
          <span className="button-icon">👋</span> Cerrar Sesión
      </button>
  );
}

export default LogoutButton;
