export interface ILessonProblem {
  type: string,
  question: string,
  answers: ILesson[],
  correctAnswer: number,
}

interface ILesson {
  name: string,
  icon?: string,
}

const lessonProblem1: ILessonProblem = {
  type: "SELECT_1_OF_3",
  question: `1.	Các dòng sản phẩm chính của Nestle Health Science?`,
  answers: [
    { name: "a.	Peptamen_ Dinh dưỡng chuyên biệt cho bệnh nhân nặng, kém hấp thu" },
    { name: "b.	Boost Optimum_ Dinh dưỡng hoàn chỉnh cho Người lớn " },
    {  name: "c.	Oral Impact- Dinh dưỡng miễn dịch cho bệnh nhân ung thu và phẫu thuật" },
    {  name: "d.	Boost Glucose Control- Dinh dưỡng cho Người Đái tháo đường" },
    {  name: "e.	Tất cả các câu trên đều đúng" },
  ],
  correctAnswer: 4,
};

const lessonProblem2 = {
  type: "SELECT_1_OF_3",
  question: `2.	Chọn câu đúng về sản phẩm Peptamen`,
  answers: [
    { name: "a.	Chứa 50% đạm Whey thủy phân" },
    { name: "b.	Không dùng để nuôi ăn qua ống thông" },
    { name: "c.	50% chất béo là chất bép MCT" },
    { name: "d.	Chứa 100% đạm whey và 70% chất béo là MCT" }
  ],
  correctAnswer: 3,
};

const lessonProblem3 = {
  type: "SELECT_1_OF_3",
  question: `3.	Vì sao Peptamen thích hợp dùng nuôi ăn qua sonde cho bệnh nhân nặng`,
  answers: [
    { name: "a.	Vì Peptamen có công thức giàu chất béo" },
    { name: "b.	Vì Peptamen có công thức đạm Whey dưới dạng Peptide nhỏ hơn, dễ hấp thu hơn" },
    { name: "c.	Vì Peptamen có áp suất thẩm thấu ưu trương" },
    { name: "d.	Tất cả đều đúng" }
  ],
  correctAnswer: 1,
};


const lessonProblem4 = {
  type: "SELECT_1_OF_3",
  question: `3.	Vì sao Peptamen thích hợp dùng nuôi ăn qua sonde cho bệnh nhân nặng`,
  answers: [
    { name: "a.	Vì Peptamen có công thức giàu chất béo" },
    { name: "b.	Vì Peptamen có công thức đạm Whey dưới dạng Peptide nhỏ hơn, dễ hấp thu hơn" },
    { name: "c.	Vì Peptamen có áp suất thẩm thấu ưu trương" },
    { name: "d.	Tất cả đều đúng" }
  ],
  correctAnswer: 1,
};

const lessonProblem5 = {
  type: "SELECT_1_OF_3",
  question: `3.	Vì sao Peptamen thích hợp dùng nuôi ăn qua sonde cho bệnh nhân nặng`,
  answers: [
    { name: "a.	Vì Peptamen có công thức giàu chất béo" },
    { name: "b.	Vì Peptamen có công thức đạm Whey dưới dạng Peptide nhỏ hơn, dễ hấp thu hơn" },
    { name: "c.	Vì Peptamen có áp suất thẩm thấu ưu trương" },
    { name: "d.	Tất cả đều đúng" }
  ],
  correctAnswer: 1,
};

const lessonProblem6 = {
  type: "SELECT_1_OF_3",
  question: `3.	Vì sao Peptamen thích hợp dùng nuôi ăn qua sonde cho bệnh nhân nặng`,
  answers: [
    { name: "a.	Vì Peptamen có công thức giàu chất béo" },
    { name: "b.	Vì Peptamen có công thức đạm Whey dưới dạng Peptide nhỏ hơn, dễ hấp thu hơn" },
    { name: "c.	Vì Peptamen có áp suất thẩm thấu ưu trương" },
    { name: "d.	Tất cả đều đúng" }
  ],
  correctAnswer: 1,
};

const lessonProblem7 = {
  type: "SELECT_1_OF_3",
  question: `3.	Vì sao Peptamen thích hợp dùng nuôi ăn qua sonde cho bệnh nhân nặng`,
  answers: [
    { name: "a.	Vì Peptamen có công thức giàu chất béo" },
    { name: "b.	Vì Peptamen có công thức đạm Whey dưới dạng Peptide nhỏ hơn, dễ hấp thu hơn" },
    { name: "c.	Vì Peptamen có áp suất thẩm thấu ưu trương" },
    { name: "d.	Tất cả đều đúng" }
  ],
  correctAnswer: 1,
};

const lessonProblem8 = {
  type: "SELECT_1_OF_3",
  question: `3.	Vì sao Peptamen thích hợp dùng nuôi ăn qua sonde cho bệnh nhân nặng`,
  answers: [
    { name: "a.	Vì Peptamen có công thức giàu chất béo" },
    { name: "b.	Vì Peptamen có công thức đạm Whey dưới dạng Peptide nhỏ hơn, dễ hấp thu hơn" },
    { name: "c.	Vì Peptamen có áp suất thẩm thấu ưu trương" },
    { name: "d.	Tất cả đều đúng" }
  ],
  correctAnswer: 1,
};

const lessonProblem9 = {
  type: "SELECT_1_OF_3",
  question: `3.	Vì sao Peptamen thích hợp dùng nuôi ăn qua sonde cho bệnh nhân nặng`,
  answers: [
    { name: "a.	Vì Peptamen có công thức giàu chất béo" },
    { name: "b.	Vì Peptamen có công thức đạm Whey dưới dạng Peptide nhỏ hơn, dễ hấp thu hơn" },
    { name: "c.	Vì Peptamen có áp suất thẩm thấu ưu trương" },
    { name: "d.	Tất cả đều đúng" }
  ],
  correctAnswer: 1,
};

const lessonProblem10 = {
  type: "SELECT_1_OF_3",
  question: `3.	Vì sao Peptamen thích hợp dùng nuôi ăn qua sonde cho bệnh nhân nặng`,
  answers: [
    { name: "a.	Vì Peptamen có công thức giàu chất béo" },
    { name: "b.	Vì Peptamen có công thức đạm Whey dưới dạng Peptide nhỏ hơn, dễ hấp thu hơn" },
    { name: "c.	Vì Peptamen có áp suất thẩm thấu ưu trương" },
    { name: "d.	Tất cả đều đúng" }
  ],
  correctAnswer: 1,
};

// const lessonProblem5 = {
//   type: "WRITE_IN_ENGLISH",
//   question: "2.	Chọn câu đúng về sản phẩm Peptamen",
//   answerTiles: ["aChứa 50% đạm Whey thủy phân", "milk", "water", "I", "The", "boy"],
//   correctAnswer: [4, 5],
// }


// const lessonProblem7 = {
//   type: "SELECT_1_OF_3",
//   question: `1.	Các dòng sản phẩm chính của Nestle Health Science?`,
//   answers: [
//     { icon: <AppleSvg />, name: "a.	Peptamen_ Dinh dưỡng chuyên biệt cho bệnh nhân nặng, kém hấp thu" },
//     { icon: <BoySvg />, name: "b.	Boost Optimum_ Dinh dưỡng hoàn chỉnh cho Người lớn " },
//     { icon: <WomanSvg />, name: "c.	Oral Impact- Dinh dưỡng miễn dịch cho bệnh nhân ung thu và phẫu thuật" },
//     { icon: <WomanSvg />, name: "d.	Boost Glucose Control- Dinh dưỡng cho Người Đái tháo đường" },
//     { icon: <WomanSvg />, name: "e.	Tất cả các câu trên đều đúng" },
//   ],
//   correctAnswer: 4,
// };


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
