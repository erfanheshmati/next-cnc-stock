"use client";

import {
  CheckboxFilter,
  useFiltersLogic,
} from "@/contexts/filter-logic-context";
import { useMemo } from "react";
import { BiArrowFromTop, BiX } from "react-icons/bi";
import DualRangeSlider from "./dual-range-slider";

export default function FiltersMobile({ onClose }: { onClose: () => void }) {
  const {
    attributes,
    checkedItems,
    inStockOnly,
    setInStockOnly,
    toggleFilter,
    openFilter,
    handleCheckAndFilterChange,
    handleRangeChange,
    enabledAttributes,
    filteredProductsCount,
    clearFilters,
    applyFilters,
  } = useFiltersLogic();

  const renderedFilters = useMemo(() => {
    return attributes
      .filter((attribute) => enabledAttributes.has(attribute.id))
      .map((attribute, index) => {
        const isChecked =
          checkedItems[attribute.id] &&
          (attribute.type === "string"
            ? Object.values(checkedItems[attribute.id] as CheckboxFilter).some(
                Boolean
              )
            : (attribute.type === "number" &&
                checkedItems[attribute.id].min !== attribute.min) ||
              checkedItems[attribute.id].max !== attribute.max);

        const isOpen = openFilter === index || isChecked; // Keep open if checked

        return (
          <div key={attribute.id} className="bg-secondary/10 rounded-xl my-2">
            <button
              className="flex justify-between items-center w-full"
              onClick={() => toggleFilter(index)}
            >
              <span className="text-black/80 font-semibold text-[13px] px-5 py-4">
                {attribute.title}
              </span>
              <span className="p-5">
                <BiArrowFromTop
                  size={18}
                  className={`text-secondary transform transition-transform duration-300 ${
                    openFilter === index ? "rotate-180" : ""
                  }`}
                />
              </span>
            </button>
            {isOpen && (
              <div className="py-2">
                {/* String-Based Filters (Checkboxes) */}
                {attribute.type === "string" &&
                  (attribute.value || []).map((option, idx) => {
                    // Cast the filter value as a CheckboxFilter so we can index using option.value
                    const checkboxValue = (
                      checkedItems[attribute.id] as
                        | { [key: string]: boolean }
                        | undefined
                    )?.[option.value];
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-5 py-2"
                      >
                        <input
                          type="checkbox"
                          id={`filter-${index}-${idx}`}
                          checked={Boolean(checkboxValue)}
                          onChange={() =>
                            handleCheckAndFilterChange(
                              attribute.id,
                              option.value
                            )
                          }
                          className="w-5 h-5 cursor-pointer"
                        />
                        <label
                          htmlFor={`filter-${index}-${idx}`}
                          className={`font-semibold text-[12px] cursor-pointer pt-0.5 ${
                            checkboxValue ? "text-black" : "text-black/60"
                          }`}
                        >
                          {option.value} ({option.count})
                        </label>
                      </div>
                    );
                  })}

                {/* Numeric Filters (Dual Range Slider for Min & Max) */}
                {attribute.type === "number" && (
                  <DualRangeSlider
                    min={attribute.min}
                    max={attribute.max}
                    currentValue={
                      checkedItems[attribute.id] &&
                      typeof checkedItems[attribute.id] === "object" &&
                      "min" in checkedItems[attribute.id] &&
                      "max" in checkedItems[attribute.id]
                        ? (checkedItems[attribute.id] as {
                            min: number;
                            max: number;
                          })
                        : { min: attribute.min, max: attribute.max }
                    }
                    onChange={(newRange) =>
                      handleRangeChange(attribute.id, newRange)
                    }
                  />
                )}
              </div>
            )}
          </div>
        );
      });
  }, [
    attributes,
    enabledAttributes,
    openFilter,
    checkedItems,
    toggleFilter,
    handleCheckAndFilterChange,
    handleRangeChange,
  ]);

  return (
    <div
      className="md:hidden flex flex-col items-center w-full max-w-sm sm:max-w-md p-6 shadow-2xl rounded-2xl bg-white overflow-y-auto relative"
      style={{ height: "calc(100vh - 250px)" }}
    >
      <div className="text-primary font-bold text-[16px]">فیلترها</div>
      <div className="absolute right-5 top-5">
        <button onClick={onClose}>
          <BiX size={20} className="text-secondary/60" />
        </button>
      </div>
      <div className="mt-4 w-full">
        {renderedFilters}

        {/* In-Stock Toggle Switch */}
        <label
          htmlFor="in-stock-toggle"
          className="flex items-center justify-between bg-secondary/10 rounded-xl px-5 py-4"
        >
          <span className="text-black/70 font-semibold text-[13px]">
            فقط نمایش موجودها
          </span>
          <div
            className={`relative w-12 h-6 rounded-md shadow-inner ${
              inStockOnly ? "bg-primary" : "bg-gray-300"
            }`}
          >
            <input
              type="checkbox"
              id="in-stock-toggle"
              className="sr-only"
              checked={inStockOnly ?? false}
              onChange={() => setInStockOnly(!inStockOnly)}
            />
            <div
              className={`absolute w-5 h-5 left-0.5 top-0.5 bg-white rounded-md shadow transition-transform ${
                inStockOnly ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </label>

        {/* Clear Filters */}
        <button
          className="w-full text-center bg-red-500 text-white font-semibold text-sm py-4 mt-2 rounded-xl"
          onClick={clearFilters}
        >
          حذف فیلترها
        </button>
      </div>

      {/* Product View Button */}
      <button
        onClick={() => {
          onClose(); // Invoke the function
          applyFilters(); // Invoke the function
        }}
        className="flex items-center justify-center fixed bottom-0 w-full py-4 z-10 text-white font-bold text-[14px] bg-primary"
      >
        {filteredProductsCount > 0 ? (
          <>
            مشاهده
            <div className="px-1">{filteredProductsCount}</div>
            محصول
          </>
        ) : (
          <span>محصولی پیدا نشد</span>
        )}
      </button>
    </div>
  );
}
