import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { urlBackend } from "../global";

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

interface Magazine {
  sc_contribution_id: string;
  sc_article_title: string;
  sc_article_description: string;
  sc_article_content_url: string;
  sc_comment: string;
  sc_status: string;
  sc_image_url: string;
  p_first_name: string;
  p_last_name: string;
}


const Mkcoordinator: React.FC<NavProps> = ({ userId }) => {
  const router = useRouter();
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editedStatus, setEditedStatus] = useState("");

  const [publishMagazines, setPublishMagazines] = useState<Magazine[]>([]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleEditStatus = (index: number) => {
    setEditingRowIndex(index);
  };
  const handleSaveStatus = async (index: number, contributionId: string, contributionStatus: string) => {
    if (contributionStatus !== "" && "default") {
      try {
        const response = await fetch("http://localhost:3001/contribution/updateStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contribution_id: contributionId,
            status: contributionStatus,
          }),
        });
        if (response.ok) {
          showAllMagazineBelongToFaculty();
          showMagazineOfStudent();
          setEditingRowIndex(null);
          setEditedStatus("");
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingRowIndex(null); // Reset editing state
    setEditedStatus("");
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const tabs = ["Home", "Manage Contribution", "Profile"];
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);


  useEffect(() => {
    fetchProfileData();
    showAllMagazineBelongToFaculty();
    showMagazineOfStudent();
  }, []);

  const showAllMagazineBelongToFaculty = async () => {
    try {
      const response = await fetch(`${urlBackend}/users/getFacultyByUserId/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const facultyName = data.faculty_name;
        const getMagazineResponse = await fetch(`${urlBackend}/contribution/getPublishContributionsByFacultyName/${facultyName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (getMagazineResponse.ok) {
          const magazineData = await getMagazineResponse.json();
          for (const magazine of magazineData) {
            const getImageResponse = await fetch(`${urlBackend}/contribution/getImage/${magazine.sc_image_url}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });

            if (getImageResponse.ok) {
              const imageUrl = await getImageResponse.text();
              magazine.sc_image_url = imageUrl;
            }
          }
          setPublishMagazines(magazineData);
          console.log(magazineData);
        } else {
          console.error("Magazine cannot loading.");
          return;
        }
      } else {
        console.log("not ok");
        console.error("Cannot get faculty by user_id.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const showMagazineOfStudent = async () => {
    try {
      const response = await fetch(`${urlBackend}/users/getFacultyByUserId/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        const facultyName = data.faculty_name;
        const getMagazineResponse = await fetch(`${urlBackend}/contribution/getContributionsByFacultyName/${facultyName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (getMagazineResponse.ok) {
          const magazineData = await getMagazineResponse.json();
          for (const magazine of magazineData) {
            const getImageResponse = await fetch(`${urlBackend}/contribution/getImage/${magazine.sc_image_url}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              }
            });

            if (getImageResponse.ok) {
              const imageUrl = await getImageResponse.text();
              magazine.sc_image_url = imageUrl;
            }
          }
          setMagazines(magazineData);
          console.log(magazineData);
        } else {
          console.error("Magazine cannot loading.");
          return;
        }
      } else {
        console.log("not ok");
        console.error("Cannot get faculty by user_id.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  async function handleFileDownload(filename: string) {
    try {
      const response = await fetch(`${urlBackend}/contribution/getFile/${filename}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Error downloading file:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  //Start view profile
  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `${urlBackend}/profile/getProfileByUserId/${userId}`
      );
      const data = await response.json();
      const {
        profile_id,
        first_name,
        last_name,
        email,
        phone_number,
        user_id,
      } = data;
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
      } else {
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsEditing(false);
  };

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
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Home &gt;
                    </p>
                    <h1 className="mt-4 pb-6 text-3xl font-semibold text-dark md:text-4xl">
                      Magazine
                    </h1>
                  </div>
                </div>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 mt-12 mb-12">
                  <article>
                    <section className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                      {publishMagazines.map((publishMagazines) => (
                        <article key={publishMagazines.sc_contribution_id} className="bg-white group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform duration-200">
                          <div className="relative w-full h-80 md:h-64 lg:h-44">
                            <img
                              src={publishMagazines.sc_image_url}
                              alt={publishMagazines.sc_article_title}
                              className="w-full h-full object-center object-cover"
                            />
                          </div>
                          <div className="px-3 py-4">
                            <h3 className="text-sm text-gray-500 pb-2">
                              <span className="bg-indigo-600 py-1 px-2 text-white rounded-lg">
                                Author: {publishMagazines.p_first_name + ' ' + publishMagazines.p_last_name}
                              </span>
                            </h3>
                            <p className="text-base font-semibold text-gray-900 group-hover:text-indigo-600">
                              {publishMagazines.sc_article_description}
                            </p>
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                              onClick={() => handleFileDownload(publishMagazines.sc_article_content_url)}
                            >
                              <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M15.5 10l-5 5-5-5h3V4h4v6zm4.5 7H4v2h16v-2z" />
                              </svg>
                              Download Article
                            </button>
                          </div>
                        </article>
                      ))}
                    </section>
                  </article>
                </section>
              </div>
            )}
            {index === 1 &&
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Manage Contribution &gt;
                    </p>
                    <h1 className="mt-4 pb-6 text-3xl font-semibold text-dark md:text-4xl">
                      Contribution Table
                    </h1>
                  </div>
                </div>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 mt-12 mb-12" style={{ maxWidth: "75%" }}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {magazines.map((magazine, index) => (
                        <tr key={magazine.sc_contribution_id} className="bg-white">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex-shrink-0 h-20 w-20">
                              <img className="h-20 w-20 rounded-full" src={magazine.sc_image_url} alt={magazine.sc_article_title} />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{magazine.sc_article_title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{magazine.p_first_name} {magazine.p_last_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{magazine.sc_article_description}</div>
                          </td>
                          <td className="px-2 py-2 whitespace-nowrap relative w-1/6">
                            {editingRowIndex === index ? (
                              <div className="flex items-center">
                                <select
                                  className="text-sm text-gray-900"
                                  defaultValue={"default"}
                                  value={editedStatus}
                                  onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setEditedStatus(selectedValue);
                                  }}
                                >
                                  <option value="default">Select Status</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Published">Published</option>
                                  <option value="Denined">Denined</option>
                                </select>
                                <button
                                  className="text-green-600 hover:text-green-900 p-1 mr-1"
                                  onClick={() => handleSaveStatus(index, magazine.sc_contribution_id, editedStatus)}
                                >
                                  Save
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-900 p-1"
                                  onClick={() => handleCancelEdit()}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <div className="text-sm text-gray-900">{magazine.sc_status}</div>
                                <button
                                  className="absolute top-0 right-0 text-green-600 hover:text-green-900 p-1"
                                  onClick={() => handleEditStatus(index)}
                                >
                                  <svg
                                    className="w-5 h-5 mt-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-2 whitespace-wrap relative">
                            <div className="w-full">{magazine.sc_comment}</div>
                            <button
                              className="absolute top-0 right-0 text-green-600 hover:text-green-900"
                            // onClick={() => handleEditComment(index)}
                            >
                              <svg className="w-5 h-5 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" />
                              </svg>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <button
                              className="text-green-600 hover:text-green-900"
                              onClick={() => handleFileDownload(magazine.sc_article_content_url)}
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 10l-5 5-5-5h3V4h4v6zm4.5 7H4v2h16v-2z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>
            }
            {/* Start View Profile */}
            {index === 2 && (
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
                                readOnly={!isEditing}
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
                                readOnly={!isEditing}
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
                                readOnly={!isEditing}
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
                                readOnly={!isEditing}
                              />
                            </div>
                          </div>
                        </div>
                        <hr className="border-b-1 border-blueGray-300 mt-6" />
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

export default Mkcoordinator;
