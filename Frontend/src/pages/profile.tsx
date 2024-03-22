/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { urlBackend } from "../global";

export const Profile: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const firstname = useRef<HTMLInputElement>(null);
  const lastname = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phonenumber = useRef<HTMLInputElement>(null);

  const { user_id } = router.query;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const updateProfile = async () => {
    const fieldFirstName = firstname.current?.value.trim();
    const fieldLastName = lastname.current?.value.trim();
    const fieldEmail = email.current?.value.trim();
    const fieldPhoneNumber = phonenumber.current?.value.trim();

    if (!fieldFirstName || !fieldLastName || !fieldEmail || !fieldPhoneNumber) {
      setErrorMessage("Please enter all required information.");
      return;
    }

    try {
      const responseGetProfile = await fetch(`${urlBackend}/profile/getProfileByUserId/${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (responseGetProfile.ok) {
        const profile_id = await responseGetProfile.json();
        const response = await fetch(`${urlBackend}/profile/updateProfile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_id: profile_id.profile_id,
            first_name: fieldFirstName,
            last_name: fieldLastName,
            email: fieldEmail,
            phone_number: fieldPhoneNumber,
          }),
        });

        if (response.ok) {
          await router.push("/login");
        } else if (response.status === 409) {
          setErrorMessage("This account already exists.");
        } else {
          throw new Error("Failed to register user.");
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage("An error occurred while registering.");
    }
  };

  return (
    <div className="bg-gradient-to-tr from-sky-200 to-sky-500">
      <section
        className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-4"
      >
        <div className="rounded bg-sky-100 p-6">
          <div className="m-3 flex items-center justify-center text-4xl font-black text-sky-900">
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
          <div
            className="flex flex-col justify-center"
          >
            <label className="text-sm font-medium">First Name</label>
            <input
              className="mb-2 mb-3 mt-1 block w-full rounded-md border border-gray-500 px-2 px-2 py-1.5 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              type="text"
              name="firstname"
              placeholder="first name"
              required
              ref={firstname}
            />
            <label className="text-sm font-medium">Last Name</label>
            <input
              className="mb-2 mt-1 block w-full rounded-md border border-gray-500 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              type="text"
              name="lastname"
              placeholder="last name"
              required
              ref={lastname}
            />
            <label className="text-sm font-medium">Email</label>
            <input
              className="mb-2 mt-1 block w-full rounded-md border border-gray-500 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              type="email"
              name="email"
              placeholder="nguyenvana@gmail.com"
              required
              ref={email}
            />
            <label className="text-sm font-medium">Phone Number</label>
            <input
              className="mb-2 mt-1 block w-full rounded-md border border-gray-500 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              type="tel"
              name="phonenumber"
              placeholder="09*******"
              required
              ref={phonenumber}
            />
            {errorMessage && (
              <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 text-yellow-900 text-sm">
                {errorMessage}
              </div>
            )}
            <button
              className="mb-5 mt-3 block rounded-md bg-sky-600 px-6 py-1.5 font-medium text-gray-100 shadow-lg transition duration-300 hover:bg-sky-700"
              onClick={() => {
                void updateProfile();
              }}
            >Update Profile</button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Profile;
