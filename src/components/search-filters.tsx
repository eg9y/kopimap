import React from "react";
import * as Headless from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { Label } from "./catalyst/fieldset";
import { Select } from "./catalyst/select";
import { reviewAttributes } from "./lib/review-attributes";
import { useStore } from "../store";
import { SearchFilters as SearchFiltersType } from "../types";

export const SearchFilters: React.FC = () => {
  const { t } = useTranslation();
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
    <div className="flex flex-col gap-4">
      {reviewAttributes.map((category) => (
        <div key={category.category} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {t(`categories.${category.category}`)}
          </h3>
          {category.attributes.map((attribute) => (
            <div key={attribute.name} className="mb-2">
              <Headless.Field className="flex flex-col gap-1">
                <Label className="text-sm font-medium">
                  {t(`attributes.${attribute.name}.name`)}
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
                  <option value="">{t(`attributes.${attribute.name}.name`)}</option>
                  {attribute.options.map((option) => (
                    <option key={option} value={option}>
                      {t(`attributes.${attribute.name}.options.${option}`)}
                    </option>
                  ))}
                </Select>
              </Headless.Field>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};