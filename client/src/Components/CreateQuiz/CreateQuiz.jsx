// import React, { useState } from "react";
// import "./CreateQuiz.css";
// import { useNavigate } from "react-router-dom";
// import BaseUrl from "../BaseUrl/BaseUrl";
// const QuizForm = ({ onClose }) => {
//   const [quizName, setQuizName] = useState("");
//   const [quizType, setQuizType] = useState("");
//   const [isVisible, setIsVisible] = useState(true);
//   const navigate = useNavigate();

//   const handleNameChange = (e) => {
//     setQuizName(e.target.value);
//   };

//   const handleTypeChange = (newType) => {
//     setQuizType(newType);
//   };

//   const handleCancel = () => {
//     setIsVisible(false);
//     onClose && onClose();
//     navigate("/homepage/dashboard");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (quizName.trim() && quizType) {
//       try {
//         const token = localStorage.getItem("token");
//         const userId = localStorage.getItem("userId");
//         if (!token) {
//           alert("You must be logged in to create a quiz.");
//           return;
//         }
//         const response = await fetch(
//           `${BaseUrl}/api/quizzes/user/${userId}/quizzes`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               name: quizName,
//               type: quizType,
//             }),
//           }
//         );

//         const data = await response.json();

//         if (response.ok) {
//           const newQuizId = data._id;
//           localStorage.setItem("newQuizId", newQuizId);
//           navigate(`/homepage/create-question/${newQuizId}`, {
//             state: { quizType, quizName },
//           });
//         } else {
//           alert(`Failed to create quiz: ${data.message}`);
//         }
//       } catch (error) {
//         alert(`Network error: ${error.message}`);
//       }
//     } else {
//       alert("Please fill in the quiz name and select a quiz type.");
//     }
//   };

//   if (!isVisible) {
//     return null;
//   }

//   return (
//     <div className="modal-backdrop">
//       <div className="quiz-form-container">
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="text"
//               value={quizName}
//               onChange={handleNameChange}
//               placeholder="Quiz name"
//               className="quiz-name-input"
//             />
//           </div>
//           <div className="form-group">
//             Quiz Type
//             <button
//               type="button"
//               className={`quiz-type-button ${
//                 quizType === "Q&A" ? "active" : ""
//               }`}
//               onClick={() => handleTypeChange("Q&A")}
//             >
//               Q & A
//             </button>
//             <button
//               type="button"
//               className={`quiz-type-button ${
//                 quizType === "Poll" ? "active" : ""
//               }`}
//               onClick={() => handleTypeChange("Poll")}
//             >
//               Poll Type
//             </button>
//           </div>

//           <div className="form-actions">
//             <button type="button" className=" can-btn" onClick={handleCancel}>
//               Cancel
//             </button>
//             <button type="submit" className=" cont-btn continue-button">
//               Continue
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default QuizForm;







import React, { useState } from "react";
import "./CreateQuiz.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast
import BaseUrl from "../BaseUrl/BaseUrl";

const QuizForm = ({ onClose }) => {
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setQuizName(e.target.value);
  };

  const handleTypeChange = (newType) => {
    setQuizType(newType);
  };

  const handleCancel = () => {
    setIsVisible(false);
    onClose && onClose();
    navigate("/homepage/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quizName.trim() && quizType) {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!token) {
          toast.error("You must be logged in to create a quiz."); // Show toast message
          return;
        }
        const response = await fetch(
          `${BaseUrl}/api/quizzes/user/${userId}/quizzes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: quizName,
              type: quizType,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          const newQuizId = data._id;
          localStorage.setItem("newQuizId", newQuizId);
          navigate(`/homepage/create-question/${newQuizId}`, {
            state: { quizType, quizName },
          });
        } else {
          toast.error(`Failed to create quiz: ${data.message}`); // Show toast message
        }
      } catch (error) {
        toast.error(`Network error: ${error.message}`); // Show toast message
      }
    } else {
      toast.error("Please fill in the quiz name and select a quiz type."); // Show toast message
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="quiz-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={quizName}
              onChange={handleNameChange}
              placeholder="Quiz name"
              className="quiz-name-input"
            />
          </div>
          <div className="form-group">
            Quiz Type
            <button
              type="button"
              className={`quiz-type-button ${
                quizType === "Q&A" ? "active" : ""
              }`}
              onClick={() => handleTypeChange("Q&A")}
            >
              Q & A
            </button>
            <button
              type="button"
              className={`quiz-type-button ${
                quizType === "Poll" ? "active" : ""
              }`}
              onClick={() => handleTypeChange("Poll")}
            >
              Poll Type
            </button>
          </div>

          <div className="form-actions">
            <button type="button" className=" can-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className=" cont-btn continue-button">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
