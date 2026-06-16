import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Achivements = () => {
  const [isContentOpen, setIsContentOpen] = useState(false);
  const myProfile = useSelector((state) => state.userProfile.user);

  const totalAchievements = [
    { id: 1, src: "https://res.cloudinary.com/djiqzvcev/image/upload/v1739281946/achivement3_hlkpml.png", alt: "first_Step", title: "first_Step" },
    { id: 2, src: "https://res.cloudinary.com/djiqzvcev/image/upload/v1739281968/achivement2_xqn8uc.png", alt: "adventurer", title: "adventurer" },
    { id: 3, src: "https://res.cloudinary.com/djiqzvcev/image/upload/v1739309183/achivement4_xeacf0_c_crop_w_400_h_400_puophi.png", alt: "explorer", title: "explorer" },
    { id: 4, src: "https://res.cloudinary.com/djiqzvcev/image/upload/v1739307386/mountain-and-lake-travel-badge-with-airplane_10964465_tvmfaa.png", alt: "Nomad", title: "nomad" },
    { id: 5, src: "https://res.cloudinary.com/djiqzvcev/image/upload/v1739307394/pngtree-mountain-summer-time-badge-png-image_11928438_axvgod.png", alt: "Nature_Lover", title: "Nature_Lover" },
    { id: 6, src: "https://res.cloudinary.com/djiqzvcev/image/upload/v1739307403/travel-badge-with-forest-lake-mountain-and-beautiful-landscape-_10964474_qagip6.png", alt: "Cultural_Traveler", title: "Cultural_Traveler" },
  ];

  return (
    <div className="rounded-t-xl overflow-hidden shadow-lg">
      <div
        className="text-bgSecondary p-4 bg-bgPrimary justify-between flex items-center"
        onClick={() => setIsContentOpen(!isContentOpen)}
      >
        <p className="text-xl md:text-2xl font-semibold">Achievements</p>
        <p className="text-xl md:text-3xl cursor-pointer">
          {isContentOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </p>
      </div>

      {isContentOpen && (
        <div className="flex overflow-x-auto gap-4 p-4 flex-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {totalAchievements.map((achievement) => {
            const hasBadge = myProfile?.badges?.some(
              (badge) => badge.name === achievement.title
            );
            const tooltipText = hasBadge
              ? achievement.title.replace("_", " ")
              : `${achievement.title.replace("_", " ")} (Locked)`;

            return (
              <div
                key={achievement.id}
                data-tooltip-id="achievements-tooltip"
                data-tooltip-content={tooltipText}
                className={`relative min-w-[6rem] md:min-w-[8rem] h-24 md:h-32 rounded-xl overflow-hidden transition-transform ${
                  hasBadge ? "" : "grayscale"
                } hover:scale-105`}
              >
                <img
                  src={achievement.src}
                  alt={achievement.alt}
                  className="w-full h-full object-cover"
                />
                {!hasBadge && (
                  <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center text-white font-bold">
                    Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tooltip component only once */}
      <Tooltip id="achievements-tooltip" place="top" />
    </div>
  );
};

export default Achivements;
