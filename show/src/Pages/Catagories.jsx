import React from "react";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "WOMEN'S WEAR",
    items: "3268 Items",
    image:
      "https://kumo-shreethemes.netlify.app/assets/b-1-D-HNkJ_h.png",
  },
  {
    title: "KID'S WEAR",
    items: "8562 Items",
    image:
      "https://kumo-shreethemes.netlify.app/assets/b-3-Gejxozrv.png",
  },
  {
    title: "MEN'S WEAR",
    items: "32 Items",
    image:
      "https://kumo-shreethemes.netlify.app/assets/b-5-sdfB0ous.png",
  },
];

export default function FashionCategories() {
  return (
    <div className="w-full bg-[#f8f8f8] py-6 px-3 md:px-6 lg:px-10">
      
      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">

        {/* LEFT WOMEN CARD */}
        <div className="relative overflow-hidden rounded-sm bg-[#dfecef] h-[420px] group">
          
          <img
            src={categories[0].image}
            alt="Women's Wear"
            className="absolute right-0 bottom-0 h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* CONTENT */}
          <div className="relative z-10 p-5 flex flex-col justify-between h-full">

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                {categories[0].title}
              </h2>

              <p className="text-gray-700 mt-1 text-sm md:text-base">
                {categories[0].items}
              </p>
            </div>

            <button className="w-fit border border-black px-5 py-2 text-sm flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-300">
              Browse Items
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4">

          {/* KIDS CARD */}
          <div className="relative overflow-hidden rounded-sm bg-[#f2ece9] h-[200px] group">
            
            <img
              src={categories[1].image}
              alt="Kids Wear"
              className="absolute right-0 bottom-0 h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* CONTENT */}
            <div className="relative z-10 p-5 flex flex-col justify-between h-full">

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-black">
                  {categories[1].title}
                </h2>

                <p className="text-gray-700 mt-1 text-sm">
                  {categories[1].items}
                </p>
              </div>

              <button className="w-fit border border-black px-4 py-2 text-sm flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-300">
                Browse
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* MEN CARD */}
          <div className="relative overflow-hidden rounded-sm bg-[#f2efeb] h-[200px] group">
            
            <img
              src={categories[2].image}
              alt="Men Wear"
              className="absolute right-0 bottom-0 h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* CONTENT */}
            <div className="relative z-10 p-5 flex flex-col justify-between h-full">

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-black">
                  {categories[2].title}
                </h2>

                <p className="text-gray-700 mt-1 text-sm">
                  {categories[2].items}
                </p>
              </div>

              <button className="w-fit border border-black px-4 py-2 text-sm flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-300">
                Browse
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}