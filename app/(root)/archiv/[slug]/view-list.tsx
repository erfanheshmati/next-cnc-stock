"use client";

import { useState } from "react";
import ProductCardList from "./product-card-list";
import { productsData } from "@/lib/data";
import { useView } from "@/contexts/view-context";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function ViewList() {
  const { viewType } = useView();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Number of products per page

  // Calculate total pages
  const totalPages = Math.ceil(productsData.length / productsPerPage);

  // Get products for current page
  const currentProducts = productsData.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {viewType === "list" && (
        <div className="flex flex-col gap-4 pt-6">
          {currentProducts.map((data) => (
            <ProductCardList key={data.slug} data={data} />
          ))}

          {/* Pagination */}
          <div
            className="flex justify-center items-center gap-3 mt-6"
            dir="ltr"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded hover:opacity-60 transition-all duration-300 ease-in-out ${
                currentPage === 1
                  ? " text-gray-300 cursor-not-allowed"
                  : "text-gray-600"
              }`}
            >
              <IoIosArrowBack size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`flex items-center justify-center w-10 h-10 rounded hover:opacity-80 transition-all duration-300 ease-in-out ${
                  currentPage === index + 1
                    ? "bg-primary text-white"
                    : "bg-secondary/15 text-secondary"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded hover:opacity-60 transition-all duration-300 ease-in-out ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600"
              }`}
            >
              <IoIosArrowForward size={20} />
            </button>
          </div>
          <div className="flex items-center justify-center text-secondary text-sm">
            نمایش {productsPerPage * (currentPage - 1) + 1} تا{" "}
            {Math.min(productsPerPage * currentPage, productsData.length)} از{" "}
            {productsData.length} مورد
          </div>
        </div>
      )}
    </>
  );
}