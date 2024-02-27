export interface ILessonProblem {
  type: string,
  questionNum: number,
  question: string,
  answers: ILesson[],
  correctAnswer: number,
}

interface ILesson {
  name: string,
  ques: string,
}

const lessonProblem1: ILessonProblem = {
  type: "SELECT_1_OF_3",
  questionNum: 1,
  question: `1.	Các dòng sản phẩm chính của Nestle Health Science?`,
  answers: [
    { ques: "A.", name: "Peptamen_ Dinh dưỡng chuyên biệt cho bệnh nhân nặng, kém hấp thu" },
    { ques: "B.", name: "Boost Optimum_ Dinh dưỡng hoàn chỉnh cho Người lớn " },
    { ques: "C.", name: "Oral Impact- Dinh dưỡng miễn dịch cho bệnh nhân ung thu và phẫu thuật" },
    { ques: "D.", name: "Boost Glucose Control- Dinh dưỡng cho Người Đái tháo đường" },
    { ques: "E.", name: "Tất cả các câu trên đều đúng" },
  ],
  correctAnswer: 4,
};

const lessonProblem2 = {
  type: "SELECT_1_OF_3",
  questionNum: 2,
  question: `2.	Chọn câu đúng về sản phẩm Peptamen`,
  answers: [
    { ques: "A.", name: "Chứa 50% đạm Whey thủy phân" },
    { ques: "B.", name: "Không dùng để nuôi ăn qua ống thông" },
    { ques: "C.", name: "50% chất béo là chất bép MCT" },
    { ques: "D.", name: "Chứa 100% đạm whey và 70% chất béo là MCT" }
  ],
  correctAnswer: 3,
};

const lessonProblem3 = {
  type: "SELECT_1_OF_3",
  questionNum: 3,
  question: `3.	Vì sao Peptamen thích hợp dùng nuôi ăn qua sonde cho bệnh nhân nặng`,
  answers: [
    { ques: "A.", name: "Vì Peptamen có công thức giàu chất béo" },
    { ques: "B.", name: "Vì Peptamen có công thức đạm Whey dưới dạng Peptide nhỏ hơn, dễ hấp thu hơn" },
    { ques: "C.", name: "Vì Peptamen có áp suất thẩm thấu ưu trương" },
    { ques: "D.", name: "Tất cả các câu trên đều đúng" }
  ],
  correctAnswer: 1,
};


const lessonProblem4 = {
  type: "SELECT_1_OF_3",
  questionNum: 4,
  question: `4.	Chọn đáp án đúng nhất về ưu điểm của Boost Optimum`,
  answers: [
    { ques: "A.", name: "Chứa 45% đạm WHEY chất lượng cao, giúp dễ tiêu hóa và hỗ trợ miễn dịch" },
    { ques: "B.", name: "Có hệ chất béo tốt cho tim mạch theo hướng dẫn của Hội Tim Mạch Châu Âu" },
    { ques: "C.", name: "Chứa Probiotics và Prebiotics: giúp giảm tiêu chảy, tăng cường sức khỏe hệ tiêu hóa và miễn dịch" },
    { ques: "D.", name: "Có chứa 75 mg vitamin E trong mỗi ly sữa (55g bột): là chất chống oxy hóa bảo vệ các tế bào miễn dịch khỏi stress oxy hóa" }
  ],
  correctAnswer: 2,
};

const lessonProblem5 = {
  type: "SELECT_1_OF_3",
  questionNum: 5,
  question: `5.	Boost Optimum dùng cho những đối tượng nào?`,
  answers: [
    { ques: "A.", name: "Người mệt mỏi, ốm yếu, ăn uống kém, hấp thu kém" },
    { ques: "B.", name: "Người cần hồi phục sau phẫu thuật, bệnh nặng" },
    { ques: "C.", name: "Người bị mất khối lượng cơ bắp" },
    { ques: "D.", name: "Tất cả các câu trên đều đúng" }
  ],
  correctAnswer: 3,
};

const lessonProblem6 = {
  type: "SELECT_1_OF_3",
  questionNum: 6,
  question: `6.	Chọn câu đúng về Boost Optimum:`,
  answers: [
    { ques: "A.", name: "BOOST OPTIMUM chứa 45% đạm WHEY" },
    { ques: "B.", name: "BOOST OPTIMUM chứa BCAAs cần thiết cho sức khỏe cơ bắp" },
    { ques: "C.", name: "LEUCINE là acid amin thiết yếu có trong BOOST OPTIMUM, kích thích tổng hợp protein cơ bắp" },
    { ques: "D.", name: "Boost Optimum được chứng minh lâm sàng giúp cải thiện sức khỏe sau 6 tuần" },
    { ques: "E.", name: "B và C đúng" },
    { ques: "F.", name: "B,C, và D đúng" }
  ],
  correctAnswer: 5,
};

const lessonProblem7 = {
  type: "SELECT_1_OF_3",
  questionNum: 7,
  question: `7.	Chọn câu đúng về Boost Glucose Control:`,
  answers: [
    { ques: "A.", name: "Chứa 50% Đạm Whey " },
    { ques: "B.", name: "Thích hợp cho bệnh nhân Đái tháo đường, tiền đái tháo đường, ĐTĐ thai kỳ" },
    { ques: "C.", name: "Chỉ số đường huyết GI cao" },
    { ques: "D.", name: "Tất cả các câu trên đều đúng" },
    { ques: "E.", name: "A và B đúng" }
  ],
  correctAnswer: 4,
};

const lessonProblem8 = {
  type: "SELECT_1_OF_3",
  questionNum: 8,
  question: `8.	Vì sao Boost Glucose Control thích hợp cho bệnh nhân Đái tháo đường:`,
  answers: [
    { ques: "A.", name: "Chứa hệ chất béo tốt cho sức khỏe" },
    { ques: "B.", name: "Chứa 100% đường đa" },
    { ques: "C.", name: "Dinh dưỡng cân bằng và hoàn chỉnh: 1kcal/ml" },
    { ques: "D.", name: "Tất cả các câu trên đều đúng" }
  ],
  correctAnswer: 3,
};

const lessonProblem9 = {
  type: "SELECT_1_OF_3",
  questionNum: 9,
  question: `9.	Bộ 3 Dinh dưỡng miễn dịch trong sản phẩm Oral Impact là:`,
  answers: [
    { ques: "A.", name: "Nucleotide, Vitamin E, Arginine" },
    { ques: "B.", name: "Arginine, Nucleotide, Omega 3" },
    { ques: "C.", name: "Selen, Vitamin E, Kẽm" },
    { ques: "D.", name: "Vitamin C, Nucleotide, Omega 3" }
  ],
  correctAnswer: 1,
};

const lessonProblem10 = {
  type: "SELECT_1_OF_3",
  questionNum: 10,
  question: `10.	Dòng sản phẩm dành cho bệnh nhân Nhi có mặt tạo thi trường Việt Nam của Nestle Health Science là:`,
  answers: [
    { ques: "A.", name: "Nutren Junior_ Dinh dưỡng dành trẻ suy dinh dưỡng, thấp còi" },
    { ques: "B.", name: "Peptamen Junior_ Dinh dưỡng chuyên biệt cho bệnh Nhi nặng" },
    { ques: "C.", name: "Nutren Optimum" },
    { ques: "D.", name: "Optifast" },
    { ques: "E.", name: "Tất cả các câu trên đều đúng" },
    { ques: "F.", name: "A và B đúng" }
  ],
  correctAnswer: 5,
};


export const LESSONS = [
  lessonProblem1, 
  lessonProblem2, 
  lessonProblem3, 
  lessonProblem4,
  lessonProblem5,
  lessonProblem6,
  lessonProblem7,
  lessonProblem8,
  lessonProblem9,
  lessonProblem10
];
