const mongoose = require("mongoose");

const quizResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  answers: [Number], 
  result: {
    success: Boolean,
    message: String,
    correctAttempts: Number,
    incorrectAttempts: Number,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  impressions: {
    type: Number,
    default: 0, 
  },
  quizName: {
    type: String,
    required: true, 
  },
});

const QuizResponse = mongoose.model("QuizResponse", quizResponseSchema);

module.exports = QuizResponse;
