// Nav.tsx

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
import Header from "./header";




interface Profile {
  profile_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  user_id: string;
}
const Nav: React.FC = () => {
  const router = useRouter();
  const handleLogout = () => {
    // Implement your logout functionality here
    // For example, clearing local storage or session
    router.push("/login"); // Redirect to login page after logout
  };
  const tabs = ["Home", "Magazin", "Submit Contribution", "Profile"];
  const [activeTab, setActiveTab] = useState(0);

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `${urlBackend}/profile/getProfileByUserId/2d100507-8be5-4ee9-9f13-e74a795eb97e`
      );
      const data = await response.json(); // Parse response body as JSON
      const {
        profile_id,
        first_name,
        last_name,
        email,
        phone_number,
        user_id,
      } = data; // Destructure necessary fields
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      setProfile({
        profile_id,
        first_name,
        last_name,
        email,
        phone_number,
        user_id,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="flex flex-col bg_white">
      <div className="ml-10 mr-10 max-w-screen-2xl px-6 text-base">
        <nav className="flex flex-row items-center justify-between p-3">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold text-sky-950">
              <div className="flex h-1 w-auto items-center justify-center text-4xl font-black text-sky-1000">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3 h-10 w-10"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                </svg>
                <h1 className="tracking-wide">
                  UMCMS<span className="font-mono">™</span>
                </h1>
              </div>
            </div>
            <ul className="hidden flex-wrap items-center justify-center pl-24 text-base md:ml-auto md:mr-auto md:flex">
              {tabs.map((tab, index) => (
                <li key={index} className="me-2" role="presentation">
                  <button
                    onClick={() => handleClick(index)}
                    className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-red-400 hover:text-gray-600 dark:hover:text-gray-300 ${
                      index === activeTab
                        ? "text-gray-600 dark:text-gray-900"
                        : ""
                    }`}
                    id="profile-tab-example"
                    type="button"
                    role="tab"
                    aria-controls="profile-example"
                    aria-selected={index === activeTab}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
            
          </div>
          <button
              className="ease rounded bg_red px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 hover:shadow-md focus:outline-none active:bg-teal-600"
              onClick={handleLogout}
            >Logout
            </button>
        </nav>
      </div>

      <div>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`mb-4 ${activeTab === index ? "block" : "hidden"}`}
          >
            {index === 0 && (
              <div>
                <Header />
              </div>
            )}
            {index === 1 && <div>Content of 1 tab</div>}
            {index === 2 && <div>Content of 2 tab</div>}
            {/* Start View Profile */}
            {index === 3 && (
              <div>
                <div>
                  <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                    <div className="bg_blue relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                      <div className="mb-0 rounded-t bg_nude px-6 py-6">
                        <div className="flex justify-between text-center ">
                          <button className="ml-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 inline-flex items-center justify-center w-10 h-10">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 17 14">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"></path>
                            </svg>
                          </button>
                          <h6 className="text-blueGray-700 text-xl font-bold">
                            My Account
                          </h6>
                          <Link
                            href={`/edit-profile/2d100507-8be5-4ee9-9f13-e74a795eb97e`}
                          >
                            <button
                              className="mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                              type="button"
                            >
                              Edit
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                        <form>
                          <h6 className="text-blueGray-400 mb-6 mt-3 text-sm font-bold uppercase">
                            Profile Information
                          </h6>
                          <div className="flex flex-wrap">
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="first_name"
                                >
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  disabled
                                  defaultValue={profile.first_name}
                                />
                              </div>
                            </div>
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="last_name"
                                >
                                  Last Name
                                </label>
                                <input
                                  type="email"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  disabled
                                  defaultValue={profile.last_name}
                                />
                              </div>
                            </div>
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="email"
                                >
                                  Email Address
                                </label>
                                <input
                                  type="text"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  disabled
                                  defaultValue={profile.email}
                                />
                              </div>
                            </div>
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="phone_number"
                                >
                                  Phone Number
                                </label>
                                <input
                                  type="text"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  disabled
                                  defaultValue={profile.phone_number}
                                />
                              </div>
                            </div>
                          </div>
                          <hr className="border-b-1 border-blueGray-300 mt-6" />
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* End View Profile */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nav;
