import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function saveToSearchHistory(term: string) {
  localStorage.setItem("lastSearch", term)
}

export const SearchInput = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const lastSearch = localStorage.getItem("lastSearch");

  const handleSearch = () => {
    const trimmed = query.trim();
    if(trimmed) {
      saveToSearchHistory(trimmed)
      navigate(`/search/${trimmed}`)
    }
  } 

  return (
    <div className="w-full max-w-4xl px-4">
      <div className="relative w-full">
        <input
          type="text"
          placeholder={lastSearch ? `${lastSearch}` : "Pesquise o produto"}
          className="border-none rounded-[100px] text-black w-full p-3 pr-10 bg-neutral-50 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-600" onClick={handleSearch}>
          <IoIosSearch size={24} />
        </button>
      </div>
    </div>
  );
};
