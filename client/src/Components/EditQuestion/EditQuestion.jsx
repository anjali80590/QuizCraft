import React, { useState, useEffect } from "react";
import "./EditQuestion.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams, useLocation } from "react-router-dom";
import BaseUrl from "../BaseUrl/BaseUrl";
import Vector from "../../images/Vector.png";

const EditQuestion = () => {
  const { quizId } = useParams();
  console.log("create question quiz id", quizId);
  const location = useLocation();
  const [quiz, setQuiz] = useState({ name: "", type: "" });
  const [questions, setQuestions] = useState([
    {
      Question: "",
      options: [
        { text: "", imageUrl: "" },
        { text: "", imageUrl: "" },
      ],
      correctAnswer: null,
      timer: "OFF",
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [optionType, setOptionType] = useState("text");

  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      setQuiz({
        name: location.state.quizName,
        type: location.state.quizType,
      });
    }
  }, [location.state]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      toast.error("You must be logged in to edit a quiz.");
      return;
    }

    fetch(
      `${BaseUrl}/api/questions/user/${userId}/${quizId}/question`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(
            data.map((question) => ({
              _id: question._id,
              Question: question.Question,
              correctAnswer: question.correctAnswer,
              correctAttempts: question.correctAttempts,
              incorrectAttempts: question.incorrectAttempts,
              options: question.options,
              quizType: question.quizType,
              timer: question.timer,
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching quiz questions:", error);
        toast.error(`Error fetching quiz questions: ${error.message}`);
      });
  }, [quizId]);

  const closePopup = () => {
    navigate("/homepage/dashboard");
  };

  const handlePollQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].Question = value;

    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value, type) => {
    const newQuestions = [...questions];
    if (type === "text") {
      newQuestions[questionIndex].options[optionIndex].text = value;
    } else if (type === "imageUrl") {
      newQuestions[questionIndex].options[optionIndex].imageUrl = value;
    }
    setQuestions(newQuestions);
    console.log("set new question", setQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    const options = newQuestions[questionIndex].options;

    if (options.length > 2) {
      options.splice(optionIndex, 1);
      setQuestions(newQuestions);
    }
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions].filter((_, i) => i !== index);
    setQuestions(newQuestions);

    if (currentQuestionIndex === index) {
      if (index > 0) {
        setCurrentQuestionIndex(index - 1);
      } else if (newQuestions.length > 0) {
        setCurrentQuestionIndex(0);
      } else {
        setCurrentQuestionIndex(null);
      }
    } else if (currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const updateQuestion = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) {
      toast.error("You must be logged in to update the quiz.");
      return;
    }

    try {
      const response = await fetch(
        `${BaseUrl}/api/questions/user/${userId}/${quizId}/questions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ questions }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success("Quiz updated successfully!");
      navigate('/homepage/analytics')
    } catch (error) {
      console.error("Error updating the quiz:", error);
      toast.error(`Error updating the quiz: ${error.message}`);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  const renderOptionInput = (option, questionIndex, optionIndex) => {
    const currentQuestion = questions[questionIndex];

    const isCorrectAnswer =
      questions[questionIndex].correctAnswer === optionIndex;
    const inputClass = isCorrectAnswer
      ? "correct-option-input"
      : "option-input";

    const inputElement = (
      <input
        type="text"
        value={option.text}
        onChange={(e) =>
          handleOptionChange(questionIndex, optionIndex, e.target.value, "text")
        }
        placeholder={`Text Option ${optionIndex + 1}`}
        className={inputClass}
      />
    );

    const imageElement = (
      <input
        type="text"
        value={option.imageUrl}
        onChange={(e) =>
          handleOptionChange(
            questionIndex,
            optionIndex,
            e.target.value,
            "imageUrl"
          )
        }
        placeholder={`Image URL Option ${optionIndex + 1}`}
        className={inputClass}
      />
    );

    const radioButton = quiz.type !== "Poll" && (
      <input
        type="radio"
        name={`correct-answer-${questionIndex}`}
        checked={isCorrectAnswer}
        onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
        className="correct-answer-radio"
      />
    );
    return (
      <div key={optionIndex} className="option">
        {radioButton}
        {optionType === "text" && inputElement}
        {optionType === "image" && imageElement}
        {optionType === "textAndImage" && (
          <>
            {inputElement}
            {imageElement}
          </>
        )}
        {optionIndex >= 2 && currentQuestion.options.length > 2 && (
          <button
            onClick={() => removeOption(questionIndex, optionIndex)}
            className="remove-option-button"
          >
            <img className="del" src={Vector} alt="" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="modal-backdrop">
      <div className="quiz-creator">
        <div className="quiz-header">
          {questions.map((_, index) => (
            <div key={index} className="question-with-remove">
              <button
                onClick={() => goToQuestion(index)}
                className={`navigation-button ${
                  currentQuestionIndex === index ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
              {index !== 0 && (
                <button
                  onClick={() => removeQuestion(index)}
                  className="remove-question-button"
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
        {questions.map((question, questionIndex) => (
          <div
            key={questionIndex}
            className={`question-block ${
              currentQuestionIndex === questionIndex ? "" : "hidden"
            }`}
          >
            <div className="question-type-header"></div>
            <input
              type="text"
              value={question.Question}
              onChange={(e) =>
                handlePollQuestionChange(questionIndex, e.target.value)
              }
              placeholder={
                quiz.type === "Poll" ? "Poll Question" : "Q&A Question"
              }
              className="poll-question-input"
            />

            <div className="text-image-inputs">
              {question.options.map((option, optionIndex) =>
                renderOptionInput(option, questionIndex, optionIndex)
              )}
            </div>
          </div>
        ))}

        <div className="quiz-footer">
          <button onClick={closePopup} className="cancel-button">
            Cancel
          </button>
          <button onClick={updateQuestion} className="create-quiz-button">
            Update Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;
