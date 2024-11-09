"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [dropDown, setDropDown] = useState(false)
  const [userData, setUserData] = useState({});
  const route = useRouter();

  useEffect(() => {
    const chekingLogin = () =>{
      if (Cookies.get("userID")) {
        fetch(`/api/v1/user/${Cookies.get("userID")}`)
          .then((res) => res.json())
          .then((data) => setUserData(data))
          .catch(() => route.push("/login"));
      } else {
        route.push("/login");
      }
    }
    chekingLogin()
    
  }, []);

  return (
    <nav className="bg-accent sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        <a href="/" className="flex items-center text-xl font-bold">
          <img
            src="/images/icons/Logo.png"
            alt="logo"
            className="h-16 w-16 object-contain"
          />
          <span className="ml-2">ProgCast</span>
        </a>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered rounded-lg px-4 py-2 w-24 md:w-64"
          />
          <div className="relative">
            <button className="focus:outline-none" onClick={()=>setDropDown(!dropDown)}>
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={
                  userData.image ||
                  "https://flyclipart.com/thumb2/account-avatar-head-human-male-man-people-person-profile-873990.png"
                }
                alt="User avatar"
              />
            </button>
            {dropDown && <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={()=>{route.push(`/profile/${userData.username}`)}}>
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={()=>{route.push("/create")}}>
                      Create
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Settings
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={()=>{Cookies.remove("userID"); route.push("/login")}}>
                  Logout
                </li>
                </ul>}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
