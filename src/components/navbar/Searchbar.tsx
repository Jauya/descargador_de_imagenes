import { Input } from "@heroui/input";
import { useQueryState } from "nuqs";
import { FormEvent } from "react";
import { IoSearch } from "react-icons/io5";

export default function Searchbar() {
  const [term, setTerm] = useQueryState("term");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    if (data.get("term")?.toString().trim()) {
      setTerm(data.get("term")?.toString() ?? "");
    } else setTerm(null);
  };

  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <Input
        autoComplete="off"
        color="default"
        defaultValue={term || ""}
        name="term"
        placeholder="Buscar..."
        startContent={<IoSearch className="size-5 text-neutral-500" />}
        type="search"
      />
    </form>
  );
}
