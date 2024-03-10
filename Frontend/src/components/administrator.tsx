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
const Administrator: React.FC = () => {
  const router = useRouter();
  const handleClick = (index: number) => {
    setActiveTab(index);
  };
  const handleLogout = () => {
    // Implement your logout functionality here
    // For example, clearing local storage or session
    router.push("/login"); // Redirect to login page after logout
  };
  const tabs = ["Home", "Magazin", "Submit Contribution", "Profile"];
  const [activeTab, setActiveTab] = useState(0);
  // Start Upload
  const [profile, setProfile] = useState<Profile | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [wordFile, setWordFile] = useState<File | null | undefined>(null);

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImageFiles(filesArray);
    }
  };

  const handleWordFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setWordFile(event.target.files[0]);
    }
  };

  const fetchUploadData = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", "2d100507-8be5-4ee9-9f13-e74a795eb97e");
      formData.append("article_title", "Sample Article Title");
      formData.append(
        "article_description",
        "Sample article description goes here."
      );
      formData.append("submission_date", "2024-03-09T12:00:00Z");
      formData.append("edit_date", "2024-03-09T12:00:00Z");
      formData.append("status", "Published");
      formData.append(
        "academic_year_id",
        "2891d2f3-8862-4b6a-8e0c-ee3ab56a1514"
      );
      formData.append("articleFile", wordFile as Blob);

      const response = await fetch(
        `${urlBackend}/contribution/createContribution/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        // Handle success
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  //End Upload

  //Start view profile
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
  //End view profile

  // async function uploadFile(contributionId, file) {
  //   const formData = new FormData();
  //   formData.append('contribution_id', contributionId);
  //   formData.append('file', file);

  //   try {
  //     const response = await axios.post('http://your-api-url/filesupload/uploadFile', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     console.log('File uploaded successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   }
  // }

  return (
    <div className="bg_white flex flex-col">
      <div className="ml-10 mr-10 max-w-screen-2xl px-6 text-base">
        <nav className="flex flex-row items-center justify-between p-3">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold text-sky-950">
              <div className="text-sky-1000 flex h-1 w-auto items-center justify-center text-4xl font-black">
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
            className="ease bg_red rounded px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 hover:shadow-md focus:outline-none active:bg-teal-600"
            onClick={handleLogout}
          >
            Logout
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
            {index === 2 && (
              <div>
                <div className="flex items-center justify-center p-12">
                  <div className="mx-auto w-full max-w-[550px] bg-white">
                    <form
                      className="px-9 py-6"
                      action="https://formbold.com/s/FORM_ID"
                      method="POST"
                    >
                      <div className="mb-6 pt-4">
                        <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                          Upload Image
                        </label>
                        <div className="mb-8">
                          <input
                            type="file"
                            multiple
                            name="imageFiles"
                            id="imageFiles"
                            className="sr-only"
                            onChange={handleImageFileChange}
                          />
                          <label
                            htmlFor="imageFiles"
                            className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                          >
                            <div>
                              <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                                Drop image files here
                              </span>
                              <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                Or
                              </span>
                              <span className="inline-flex rounded border border-[#e0e0e0] px-7 py-2 text-base font-medium text-[#07074D]">
                                Browse
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="mb-6">
                          <h2 className="mb-2 block text-xl font-semibold text-[#07074D]">
                            Selected Image Files:
                          </h2>
                          {imageFiles.map((file, index) => (
                            <p key={index}>{file.name}</p>
                          ))}
                        </div>

                        <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                          Upload Word File
                        </label>
                        <div className="mb-8">
                          <input
                            type="file"
                            name="wordFile"
                            id="wordFile"
                            className="sr-only"
                            onChange={handleWordFileChange}
                          />
                          <label
                            htmlFor="wordFile"
                            className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
                          >
                            <div>
                              <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                                Drop Word file here
                              </span>
                              <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                Or
                              </span>
                              <span className="inline-flex rounded border border-[#e0e0e0] px-7 py-2 text-base font-medium text-[#07074D]">
                                Browse
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h2 className="mb-2 block text-xl font-semibold text-[#07074D]">
                          Selected Word File:
                        </h2>
                        {wordFile && <p>{wordFile.name}</p>}
                      </div>

                      <div>
                        <button
                          onClick={fetchUploadData}
                          className="hover:shadow-form w-full rounded-md bg-[#6A64F1] px-8 py-3 text-center text-base font-semibold text-white outline-none"
                        >
                          Send Files
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Start View Profile */}
            {index === 3 && (
              <div>
                <div>
                  <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                    <div className="bg_blue relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                      <div className="bg_nude mb-0 rounded-t px-6 py-6">
                        <div className="flex justify-between text-center ">
                          <button className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-700">
                            <svg
                              className="h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 17 14"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 1h15M1 7h15M1 13h15"
                              ></path>
                            </svg>
                          </button>
                          <h6 className="text-blueGray-700 text-xl font-bold">
                            My Account
                          </h6>
                          <Link href={`/edit-profile/${profile?.user_id}`}>
                            <button
                              className="bg_blue mr-1 rounded px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
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

export default Administrator;
