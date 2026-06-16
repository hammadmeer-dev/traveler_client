import React, { useState } from 'react';
import ImageOne from "../assets/Images/Slider/one.jpg";
import ImageTwo from "../assets/Images/Slider/two.jpg";
import ImageThree from "../assets/Images/Slider/three.jpg";
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';

const Carousel = ({data}) => {
    const slides = data;
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="overflow-hidden relative w-full h-64 md:h-96 lg:h-[500px] pt-5">
            {/* Slide Container */}
            <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide.url}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover flex-shrink-0"
                    />
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
                <button
                    onClick={handlePrev}
                    className="bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-gray-700"
                >
                    <CgChevronLeft size={30} />
                </button>
                <button
                    onClick={handleNext}
                    className="bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-gray-700"
                >
                    <CgChevronRight size={30} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            index === currentIndex
                                ? 'bg-white'
                                : 'bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;