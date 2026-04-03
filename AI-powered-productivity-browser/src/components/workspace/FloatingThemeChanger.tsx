import { useThemeStore } from "../../store/themeStore";

export default function FloatingThemeChanger() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div className="floating-theme-changer">
      <button
        type="button"
        className="floating-theme-trigger"
        onClick={toggleTheme}
      >
        <span className="floating-mode-label">Theme</span>
        <strong>{theme === "dark" ? "Dark" : "Light"}</strong>
      </button>
    </div>
  );
}
