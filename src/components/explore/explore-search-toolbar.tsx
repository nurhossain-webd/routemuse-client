"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/cn";

interface ExploreSearchToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  activeFilterCount: number;
  onOpenAdvanced: () => void;
}

export function ExploreSearchToolbar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  sortValue,
  onSortChange,
  activeFilterCount,
  onOpenAdvanced,
}: ExploreSearchToolbarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              aria-label="Search experiences"
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onSearchSubmit();
                }
              }}
              className="pl-11"
              placeholder="Search by title, destination, category..."
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={onSearchSubmit}
            className="shrink-0 px-4 py-2"
          >
            Search
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            aria-label="Sort by"
            value={sortValue}
            onChange={(event) => onSortChange(event.target.value)}
            placeholder="Sort by"
            className="w-full sm:w-56"
          />
          <Button
            type="button"
            variant="outline"
            onClick={onOpenAdvanced}
            className={cn("w-full sm:w-auto", activeFilterCount > 0 ? "justify-between" : "")}
          >
            Advanced Search
            {activeFilterCount > 0 && (
              <span className="ml-2 rounded-full bg-teal px-2.5 py-1 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
