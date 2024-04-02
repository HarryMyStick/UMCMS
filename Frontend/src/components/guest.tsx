import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
import Chart from 'chart.js/auto';

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

interface AcademicYear {
  academic_year_id: string;
  academic_year: string;
}


const Guest: React.FC<NavProps> = ({ userId }) => {
  const router = useRouter();
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [profile, setProfile] = useState<Profile | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedYear, setEditedYear] = useState("");

  const [editedYearStat, setEditedYearStat] = useState("");

  const [publishMagazines, setPublishMagazines] = useState<Magazine[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);


  const tabs = ["Home", "Statistical Analysis", "Profile", "Help"];
  const [activeTab, setActiveTab] = useState(() => {
    const storedTabIndex = sessionStorage.getItem("activeTabIndex");
    const tabsLength = tabs.length;
    return storedTabIndex && parseInt(storedTabIndex) < tabsLength ? parseInt(storedTabIndex) : 0;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      displayMessage("", "");
    }, 3000);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    if ((editedYear === "default") || (editedYear === "")) {
      showAllMagazineBelongToFaculty();
    } else {
      showAllMagazineByFacultyAndYear(editedYear);
    }
    fetchProfileData();
    getAcademicYear();
    fetchDataChart('2024');
  }, []);

  useEffect(() => {
    sessionStorage.setItem("activeTabIndex", activeTab.toString());
  }, [activeTab]);

  const handleChangeYear = (year: string) => {
    if ((year === "default") || (year === "")) {
      showAllMagazineBelongToFaculty();
    } else {
      showAllMagazineByFacultyAndYear(year);
    }
  }

  const displayMessage = (type: any, message: any) => {
    setNotification({ type, message });
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    router.push("/login");
  };

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleYearChange = (selectedYear: string) => {
    setEditedYearStat(selectedYear);
    fetchDataChart(selectedYear);
  }

  const fetchDataChart = async (year: string) => {
    try {
      const response = await fetch(`${urlBackend}/users/getFacultyByUserId/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const faculty_name = data.faculty_name;

        const contributionResponse = await fetch(`${urlBackend}/contribution/statisticContributionPerYearPerFaculty/${year}/${faculty_name}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (contributionResponse.ok) {
          const contributionData = await contributionResponse.json();

          let chartElement = document.getElementById("myChartCounts");

          if (contributionData.length === 0) {
            // If contributionData is empty
            if (chartElement) {
              // If chart already exists, destroy it and change canvas to div (no data)
              const chart = Chart.getChart(chartElement as HTMLCanvasElement);
              if (chart) {
                chart.destroy();
              }
              chartElement.outerHTML = '<div id="myChartCounts" class="text-2xl text-black" style="text-align: center;">There is no contributions be contribute this year!!</div>';
            } else {
              // If chart doesn't exist, change canvas to div (no data)
              chartElement = document.createElement("div");
              chartElement.id = "myChartCounts";
              chartElement.style.textAlign = "center";
              document.body.appendChild(chartElement);
              chartElement.innerHTML = "No data";
            }
          } else {
            // If contributionData is not empty
            if (chartElement && chartElement.tagName.toLowerCase() === "div") {
              // If div (no data) exists, replace it with canvas tag and show chart
              const canvasContribution = document.createElement("canvas");
              canvasContribution.id = "myChartCounts";
              chartElement.replaceWith(canvasContribution);
              chartElement = canvasContribution;
            }

            // Render chart
            const canvasContribution = chartElement as HTMLCanvasElement;
            const approvedCount = parseInt(contributionData.approvedcount);
            const totalCount = parseInt(contributionData.totalcount);
            const unApprovedCount = totalCount - approvedCount;

            new Chart(canvasContribution, {
              type: 'bar',
              data: {
                labels: ['Total', 'Approved', 'Unapproved'],
                datasets: [{
                  label: 'Total Contribution',
                  data: [totalCount, approvedCount, unApprovedCount],
                  backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                  ],
                  borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                  ],
                  borderWidth: 1,
                }]
              },
              options: {
                scales: {
                  y: {
                    stacked: true,
                    ticks: {
                      stepSize: 1
                    }
                  },
                  x: {
                    stacked: true
                  }
                },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  }
                }
              }
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const showAllMagazineByFacultyAndYear = async (year: string) => {
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
        const getMagazineResponse = await fetch(`${urlBackend}/contribution/getPublishContributionsByFacultyNameAndByYear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            faculty_name: facultyName,
            year: year,
          }),
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
        } else {
          console.log("Magazine cannot loading.");
          return;
        }
      } else {
        console.log("Cannot get faculty by user_id.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

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
        } else {
          console.log("Magazine cannot loading.");
          return;
        }
      } else {
        console.log("Cannot get faculty by user_id.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };
  const getAcademicYear = async () => {
    try {
      const response = await fetch(`${urlBackend}/academicyear/getAllAcademicYear`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const academicYearData = await response.json();
        setAcademicYears(academicYearData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

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

  const handleSaveProfile = async () => {
    const fieldFirstName = firstName.current?.value.trim();
    const fieldLastName = lastName.current?.value.trim();
    const fieldEmail = email.current?.value.trim();
    const fieldPhoneNumber = phoneNumber.current?.value.trim();
    if (!fieldFirstName || !fieldLastName || !fieldEmail || !fieldPhoneNumber) {
      displayMessage("warning", "Please enter full information.");
      return;
    }
    try {
      const saveProfileResponse = await fetch(`${urlBackend}/profile/updateProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_id: profile.profile_id,
          first_name: fieldFirstName,
          last_name: fieldLastName,
          email: fieldEmail,
          phone_number: fieldPhoneNumber
        }),
      });
      if (saveProfileResponse.ok) {
        setIsEditing(false);
        fetchProfileData();
        displayMessage("success", "Change profile successfully.");
      } else {
        displayMessage("error", "Change profile unsuccessfully due to some error.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
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
            className="ease rounded bg-gray-700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 hover:shadow-md focus:outline-none active:bg-gray-600"
            onClick={handleLogout}
          >Sign out
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
                  <div className="flex justify-end mb-4">
                    <select
                      className="text-center block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      defaultValue={"default"}
                      value={editedYear}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        setEditedYear(selectedValue);
                        handleChangeYear(selectedValue);
                      }}
                    >
                      <option value="default">All Year</option>
                      {academicYears.map((year) => (
                        <option key={year.academic_year_id} value={year.academic_year}>
                          {year.academic_year}
                        </option>
                      ))}
                    </select>
                  </div>
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
                              <span className="bg-gray-600 py-1 px-2 text-white rounded-lg">
                                Author: {publishMagazines.p_first_name + ' ' + publishMagazines.p_last_name}
                              </span>
                            </h3>
                            <p className="text-base font-semibold text-gray-900 group-hover:text-gray-600">
                              {publishMagazines.sc_article_description}
                            </p>
                            <button
                              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
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
            {index === 1 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Statistical Analysis &gt;
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">
                      Statistic Chart<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-3 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 mt-12 mb-12">
                  <div className="flex justify-end mb-4">
                    <select
                      className="text-center block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      defaultValue={"default"}
                      value={editedYearStat}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        setEditedYearStat(selectedValue);
                        handleYearChange(selectedValue);
                      }}
                    >
                      <option value="2024">All Year</option>
                      {academicYears.map((year) => (
                        <option key={year.academic_year_id} value={year.academic_year}>
                          {year.academic_year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="container mx-auto px-4 py-8">
                    <h1 className="text-2xl font-semibold text-center mb-6">Statistic Based On Number Of Contributions Within Faculty In Year {editedYearStat === '' || editedYearStat === 'default' ? '2024' : editedYearStat}</h1>
                    <div className="grid grid-cols-1 gap-8">
                      <div className="chart-container">
                        <div className="flex justify-center">
                          <div className="w-[800px] max-w-xl mx-auto">
                            <canvas id="myChartCounts"></canvas>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {index === 2 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Profile information &gt;
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">
                      Your profile information<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-3 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                    {notification && (
                      <div
                        className={`p-3 text-sm rounded-md ${notification.type === "error"
                          ? "bg-red-100 border border-red-300 text-red-900"
                          : notification.type === "warning"
                            ? "bg-yellow-100 border border-yellow-300 text-yellow-900"
                            : notification.type === "success"
                              ? "bg-green-100 border border-green-300 text-green-900"
                              : ""
                          }`}
                      >
                        {notification.message}
                      </div>
                    )}
                    <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                      {isEditing ? (
                        <div>
                          <div className="mb-0 rounded-t bg_nude px-6 py-6">
                            <div className="flex justify-between text-center ">
                              <h6 className="text-blueGray-700 text-xl font-bold">
                                My Account
                              </h6>
                              <button
                                className="mr-1 rounded bg_gray_700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                                type="button"
                                onClick={() => handleSaveProfile()}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                          <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                            <form>
                              <h6 className="text-blueGray-400 mb-6 mt-3 text-sm font-bold uppercase">
                                Manage Profile
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
                                      className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring`}
                                      defaultValue={profile.first_name}
                                      ref={firstName}
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
                                      className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring`}
                                      defaultValue={profile.last_name}
                                      ref={lastName}
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
                                      className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring`}
                                      defaultValue={profile.email}
                                      ref={email}
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
                                      className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring`}
                                      defaultValue={profile.phone_number}
                                      ref={phoneNumber}
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-0 rounded-t bg_nude px-6 py-6">
                            <div className="flex justify-between text-center ">
                              <h6 className="text-blueGray-700 text-xl font-bold">
                                My Account
                              </h6>
                              <button
                                className="mr-1 rounded bg-gray-700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                                type="button"
                                onClick={() => handleEditProfile()}
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                          <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                            <form>
                              <h6 className="text-blueGray-400 mb-6 mt-3 text-sm font-bold uppercase">
                                Manage Profile
                              </h6>
                              <div className="flex flex-wrap">
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="last_name">
                                      First Name
                                    </label>
                                    <p>{profile.first_name}</p>
                                  </div>
                                </div>
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="last_name">
                                      Last Name
                                    </label>
                                    <p>{profile.last_name}</p>
                                  </div>
                                </div>
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="last_name">
                                      Email
                                    </label>
                                    <p>{profile.email}</p>
                                  </div>
                                </div>
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label
                                      className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                      htmlFor="last_name">
                                      Phone Number
                                    </label>
                                    <p>{profile.phone_number}</p>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* End View Profile */}
            {index == 3 && (
              <div>
                <div className="container px-6 py-10 mx-auto">
                  <div className="lg:flex lg:items-center">
                    <div className="w-full space-y-12 lg:w-1/2">
                      <div>
                        <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white">Welcome to <br /> the University Magazine Contribution Management System (UMCMS™)</h1>
                        <div className="mt-2">
                          <span className="inline-block w-40 h-1 rounded-full bg-blue-500"></span>
                          <span className="inline-block w-3 h-1 ml-1 rounded-full bg-blue-500"></span>
                          <span className="inline-block w-1 h-1 ml-1 rounded-full bg-blue-500"></span>
                        </div>
                      </div>

                      <div className="md:flex md:items-start md:-mx-4">
                        <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </span>
                        <div className="mt-4 md:mx-4 md:mt-0">
                          <h1 className="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Submission Management</h1>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">
                            Students can easily submit articles as Word documents and upload high-quality images directly through the system.Submission is subject to agreeing to predefined Terms and Conditions, ensuring compliance and legal clarity.
                          </p>
                        </div>
                      </div>

                      <div className="md:flex md:items-start md:-mx-4">
                        <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </span>
                        <div className="mt-4 md:mx-4 md:mt-0">
                          <h1 className="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Role-Based Access Control</h1>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">
                            UMCMS™ accommodates various user roles, including students, faculty marketing coordinators, the University Marketing Manager, guests, and administrators. Each role is assigned specific privileges and responsibilities tailored to their respective functions within the magazine contribution process.
                          </p>
                        </div>
                      </div>

                      <div className="md:flex md:items-start md:-mx-4">
                        <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </span>
                        <div className="mt-4 md:mx-4 md:mt-0">
                          <h1 className="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Statistical Analysis</h1>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">
                            UMCMS™ offers robust statistical analysis capabilities, providing insights such as the number of contributions per Faculty, helping stakeholders understand participation levels and trends.
                          </p>
                        </div>
                      </div>

                      <div className="md:flex md:items-start md:-mx-4">
                        <span className="inline-block p-2 text-blue-500 bg-blue-100 rounded-xl md:mx-4 dark:text-white dark:bg-blue-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7.257 6.257 8 5.5M17.657 18.657L18 18M18 18l.343.343M18 18a8.001 8.001 0 10-7.657 11.314" />
                          </svg>
                        </span>
                        <div className="mt-4 md:mx-4 md:mt-0">
                          <h1 className="text-2xl font-semibold text-gray-700 capitalize dark:text-white">Responsive Interface</h1>
                          <p className="mt-3 text-gray-500 dark:text-gray-300">
                          The system features a responsive and intuitive interface optimized for accessibility across all devices, including mobile phones, tablets, and desktops, ensuring a seamless user experience and convenience.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full mt-12 lg:w-1/2 lg:mt-0 lg:pl-12">
                      <img src="https://ntthnue.edu.vn/uploads/Images/2017/09/013.jpg" alt="Components" className="object-cover w-full h-64 rounded-md shadow-md lg:h-96" />
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div >
  );
};

export default Guest;
