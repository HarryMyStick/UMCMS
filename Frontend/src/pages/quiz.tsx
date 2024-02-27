/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  BigCloseSvg,
  DoneSvg,
} from "~/components/Svgs";
import { useRouter } from "next/router";
import type { ILessonProblem } from "~/data/question";
import { LESSONS } from "~/data/question";
import { urlBackend } from "../global";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const lessonProblems = [...LESSONS];
const numbersEqual = (a: number[], b: number[]): boolean => {
  return a.length === b.length && a.every((_, i) => a[i] === b[i]);
};

const formatTime = (timeMs: number): string => {
  const seconds = Math.floor(timeMs / 1000) % 60;
  const minutes = Math.floor(timeMs / 1000 / 60) % 60;
  const hours = Math.floor(timeMs / 1000 / 60 / 60);
  if (hours === 0)
    return [minutes, seconds]
      .map((x) => x.toString().padStart(2, "0"))
      .join(":");
  return [hours, minutes, seconds]
    .map((x) => x.toString().padStart(2, "0"))
    .join(":");
};

const soundURLs = [
  '/rightAns.mp3',
  'wrongAns.mp3',
  'theme64.mp3',
  'celebrate.mp3'
];


const Quiz = () => {

  const [audios, setAudios] = useState<HTMLAudioElement[]>([]);
  const [loading, setLoading] = useState(true);

  const [lessonProblem, setLessonProblem] = useState(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  const [incorrectAnswerCount, setIncorrectAnswerCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<null | number>(null);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [answered, setAnswered] = useState<null | number>(null);

  const startTime = useRef(Date.now());
  const endTime = useRef(startTime.current + 1000 * 60 * 3 + 1000 * 33);

  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [reviewLessonShown, setReviewLessonShown] = useState(false);

  const problem: ILessonProblem = lessonProblems[lessonProblem] || lessonProblems[0] as ILessonProblem;

  const totalQuestions = 10;
  const totalAnswer = correctAnswerCount + incorrectAnswerCount

  const { correctAnswer } = problem;
  const isAnswerCorrect = Array.isArray(correctAnswer)
    ? numbersEqual(selectedAnswers, correctAnswer)
    : selectedAnswer === correctAnswer;

  const loadSuccess = useRef(false);

  useEffect(() => {
    if (!loadSuccess.current) {
      const loadAudios = async () => {
        try {
          const loadedAudioElements = await Promise.all(
            soundURLs.map(async (url) => {
              const audio = new Audio(url);
              await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve);
                audio.addEventListener('error', reject);
                audio.load();
              });
              audio.preload = 'auto';
              return audio;
            })
          );
          // Set loaded audios in state or context for caching
          setAudios(loadedAudioElements);
          setLoading(false);
          console.log("Audios loaded successfully");
        } catch (error) {
          console.error('Error loading audio:', error);
        }
      };

      loadAudios()
        .then(() => {
          console.log('Audio played successfully');
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
      loadSuccess.current = true;
    }
  }, []);

  useEffect(() => {
    const handleEnded = () => {
      if (audios[2]) {
        audios[2].currentTime = 0;
        audios[2].play()
          .then(() => {
            console.log('Audio played successfully');
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
          });
      }
    };

    if (audios[2]) {
      audios[2].addEventListener('ended', handleEnded);

      return () => {
        if (audios[2]) {
          audios[2].removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [audios]);

  useEffect(() => {
    if (audios[2]) {
      audios[2].play()
        .then(() => {
          console.log('Audio played successfully');
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    }
  }, [audios]);


  const playAudio = (index: number) => {
    const audio = audios[index];
    if (audio) {
      audio.currentTime = 0;
      audio.play()
        .then(() => {
          console.log('Audio played successfully');
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
        });
    }
  };

  const stopAudio = (index: number) => {
    const audio = audios[index];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const onFinish = () => {
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setAnswered(null);
    setLessonProblem((x) => (x + 1) % lessonProblems.length);
    endTime.current = Date.now();
    if (isAnswerCorrect) {
      setCorrectAnswerCount((x) => x + 1);
    } else {
      setIncorrectAnswerCount((x) => x + 1);
    }
    setQuestionResults((questionResults) => [
      ...questionResults,
      {
        question: problem.question,
        yourResponse: problem.answers[selectedAnswer ?? 0]?.name ?? "",
        correctResponse: problem.answers[problem.correctAnswer ?? 0]?.name ?? "",
      },
    ]);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-ln-custom from-white to-blue-200">
        <p className="text-4xl font-bold text-white animate-pulse">Loading...</p>
      </div>
    );
  } else {
    if (correctAnswerCount + incorrectAnswerCount >= totalQuestions) {
      stopAudio(2);
      return (
        <LessonComplete
          correctAnswerCount={correctAnswerCount}
          startTime={startTime}
          endTime={endTime}
          reviewLessonShown={reviewLessonShown}
          setReviewLessonShown={setReviewLessonShown}
          questionResults={questionResults}
          playAudio={playAudio}
          stopAudio={stopAudio}
        />
      );
    }
    switch (problem.type) {
      case "SELECT_1_OF_3": {
        return (
          <ProblemSelect1Of3
            problem={problem}
            totalQuestions={totalQuestions}
            totalAnswer={totalAnswer}
            selectedAnswer={selectedAnswer}
            answered={answered}
            setSelectedAnswer={setSelectedAnswer}
            setAnswered={setAnswered}
            isAnswerCorrect={isAnswerCorrect}
            onFinish={onFinish}
            playAudio={playAudio}
          />
        );
      }
    }
  }
};

export default Quiz;

const ProgressBar = ({
  questionNum,
  totalQuestions,
  totalAnswer,
}: {
  questionNum: number;
  totalQuestions: number;
  totalAnswer: number;
}) => {
  const imagePosition = `${(totalAnswer / totalQuestions) * 100}%`;
  return (
    <header className="relative flex items-center gap-4">
      <div
        className="relative h-4 grow rounded-full bg-gray-200 flex items-center"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={totalAnswer / totalQuestions}
      >
        <div
          className={
            "h-full rounded-full bg-green-500 transition-all duration-700 " +
            (totalAnswer > 0 ? "px-2 pt-1 " : "")
          }
          style={{
            width: `${(totalAnswer / totalQuestions) * 100}%`,
          }}
        >
          <div className="h-[5px] w-full rounded-full bg-green-400"></div>
        </div>
        <img
          src="iconProgress.png"
          alt="Image"
          className="absolute pl-2.5 w-12 h-12 top-[-21px] transform -translate-x-1/2 transition-all duration-500 
          sm:top-[-26px] sm:w-14 sm:h-14 
          md:top-[-40px] md:w-20 md:h-20 
          xl:top-[-40px] xl:w-20 xl:h-20 
          2xl:top-[-40px] 2xl:w-20 2xl:h-20"
          style={{ left: imagePosition }}
        />
      </div>
      <h1 className="msFont-num"> {questionNum} / {totalQuestions} </h1>
    </header>
  );
};

const ProblemSelect1Of3 = (({
  problem,
  totalQuestions,
  totalAnswer,
  selectedAnswer,
  answered,
  setSelectedAnswer,
  setAnswered,
  isAnswerCorrect,
  onFinish,
  playAudio,
}: {
  problem: ILessonProblem;
  totalQuestions: number;
  totalAnswer: number;
  selectedAnswer: number | null;
  answered: number | null;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<number | null>>;
  setAnswered: React.Dispatch<React.SetStateAction<number | null>>;
  isAnswerCorrect: boolean;
  onFinish: () => void;
  playAudio: (n: number) => void;
}) => {
  const { question, answers } = problem;
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<null | number>(null);

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex grow flex-col items-center gap-5">
        <section className="flex max-w-2xl grow flex-col gap-5 self-center sm:items-center sm:justify-center sm:gap-[3rem] sm:px-5 pb-[15vh] ">
          <div className="w-full max-w-5xl sm:mt-8 sm:px-5">
            <div className="flex items-center relative w-full h-36 md:h-52">
              <img src="/logoQuiz.png" alt="Logo" className="absolute left-0 w-36 h-12 
              sm:w-64 sm:h-32 
              md:w-80 md:h-36 
              lg:mr-16 lg:w-80 
              xl:w-80 xl:h-36 
              2xl:w-80 2xl:h-36" />
              <div className="absolute right-0 w-24 md:w-[9rem] sm:w-[9rem]">
                <Carousel
                  infiniteLoop
                  autoPlay
                  interval={5000}
                  stopOnHover={false}
                  showArrows={false}
                  showIndicators={false}
                  showStatus={false}
                  swipeable={false}
                  showThumbs={false}
                >
                  <div>
                    <img src="/p1.png" alt="Image 1" />
                  </div>
                  <div>
                    <img src="/p2.png" alt="Image 2" />
                  </div>
                  <div>
                    <img src="/p3.png" alt="Image 3" />
                  </div>
                  <div>
                    <img src="/p4.png" alt="Image 4" />
                  </div>
                </Carousel>
              </div>
            </div>
            <ProgressBar
              questionNum={problem.questionNum}
              totalQuestions={totalQuestions}
              totalAnswer={totalAnswer}
            />
          </div>
          <h1 className="msFont self-start text-2xl font-bold sm:text-3xl">
            {question}
          </h1>
          <div
            className="grid grid-cols-2 gap-2 sm:grid-cols-3"
            role="radiogroup"
          >
            {answers.map((answer, i) => {
              return (
                <div
                  key={i}
                  className={
                    i === selectedAnswer
                      ? isAnswerCorrect
                        ? "cursor-pointer rounded-xl border-2 border-b-4 ans_box_right p-4 text-white"
                        : "cursor-pointer rounded-xl border-2 border-b-4 ans_box_wrong p-4 text-white"
                      : (answered === 1 && !isAnswerCorrect && i === correctAnswerIndex)
                        ? "cursor-pointer rounded-xl border-2 border-b-4 ans_box_right p-4 text-white"
                        : "cursor-pointer rounded-xl border-2 border-b-4 border-gray-200 p-4 hover:bg-gray-100"
                  }
                  role="radio"
                  aria-checked={i === selectedAnswer}
                  tabIndex={0}
                  onClick={() => {
                    if (answered == null) {
                      setSelectedAnswer(i);
                      setAnswered(1);
                      setCorrectAnswerIndex(problem.correctAnswer);
                      if (i === problem.correctAnswer) {
                        playAudio(0);
                      } else {
                        playAudio(1);
                      }
                    }
                  }}
                >
                  <h1 className="question-text">{answer.ques}</h1>
                  <h2 className="text-left">{answer.name}</h2>
                </div>
              );
            })}
          </div>
          <div className="bg_btn w-full h-full flex justify-center p-2.5 fixed_btn">
            <button
              onClick={() => {
                onFinish();
              }}
              disabled={selectedAnswer === null}
              className={`self-middle sm:self-middle btn_color ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : 'hover:border-cyan-300 hover:bg-cyan-600'} text-white font-bold px-6 rounded text-lg`}
            >
              Tiếp tục
            </button>
          </div>
        </section>
      </div>

    </div>
  );
});
const LessonComplete = ({
  correctAnswerCount,
  startTime,
  endTime,
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
  playAudio,
  stopAudio,
}: {
  correctAnswerCount: number;
  startTime: React.MutableRefObject<number>;
  endTime: React.MutableRefObject<number>;
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
  playAudio: (n: number) => void;
  stopAudio: (n: number) => void;
}) => {
  const router = useRouter();
  const { userId } = router.query;
  const replay = async () => {
    try {
      await router.push('/register');
    } catch (error) {
      console.error('Error redirecting:', error);
    }
  };
  playAudio(3);
  const sendDataToBackend = async () => {
    try {
      const response = await fetch(`${urlBackend}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: userId,
          score: correctAnswerCount,
          time: formatTime(endTime.current - startTime.current),
        }),
      });

      if (response.ok) {
        console.log("Success add result");
      } else {
        const responseData = await response.json() as unknown;
        if ((responseData as { message: string }).message === "Account already exists") {
        } else {
          throw new Error('Error registering user');
        }
      }
    } catch (error) {
      console.log("Error in query");
    }
  };

  void sendDataToBackend();

  return (
    <div className="flex min-h-screen flex-col gap-5 px-4 py-5 sm:px-0 sm:py-0">
      <div className="flex-grow flex flex-col items-center justify-center gap-8 font-bold">
        <h1 className="text-center text-3xl md:text-5xl t-color">Chúc mừng</h1>
        {correctAnswerCount >= 8 ? (
          <h1 className="text-center text-3xl md:text-5xl t-color">Bạn thật <span className="t-color-yellow">xuất sắc!</span></h1>
        ) : (
          <h1 className="text-center text-3xl md:text-5xl t-color">Bạn đã <span className="t-color-yellow">hoàn thành!</span></h1>
        )}
        <div className="relative">
          <img src="/Stars.png" alt="effectStars" className="hidden sm:block absolute max-w-[590px] left-[-87px] top-[-92%] md:max-w-[600px] md:left-[-90px] md:top-[-96%]" />
          <div className="flex flex-wrap justify-center gap-5">
            <div className="w-[200px] rounded-xl border-2 round-count">
              <h2 className="py-3 text-center text-white">Số câu trả lời đúng</h2>
              <div className="flex justify-center rounded-xl bg-white py-4 text-3xl text-yellow-400 t-bold">
                {correctAnswerCount}
              </div>
            </div>
            <div className="w-[200px] rounded-xl border-2 round-count">
              <h2 className="py-3 text-center text-white">Thời gian</h2>
              <div className="flex justify-center rounded-xl bg-white py-4 text-3xl text-yellow-400 t-bold">
                {formatTime(endTime.current - startTime.current)}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl sm:justify-between space-x-4 text-sm md:text-xl mt-3">
          <button
            onClick={() => setReviewLessonShown(true)}
            className="flex items-center justify-center rounded-2xl border-b-4 btn_color p-1.5 md:p-3 font-bold uppercase text-white transition hover:border-cyan-300 hover:bg-cyan-600 md:min-w-[150px] min-w-[115px] sm:w-auto"
          >
            Kết quả
          </button>
          <Link
            href="/rank"
            className="flex items-center justify-center rounded-2xl border-b-4 btn_color p-1.5 md:p-3 font-bold uppercase text-white transition hover:border-cyan-300 hover:bg-cyan-600 md:min-w-[150px] min-w-[115px] sm:w-auto"
          >
            BXH
          </Link>
          <button
            onClick={() => {
              void replay();
              void stopAudio(3);
            }}
            className="flex items-center justify-center rounded-2xl border-b-4 btn_color p-1.5 md:p-3 font-bold uppercase text-white transition hover:border-cyan-300 hover:bg-cyan-600 md:min-w-[150px] min-w-[115px] sm:w-auto"
          >
            Chơi lại
          </button>
        </div>
      </div>
      <ReviewLesson
        reviewLessonShown={reviewLessonShown}
        setReviewLessonShown={setReviewLessonShown}
        questionResults={questionResults}
      />
    </div>

  );
};

type QuestionResult = {
  question: string;
  yourResponse: string;
  correctResponse: string;
};

const ReviewLesson = ({
  reviewLessonShown,
  setReviewLessonShown,
  questionResults,
}: {
  reviewLessonShown: boolean;
  setReviewLessonShown: React.Dispatch<React.SetStateAction<boolean>>;
  questionResults: QuestionResult[];
}) => {
  const [selectedQuestionResult, setSelectedQuestionResult] =
    useState<null | QuestionResult>(null);
  return (
    <div
      className={[
        "fixed inset-0 flex items-center justify-center p-5 transition duration-300",
        reviewLessonShown ? "" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0 bg-black",
          reviewLessonShown ? "opacity-75" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setReviewLessonShown(false)}
      ></div>
      <div className="relative flex w-full max-w-4xl flex-col gap-5 rounded-2xl border-2 border-gray-200 bg-white p-8 overflow-y-auto max-h-full">
        <button
          className="absolute right-5 top-5 rounded-full border-2 border-gray-200 bg-gray-100 p-1 text-gray-400 hover:brightness-90"
          onClick={() => setReviewLessonShown(false)}
        >
          <BigCloseSvg className="h-8 w-8" />
          <span className="sr-only">Close</span>
        </button>
        <h2 className="text-center text-3xl">Cùng xem kết quả của bạn nào</h2>
        <p className="text-center text-xl text-gray-400">
          Ấn vào câu hỏi để xem câu trả lời của bạn
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {questionResults.map((questionResult, i) => {
            return (
              <button
                key={i}
                className={[
                  "relative flex flex-col items-stretch gap-3 rounded-xl p-5 text-left",
                  questionResult.yourResponse === questionResult.correctResponse
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-500",
                ].join(" ")}
                onClick={() =>
                  setSelectedQuestionResult((selectedQuestionResult) =>
                    selectedQuestionResult === questionResult
                      ? null
                      : questionResult
                  )
                }
              >
                <div className="flex justify-between gap-2">
                  <h3 className="font-bold">{questionResult.question}</h3>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
                    {questionResult.yourResponse ===
                      questionResult.correctResponse ? (
                      <DoneSvg className="h-5 w-5" />
                    ) : (
                      <BigCloseSvg className="h-5 w-5" />
                    )}
                  </div>
                </div>
                <div>{questionResult.yourResponse}</div>
                {selectedQuestionResult === questionResult && (
                  <div className="absolute left-1 right-1 top-20 z-10 rounded-2xl border-2 border-gray-200 bg-white p-3 text-sm tracking-tighter">
                    <div
                      className="absolute -top-2 h-3 w-3 rotate-45 border-l-2 border-t-2 border-gray-200 bg-white"
                      style={{ left: "calc(50% - 6px)" }}
                    ></div>
                    <div className="font-bold uppercase text-gray-400">
                      Câu trả lời của bạn:
                    </div>
                    <div className="mb-3 text-gray-700">
                      {questionResult.yourResponse}
                    </div>
                    <div className="font-bold uppercase text-gray-400">
                      Câu trả lời đúng:
                    </div>
                    <div className="text-gray-700">
                      {questionResult.correctResponse}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
