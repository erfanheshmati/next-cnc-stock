"use client";

import DialogBoxInquiry from "@/components/shared/dialog-box-inquiry";
import Banner from "@/components/shared/home/banner";
import Blogs from "@/components/shared/home/blogs";
import Brands from "@/components/shared/home/brands";
import Categories from "@/components/shared/home/categories";
import Consultation from "@/components/shared/home/consultation";
import Helps from "@/components/shared/home/helps";
import Inquire from "@/components/shared/home/inquire";
import Products from "@/components/shared/home/products";
import Search from "@/components/shared/home/search";
import { useDialog } from "@/contexts/dialog-context";
import { API_URL } from "@/lib/constants";
import { Brand } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home() {
  const { isDialogOpen, closeDialog } = useDialog();

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrandsData = async () => {
      try {
        const res = await fetch(`${API_URL}/brand`);
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات!");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setBrands(data);
          setSelectedBrand(data[0]._id); // Set first brand as default
        } else throw new Error("برندی وجود ندارد");
      } catch (error) {
        console.log((error as Error).message);
      }
    };
    fetchBrandsData();
  }, []);

  return (
    <>
      <DialogBoxInquiry isOpen={isDialogOpen} onClose={closeDialog} />

      <div className="relative">
        <Banner>
          <Search />
        </Banner>
        <div className="wrapper">
          <Categories />
          <Consultation />
          <div className="flex flex-col md:flex-row gap-8 md:gap-4 mt-10 mb-2 md:mt-24 md:wrapper -mx-4 md:mx-0">
            <Brands brands={brands} setSelectedBrand={setSelectedBrand} />
            <Products selectedBrand={selectedBrand} />
          </div>
          <Inquire />
          <div className="flex flex-col md:flex-row gap-8 md:gap-0 mt-10 mb-4 md:my-24 md:wrapper -mx-4 md:mx-0">
            <Helps />
            <Blogs />
          </div>
        </div>
      </div>
    </>
  );
}
