"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { MdHome } from "react-icons/md";
import { TfiLayoutMediaLeftAlt } from "react-icons/tfi";
import { IoFileTrayStackedOutline } from "react-icons/io5";


const Sidebar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleUserData = async () => {
      const userID = Cookies.get("userID");
      if (userID) {
        try {
          const response = await fetch(`/api/v1/user/${userID}`);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data = await response.json();
          setUserData(data);
        } catch (err) {
          setError(err.message);
        }
      } else {
        router.push('/login');  // Redirect if no userID is found in cookies
      }
      setLoading(false);
    };

    handleUserData();
  }, [router]);

  

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <aside className="fixed pt-20 left-0 h-screen w-64 bg-[#191919] text-white flex flex-col">
      <div className="py-4">
        <ul className="space-y-4 px-4">
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <MdHome size={24} />
            <span>Home</span>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <TfiLayoutMediaLeftAlt size={24} />
            <span>Browser</span>
          </li>
          <li className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded">
            <IoFileTrayStackedOutline size={24} />
            <span>Saved</span>
          </li>
        </ul>
      </div>
      <hr className="h-px mx-2 my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex flex-col justify-end px-4">
        <h4 className="text-lg">Subscriptions:</h4>
        {
          !loading ?
            (
              <ul className="space-y-2 mt-2">
                {userData && userData.substo.length > 0 ? (
                  userData.substo.map((sub) => (
                    <li key={sub._id} className="hover:bg-gray-700 p-2 rounded flex items-center cursor-pointer"
                        onClick={() => router.push(`/profile/${sub.username}`)}>
                      <img src={sub.image} alt="" srcset={sub.image} className="h-8 w-8 rounded-full mr-2" />{sub.username}
                    </li>
                  ))
                ) : (
                  <li>No subscriptions found</li>
                )}
              </ul>
            ) : 
            (
              <p>Loading ...</p>
            )
          
        }
        
      </div>
    </aside>
  );
};

export default Sidebar;
