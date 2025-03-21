import { IMAGE_URL } from "@/lib/constants";
import { Category } from "@/lib/types";
import { BiArrowFromRight } from "react-icons/bi";

export default function CategoryCard({ data }: { data: Category }) {
  return (
    <>
      {/* Mobile Card */}
      <div className="md:hidden w-[156px] sm:w-[190px] px-2 h-[166px] border border-gray-200/90 shadow-md rounded-2xl bg-gradient-to-tl from-[#eff0f1] via-[#fff] to-[#fff]">
        <div className="flex items-center justify-center h-[110px]">
          <img
            src={`${IMAGE_URL}/${data.image}`}
            alt={data.title}
            className="w-[90px] h-[80px]"
          />
        </div>
        <div className="flex flex-col items-center text-primary font-bold">
          <h3 className="text-[14px] mt-2">{data.title}</h3>
        </div>
      </div>

      {/* ************************************************************************************************************** */}

      {/* Desktop Card */}
      <div className="hidden md:block h-[355px] border border-gray-200/70 rounded-2xl shadow-md px-4 relative hover:bg-gradient-to-tl from-[#f2f3f5] via-[#fff] to-[#fff]">
        <div className="absolute left-6 top-6">
          {/* <span dangerouslySetInnerHTML={{ __html: data.badge }} /> */}
        </div>
        <div className="flex items-center justify-center h-[180px]">
          <img
            src={`${IMAGE_URL}/${data.image}`}
            alt={data.title}
            className="w-[140px] h-[130px]"
          />
        </div>
        <div className="flex items-center gap-1 text-primary font-bold">
          <h3 className="text-[20px] w-full text-center">{data.title}</h3>
        </div>
        <div className="text-secondary/80 text-[12px] leading-5 line-clamp-3 text-justify mt-2">
          {data.description}
        </div>
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-[#536683] font-bold text-[13px]">
            مشاهده محصولات
          </span>
          <BiArrowFromRight color="#536683" size={16} />
        </div>
      </div>
    </>
  );
}
