import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./QuizQuestionAnalytics.module.css"; // Import the CSS module
import Line from "../../images/Line.png";
import BaseUrl from "../BaseUrl/BaseUrl";

const QuizQuestionAnalytics = () => {
  const { quizId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BaseUrl}/api/quizzes/quiz-analysis/${quizId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz analytics");
        }
        const data = await response.json();
        setAnalytics(data.analytics);
        setQuestions(data.questions);
      } catch (err) {
        setError(err.message);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizAnalytics();
  }, [quizId]);
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (isLoading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.errorMessage}>Error: {error}</p>;

  return (
    <div className={styles.analyticsContainer}>
      {analytics ? (
        <>
          <h2 className={styles.quizAnalytics}>
            {analytics.quizName} Question Analysis
          </h2>
          {questions &&
            questions.map((question, index) => (
              <div key={question?._id} className={styles.questionBlock}>
                <div className={styles.questionText}>
                  Q. {index + 1}: {question?.Question || "No question data"}
                </div>
                {question?.quizType === "Q&A" && (
                  <div className={styles.qnaAnalytics}>
                    <div className={styles.analyticsData}>
                      <span className={styles.analyticsDataValue}>
                        {question.totalAttempts}
                      </span>
                      <span className={styles.analyticsDataLabel}>
                        Total Attempts:
                      </span>
                    </div>
                    <div className={styles.analyticsData}>
                      <span className={styles.analyticsDataValue}>
                        {question.correctAttempts}
                      </span>
                      <span className={styles.analyticsDataLabel}>
                        Correct Attempts:
                      </span>
                    </div>
                    <div className={styles.analyticsData}>
                      <span className={styles.analyticsDataValue}>
                        {question.incorrectAttempts}
                      </span>
                      <span className={styles.analyticsDataLabel}>
                        Incorrect Attempts:
                      </span>
                    </div>
                  </div>
                )}
                <span className={styles.line}>
                  <img src={Line} alt="" />
                </span>
                {question?.quizType === "Poll" && question.options && (
                  <div className={styles.pollAnalytics}>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className={styles.analyticsData}>
                        <span className={styles.analyticsDataLabel}>
                          Option {optIndex + 1}:
                        </span>
                        <span className={styles.analyticsDataValue}>
                          {option?.text
                            ? `${option.text} - ${option.selectionCount} votes`
                            : "No option data"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          <div className={styles.impdate}>
            <div> CreatedOn : {formatDate(analytics.createdOn)}</div>
            <div>Impression : {analytics.impressions}</div>
          </div>
        </>
      ) : (
        <p className={styles.loading}>Loading...</p>
      )}
      {error && <p className={styles.errorMessage}>Error: {error}</p>}
    </div>
  );
};

export default QuizQuestionAnalytics;
