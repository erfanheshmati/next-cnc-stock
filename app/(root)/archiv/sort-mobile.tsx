"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BiX } from "react-icons/bi";

export default function SortMobile({
  onClose,
}: // currentPage,
// limit,
// search,
// category,
// view,
// sort,
{
  onClose: () => void;
  // currentPage: number;
  // limit: number;
  // search: string;
  // category: string;
  // view: string;
  // sort: string;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const handleSortChange = (sortType: string = params.get("sort") || "") => {
    const currentPage = params.get("page") || "1";
    const limit = params.get("limit") || "10";
    const category = params.get("category") || "";
    const search = params.get("q") || "";
    const view = params.get("view") || "";

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", currentPage);
    searchParams.set("limit", limit);
    searchParams.set("category", category);
    searchParams.set("q", search);
    searchParams.set("view", view);
    searchParams.set("sort", sortType);
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <div
      className="md:hidden flex flex-col items-center w-full max-w-sm sm:max-w-md p-6 shadow-2xl rounded-2xl bg-white overflow-y-auto relative"
      style={{ height: "calc(100vh - 250px)" }}
    >
      <div className="text-primary font-bold text-[16px]">مرتب سازی</div>
      <div className="absolute right-5 top-5">
        <button onClick={onClose}>
          <BiX size={20} className="text-secondary/60" />
        </button>
      </div>
      <div className="mt-4 w-full">
        <div className="flex flex-col gap-3">
          <span
            className={`border rounded-lg p-4 font-medium text-[14px] ${
              !params.get("sort")
                ? "text-white bg-primary font-semibold"
                : "text-secondary"
            }`}
            onClick={() => handleSortChange("")}
          >
            جدیدترین
          </span>
          <span
            className={`border rounded-lg p-4 font-medium text-[14px] ${
              params.get("sort") === "mostViewed"
                ? "text-white bg-primary font-semibold"
                : "text-secondary"
            }`}
            onClick={() => handleSortChange("mostViewed")}
          >
            پربازدیدترین
          </span>
        </div>
      </div>

      {/* Product View Button */}
      <button
        onClick={onClose}
        className="block md:hidden fixed bottom-0 w-full py-4 z-10 text-white font-bold text-[14px] bg-primary"
      >
        مشاهده محصولات
      </button>
    </div>
  );
}
