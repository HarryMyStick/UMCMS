/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { urlBackend } from "../global";

export const Register: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  const registerUser = async () => {
    const fieldUsername = username.current?.value.trim();
    const fieldPassword = password.current?.value.trim();
    const fieldConfirmPassword = confirmPassword.current?.value.trim();

    if (!fieldUsername || !fieldPassword || !fieldConfirmPassword) {
      setErrorMessage("Please enter all required information.");
      return;
    }

    if (fieldPassword !== fieldConfirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${urlBackend}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: fieldUsername,
          password: fieldPassword,
        }),
      });

      if (response.ok) {
        await router.push("/login");
      } else if (response.status === 409) {
        setErrorMessage("This account already exists.");
      } else {
        throw new Error("Failed to register user.");
      }
    } catch (error) {
      console.error("Error registering user:", error);

      console.log("Error registering user:", error);
      setErrorMessage("An error occurred while registering.");
    }
  };

  return (
    <div className="bg-gradient-to-tr from-sky-200 to-sky-500">
      <section
        id="login"
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
          <form
            id="login_form"
            action="api_login"
            method="POST"
            className="flex flex-col justify-center"
          >
            <label className="text-sm font-medium">Username</label>
            <input
              className="mb-2 mb-3 mt-1 block w-full rounded-md border border-gray-500 px-2 px-2 py-1.5 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              type="text"
              name="username"
              placeholder="Username"
              required
            />
            <label className="text-sm font-medium">Password</label>
            <input
              className="mb-2 mt-1 block w-full rounded-md border border-gray-500 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              type="password"
              name="password"
              placeholder="********"
              required
            />
            <label className="text-sm font-medium">Re-Pasword</label>
            <input
              className="mb-2 mt-1 block w-full rounded-md border border-gray-500 px-2 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500"
              type="password"
              name="password"
              placeholder="********"
              required
            />
            <label className="text-sm font-medium">Faculty</label>
            <select className="mb-2 mb-3 mt-1 block w-full rounded-md border border-gray-500 px-2 px-2 py-1.5 py-1.5 text-sm placeholder-gray-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:invalid:border-red-500 focus:invalid:ring-red-500" name="cars">
              <option className="mb-2 mb-3 mt-1 block w-full rounded-md border" value="Information Technology">Information Technology</option>
              <option value="Business Marketing">Business Marketing</option>
              <option value="Graphic Design">Graphic Design</option>
            </select>

            <button
              className="mb-5 mt-3 block rounded-md bg-sky-600 px-6 py-1.5 font-medium text-gray-100 shadow-lg transition duration-300 hover:bg-sky-700"
              type="submit"
            >
              <span id="login_process_state" className="hidden">
                Checking ...
              </span>
              <span id="login_default_state">Sign up</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
export default Register;
