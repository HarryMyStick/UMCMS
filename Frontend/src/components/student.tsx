// Nav.tsx

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
import Header from "./header";

interface NavProps {
  userId: string;
}

interface Profile {
  profile_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  user_id: string;
}
const Student: React.FC<NavProps> = ({ userId }) => {
  const router = useRouter();
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [titleValue, setTitleValue] = useState<string>('');
  const [descriptionValue, setDescriptionValue] = useState<string>('');

  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    setIsEditing(true);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);
  
  // start method reset form submit contributions
  const handleSentFile = async () => {
    try {
      await fetchUploadData(); // Gửi dữ liệu
      resetForm(); // Đặt lại form sau khi gửi dữ liệu
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  };

  const resetForm = () => {
    // Đặt lại trạng thái của các trường trong form
    setWordFile(null);
    setImageFiles(null);
    setTitleValue('');
    setDescriptionValue('');
    // Đặt lại trạng thái của các trường khác nếu cần thiết
  };
  // end method reset form submit contributions

  const [wordFile, setWordFile] = useState<File | null | undefined>(null);
  const [imageFile, setImageFiles] = useState<File | null | undefined>(null);

  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    // Implement your logout functionality here
    // For example, clearing local storage or session
    router.push("/login"); // Redirect to login page after logout
  };
  const tabs = ["Home", "Magazine", "Submit Contribution", "Profile"];
  const [activeTab, setActiveTab] = useState(0);

  //Start view profile
  useEffect(() => {
    fetchProfileData();
  }, []);
  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `${urlBackend}/profile/getProfileByUserId/${userId}`
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

  const handleSaveProfile = async () => {
    const fieldFirstName = firstName.current?.value.trim();
    const fieldLastName = lastName.current?.value.trim();
    const fieldEmail = email.current?.value.trim();
    const fieldPhoneNumber = phoneNumber.current?.value.trim();
    if (!fieldFirstName || !fieldLastName || !fieldEmail || !fieldPhoneNumber) {
      setErrorMessage("Please enter full information.");
      return;
    }
    try {
      const response = await fetch(`${urlBackend}/profile/updateProfile`, {
        method: "POST",
        body: JSON.stringify(
          {
            profile_id: profile.profile_id,
            first_name: fieldFirstName,
            last_name: fieldLastName,
            email: fieldEmail,
            phone_number: fieldPhoneNumber
          }
        ),
        headers: {
          "Content-Type": "application/json",
        },

      });
      if (response.ok) {
        // Cập nhật trạng thái chỉnh sửa thành false hoặc xử lý thông báo thành công
      } else {
        // Xử lý lỗi
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsEditing(false);
  };



  const handleClick = (index: number) => {
    setActiveTab(index);
  };




  // Start Upload

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFiles(event.target.files[0]);
    }
  };
  const handleWordFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setWordFile(event.target.files[0]);
    }
  };

  const fetchUploadData = async () => {
    try {
      const fieldTitle = title.current?.value?.trim() || '';
      const fieldDescription = description.current?.value?.trim() || '';
      if(fieldTitle === "" || fieldDescription ===""){
        setErrorMessage("Please enter full information.");
      }
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("article_title", fieldTitle);
      formData.append("article_description", fieldDescription);
      formData.append("submission_date", "2024-03-09T12:00:00Z");
      formData.append("edit_date", "2024-03-09T12:00:00Z");
      formData.append("status", "Published");
      formData.append("academic_year_id", "2891d2f3-8862-4b6a-8e0c-ee3ab56a1514");
      formData.append("articleFile", wordFile as Blob);


      const response = await fetch(`${urlBackend}/contribution/createContribution/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the response body contains JSON data
        const contributionId = data.contribution_id;
        const dataFormImage = new FormData();
        dataFormImage.append("contribution_id", contributionId);
        dataFormImage.append("imageFile", imageFile as Blob);

        const uploadImageResponse = await fetch(`${urlBackend}/contribution/uploadImage/`, {
          method: "POST",
          body: dataFormImage,
        });

        if (uploadImageResponse.ok) {
          // Image upload successful
        } else {
          setErrorMessage("Please enter full information.");
          return;
        }
      } else {
        // Handle error
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  //End Upload



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
                    className={`inline-block rounded-t-lg border-b-2 border-transparent p-4 hover:border-red-400 hover:text-gray-600 dark:hover:text-gray-300 ${index === activeTab
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
            {index === 2 &&
              <div>
                <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                  <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                    <div className="mb-0 rounded-t bg_nude px-6 py-6">
                      <div className="flex justify-between text-center ">
                        <h6 className="text-blueGray-700 text-xl font-bold">
                          My Contribution
                        </h6>
                        <button
                          onClick={() => handleSentFile()}
                          className="mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                          type="button"
                        >
                          Sent File
                        </button>
                      </div>
                    </div>
                    <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                      <form>
                        {errorMessage && (
                          <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 text-yellow-900 text-sm">
                            {errorMessage}
                          </div>
                        )}
                        <div className="text-blueGray-400 mb-6 mt-3 text-sm font-bold uppercase">
                          <div className="flex flex-wrap">
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Title:
                                </label>
                                <input
                                  type="email"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  placeholder="Input Title"
                                  value={titleValue}
                                  onChange={(e) => setTitleValue(e.target.value)}
                                  ref={title}
                                />
                              </div>
                            </div>
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="description">
                                  Description
                                </label>
                                <input
                                  type="email"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  placeholder="Input Description"
                                  value={descriptionValue}
                                  onChange={(e) => setDescriptionValue(e.target.value)}
                                  ref={description}
                                />
                              </div>
                            </div>
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Upload Image File
                                </label>
                                <div className="mb-8">
                                  <input type="file" multiple name="imageFiles" id="imageFiles" className="sr-only" onChange={handleImageFileChange} />
                                  <label htmlFor="imageFiles" className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
                                    <div>
                                      <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                        Drop Image file here
                                      </label>
                                      <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                        Or
                                      </span>
                                      <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                        Browse
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Upload Word File
                                </label>
                                <div className="mb-8">
                                  <input type="file" name="wordFile" id="wordFile" className="sr-only" onChange={handleWordFileChange} />
                                  <label htmlFor="wordFile" className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
                                    <div>
                                      <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                        Drop Word file here
                                      </label>
                                      <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                        Or
                                      </span>
                                      <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                                        Browse
                                      </span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Sellected image file:
                                </label>
                                {imageFile && <p>{imageFile.name}</p>}
                              </div>
                            </div>

                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                  Sellected word file:
                                </label>
                                {wordFile && <p>{wordFile.name}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            }
            {/* Start View Profile */}
            {index === 3 && (
              <div>
                <div>
                  <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                    <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                      <div className="mb-0 rounded-t bg_nude px-6 py-6">
                        <div className="flex justify-between text-center ">
                          <h6 className="text-blueGray-700 text-xl font-bold">
                            My Account
                          </h6>
                          {isEditing ? (
                            <button
                              className="mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                              type="button"
                              onClick={handleSaveProfile}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                              type="button"
                              onClick={handleEditProfile}
                            >
                              Edit
                            </button>
                          )}
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
                                  className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring ${isEditing ? '' : 'cursor-not-allowed'
                                    }`}
                                  value={profile.first_name}
                                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                  ref={firstName}
                                  readOnly={!isEditing} // Sử dụng readOnly để ngăn người dùng chỉnh sửa
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
                                  type="text"
                                  className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring ${isEditing ? '' : 'cursor-not-allowed'
                                    }`}
                                  value={profile.last_name}
                                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                                  ref={lastName}
                                  readOnly={!isEditing} // Sử dụng readOnly để ngăn người dùng chỉnh sửa
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
                                  className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring ${isEditing ? '' : 'cursor-not-allowed'
                                    }`}
                                  value={profile.email}
                                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                  ref={email}
                                  readOnly={!isEditing} // Sử dụng readOnly để ngăn người dùng chỉnh sửa
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
                                  className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring ${isEditing ? '' : 'cursor-not-allowed'
                                    }`}
                                  value={profile.phone_number}
                                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                  ref={phoneNumber}
                                  readOnly={!isEditing} // Sử dụng readOnly để ngăn người dùng chỉnh sửa
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
    </div >
  );
};

export default Student;
