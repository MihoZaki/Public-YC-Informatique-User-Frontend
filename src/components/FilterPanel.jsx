// src/components/FilterPanel.jsx
import React from "react";

const FilterPanel = (
  { filters, onFilterChange, categories = [], loading = false },
) => {
  // Removed useEffect and fetchCategories logic as data is now passed down

  // Removed separate loading state as it's handled in the parent component (Products.jsx)
  // The skeleton UI in Products.jsx covers the initial load of both products and categories

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-md border border-neutral-content">
      <h3 className="font-bold text-lg mb-4 ">Filters</h3>

      {/* Category Filter - Uses passed down categories */}
      <div className="mb-4">
        <label className="label">
          <span className="label-text ">Category</span>
        </label>
        <select
          className="select select-bordered w-full bg-base-100"
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          <option value="" className="bg-base-100">
            All Categories
          </option>
          {categories.map((category) => (
            <option
              key={category.id} // Use category.id from the fetched data
              value={category.name} // Use category.name for the filter value (matches the filter logic in Products.jsx)
              className="bg-base-100"
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="label">
          <span className="label-text ">Price Range</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            className="input input-bordered bg-base-100  border-gray-600"
            value={filters.minPrice}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="input input-bordered bg-base-100  border-gray-600"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-4">
        <label className="label">
          <span className="label-text ">Brand</span>
        </label>
        <select
          className="select select-bordered w-full bg-base-100  border-gray-600"
          value={filters.brand}
          onChange={(e) => onFilterChange("brand", e.target.value)}
        >
          <option value="" className="bg-base-100">
            All Brands
          </option>
          <option value="Intel" className="bg-base-100">
            Intel
          </option>
          <option value="AMD" className="bg-base-100">
            AMD
          </option>
          <option value="NVIDIA" className="bg-base-100">
            NVIDIA
          </option>
          <option value="Samsung" className="bg-base-100">
            Samsung
          </option>
          <option value="Corsair" className="bg-base-100">
            Corsair
          </option>
        </select>
      </div>

      <button
        className="btn btn-secondary btn-outline w-full"
        onClick={() => onFilterChange("reset")}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel;
