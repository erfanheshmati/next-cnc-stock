import { notFound, permanentRedirect, redirect } from "next/navigation";
import BannerThin from "@/components/shared/banner-thin";
import Sitemap from "./site-map";
import Filters from "./filters";
import ViewSwitch from "./view-switch";
import ViewList from "./view-list";
import ViewGrid from "./view-grid";
import DialogInquiry from "../dialog-inquiry";
import ViewMobile from "./view-mobile";
import DialogFilters from "./dialog-filters";
import ButtonsMobile from "./buttons-mobile";
import { FilterProvider } from "@/contexts/filter-popup-context";
import { API_URL, APP_URL } from "@/lib/constants";
import { Category } from "@/lib/types";
import { FiltersLogicProvider } from "@/contexts/filter-logic-context";
import SortSwitch from "./sort-switch";
import { SortProvider } from "@/contexts/sort-popup-context";
import DialogSort from "./dialog-sort";
import { ViewProvider } from "@/contexts/view-context";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const catQuery = searchParams.category;

  const res1 = await fetch(`${API_URL}/category`);
  const res2 = await fetch(`${API_URL}/web-text-plans`);

  if (!res1.ok || !res2.ok) {
    return {
      title: "خطا در دریافت اطلاعات",
    };
  }

  const categoriesData = await res1.json();
  const info = await res2.json();

  const category = categoriesData.categories.find(
    (cat: Category) => cat._id === catQuery
  );

  // Use existing canonical or fallback to current URL
  const canonicalUrl = info.archiveProductCanonical || `${APP_URL}/archiv`;

  return {
    title: `${category?.seoTitle || info.archiveProductSeoTitle} - ${
      info.title
    }`,
    description: category?.metaData || info.archiveProductMetaData,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    page?: string;
    limit?: string;
    sort?: string;
  };
}) {
  const searchQuery = searchParams?.q || "";
  const categoryQuery = searchParams?.category || "";
  // const pageQuery = parseInt(searchParams?.page || "1", 10);
  // const limitQuery = parseInt(searchParams?.limit || "10", 10);
  const sortQuery = searchParams?.sort || "";

  let error: string | null = null;

  const res1 = await fetch(`${API_URL}/web-text-plans`);
  const res2 = await fetch(`${API_URL}/category`);
  const res3 = await fetch(
    // `${API_URL}/product?page=${pageQuery}&limit=${limitQuery}&category=${categoryQuery}&q=${searchQuery}&sort=${sortQuery}`,
    `${API_URL}/product?category=${categoryQuery}&q=${searchQuery}&sort=${sortQuery}`,
    // `${API_URL}/product`,
    { cache: "no-store" }
  );

  const info = await res1.json();
  const categoriesData = await res2.json();
  const productsData = await res3.json();

  // Check redirection
  if (info.archiveProductRedirectStatus && info.archiveProductNewUrl) {
    if (Number(info.archiveProductRedirectStatus) === 301) {
      permanentRedirect(info.archiveProductNewUrl);
    } else {
      redirect(info.archiveProductNewUrl);
    }
  }

  // If no data, return 404
  if (!productsData) return notFound();

  const category = categoriesData?.categories.find(
    (cat: Category) => cat._id === categoryQuery
  );

  if (productsData.length === 0) {
    error = "جستجو بی نتیجه بود";
  }

  return (
    <FiltersLogicProvider initialProducts={productsData}>
      <FilterProvider>
        <SortProvider>
          <ViewProvider>
            {/* Pop-Ups */}
            <DialogInquiry />
            <DialogFilters />
            <DialogSort />

            {/* Mobile View */}
            <div className="block md:hidden relative">
              <BannerThin />
              {/* Heading */}
              <div className="absolute w-full flex justify-center top-10">
                <h1 className="text-primary font-bold text-[20px]">
                  {category ? category.title : info.archiveProductTitle}
                </h1>
              </div>
              {/* Content */}
              <div className="flex flex-col pt-8 wrapper min-h-screen">
                {/* Buttons */}
                <ButtonsMobile />
                {/* Product View */}
                {error ? (
                  <div className="flex items-start justify-center pt-20 h-screen text-secondary text-sm">
                    {error}
                  </div>
                ) : (
                  <ViewMobile />
                )}
                {/* Description */}
                {category && (
                  <div className="flex flex-col gap-4 bg-[#618FB61A] -mx-4 px-4 py-8">
                    <h2 className="text-primary font-bold text-[16px] text-center">
                      {category.title}
                    </h2>
                    <p className="text-secondary font-medium text-[12px] leading-7 text-justify">
                      {category.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ****************************************************************************************************************** */}

            {/* Desktop View */}
            <div className="hidden md:block relative">
              <BannerThin />
              {/* Sitemap */}
              <div className="flex items-center justify-center">
                <div className="wrapper flex items-center justify-between absolute -mt-12 z-10">
                  <Sitemap category={category} info={info} />
                </div>
              </div>
              {/* Content */}
              <div className="wrapper min-h-screen flex flex-row md:gap-10 xl:gap-20 py-12">
                {/* Filters */}
                <div className="flex flex-col gap-8 w-6/12 lg:w-4/12 xl:w-3/12">
                  <h3 className="text-secondary font-semibold text-[20px]">
                    فیلترها
                  </h3>
                  <Filters />
                </div>
                {/* Product View */}
                <div className="flex flex-col w-9/12">
                  {/* Heading */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h1 className="text-primary font-bold text-[24px]">
                        {category ? category.title : info.archiveProductTitle}
                      </h1>
                    </div>
                    <SortSwitch sort={sortQuery} />
                    <ViewSwitch />
                  </div>
                  {/* Contents */}
                  <div className="flex flex-col justify-between h-full">
                    {error ? (
                      <div className="flex items-start justify-center pt-20 h-full text-secondary text-sm">
                        {error}
                      </div>
                    ) : (
                      <>
                        {/* List */}
                        <ViewList />
                        {/* Grid */}
                        <ViewGrid />
                      </>
                    )}
                    {/* Description Card */}
                    {category && (
                      <div className="flex flex-col gap-4 border rounded-xl shadow-md p-8 mt-14">
                        <h2 className="text-primary font-bold text-[20px]">
                          {category?.title}
                        </h2>
                        <p className="text-secondary font-medium text-[13px] leading-7 text-justify">
                          {category?.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ViewProvider>
        </SortProvider>
      </FilterProvider>
    </FiltersLogicProvider>
  );
}
