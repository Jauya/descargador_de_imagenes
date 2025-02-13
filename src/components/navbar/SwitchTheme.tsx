import { useTheme } from "next-themes";
import { Switch } from "@heroui/switch";
import { BiSolidMoon, BiSolidSun } from "react-icons/bi";

export default function SwitchTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <Switch
      aria-label="Dark and light mode"
      color="default"
      isSelected={theme === "dark"}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <BiSolidMoon className={className} />
        ) : (
          <BiSolidSun className={className} />
        )
      }
      onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
}
