import { useEffect, useState } from "react";

export default function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      className={`fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-lg transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
        bg-[var(--color-accent-top)] text-black hover:bg-[var(--color-accent2)]`}
    >
      ↑
    </button>
  );
}
