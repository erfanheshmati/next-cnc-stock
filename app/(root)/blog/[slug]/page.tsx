import { notFound, permanentRedirect, redirect } from "next/navigation";
import BannerThin from "@/components/shared/banner-thin";
import React from "react";
import DialogInquiry from "../../dialog-inquiry";
import { API_URL, APP_URL, IMAGE_URL } from "@/lib/constants";
import moment from "moment-jalaali";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const res1 = await fetch(`${API_URL}/blog/${params.slug}`);
  const res2 = await fetch(`${API_URL}/web-text-plans`);

  const data = await res1.json();
  const info = await res2.json();

  if (!res1.ok || !res2.ok) {
    return {
      title: "خطا در دریافت اطلاعات",
    };
  }

  // Use existing canonical or fallback to current URL
  const canonicalUrl = data.canonical || `${APP_URL}/blog/${params.slug}`;

  return {
    title: `${data.seoTitle} - ${info.title}`,
    description: data.metaData,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function BlogDetails({
  params,
}: {
  params: { slug: string };
}) {
  const res = await fetch(`${API_URL}/blog/${params.slug}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("خطا در دریافت اطلاعات!");

  const data = await res.json();

  // Check redirection
  if (data.redirectStatus && data.newUrl) {
    if (Number(data.redirectStatus) === 301) {
      permanentRedirect(data.newUrl);
    } else {
      redirect(data.newUrl);
    }
  }

  // If no data, return 404
  if (!data) return notFound();

  const formattedDate = moment(data.createdAt).format("jYYYY/jMM/jDD");

  return (
    <>
      <DialogInquiry />

      {/* Mobile View */}
      <div className="flex flex-col md:hidden min-h-screen">
        <img
          src={`${IMAGE_URL}/${data.image}`}
          alt={data.title}
          width={800}
          height={500}
          className="w-full h-[200px]"
        />
        <div className="flex flex-col gap-4 wrapper pt-6 pb-10">
          <h2 className="text-primary font-bold text-[20px]">{data.title}</h2>
          <p
            dangerouslySetInnerHTML={{ __html: data.content }}
            className="font-medium text-[14px] leading-7 text-justify"
          />
          <div className="flex flex-col gap-1">
            <span className="text-secondary text-[12px]">
              {" "}
              نوشته شده توسط {data.author}
            </span>
            <span className="text-secondary text-[12px]">
              {" "}
              در تاریخ {formattedDate}
            </span>
          </div>
        </div>
      </div>

      {/* ************************************************************************************************************************ */}

      {/* Desktop View */}
      <div className="hidden md:block min-h-screen">
        <BannerThin />

        <div className="flex flex-col gap-8 wrapper pt-10 pb-20">
          <img
            src={`${IMAGE_URL}/${data.image}`}
            alt={data.title}
            width={800}
            height={500}
            className="w-full h-[400px] rounded-lg"
          />
          <h2 className="text-primary font-bold text-[24px]">{data.title}</h2>
          <p
            dangerouslySetInnerHTML={{ __html: data.content }}
            className="font-medium leading-8 text-justify"
          />
          <div className="flex flex-col gap-1">
            <span className="text-secondary text-sm">
              {" "}
              نوشته شده توسط {data.author}
            </span>
            <span className="text-secondary text-sm">
              {" "}
              در تاریخ {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
