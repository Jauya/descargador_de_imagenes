import { SiFreepik, SiPexels, SiPixabay } from "react-icons/si";
import { Select, SelectItem } from "@heroui/select";
import { parseAsInteger, useQueryState } from "nuqs";

export const providers = [
  { key: "", label: "Seleccione", icon: null },
  { key: "pexels", label: "Pexels", icon: <SiPexels className="size-8" /> },
  { key: "pixabay", label: "Pixabay", icon: <SiPixabay className="size-8" /> },
  { key: "freepik", label: "Freepik", icon: <SiFreepik className="size-8" /> }
];

export default function SelectProvider() {
  const [currentProvider, setCurrentProvider] = useQueryState("provider");
  const [, setCurrentPage] = useQueryState("page", parseAsInteger);

  return (
    <Select
      disallowEmptySelection
      aria-label="provider-selector"
      className="w-40"
      defaultSelectedKeys={[currentProvider ?? ""]}
      disabledKeys={[""]}
      onChange={(e) => {
        setCurrentProvider(e.target.value);
        setCurrentPage(1);
      }}
    >
      {providers.map((provider) => (
        <SelectItem key={provider.key}>{provider.label}</SelectItem>
      ))}
    </Select>
  );
}
