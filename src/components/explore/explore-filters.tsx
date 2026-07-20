"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const categoryOptions = [
  "Adventure",
  "Art & Design",
  "Culture",
  "Culture & Food",
  "Cycling",
  "Food",
  "Hiking",
  "Local Life",
  "Nature",
  "Wildlife",
].map((category) => ({ value: category, label: category }));

interface ExploreFiltersProps {
  values: URLSearchParams;
  onChange: (key: string, value: string) => void;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  onClose?: () => void;
}

export function ExploreFilters({
  values,
  onChange,
  onSearchChange,
  onClear,
  onClose,
}: ExploreFiltersProps) {
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valuesKey = values.toString();

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    },
    [valuesKey],
  );

  const debounceSearch = (value: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => onSearchChange(value.trim()), 400);
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 font-bold text-navy">
          <SlidersHorizontal className="size-5 text-teal" /> Filters
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close filters"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-10 size-4 text-slate-400" />
        <Input
          key={`search-${values.get("search") ?? ""}`}
          label="Search"
          type="search"
          defaultValue={values.get("search") ?? ""}
          placeholder="Title, description, or place"
          className="pl-9"
          onChange={(event) => debounceSearch(event.target.value)}
        />
      </div>

      <Select
        key={`category-${values.get("category") ?? ""}`}
        label="Category"
        value={values.get("category") ?? ""}
        placeholder="All categories"
        options={categoryOptions}
        onChange={(event) => onChange("category", event.target.value)}
      />

      <Input
        key={`location-${values.get("location") ?? ""}`}
        label="Location"
        defaultValue={values.get("location") ?? ""}
        placeholder="City or region"
        onBlur={(event) => onChange("location", event.target.value.trim())}
      />

      <Input
        key={`country-${values.get("country") ?? ""}`}
        label="Country"
        defaultValue={values.get("country") ?? ""}
        placeholder="Country"
        onBlur={(event) => onChange("country", event.target.value.trim())}
      />

      <fieldset>
        <legend className="text-sm font-medium text-navy">Price range</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Input
            key={`min-${values.get("minPrice") ?? ""}`}
            aria-label="Minimum price"
            type="number"
            inputMode="decimal"
            min="0"
            defaultValue={values.get("minPrice") ?? ""}
            placeholder="Min"
            onBlur={(event) => onChange("minPrice", event.target.value)}
          />
          <Input
            key={`max-${values.get("maxPrice") ?? ""}`}
            aria-label="Maximum price"
            type="number"
            inputMode="decimal"
            min="0"
            defaultValue={values.get("maxPrice") ?? ""}
            placeholder="Max"
            onBlur={(event) => onChange("maxPrice", event.target.value)}
          />
        </div>
      </fieldset>

      <Select
        key={`rating-${values.get("minRating") ?? ""}`}
        label="Minimum rating"
        value={values.get("minRating") ?? ""}
        placeholder="Any rating"
        options={[
          { value: "4.5", label: "4.5 and above" },
          { value: "4", label: "4.0 and above" },
          { value: "3", label: "3.0 and above" },
        ]}
        onChange={(event) => onChange("minRating", event.target.value)}
      />

      <button
        type="button"
        onClick={onClear}
        className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-navy hover:bg-slate-50"
      >
        Clear all filters
      </button>
    </div>
  );
}
