import React from "react";
import * as Headless from "@headlessui/react";
import { LocalizedString } from "typesafe-i18n";
import { useI18nContext } from "@/src/i18n/i18n-react";
import { Label } from "./catalyst/fieldset";
import { Select } from "./catalyst/select";
import { reviewAttributes } from "./lib/review-attributes";
import { useStore } from "../store";
import { SearchFilters as SearchFiltersType } from "../types";

export default function SearchFilters() {
  const { LL } = useI18nContext();
  const { searchFilters, setSearchFilters } = useStore();

  const handleFilterChange = (
    attributeName: keyof SearchFiltersType,
    value: string
  ) => {
    if (value === "") {
      const newFilters = { ...searchFilters };
      delete newFilters[attributeName];
      setSearchFilters(newFilters);
    } else {
      setSearchFilters({ ...searchFilters, [attributeName]: value });
    }
  };

  return (
    <div className="h-full bg-slate-200 flex flex-col px-2 pt-16 overflow-scroll">
                  <h2 className="text-2xl">Filters</h2>

      {reviewAttributes.map((category) => (
        <div key={category.category} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {LL.categories[category.category as keyof typeof LL.categories]()}
          </h3>
          {category.attributes.map((attribute) => {
             const attrName = attribute.name as keyof typeof LL.attributes;
             const options = LL.attributes[attrName].options as Record<string, () => LocalizedString>;
            return (
            <div key={attribute.name} className="mb-2">
              <Headless.Field className="flex flex-col gap-1">
                <Label className="text-sm font-medium">
                  {LL.attributes[attrName].name()}
                </Label>
                <Select
                  name={attribute.name}
                  className="w-full"
                  onChange={(e) =>
                    handleFilterChange(
                      attribute.name as keyof SearchFiltersType,
                      e.target.value
                    )
                  }
                  value={searchFilters[attribute.name] || ""}
                >
                  <option value="">
                    {LL.attributes[attrName].name()}
                  </option>
                  {attribute.options.map((option) => (
                    <option key={option} value={option}>
                      {options[option]()}
                    </option>
                  ))}
                </Select>
              </Headless.Field>
            </div>
          )})}
        </div>
      ))}
    </div>
  );
};