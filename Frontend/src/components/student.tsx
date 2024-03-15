// Nav.tsx

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
interface AcademicYear {
  academic_year_id: string;
  academic_year: string;
}

const Student: React.FC<NavProps> = ({ userId }) => {
  const router = useRouter();
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [titleValue, setTitleValue] = useState<string>('');
  const [descriptionValue, setDescriptionValue] = useState<string>('');
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  const [agree, setAgree] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [publishMagazines, setPublishMagazines] = useState<Magazine[]>([]);
  const [editedYear, setEditedYear] = useState("");
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [editedYearManage, setEditedYearManage] = useState("");
  const [editingContribution, setEditingContribution] = useState<any>(null);
  const [wordFile, setWordFile] = useState<File | null | undefined>(null);
  const [imageFile, setImageFiles] = useState<File | null | undefined>(null);

  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);

  const titleUpdate = useRef<HTMLInputElement>(null);
  const descriptionUpdate = useRef<HTMLInputElement>(null);

  const tabs = ["Home", "Contribute articles", "Manage contributions", "Manage Profile"];
  const [activeTab, setActiveTab] = useState(() => {
    const storedTabIndex = sessionStorage.getItem("activeTabIndex");
    return storedTabIndex ? parseInt(storedTabIndex) : 0; 
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      displayMessage("", "");
    }, 3000);
    return () => clearTimeout(timeout);
  });

  useEffect(() => {
    sessionStorage.setItem("activeTabIndex", activeTab.toString());
  }, [activeTab]);

  useEffect(() => {
    if ((editedYear === "default") || (editedYear === "")) {
      showAllMagazineBelongToFaculty();
    } else {
      showAllMagazineByFacultyAndYear(editedYear);
    }
    if ((editedYearManage === "default") || (editedYearManage === "")) {
      showMagazineOfStudent();
    } else {
      showAllMagazineByFacultyAndYearNonPublish(editedYearManage);
    }
    fetchProfileData();
    getAcademicYear();
  }, []);

  const handleLogout = () => {
    // Implement your logout functionality here
    // For example, clearing local storage or session
    router.push("/login"); // Redirect to login page after logout
  };

  const handleChangeYear = (year: string) => {
    if ((year === "default") || (year === "")) {
      showAllMagazineBelongToFaculty();
    } else {
      showAllMagazineByFacultyAndYear(year);
    }
  }

  const handleEdit = (contribution: any) => {
    setEditingContribution({
      contribution_id: contribution.sc_contribution_id,
      title: contribution.sc_article_title,
      description: contribution.sc_article_description,
      urlImage: contribution.sc_image_url,
      urlWord: contribution.sc_article_content_url,
    });
  };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgree(e.target.checked);
  };

  const displayMessage = (type: any, message: any) => {
    setNotification({ type, message });
  };
  const handleEditProfile = (index: number) => {
    setEditingRowIndex(index);
  };
  
  // start method reset form submit contributions
  const handleSentFile = async () => {
    try {
      await fetchUploadData(); // Gửi dữ liệu
      setAgree(false); // Đặt lại trạng thái của checkbox
      // setFormSent(true); // Đặt trạng thái của form thành đã gửi
    } catch (error) {
      displayMessage("success", "Saved successfully!")
    }
  };

  const handleUpdateFile = async (contribution_id: string) => {
    try {
      await updateContribution(contribution_id); // Gửi dữ liệu
      setAgree(false); // Đặt lại trạng thái của checkbox
      // setFormSent(true); // Đặt trạng thái của form thành đã gửi
    } catch (error) {
      displayMessage("success", "Error updating contribution!")
    }
  };

  const updateContribution = async (contributionId: string) => {
    try {
      const fieldTitle = titleUpdate.current?.value?.trim() || '';
      const fieldDescription = descriptionUpdate.current?.value?.trim() || '';
      if (fieldTitle === "" || fieldDescription === "") {
        displayMessage("error", "Please enter full information.");
        return;
      }
      const currentYear = new Date().getFullYear();
      const getAcademicYearId = await fetch(`${urlBackend}/academicyear/getAcademicYearByYear/${currentYear}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (getAcademicYearId.ok) {
        const data = await getAcademicYearId.json();
        const academic_year_id = data.academic_year_id;
        const formData = new FormData();
        const currentDate: string = formatDate(new Date());
        formData.append("contribution_id", contributionId);
        formData.append("user_id", userId);
        formData.append("article_title", fieldTitle);
        formData.append("article_description", fieldDescription);
        formData.append("submission_date", currentDate);
        formData.append("edit_date", currentDate);
        formData.append("status", "Pending");
        formData.append("academic_year_id", academic_year_id);

        if (wordFile) {
          formData.append("articleFile", wordFile as Blob);
        }         
        if (imageFile) {
          const dataFormImage = new FormData();

          dataFormImage.append("contribution_id", contributionId);
          dataFormImage.append("imageFile", imageFile as Blob);

          const uploadImageResponse = await fetch(`${urlBackend}/contribution/uploadImage/`, {
            method: "POST",
            body: dataFormImage,
          });

          if (!uploadImageResponse.ok) {
            displayMessage("error", "Error uploading image.");
            return;
          }
        }

        const updateContribution = await fetch(`${urlBackend}/contribution/updateContribution`, {
          method: "POST",
          body: formData,
        });

        if (updateContribution.ok) {
          const data = await updateContribution.json();
          displayMessage("success", "Contribution successfully updated.");

        } else {
          displayMessage("error", "Error updating contribution.");
        }
      }
    } catch (error) {
      displayMessage("error", "Error updating contribution!.");
    }
  }

  const resetForm = async () => {
    // Đặt lại trạng thái của các trường trong form
    setWordFile(null);
    setImageFiles(null);
    setTitleValue('');
    setDescriptionValue('');
    // Đặt lại trạng thái của các trường khác nếu cần thiết
  };

  const handleDelete = async (contributionId: string) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this contribution?");
      if (confirmDelete) {
        const response = await fetch(`${urlBackend}/contribution/deleteContribution/${contributionId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Xóa mục khỏi danh sách magazines nếu xóa thành công
          setMagazines(magazines.filter(magazine => magazine.sc_contribution_id !== contributionId));
          setNotification({ type: 'success', message: 'Contribution deleted successfully' });
        } else {
          setNotification({ type: 'error', message: 'Failed to delete contribution' });
        }
      }
    } catch (error) {
      console.error('Error deleting contribution:', error);
      setNotification({ type: 'error', message: 'An error occurred while deleting contribution' });
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
      displayMessage("error", "Error fetching profile data");
    }
  }
  // End delete contribution

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

  const tonggleBack = async () => {
    setEditingContribution(null);
    handleChangeYearNonPublish("");
  
  }

  const handleChangeYearNonPublish = (year: string) => {
    if ((year === "default") || (year === "")) {
      showMagazineOfStudent();
    } else {
      showAllMagazineByFacultyAndYearNonPublish(year);
    }
  }

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
        } else {
          console.log("Magazine cannot loading.");
          return;
        }
      } else {
        console.error("Cannot get faculty by user_id.");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const showAllMagazineByFacultyAndYearNonPublish = async (year: string) => {
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
        const getMagazineResponse = await fetch(`${urlBackend}/contribution/getContributionsByFacultyNameAndByYear`, {
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
          setMagazines(magazineData);
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
        const getContributionResponse = await fetch(`${urlBackend}/contribution/getPublishContributionsByFacultyName/${facultyName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        if (getContributionResponse.ok) {
          const magazineData = await getContributionResponse.json();
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
  
  const handleSaveProfile = async () => {
    const fieldFirstName = firstName.current?.value.trim();
    const fieldLastName = lastName.current?.value.trim();
    const fieldEmail = email.current?.value.trim();
    const fieldPhoneNumber = phoneNumber.current?.value.trim();
    if (!fieldFirstName || !fieldLastName || !fieldEmail || !fieldPhoneNumber) {
      displayMessage("warning", "Please enter full information");
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
        setEditingRowIndex(null);
        fetchProfileData();
        displayMessage("success", "Save profile information successfully.");
      } else {
        // Xử lý lỗi
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }

  };
  //End update profile

  const handleClick = (index: number) => {
    setActiveTab(index);
  };




  // Start Upload

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === 'image/png' || fileType === 'image/jpeg') {
        setImageFiles(selectedFile);
      } else {
        // Hiển thị thông báo hoặc thực hiện hành động phù hợp khi người dùng chọn loại file không hợp lệ
        displayMessage("error","Please select a PNG or JPEG image file.")
        event.target.value = ''; // Xóa giá trị file không hợp lệ khỏi trường nhập file
      }
    }
  };

  const handleWordFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileName = selectedFile.name;
      if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        setWordFile(selectedFile);
      } else {
        // Hiển thị thông báo hoặc thực hiện hành động phù hợp khi người dùng chọn loại file không hợp lệ
        displayMessage("error","Please select a Word document file.")
        event.target.value = ''; // Xóa giá trị file không hợp lệ khỏi trường nhập file
      }
    }
  };
  function formatDate(date: Date): string {
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }

  const fetchUploadData = async () => {
    try {
      const fieldTitle = title.current?.value?.trim() || '';
      const fieldDescription = description.current?.value?.trim() || '';
      if (fieldTitle === "" || fieldDescription === "") {
        setNotification({type: "error", message: "Please enter full information."});
      }
      const currentYear = new Date().getFullYear();
      const getAcademicYearId = await fetch(`${urlBackend}/academicyear/getAcademicYearByYear/${currentYear}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (getAcademicYearId.ok) {
        const data = await getAcademicYearId.json();
        const academic_year_id = data.academic_year_id;
        const formData = new FormData();
        const currentDate: string = formatDate(new Date());
        formData.append("user_id", userId);
        formData.append("article_title", fieldTitle);
        formData.append("article_description", fieldDescription);
        formData.append("submission_date", currentDate);
        formData.append("edit_date", currentDate);
        formData.append("status", "Pending");
        formData.append("academic_year_id", academic_year_id);
        formData.append("articleFile", wordFile as Blob);
        const createContribution = await fetch(`${urlBackend}/contribution/createContribution/`, {
          method: "POST",
          body: formData,
        });
        if (createContribution.ok) {
          const data = await createContribution.json(); // Assuming the response body contains JSON data
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
            setNotification({type: "error", message: "Please enter full information."});
            return;
          }
        } else {
          // Handle error
        }
      }
    }
    catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }

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
                      Contribute article &gt;
                    </p>
                    <h1 className="mt-4 pb-6 text-3xl font-semibold text-dark md:text-4xl">
                      Contribute your article magazine
                    </h1>
                  </div>
                </div>
                <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                  <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                    <div className="mb-0 rounded-t bg_nude px-6 py-6">
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
                      <div className="flex items-center text-center">
                        <h6 className="text-blueGray-700 text-xl font-bold mr-auto">
                          My Contribution
                        </h6>
                        <button
                          onClick={() => handleSentFile()}
                          disabled={!agree}
                          className={`mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none ${!agree && 'opacity-50 cursor-not-allowed'
                            }`}
                          type="button"
                        >
                          Sent File
                        </button>
                        <button
                          onClick={() => resetForm()}
                          className={`rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none`}
                          type="button"
                        >
                          Clean Form
                        </button>
                      </div>
                    </div>
                    <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                      <form>
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
                                      <input
                                        type="file"
                                        name="imageFiles"
                                        id="imageFiles"
                                        className="sr-only"
                                        accept="image/png, image/jpeg" // Only PNG and JPEG images are allowed to be imported
                                        onChange={handleImageFileChange}
                                      />
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
                                      <input
                                        type="file"
                                        name="wordFile"
                                        id="wordFile"
                                        className="sr-only"
                                        accept=".docx, .doc" // Chỉ cho phép nhập file Word
                                        onChange={handleWordFileChange}
                                      />
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
                            <div className="relative mb-3 w-full">
                              <label className="inline-flex items-center mt-3">
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-5 w-5 text-gray-600"
                                  checked={agree}
                                  onChange={handleAgreeChange}
                                  disabled={formSent} // Không vô hiệu hóa checkbox sau khi gửi
                                />
                                <span className="ml-2 text-gray-700">You can only submit Word files and PNG images, and please ensure that you are the author of the submitted content.</span>
                              </label>
                            </div>
                          </div>
                          <hr className="border-b-1 border-blueGray-300 mt-6" />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            }
            {index === 2 &&
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Manage contributions &gt;
                    </p>
                    <h1 className="mt-4 pb-6 text-3xl font-semibold text-dark md:text-4xl">
                      Manage my contributions
                    </h1>
                  </div>
                </div>
                {
                  editingContribution ? (
                    <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                      <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                        <div className="mb-0 rounded-t bg_nude px-6 py-6">
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
                          <div className="flex items-center text-center">
                            <h6 className="text-blueGray-700 text-xl font-bold mr-auto">
                              Update Contribution
                            </h6>
                            <button
                              onClick={() => tonggleBack()}
                              className={`mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none
                                }`}
                              type="button"
                            >
                              Back To List
                            </button>
                            <button
                              onClick={() => handleUpdateFile(editingContribution.contribution_id)}
                              disabled={!agree}
                              className={`mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none ${!agree && 'opacity-50 cursor-not-allowed'
                                }`}
                              type="button"
                            >
                              Update Contribution
                            </button>
                          </div>
                        </div>
                        <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                          <form>
                            <div className="text-blueGray-400 mb-6 mt-3 text-sm font-bold uppercase">
                              <div className="flex flex-wrap">
                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">

                                    <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                      Title:
                                    </label>
                                    <input
                                      type="text"
                                      className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                      placeholder="Input Title"
                                      value={editingContribution.title} // Đảm bảo rằng giá trị của title đã được đặt
                                      onChange={(e) => setEditingContribution({ ...editingContribution, title: e.target.value })}
                                      ref={titleUpdate}
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
                                      value={editingContribution.description}
                                      onChange={(e) => setEditingContribution({ ...editingContribution, description: e.target.value })}
                                      ref={descriptionUpdate}
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
                                          <input
                                            type="file"
                                            name="imageFiles"
                                            id="imageFiles"
                                            className="sr-only"
                                            accept="image/png, image/jpeg" // Only PNG and JPEG images are allowed to be imported
                                            onChange={handleImageFileChange}
                                          />
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
                                          <input
                                            type="file"
                                            name="wordFile"
                                            id="wordFile"
                                            className="sr-only"
                                            accept=".docx, .doc" // Chỉ cho phép nhập file Word
                                            onChange={handleWordFileChange}
                                          />
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                </div>

                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                      Selected image file:
                                    </label>
                                    {imageFile ? (
                                      <div>
                                        <p>{imageFile.name}</p>
                                        <img src={URL.createObjectURL(imageFile)} alt="Selected Image" />
                                      </div>
                                    ) : (
                                      editingContribution.urlImage ? (
                                        <div>
                                          {editingContribution.urlImage && <img src={editingContribution.urlImage} />}
                                        </div>
                                      ) : (
                                        <p>No image selected</p>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div className="w-full px-4 lg:w-6/12">
                                  <div className="relative mb-3 w-full">
                                    <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
                                      Sellected word file:
                                    </label>
                                    {editingContribution.urlWord && !wordFile && <p>{editingContribution.urlWord}</p>}
                                    {wordFile && <p>{wordFile.name}</p>}
                                  </div>

                                </div>
                                <div className="relative mb-3 w-full">
                                  <label className="inline-flex items-center mt-3">
                                    <input
                                      type="checkbox"
                                      className="form-checkbox h-5 w-5 text-gray-600"
                                      checked={agree}
                                      onChange={handleAgreeChange}
                                      disabled={formSent} // Không vô hiệu hóa checkbox sau khi gửi
                                    />
                                    <span className="ml-2 text-gray-700">You can only submit Word files and PNG images, and please ensure that you are the author of the submitted content.</span>
                                  </label>
                                </div>
                              </div>
                              <hr className="border-b-1 border-blueGray-300 mt-6" />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 mt-12 mb-12" >
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
                      <div className="flex justify-end mb-4">
                        <select
                          className="text-center block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          defaultValue={"default"}
                          value={editedYearManage}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setEditedYearManage(selectedValue);
                            handleChangeYearNonPublish(selectedValue);
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
                      <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Image</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {magazines.map((magazine, index) => (
                            <tr key={magazine.sc_contribution_id} className="bg-white text-center">
                              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                                <div className="flex-shrink-0 h-20 w-20">
                                  <img className="h-20 w-20 rounded-full" src={magazine.sc_image_url} alt={magazine.sc_article_title} />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-normal border-b border-gray-300">
                                <div className="text-sm font-medium text-gray-900">{magazine.sc_article_title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-normal border-b border-gray-300">
                                <div className="text-sm text-gray-900">{magazine.sc_article_description}</div>
                              </td>
                              <td className="px-2 py-2 relative w-1/6 text-center border-b border-gray-300">
                                <div className="text-sm text-gray-900">{magazine.sc_status}</div>
                              </td>
                              <td className="px-2 py-2 relative w-1/6 text-center border-b border-gray-300">
                                <button
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => handleFileDownload(magazine.sc_article_content_url)}
                                >
                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 10l-5 5-5-5h3V4h4v6zm4.5 7H4v2h16v-2z" />
                                  </svg>
                                </button>
                                <button
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => handleEdit(magazine)}
                                >
                                  <svg className="w-5 h-5 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" />
                                  </svg>
                                </button>
                                <button onClick={() => handleDelete(magazine.sc_contribution_id)} className="text-red-500 hover:text-red-700 focus:outline-none">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 flex items-center mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  )}
              </div>
            }
            {/* Start View Profile */}
            {index === 3 && (
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 block w-full text-sm md:text-base">
                      Profile information &gt;
                    </p>
                    <h1 className="mt-4 pb-6 text-3xl font-semibold text-dark md:text-4xl">
                      Your profile information
                    </h1>
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

                      {editingRowIndex ? (
                        <div>
                          <div className="mb-0 rounded-t bg_nude px-6 py-6">
                            <div className="flex justify-between text-center ">
                              <h6 className="text-blueGray-700 text-xl font-bold">
                                My Account
                              </h6>
                              <button
                                className="mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
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
                                className="mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                                type="button"
                                onClick={() => handleEditProfile(index)}
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
                      <hr className="border-b-1 border-blueGray-300 mt-6" />
                    </div>

                  </div>

                </div>
              </div>
            )}
            {/* End View Profile */}
          </div>
        ))
        }
      </div >
    </div >
  );
};

export default Student;
