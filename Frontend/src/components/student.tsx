// Nav.tsx

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { urlBackend } from "../global";
<<<<<<< Updated upstream
import Chat from "./chat";
import Comment from './comment';
=======
import Header from "./header";
import Homepage from "./homepage";

const NavbarScript: React.FC = () => {
  useEffect(() => {
    const handleBurgerClick = () => {
      const menus = document.querySelectorAll(".navbar-menu");
      menus.forEach((menu) => {
        menu.classList.toggle("hidden");
      });
    };

    const handleMenuClose = () => {
      const menus = document.querySelectorAll(".navbar-menu");
      menus.forEach((menu) => {
        menu.classList.toggle("hidden");
      });
    };

    const burger = document.querySelectorAll(".navbar-burger");
    const close = document.querySelectorAll(".navbar-close");
    const backdrop = document.querySelectorAll(".navbar-backdrop");

    if (burger.length) {
      burger.forEach((burgerItem) => {
        burgerItem.addEventListener("click", handleBurgerClick);
      });
    }

    if (close.length) {
      close.forEach((closeItem) => {
        closeItem.addEventListener("click", handleMenuClose);
      });
    }

    if (backdrop.length) {
      backdrop.forEach((backdropItem) => {
        backdropItem.addEventListener("click", handleMenuClose);
      });
    }

    // Cleanup event listeners
    return () => {
      if (burger.length) {
        burger.forEach((burgerItem) => {
          burgerItem.removeEventListener("click", handleBurgerClick);
        });
      }

      if (close.length) {
        close.forEach((closeItem) => {
          closeItem.removeEventListener("click", handleMenuClose);
        });
      }

      if (backdrop.length) {
        backdrop.forEach((backdropItem) => {
          backdropItem.removeEventListener("click", handleMenuClose);
        });
      }
    };
  }, []);

  return null; // Since this component is only for handling script, return null in the render.
};
>>>>>>> Stashed changes

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
  closure_date: string;
  final_closure_date: string;
}

const Student: React.FC<NavProps> = ({ userId }) => {
  const router = useRouter();
  const firstName = useRef<HTMLInputElement>(null);
  const lastName = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

<<<<<<< Updated upstream
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
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contributionIdIndex, setContributionIdIndex] = useState("");
  const [currentAcademicYear, setCurrentAcademicYear] = useState<AcademicYear>();
  const [userFacultyName, setUserFacultyName] = useState("");
  const [agreeTerm, setAgreeTerm] = useState(false);

  const title = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLInputElement>(null);

  const titleUpdate = useRef<HTMLInputElement>(null);
  const descriptionUpdate = useRef<HTMLInputElement>(null);

  const tabs = ["Home", "Contribute articles", "Manage contributions", "Manage Profile"];
  const [activeTab, setActiveTab] = useState(() => {
    const storedTabIndex = sessionStorage.getItem("activeTabIndex");
    const tabsLength = tabs.length;
    return storedTabIndex && parseInt(storedTabIndex) < tabsLength ? parseInt(storedTabIndex) : 0;
  });
=======
  const [titleValue, setTitleValue] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
>>>>>>> Stashed changes


  useEffect(() => {
    const timeout = setTimeout(() => {
<<<<<<< Updated upstream
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
    initData();
  }, []);

  const initData = () => {
    fetchProfileData();
    getAllAcademicYear();
    getAcademicYearByYear();
    getFacultyByUserId();
  }

  const handleLogout = () => {
    localStorage.removeItem('sessionId');
    router.push("/login");
  };

  const handleChangeYear = (year: string) => {
    if ((year === "default") || (year === "")) {
      showAllMagazineBelongToFaculty();
    } else {
      showAllMagazineByFacultyAndYear(year);
    }
  }

  const handleEdit = (contribution: any) => {
    if (currentAcademicYear) {
      const final_closure_date = new Date(currentAcademicYear?.final_closure_date);
      const currentDate = new Date();
      if (currentDate > final_closure_date) {
        setNotification({ type: "error", message: "The final deadline for edit contribution is end. Thanks for your contributions!!" });
      } else {
        setEditingContribution({
          contribution_id: contribution.sc_contribution_id,
          title: contribution.sc_article_title,
          description: contribution.sc_article_description,
          urlImage: contribution.sc_image_url,
          urlWord: contribution.sc_article_content_url,
        });
      }
    } else {
      getAcademicYearByYear();
      handleEdit(contribution);
=======
      setErrorMessage("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  // start method reset form submit contributions
  const handleSentFile = async () => {
    try {
      await fetchUploadData(); // Gửi dữ liệu
      resetForm(); // Đặt lại form sau khi gửi dữ liệu
    } catch (error) {
      console.error("Error handling file upload:", error);
>>>>>>> Stashed changes
    }
  };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgree(e.target.checked);
  };

  const handleRead = () => {
    setAgreeTerm(true);
  };

  const handleStopRead = () => {
    setAgreeTerm(false);
  };

  const displayMessage = (type: any, message: any) => {
    setNotification({ type, message });
  };
  const handleEditProfile = (index: number) => {
    setEditingRowIndex(index);
  };

  const closeCommentPopup = () => {
    setIsCommentOpen(false);
  };

  const openCommentPopup = (contributionId: string) => {
    setContributionIdIndex(contributionId);
    setIsCommentOpen(true);
  };

  const closeChatPopup = () => {
    setIsChatOpen(false);
  };

  const openChatPopup = (contributionId: string) => {
    setContributionIdIndex(contributionId);
    setIsChatOpen(true);
  };

  // start method reset form submit contributions
  const handleSentFile = async () => {
    try {
      initData();
      if (currentAcademicYear) {
        const currentDate = new Date();
        const closureDate = new Date(currentAcademicYear?.closure_date);
        if (currentDate > closureDate) {
          setNotification({ type: "error", message: "Time to contribute to the magazine is end. Thanks for your contributions!" })
        } else {
          getFacultyByUserId();
          try {
            const response = await fetch(`${urlBackend}/users/getProfileOfMK/${userFacultyName}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              const data = await response.json();
              await fetchUploadData();
              setAgree(false);
              const currentTime = new Date();
              const formattedTime = currentTime.toLocaleString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
              sendEmail(data.email, "UMCMS System - New Submited Contribution", "A Contribution Submited At " + formattedTime + " please read and comment within 14 days!!!");
            } else {
              setNotification({ type: "error", message: "Please contact with your marketing coordinator to update his email or try again later." });
            }
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        initData();
        getAcademicYearByYear();
        handleSentFile();
      }
    } catch (error) {
      displayMessage("success", "Saved successfully!")
    }
  };

  const sendEmail = async (recipientEmail: string, subject: string, message: string) => {
    try {
      console.log("email called");
      const response = await fetch(`${urlBackend}/email/send/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: recipientEmail,
          subject: subject,
          message: message,
        })
      });
      if (response.ok) {
        console.log("send email success!");
      }
    } catch (error) {
      console.error(error);
    }
  }


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
    setTitleValue("");
    setDescriptionValue("");
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
  const getAllAcademicYear = async () => {
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

  const getAcademicYearByYear = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const getAcademicYearId = await fetch(`${urlBackend}/academicyear/getAcademicYearByYear/${currentYear}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (getAcademicYearId.ok) {
        const data = await getAcademicYearId.json();
        setCurrentAcademicYear(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

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
  }

  const handleChangeYearNonPublish = (year: string) => {
    if ((year === "default") || (year === "")) {
      showMagazineOfStudent();
    } else {
      showAllMagazineByFacultyAndYearNonPublish(year);
    }
  }

  const getFacultyByUserId = async () => {
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
        setUserFacultyName(facultyName);
      }
    } catch (error) {
      console.error(error);
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
        const getMagazineResponse = await fetch(`${urlBackend}/contribution/getContributionViaUserId/${userId}`, {
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
        const getMagazineResponse = await fetch(`${urlBackend}/contribution/getContributionsByFacultyNameByYearByUserId`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            faculty_name: facultyName,
            year: year,
            user_id: userId,
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
        body: JSON.stringify({
          profile_id: profile.profile_id,
          first_name: fieldFirstName,
          last_name: fieldLastName,
          email: fieldEmail,
          phone_number: fieldPhoneNumber,
        }),
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
<<<<<<< Updated upstream
  //End update profile
=======
>>>>>>> Stashed changes

  const handleClick = (index: number) => {
    setActiveTab(index);
  };

  // Start Upload

<<<<<<< Updated upstream
  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === 'image/png' || fileType === 'image/jpeg') {
        setImageFiles(selectedFile);
      } else {
        // Hiển thị thông báo hoặc thực hiện hành động phù hợp khi người dùng chọn loại file không hợp lệ
        displayMessage("error", "Please select a PNG or JPEG image file.")
        event.target.value = ''; // Xóa giá trị file không hợp lệ khỏi trường nhập file
      }
=======
  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setImageFiles(event.target.files[0]);
>>>>>>> Stashed changes
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
        displayMessage("error", "Please select a Word document file.")
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
<<<<<<< Updated upstream
      const fieldTitle = title.current?.value?.trim() || '';
      const fieldDescription = description.current?.value?.trim() || '';
      if (fieldTitle === "" || fieldDescription === "") {
        setNotification({ type: "error", message: "Please enter full information." });
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
          setNotification({ type: "success", message: "Submit Contribution Success" });
=======
      const fieldTitle = title.current?.value?.trim() || "";
      const fieldDescription = description.current?.value?.trim() || "";
      if (fieldTitle === "" || fieldDescription === "") {
        setErrorMessage("Please enter full information.");
      }
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("article_title", fieldTitle);
      formData.append("article_description", fieldDescription);
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
        const data = await response.json(); // Assuming the response body contains JSON data
        const contributionId = data.contribution_id;
        const dataFormImage = new FormData();
        dataFormImage.append("contribution_id", contributionId);
        dataFormImage.append("imageFile", imageFile as Blob);

        const uploadImageResponse = await fetch(
          `${urlBackend}/contribution/uploadImage/`,
          {
            method: "POST",
            body: dataFormImage,
          }
        );
>>>>>>> Stashed changes

          const uploadImageResponse = await fetch(`${urlBackend}/contribution/uploadImage/`, {
            method: "POST",
            body: dataFormImage,
          });
          if (uploadImageResponse.ok) {
            // Image upload successful
          } else {
            setNotification({ type: "error", message: "Please enter full information." });
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
    <div className="bg_white flex flex-col">
      <nav className="border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <div className="text-sky-1000 flex h-1 w-auto items-center justify-center text-4xl font-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-3 h-10 w-10 "
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
            <h1 className="tracking-wide">
              UMCMS<span className="font-mono">™</span>
            </h1>
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
          <button
            className="ease bg_red rounded px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 hover:shadow-md focus:outline-none active:bg-teal-600"
            onClick={handleLogout}
          >
            Sign out
          </button>
          <div className="lg:hidden">
			<button className="navbar-burger flex items-center text-blue-600 p-3">
				<svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<title>Mobile menu</title>
					<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
				</svg>
			</button>
		</div>
    <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6">
			<li><a className="text-sm text-gray-400 hover:text-gray-500" href="#">Home</a></li>
			<li className="text-gray-300">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
				</svg>
			</li>
			<li><a className="text-sm text-blue-600 font-bold" href="#">About Us</a></li>
			<li className="text-gray-300">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
				</svg>
			</li>
			<li><a className="text-sm text-gray-400 hover:text-gray-500" href="#">Services</a></li>
			<li className="text-gray-300">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
				</svg>
			</li>
			<li><a className="text-sm text-gray-400 hover:text-gray-500" href="#">Pricing</a></li>
			<li className="text-gray-300">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 current-fill" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v0m0 7v0m0 7v0m0-13a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
				</svg>
			</li>
			<li><a className="text-sm text-gray-400 hover:text-gray-500" href="#">Contact</a></li>
		</ul>
        </div>

        
      </nav>
      <div className="navbar-menu relative z-50 hidden">
		<div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
		<nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
			<div className="flex items-center mb-8">
				<a className="mr-auto text-3xl font-bold leading-none" href="#">
					<svg className="h-12" viewBox="0 0 10240 10240">
				        <path xmlns="http://www.w3.org/2000/svg" d="M8284 9162 c-2 -207 -55 -427 -161 -667 -147 -333 -404 -644 -733 -886 -81 -59 -247 -169 -256 -169 -3 0 -18 -9 -34 -20 -26 -19 -344 -180 -354 -180 -3 0 -29 -11 -58 -24 -227 -101 -642 -225 -973 -290 -125 -25 -397 -70 -480 -80 -22 -3 -76 -9 -120 -15 -100 -13 -142 -17 -357 -36 -29 -2 -98 -7 -153 -10 -267 -15 -436 -28 -525 -40 -14 -2 -45 -7 -70 -10 -59 -8 -99 -14 -130 -20 -14 -3 -41 -7 -60 -11 -19 -3 -39 -7 -45 -8 -5 -2 -28 -6 -50 -10 -234 -45 -617 -165 -822 -257 -23 -10 -45 -19 -48 -19 -7 0 -284 -138 -340 -170 -631 -355 -1107 -842 -1402 -1432 -159 -320 -251 -633 -308 -1056 -26 -190 -27 -635 -1 -832 3 -19 7 -59 10 -89 4 -30 11 -84 17 -120 6 -36 12 -77 14 -91 7 -43 33 -174 39 -190 3 -8 7 -28 9 -45 6 -35 52 -221 72 -285 7 -25 23 -79 35 -120 29 -99 118 -283 189 -389 67 -103 203 -244 286 -298 75 -49 178 -103 196 -103 16 0 27 16 77 110 124 231 304 529 485 800 82 124 153 227 157 230 3 3 28 36 54 74 116 167 384 497 546 671 148 160 448 450 560 542 14 12 54 45 90 75 88 73 219 172 313 238 42 29 77 57 77 62 0 5 -13 34 -29 66 -69 137 -149 405 -181 602 -7 41 -14 82 -15 90 -1 8 -6 46 -10 83 -3 37 -8 77 -10 88 -2 11 -7 65 -11 122 -3 56 -8 104 -9 107 -2 3 0 12 5 19 6 10 10 8 15 -10 10 -34 167 -346 228 -454 118 -210 319 -515 340 -515 4 0 40 18 80 40 230 128 521 255 787 343 118 40 336 102 395 113 28 5 53 11 105 23 25 5 59 12 75 15 17 3 41 8 55 11 34 7 274 43 335 50 152 18 372 29 565 29 194 0 481 -11 489 -19 2 -3 -3 -6 -12 -6 -9 -1 -20 -2 -24 -3 -33 -8 -73 -16 -98 -21 -61 -10 -264 -56 -390 -90 -649 -170 -1243 -437 -1770 -794 -60 -41 -121 -82 -134 -93 l-24 -18 124 -59 c109 -52 282 -116 404 -149 92 -26 192 -51 220 -55 17 -3 64 -12 105 -21 71 -14 151 -28 230 -41 19 -3 46 -7 60 -10 14 -2 45 -7 70 -10 25 -4 56 -8 70 -10 14 -2 53 -7 88 -10 35 -4 71 -8 81 -10 10 -2 51 -6 92 -9 101 -9 141 -14 147 -21 3 -3 -15 -5 -39 -6 -24 0 -52 -2 -62 -4 -21 -4 -139 -12 -307 -22 -242 -14 -700 -7 -880 13 -41 4 -187 27 -250 39 -125 23 -274 68 -373 111 -43 19 -81 34 -86 34 -4 0 -16 -8 -27 -17 -10 -10 -37 -33 -59 -52 -166 -141 -422 -395 -592 -586 -228 -257 -536 -672 -688 -925 -21 -36 -43 -66 -47 -68 -4 -2 -8 -7 -8 -11 0 -5 -24 -48 -54 -97 -156 -261 -493 -915 -480 -935 2 -3 47 -21 101 -38 54 -18 107 -36 118 -41 58 -25 458 -138 640 -181 118 -27 126 -29 155 -35 14 -2 45 -9 70 -14 66 -15 137 -28 300 -55 37 -7 248 -33 305 -39 28 -3 84 -9 125 -13 163 -16 792 -8 913 12 12 2 58 9 102 15 248 35 423 76 665 157 58 19 134 46 170 60 86 33 344 156 348 166 2 4 8 7 13 7 14 0 205 116 303 184 180 126 287 216 466 396 282 281 511 593 775 1055 43 75 178 347 225 455 100 227 236 602 286 790 59 220 95 364 120 485 6 28 45 245 50 275 2 14 7 41 10 60 3 19 8 49 10 65 2 17 6 46 9 65 15 100 35 262 40 335 3 39 8 89 10 112 22 225 33 803 21 1043 -3 41 -7 129 -11 195 -3 66 -8 136 -10 155 -2 19 -6 76 -10 125 -3 50 -8 101 -10 115 -2 14 -6 57 -10 95 -7 72 -12 113 -20 175 -2 19 -7 55 -10 80 -6 46 -43 295 -51 340 -2 14 -9 54 -15 90 -5 36 -16 97 -24 135 -8 39 -17 84 -20 100 -12 68 -18 97 -50 248 -19 87 -47 204 -61 260 -14 56 -27 109 -29 117 -30 147 -232 810 -253 832 -4 4 -7 -23 -8 -60z"></path>
			        </svg>
				</a>
				<button className="navbar-close">
					<svg className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			<div>
				<ul>
					<li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">Home</a>
					</li>
					<li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">About Us</a>
					</li>
					<li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">Services</a>
					</li>
					<li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">Pricing</a>
					</li>
					<li className="mb-1">
						<a className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded" href="#">Contact</a>
					</li>
				</ul>
			</div>
			<div className="mt-auto">
				<div className="pt-6">
					<a className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl" href="#">Sign in</a>
					<a className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl" href="#">Sign Up</a>
				</div>
			</div>
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
<<<<<<< Updated upstream
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Home &gt;
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">
                      All Magazine<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-3 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
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
=======
                <Header />
                <Homepage userId={""} />
              </div>
            )}
            {index === 1 && <div>Content of 1 tab</div>}
            {index === 2 && (
>>>>>>> Stashed changes
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Contribute Articles &gt;
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">
                      Contribute Your Article<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-3 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                  <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
<<<<<<< Updated upstream
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
=======
                    <div className="bg_nude mb-0 rounded-t px-6 py-6">
                      <div className="flex justify-between text-center ">
                        <h6 className="text-blueGray-700 text-xl font-bold">
>>>>>>> Stashed changes
                          My Contribution
                        </h6>
                        <button
                          onClick={() => handleSentFile()}
<<<<<<< Updated upstream
                          disabled={!agree}
                          className={`mr-1 rounded bg_blue px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none ${!agree && 'opacity-50 cursor-not-allowed'
                            }`}
=======
                          className="bg_blue mr-1 rounded px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
                        {errorMessage && (
                          <div className="rounded-md border border-yellow-300 bg-yellow-100 p-3 text-sm text-yellow-900">
                            {errorMessage}
                          </div>
                        )}
>>>>>>> Stashed changes
                        <div className="text-blueGray-400 mb-6 mt-3 text-sm font-bold uppercase">
                          <div className="flex flex-wrap">
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
<<<<<<< Updated upstream

                                <label className="text-blueGray-600 mb-2 block text-xs font-bold uppercase" htmlFor="title">
=======
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="title"
                                >
>>>>>>> Stashed changes
                                  Title:
                                </label>
                                <input
                                  type="email"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  placeholder="Input Title"
                                  value={titleValue}
                                  onChange={(e) =>
                                    setTitleValue(e.target.value)
                                  }
                                  ref={title}
                                />
                              </div>
                            </div>
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="description"
                                >
                                  Description
                                </label>
                                <input
                                  type="email"
                                  className="placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                                  placeholder="Input Description"
                                  value={descriptionValue}
                                  onChange={(e) =>
                                    setDescriptionValue(e.target.value)
                                  }
                                  ref={description}
                                />
                              </div>
                            </div>
                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="title"
                                >
                                  Upload Image File
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
                                      <label
                                        className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                        htmlFor="title"
                                      >
                                        Drop Image file here
                                      </label>
                                      <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                        Or
                                      </span>
                                      <span className="inline-flex rounded border border-[#e0e0e0] px-7 py-2 text-base font-medium text-[#07074D]">
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
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="title"
                                >
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
                                      <label
                                        className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                        htmlFor="title"
                                      >
                                        Drop Word file here
                                      </label>
                                      <span className="mb-2 block text-base font-medium text-[#6B7280]">
                                        Or
                                      </span>
                                      <span className="inline-flex rounded border border-[#e0e0e0] px-7 py-2 text-base font-medium text-[#07074D]">
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
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="title"
                                >
                                  Sellected image file:
                                </label>
                                {imageFile && <p>{imageFile.name}</p>}
                              </div>
                            </div>

                            <div className="w-full px-4 lg:w-6/12">
                              <div className="relative mb-3 w-full">
                                <label
                                  className="text-blueGray-600 mb-2 block text-xs font-bold uppercase"
                                  htmlFor="title"
                                >
                                  Sellected word file:
                                </label>
                                {wordFile && <p>{wordFile.name}</p>}
                              </div>
                            </div>
                            <div className="relative mb-3 w-full">
                              {agreeTerm ? (
                                <div>
                                  <p onClick={handleStopRead}>
                                    Close Term And Polices
                                  </p>
                                  <div className="terms-container bg-gray-100 border border-gray-300 rounded-lg p-6 my-6">
                                    <ol className="list-decimal pl-6">
                                      <li className="mb-4">
                                        <p>
                                          <strong>Accepted File Types:</strong> We only accept Word files (.docx) and PNG images (.png) for submission.
                                        </p>
                                      </li>
                                      <li className="mb-4">
                                        <p>
                                          <strong>Ownership of Content:</strong> You must ensure that you are the author and owner of the submitted content. Plagiarism or submitting content without proper authorization is strictly prohibited.
                                        </p>
                                      </li>
                                      <li className="mb-4">
                                        <p>
                                          <strong>Use of Submitted Content:</strong> By submitting a file, you grant us the non-exclusive right to use, reproduce, and distribute the content for the purpose of evaluating submissions and improving our services.
                                        </p>
                                      </li>
                                      <li className="mb-4">
                                        <p>
                                          <strong>Accuracy of Information:</strong> You are responsible for the accuracy and legality of the content you submit. Any misleading or fraudulent information will result in the rejection of your submission and may lead to further actions.
                                        </p>
                                      </li>
                                      <li className="mb-4">
                                        <p>
                                          <strong>Compliance with Laws:</strong> You must comply with all applicable laws and regulations when submitting content. This includes but is not limited to copyright laws, privacy laws, and laws governing the distribution of sensitive information.
                                        </p>
                                      </li>
                                      <li className="mb-4">
                                        <p>
                                          <strong>Indemnification:</strong> You agree to indemnify and hold harmless our organization, its affiliates, and employees from any claims, damages, or liabilities arising out of your submission or violation of these terms and policies.
                                        </p>
                                      </li>
                                      <li>
                                        <p>
                                          <strong>Modification of Terms:</strong> We reserve the right to modify these terms and policies at any time without prior notice. It is your responsibility to review these terms periodically for any changes.
                                        </p>
                                      </li>
                                    </ol>

                                    <label className="inline-flex items-center mt-3">
                                      <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-gray-600"
                                        checked={agree}
                                        onChange={handleAgreeChange}
                                        disabled={formSent} // Không vô hiệu hóa checkbox sau khi gửi
                                      /><p className="pl-2">Agree to term and policies</p>
                                    </label>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p onClick={handleRead}>
                                    Read Term And Polices
                                  </p>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
<<<<<<< Updated upstream
            }
            {index === 2 &&
              <div>
                <div className="content-wrapper mx-auto max-w-screen-2xl bg_nude px-8 text-base">
                  <div className="px-8 lg:px-12">
                    <p className="text-dark mb-2 mt-1 pt-2 block w-full text-sm md:text-base">
                      Manage Contribution &gt;
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold text-dark md:text-4xl">
                      Your Contributions<span className="bg-darkBlue"></span>
                    </h1>
                    <div className="mt-3 lg:flex lg:justify-start">
                      <p className="text-dark mb-2 mt-1 mt-5 block w-full text-sm md:text-base lg:w-2/3">
                      </p>
=======
            )}
            {/* Start View Profile */}
            {index === 3 && (
              <div>
                <div>
                  <div className="mx-auto mt-6 w-full px-4 lg:w-8/12">
                    <div className=" relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 shadow-lg">
                      <div className="bg_nude mb-0 rounded-t px-6 py-6">
                        <div className="flex justify-between text-center ">
                          <h6 className="text-blueGray-700 text-xl font-bold">
                            My Account
                          </h6>
                          {isEditing ? (
                            <button
                              className="bg_blue mr-1 rounded px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
                              type="button"
                              onClick={handleSaveProfile}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="bg_blue mr-1 rounded px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600"
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
                                  className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring ${
                                    isEditing ? "" : "cursor-not-allowed"
                                  }`}
                                  value={profile.first_name}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      first_name: e.target.value,
                                    })
                                  }
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
                                  className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring ${
                                    isEditing ? "" : "cursor-not-allowed"
                                  }`}
                                  value={profile.last_name}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      last_name: e.target.value,
                                    })
                                  }
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
                                  className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring ${
                                    isEditing ? "" : "cursor-not-allowed"
                                  }`}
                                  value={profile.email}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      email: e.target.value,
                                    })
                                  }
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
                                  className={`placeholder-blueGray-300 text-blueGray-600 w-full rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring ${
                                    isEditing ? "" : "cursor-not-allowed"
                                  }`}
                                  value={profile.phone_number}
                                  onChange={(e) =>
                                    setProfile({
                                      ...profile,
                                      phone_number: e.target.value,
                                    })
                                  }
                                  ref={phoneNumber}
                                  readOnly={!isEditing} // Sử dụng readOnly để ngăn người dùng chỉnh sửa
                                />
                              </div>
                            </div>
                          </div>
                          <hr className="border-b-1 border-blueGray-300 mt-6" />
                        </form>
                      </div>
>>>>>>> Stashed changes
                    </div>
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
                      {isCommentOpen ? (
                        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                          <div className="bg-white p-4 rounded-lg">
                            <Comment isOpen={isCommentOpen} onClose={closeCommentPopup} contribution_id={contributionIdIndex} role="Student" />
                          </div>
                        </div>
                      ) : null}
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Comment</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Action</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Chat</th>
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
                              <td className="px-2 py-2 whitespace-wrap relative border-b border-gray-300">
                                <button onClick={() => openCommentPopup(magazine.sc_contribution_id)} className="bg-green-500 text-white py-1 px-2 rounded-md">Comment</button>
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
                              <td className="px-8 py-2 whitespace-wrap relative border-b border-gray-300">
                                <button onClick={() => openChatPopup(magazine.sc_contribution_id)} className="border border-gray-500 text-white py-1 px-2 rounded-md">
                                  <svg
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    width="60px"
                                    height="40px"
                                    viewBox="0 0 122.88 86.411"
                                    enable-background="new 0 0 122.88 86.411"
                                  >
                                    <g>
                                      <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M83.298,8.182h25.469c7.763,0,14.113,6.351,14.113,14.113v24.907c0,7.761-6.352,14.113-14.113,14.113H97.802c1.569,6.206,3.469,11.781,9.272,16.929c-11.098-2.838-19.664-8.576-25.952-16.929h-1.895c-0.737,0-1.509-0.058-2.303-0.168c4.193-3.396,7.106-7.659,7.106-12.275V38.493c0.926,0.644,2.051,1.021,3.264,1.021c3.164,0,5.73-2.566,5.73-5.729s-2.566-5.729-5.73-5.729c-1.213,0-2.338,0.377-3.264,1.02V13.535C84.031,11.683,83.774,9.888,83.298,8.182L83.298,8.182z M57.055,28.881c-3.201,0-5.796,2.596-5.796,5.796s2.596,5.796,5.796,5.796c3.2,0,5.796-2.596,5.796-5.796S60.255,28.881,57.055,28.881L57.055,28.881z M21.488,28.881c-3.201,0-5.796,2.596-5.796,5.796s2.596,5.796,5.796,5.796s5.796-2.596,5.796-5.796S24.689,28.881,21.488,28.881L21.488,28.881z M39.271,28.881c-3.201,0-5.796,2.596-5.796,5.796s2.595,5.796,5.796,5.796s5.796-2.596,5.796-5.796S42.472,28.881,39.271,28.881L39.271,28.881z M59,3.572H19.542c-8.785,0-15.971,7.187-15.971,15.971v28.184c0,8.783,7.188,15.971,15.971,15.971h12.407c-1.775,7.022-3.924,13.332-10.493,19.156c12.558-3.211,22.252-9.704,29.367-19.156h2.145c8.783,0,22.002-7.187,22.002-15.971V19.542C74.971,10.759,67.784,3.572,59,3.572L59,3.572z M19.542,0H59h0.005v0.014c5.386,0.002,10.27,2.193,13.8,5.724l-0.008,0.007c3.536,3.539,5.731,8.422,5.732,13.796h0.014v0.002h-0.014v28.184h0.014v0.003h-0.014c-0.002,5.746-3.994,10.752-9.312,14.248c-4.952,3.256-11.205,5.277-16.247,5.277v0.015h-0.002v-0.015h-0.404c-3.562,4.436-7.696,8.225-12.43,11.333c-5.235,3.438-11.157,6.028-17.799,7.727l-0.003-0.012c-1.25,0.315-2.628-0.06-3.541-1.091c-1.302-1.472-1.165-3.721,0.307-5.023c2.896-2.567,4.816-5.239,6.207-8.041c0.774-1.559,1.398-3.188,1.939-4.878h-7.702h-0.005v-0.015c-5.384-0.001-10.269-2.193-13.799-5.723c-3.531-3.531-5.724-8.417-5.725-13.804H0v-0.002h0.014V19.542H0v-0.005h0.014c0.015-5.279,2.126-10.076,5.541-13.59c0.062-0.073,0.127-0.145,0.196-0.214c3.531-3.531,8.417-5.724,13.804-5.725V0H19.542L19.542,0z M105.57,28.056c-3.163,0-5.729,2.566-5.729,5.729s2.566,5.729,5.729,5.729c3.164,0,5.73-2.566,5.73-5.729S108.734,28.056,105.57,28.056L105.57,28.056z"
                                      />
                                    </g>
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
                    </div>

                  </div>

                </div>
              </div>
            )}
          </div>
<<<<<<< Updated upstream
        ))
        }
      </div >
      {
        isChatOpen ? (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <Chat
                isOpen={isChatOpen}
                onClose={closeChatPopup}
                contribution_id={contributionIdIndex}
                userId={userId}
                role="Student"
              />
            </div>
          </div>
        ) : null
      }

    </div >
=======
        ))}
      </div>
    </div>
>>>>>>> Stashed changes
  );
};

export default Student;
export { NavbarScript };
