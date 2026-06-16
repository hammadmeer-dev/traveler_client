import React from "react";
import logo from "../assets/Images/t.gif";
import staticlogo from "../assets/Images/logoLight.png";
const Loader = () => {
  return (
    <div className="pt-36 flex justify-center">
      <img src={logo} alt={staticlogo} className="w-44 h-44" />
    </div>
  );
};

export default Loader;
