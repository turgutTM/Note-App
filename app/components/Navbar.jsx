import React from "react";

import { GoSearch } from "react-icons/go";
import { useSelector } from "react-redux";

const Navbar = ({ selectedComponent }) => {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="flex p-4 justify-between w-full ">
      <div className="text-4xl ml-2">
        <p className="amatic-sc-bold">
          {selectedComponent.charAt(0).toUpperCase() +
            selectedComponent.slice(1)}
        </p>
      </div>
      <div className="bg-gray-100 hover:bg-gray-50 duration-150 rounded-xl flex p-2 gap-2 items-center group">
        <GoSearch />
        <input
          className="bg-gray-100 outline-none group-hover:bg-gray-50 duration-150 focus:outline-none"
          placeholder="Search for notes"
        />
      </div>

      <div className="flex text-base items-center gap-3 mr-2 font-semibold">
        <img
          className="w-8 h-8 rounded-full"
          src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
        ></img>
        <p>
          {user.name} {user.surname}
        </p>
      </div>
    </div>
  );
};

export default Navbar;
