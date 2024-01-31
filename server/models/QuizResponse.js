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
  selectedOptions: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
      optionIndex: Number, 
    },
  ],
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
});

const QuizResponse = mongoose.model("QuizResponse", quizResponseSchema);

module.exports = QuizResponse;
