import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "./QuizAnalysis.css";
import Delete from "../../images/Delete.png";
import share from "../../images/share.png";
import Edit from "../../images/Edit.png";
import BaseUrl from "../BaseUrl/BaseUrl";

const QuizAnalysis = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const navigate = useNavigate();
  const { quizId } = useParams();
  console.log(quizId);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const userToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!userToken) {
        toast.error("You must be logged in to view this data.");
        return;
      }

      try {
        const response = await fetch(
          `${BaseUrl}/api/quizzes/user/${userId}/quizzes`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        toast.error("Failed to fetch quiz data");
      }
    };

    fetchQuizzes();
  }, []);
  const copyLinkToClipboard = (quizId) => {
    const quizLink = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(quizLink).then(() => {
      toast.info("Link copied to Clipboard");
    });
  };

  const handleDeleteClick = async (quiz) => {
    setQuizToDelete(quiz);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setShowModal(false);
    if (!quizToDelete) return;

    try {
      const response = await fetch(
        `${BaseUrl}/api/quizzes/${quizToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setQuizzes(quizzes.filter((q) => q._id !== quizToDelete._id));
        toast.success("Quiz deleted successfully");
      } else {
        throw new Error("Failed to delete the quiz");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the quiz");
    }

    setQuizToDelete(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setQuizToDelete(null);
  };

  const goToQuizQuestionAnalytics = (quizId) => {
    navigate(`/homepage/quiz-analysis/${quizId}`);
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="analytics-wrapper">
      <div className="quiz-analysis-container">
        <h1>Quiz Analysis</h1>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Quiz Name</th>
              <th>Created On</th>
              <th>Impressions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz, index) => (
              <tr id="table-row" key={quiz._id}>
                <td>{index + 1}</td>
                <td>{quiz.name}</td>
                <td>{formatDate(quiz.createdOn)}</td>
                <td>{quiz.impressions}</td>
                <td>
                  <button
                    onClick={() => navigate(`/edit-question/${quiz._id}`)}
                  >
                    {" "}
                    <img src={Edit} />{" "}
                  </button>
                  <button
                    id="delete-quiz"
                    onClick={() => handleDeleteClick(quiz)}
                  >
                    {" "}
                    <img src={Delete} />{" "}
                  </button>
                  <button onClick={() => copyLinkToClipboard(quiz._id)}>
                    <img src={share} />
                  </button>
                  <button
                    className="qwa"
                    onClick={() => goToQuizQuestionAnalytics(quiz._id)}
                  >
                    Question with analysis
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showModal && (
          <ConfirmationModal
            isOpen={showModal}
            onConfirm={confirmDelete}
            onCancel={closeModal}
          />
        )}
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-body">
          <p>Are you sure you want to delete this quiz?</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirm Delete
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalysis;
