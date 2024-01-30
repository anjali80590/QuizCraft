import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import Analytics from "./Components/Analytics/Analytics";
import CreateQuiz from "./Components/CreateQuiz/CreateQuiz";
import CreateQuestion from "./Components/CreateQuestion/CreateQuestion";
import QuizQuestions from "./Components/QuizQuestions/QuizQuestions";
import HomePage from "./Components/Homepage/HomePage";
import QuizQuestionAnalysis from "./Components/QuizQuestionAnalytics/QuizQuestionAnalytics";
import EditQuestion from "./Components/EditQuestion/EditQuestion";

function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/homepage" element={<HomePage />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/homepage/analytics" element={<Analytics />} />
            <Route path="/homepage/createQuiz" element={<CreateQuiz />} />
            <Route path="/homepage/analytics" element={<Analytics />} />
            <Route
              path="/homepage/quiz-analysis/:quizId"
              element={<QuizQuestionAnalysis />}
            />
            <Route
              path="/homepage/create-question/:quizId"
              element={<CreateQuestion />}
            />
          </Route>
          <Route path="quiz/:quizId/" element={<QuizQuestions />} />
          <Route
            path="quiz-analysis/:quizId"
            element={<QuizQuestionAnalysis />}
          />
          <Route path="edit-question/:quizId" element={<EditQuestion />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
