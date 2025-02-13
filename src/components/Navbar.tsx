"use client";
import {
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as NavbarUI
} from "@heroui/navbar";
import { Skeleton } from "@heroui/skeleton";
import { useQueryState } from "nuqs";

import ApikeyModal from "./navbar/ApikeyModal";
import Searchbar from "./navbar/Searchbar";
import SelectProvider, { providers } from "./navbar/SelectProvider";
import SwitchTheme from "./navbar/SwitchTheme";

export default function Navbar() {
  const [currentProvider] = useQueryState("provider");
  const provider = providers.find(
    (provider) => provider.key == currentProvider
  );

  return (
    <NavbarUI
      classNames={{
        brand: "flex gap-2 text-xl font-medium"
      }}
      maxWidth="full"
    >
      <NavbarContent as="div" className="items-center gap-2">
        <NavbarBrand className="p-4">
          {provider ? (
            <>
              {provider?.icon}
              {provider?.label}
            </>
          ) : (
            <>
              <Skeleton className="w-40 h-10 rounded-xl" />
            </>
          )}
        </NavbarBrand>
      </NavbarContent>
      <NavbarItem className="max-w-screen-lg w-full">
        <Searchbar />
      </NavbarItem>

      <NavbarContent justify="end">
        <NavbarItem>
          <ApikeyModal />
        </NavbarItem>
        <SelectProvider />
        <SwitchTheme />
      </NavbarContent>
    </NavbarUI>
  );
}
