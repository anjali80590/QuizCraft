import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import eye from "../../images/eye.png";
import BaseUrl from "../BaseUrl/BaseUrl";

const Dashboard = () => {
  const [createdQuizzes, setCreatedQuizzes] = useState(0);
  const [createdQuestions, setCreatedQuestions] = useState(0);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);

  const userId = localStorage.getItem("userId");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const quizzesUrl = `${BaseUrl}/api/quizzes/user/${userId}/quizzes`;
    const questionsUrl = `${BaseUrl}/api/questions/user/${userId}/question`;
    const trendingUrl = `${BaseUrl}/api/quizzes/user/${userId}/trending`;

    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const [quizRes, questionRes, trendingRes] = await Promise.all([
        fetch(quizzesUrl, { headers: authHeaders }),
        fetch(questionsUrl, { headers: authHeaders }),
        fetch(trendingUrl, { headers: authHeaders }),
      ]);

      const quizData = await quizRes.json();
      const questionsData = await questionRes.json();
      const trendingData = await trendingRes.json();
      console.log(trendingData);

      setCreatedQuizzes(quizData.length || 0);
      setCreatedQuestions(questionsData.length || 0);
      setTrendingQuizzes(trendingData.quizzes || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const fetchTotalImpressions = async () => {
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
    };

    fetchTotalImpressions();
  }, [userId]);

  return (
    <div className="dashboard">
      <div className="statistics">
        <div className="stat stat-quiz">
          <div className="flex-quiz">
            <p id="stat-quiz">
              {createdQuizzes} <span id="stat">Quizzes</span>
            </p>
            <p> Created</p>
          </div>
        </div>
        <div className="stat stat-questions">
          <p id="stat-questions">
            {createdQuestions} <span id="stat">Questions</span>
          </p>
          <p> Created</p>
        </div>
        <div className="stat stat-impressions">
          <p id="stat-impressions">
            {totalImpressions} <span id="stat"> Total</span>
          </p>
          <p>Impressions</p>
        </div>
      </div>
      <div className="trending-quizzes">
        <h2>Trending Quizzes</h2>
        <ul className="quiz-list">
          {trendingQuizzes.map((quiz) => (
            <li key={quiz._id}>
              <div className="flex">
                <h3>{quiz.name}</h3>
                <p id="imp">
                  {" "}
                  {quiz.impressions || "N/A"} <img src={eye} alt="" />
                </p>
              </div>
              <p id="created-date">
                Created on: {new Date(quiz.createdOn).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
