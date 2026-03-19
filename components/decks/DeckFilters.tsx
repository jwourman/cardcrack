"use client";

import { useRouter, usePathname } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface DeckFiltersProps {
  params: {
    category?: string;
    difficulty?: string;
    q?: string;
    sort?: string;
    type?: string;
  };
}

export default function DeckFilters({ params }: DeckFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(params.q ?? "");

  const updateParam = (key: string, value: string | null) => {
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set("category", params.category);
    if (params.difficulty) searchParams.set("difficulty", params.difficulty);
    if (params.q) searchParams.set("q", params.q);
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.type) searchParams.set("type", params.type);

    if (value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    router.push(`${pathname}?${searchParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("q", search || null);
  };

  const hasFilters = params.difficulty || params.q || params.type || params.sort;

  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="mb-2 block">Search</Label>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search decks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" size="icon" variant="default">
            <Search className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Sort */}
      <div>
        <Label className="mb-2 block">Sort by</Label>
        <Select
          value={params.sort ?? "newest"}
          onValueChange={(v) => updateParam("sort", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty */}
      <div>
        <Label className="mb-2 block">Difficulty</Label>
        <Select
          value={params.difficulty ?? "all"}
          onValueChange={(v) => updateParam("difficulty", v === "all" ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type */}
      <div>
        <Label className="mb-2 block">Access Type</Label>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "all", label: "All" },
            { value: "free", label: "Free" },
            { value: "premium", label: "Premium" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => updateParam("type", t.value === "all" ? null : t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                (params.type ?? "all") === t.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-gray-500">
          <X className="w-4 h-4 mr-2" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
