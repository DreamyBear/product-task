import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ borderBottom: "1px solid #222", padding: "10px" }}>
      <div
        className="container row wrap"
        style={{ justifyContent: "space-between" }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Product Manager</h1>
      
      </div>
    </header>
  );
}
