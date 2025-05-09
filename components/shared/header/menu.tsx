"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { useDialog } from "@/contexts/dialog-context";
import { API_URL } from "@/lib/constants";
import { HeaderMenu } from "@/lib/types";
import Logo3 from "../logo-3";

export default function Menu() {
  const { openDialog } = useDialog();

  const [menusData, setMenusData] = useState<HeaderMenu[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const fetchMenusData = async () => {
      try {
        const res = await fetch(`${API_URL}/web-text-plans`);
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات!");
        const data = await res.json();
        setMenusData(data.headerMenu);
      } catch (error) {
        setError((error as Error).message);
      }
    };
    fetchMenusData();
  }, []);

  return (
    <div className="flex items-center z-20">
      {/* Mobile Menu */}
      <div className="md:hidden relative">
        {/* Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="flex items-center justify-center text-white"
        >
          <BiMenu size={24} />
        </button>
        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-1/2 sm:w-2/5 bg-slate-800 z-30 shadow-lg transform ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="relative h-full">
            {/* Nav Links */}
            <ul className="flex flex-col gap-5 px-4 pt-5">
              {/* Logo */}
              <div className="flex flex-col items-center">
                <Logo3 className="w-[120px]" />
              </div>
              <hr className="opacity-20" />
              {error && <p className="text-red-500">{error}</p>}

              {menusData.map((item) => (
                <li
                  key={item._id}
                  className="text-white font-bold text-[14px] z-10"
                >
                  <Link
                    href={item.url}
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-1"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
              <button
                onClick={() => openDialog()}
                className="flex items-center text-white font-bold text-[14px] z-10"
              >
                <span>استعلام قیمت</span>
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 32 32"
                  className="flashing-light"
                >
                  <path
                    fill="#21b074"
                    opacity="0.05"
                    d="M0 15.921c0-8.755 7.164-15.921 15.92-15.921s15.921 7.166 15.921 15.921c0 8.757-7.165 15.922-15.921 15.922s-15.92-7.164-15.92-15.922z"
                  ></path>
                  <path
                    fill="#21b074"
                    opacity="0.1"
                    d="M4.899 15.922c0-6.061 4.96-11.022 11.022-11.022s11.022 4.961 11.022 11.022c0 6.063-4.96 11.023-11.022 11.023s-11.022-4.96-11.022-11.023z"
                  ></path>
                  <path
                    fill="#21b074"
                    opacity="0.3"
                    d="M9.030 15.923c0-3.789 3.101-6.89 6.891-6.89s6.891 3.102 6.891 6.89c0 3.791-3.101 6.892-6.891 6.892s-6.891-3.101-6.891-6.892z"
                  ></path>
                  <path
                    fill="#21b074"
                    d="M12.595 15.925c0-1.829 1.496-3.326 3.326-3.326s3.326 1.497 3.326 3.326c0 1.828-1.497 3.325-3.326 3.325s-3.326-1.497-3.326-3.325z"
                  ></path>
                </svg>
              </button>
            </ul>
          </div>
        </div>
        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={toggleMobileMenu}
          ></div>
        )}
      </div>

      {/* ******************************************************************************************************************** */}

      {/* Desktop Menu */}
      <div className="hidden md:flex">
        <ul className="flex items-center gap-6 z-10">
          {error && <li className="text-red-500 pt-1">{error}</li>}

          {menusData.map((item) => (
            <li
              key={item._id}
              className="text-white hover:text-white/70 font-bold text-[14px] transition-all duration-300 ease-in-out"
            >
              <Link href={item.url} className="flex items-center">
                {item.title}
              </Link>
            </li>
          ))}
          <button
            onClick={() => openDialog()}
            className="flex items-center text-white hover:text-white/70 font-bold text-[14px] transition-all duration-300 ease-in-out"
          >
            <span>استعلام قیمت</span>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 33 33"
              className="flashing-light"
            >
              <path
                fill="#21b074"
                opacity="0.05"
                d="M0 15.921c0-8.755 7.164-15.921 15.92-15.921s15.921 7.166 15.921 15.921c0 8.757-7.165 15.922-15.921 15.922s-15.92-7.164-15.92-15.922z"
              ></path>
              <path
                fill="#21b074"
                opacity="0.1"
                d="M4.899 15.922c0-6.061 4.96-11.022 11.022-11.022s11.022 4.961 11.022 11.022c0 6.063-4.96 11.023-11.022 11.023s-11.022-4.96-11.022-11.023z"
              ></path>
              <path
                fill="#21b074"
                opacity="0.3"
                d="M9.030 15.923c0-3.789 3.101-6.89 6.891-6.89s6.891 3.102 6.891 6.89c0 3.791-3.101 6.892-6.891 6.892s-6.891-3.101-6.891-6.892z"
              ></path>
              <path
                fill="#21b074"
                d="M12.595 15.925c0-1.829 1.496-3.326 3.326-3.326s3.326 1.497 3.326 3.326c0 1.828-1.497 3.325-3.326 3.325s-3.326-1.497-3.326-3.325z"
              ></path>
            </svg>
          </button>
        </ul>
      </div>
    </div>
  );
}
