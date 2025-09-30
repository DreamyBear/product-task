export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #222", marginTop: 32 }}>
      <div
        className="container"
        style={{
          paddingTop: 16,
          paddingBottom: 16,
          fontSize: 13,
          color: "var(--muted)",
        }}
      >
        © {new Date().getFullYear()} SFD Assignment
      </div>
    </footer>
  );
}
