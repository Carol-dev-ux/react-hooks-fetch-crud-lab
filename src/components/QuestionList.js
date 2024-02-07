import React, { useState, useEffect } from "react";

function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [newQuestionForm, setNewQuestionForm] = useState({
    prompt: "",
    answers: [],
    correctIndex: 0
  });

  useEffect(() => {
    // Fetch questions when the component mounts
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:4000/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewQuestionSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newQuestionForm)
      });
      if (!response.ok) {
        throw new Error("Failed to create question");
      }
      // Assuming the response contains the created question
      const createdQuestion = await response.json();
      setQuestions([...questions, createdQuestion]);
      // Clear the form
      setNewQuestionForm({
        prompt: "",
        answers: [],
        correctIndex: 0
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) {
        throw new Error("Failed to delete question");
      }
      // Remove the deleted question from the state
      setQuestions(questions.filter(question => question.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCorrectIndexChange = async (id, correctIndex) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ correctIndex })
      });
      if (!response.ok) {
        throw new Error("Failed to update correct index");
      }
      // Update the correct index in the question object
      setQuestions(questions.map(question => {
        if (question.id === id) {
          return { ...question, correctIndex };
        }
        return question;
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map(question => (
          <li key={question.id}>
            <div>{question.prompt}</div>
            <select
              value={question.correctIndex}
              onChange={(e) => handleCorrectIndexChange(question.id, e.target.value)}
            >
              {question.answers.map((answer, index) => (
                <option key={index} value={index}>
                  {answer}
                </option>
              ))}
            </select>
            <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleNewQuestionSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            value={newQuestionForm.prompt}
            onChange={(e) => setNewQuestionForm({...newQuestionForm, prompt: e.target.value})}
          />
        </label>
        <label>
          Answers:
          <input
            type="text"
            value={newQuestionForm.answers.join(",")}
            onChange={(e) => setNewQuestionForm({...newQuestionForm, answers: e.target.value.split(",")})}
          />
        </label>
        <label>
          Correct Index:
          <input
            type="number"
            value={newQuestionForm.correctIndex}
            onChange={(e) => setNewQuestionForm({...newQuestionForm, correctIndex: e.target.value})}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default QuestionList;
