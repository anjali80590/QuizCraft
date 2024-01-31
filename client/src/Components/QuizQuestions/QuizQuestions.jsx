import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./QuizQuestions.css";
import image from "../../images/image.png";
import BaseUrl from "../BaseUrl/BaseUrl";

const QuizQuestions = () => {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizType, setQuizType] = useState(null);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [impressionsFetched, setImpressionsFetched] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timer, setTimer] = useState(null);
  const [quizDataReady, setQuizDataReady] = useState(false);
  const [submissionStarted, setSubmissionStarted] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    let isActive = true;

    const fetchQuestionsAndImpressions = async () => {
      try {
        const questionsResponse = await fetch(
          `${BaseUrl}/api/questions/user/${userId}/${quizId}/question`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!questionsResponse.ok) {
          throw new Error(`HTTP error! status: ${questionsResponse.status}`);
        }

        const questionsArray = await questionsResponse.json();

        if (isActive) {
          setQuestions(questionsArray);
          console.log(questionsArray);
          if (questionsArray.length > 0) {
            setQuizType(questionsArray[0].quizType);
            setTimer(questionsArray[0].timer);
            setTimeRemaining(questionsArray[0].timer);
            setQuizDataReady(true);
          }
        }

        if (!impressionsFetched && isActive) {
          const impressionsResponse = await fetch(
            `${BaseUrl}/api/quizzes/quiz/${userId}/${quizId}/impression`,
            {
              method: "GET",
            }
          );

          if (!impressionsResponse.ok) {
            throw new Error(
              `HTTP error! status: ${impressionsResponse.status}`
            );
          }

          setImpressionsFetched(true);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchQuestionsAndImpressions();

    return () => {
      isActive = false;
    };
  }, [quizId, userId]);

  const submitQuiz = async () => {
    let submissionData;

    if (quizType === "Q&A") {
      submissionData = {
        userId: userId,
        quizId: quizId,
        answers: Object.values(selectedAnswers),
      };
    } else if (quizType === "Poll") {
      submissionData = {
        userId: userId,
        quizId: quizId,
        answers: [selectedAnswers[currentQuestionIndex]],
      };
    } else {
      console.error("Unknown quiz type");
      return;
    }

    try {
      const response = await fetch(`${BaseUrl}/api/quizzes/submit-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log("Quiz submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestionTimer = questions[currentQuestionIndex].timer;
      setTimeRemaining(currentQuestionTimer);

      const intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            if (currentQuestionIndex === questions.length - 1) {
              setQuizCompleted(true);
              if (quizDataReady) {
                submitQuiz();
              }
            } else {
              goToNextQuestion();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [currentQuestionIndex, questions, quizDataReady]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
    } else {
      setQuizCompleted(true);
      if (quizDataReady) {
        submitQuiz();
      }
    }
  }, [currentQuestionIndex, questions.length, submitQuiz, quizDataReady]);

  const fetchTotalImpressions = useCallback(async () => {
    try {
      const response = await fetch(
        `${BaseUrl}/api/quizzes/total-impressions/${userId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTotalImpressions(data.totalImpressions);
    } catch (error) {
      console.error("Error fetching total impressions:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchTotalImpressions();
  }, [fetchTotalImpressions]);

  const handleOptionSelect = useCallback((questionIndex, optionIndex) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: optionIndex,
    }));
  }, []);

  const renderOptions = useCallback(
    (options, questionIndex) => {
      return options.map((option, idx) => (
        <button
          key={idx}
          className={`option-button ${
            selectedAnswers[questionIndex] === idx ? "selected" : ""
          }`}
          onClick={() => handleOptionSelect(questionIndex, idx)}
        >
          {option.text}
        </button>
      ));
    },
    [selectedAnswers, handleOptionSelect]
  );

  const renderCompletionMessage = () => {
    if (quizType === "Poll") {
      return <h1>Thank You for participating in the Poll</h1>;
    } else {
      let newScore = 0;
      questions.forEach((question, index) => {
        if (question.correctAnswer === selectedAnswers[index]) {
          newScore += 1;
        }
      });

      return (
        <>
          <p className="quiz-completed">Congrats! Quiz is completed</p>
          <img src={image} alt="" />
          <p>
            Your Score:{" "}
            <span className="score">
              0{newScore}/0{questions.length}
            </span>
          </p>
        </>
      );
    }
  };

  return (
    <div className="wrap">
      {quizCompleted ? (
        <div className="quiz-completed-container">
          {renderCompletionMessage()}
        </div>
      ) : (
        <div className="quiz-container">
          {questions.length > 0 ? (
            <div className="question-card">
              <div className="question-header">
                <div className="question-number">
                  0{currentQuestionIndex + 1}/0{questions.length}
                </div>
                {timer > 0 && <div className="timer">00:0{timeRemaining}s</div>}
              </div>

              <div className="question-text">
                {questions[currentQuestionIndex].Question}
              </div>
              <div className="options-container">
                {renderOptions(
                  questions[currentQuestionIndex].options,
                  currentQuestionIndex
                )}
              </div>
              <button className="next-button" onClick={goToNextQuestion}>
                {currentQuestionIndex === questions.length - 1
                  ? "SUBMIT"
                  : "NEXT"}
              </button>
            </div>
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizQuestions;
