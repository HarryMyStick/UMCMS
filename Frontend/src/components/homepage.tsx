import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
import Header from "./header";

interface NavProps {
  userId: string;
}
const Homepage: React.FC<NavProps> = ({ userId }) => {
  return (
    <div className="md-1 lg-1 mt-5 mb-8 md:w-72 focus:outline-none xl:mb-0">
      <div>
        <img
          alt="person capturing an image"
          src="https://cdn.tuk.dev/assets/templates/classified/Bitmap (1).png"
          tabindex="0"
          class="h-44 w-full focus:outline-none"
        />
      </div>
      <div className="bg-white">
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="focus:outline-none"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 4h6a2 2 0 0 1 2 2v14l-5-3l-5 3v-14a2 2 0 0 1 2 -2"></path>
            </svg>
          </div>
          <div className="rounded-full bg-yellow-200 px-6 py-1.5"></div>
        </div>
        <div className="p-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold focus:outline-none">
              iphone XS
            </h2>
          </div>
          <p className="mt-2 text-xs text-gray-600 focus:outline-none">
            The Apple iPhone XS is available in 3 colors with 64GB memory. Shoot
            amazing videos
          </p>
          <div className="mt-4 flex">
            <div></div>
            <div className="pl-2">
              <p className="bg-gray-200 px-2 py-1 text-xs text-gray-600 focus:outline-none">
                Complete box
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between py-4">
            <h2 className="text-xs font-semibold text-indigo-700 focus:outline-none">
              Bay Area, San Francisco
            </h2>
            <h3 className="text-xl font-semibold text-indigo-700 focus:outline-none"></h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
