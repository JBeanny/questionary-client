import React, { useState, useEffect } from "react";
import { Alert } from "antd";

interface Answer {
  id: number;
  option: string;
  chosen: number;
}

interface Question {
  id: number;
  question: string;
  answers: Array<Answer>;
}

const Play = ({ response }: { response: { questions: Array<Question> } }) => {
  const [index, setIndex] = useState<number>(0);
  const [indexChange, setIndexChange] = useState<boolean>(false);
  const [answerClick, setAnswerClick] = useState<boolean>(false);
  const [percentages, setPercentages] = useState<Array<number>>([]);
  const [alert, setAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const question = response.questions[index];

  const handleIncrement = () => {
    if (index < response.questions.length - 1) setIndex(index + 1);
    else setIndex(0);
    setAnswerClick(false);
  };
  const handleDecrement = () => {
    if (index >= 1) setIndex(index - 1);
    setAnswerClick(false);
  };

  const getVotes = () => {
    let votes = answerClick ? 1 : 0;
    let percentages = [] as any;
    question.answers.forEach((answer) => (votes += answer.chosen));
    question.answers.forEach((answer) =>
      percentages.push(
        votes > 0 ? ((answer.chosen * 100) / votes).toFixed(2) : 0
      )
    );
    return percentages;
  };

  const addVote = async (id: number) => {
    const api = `http://localhost:8080/api/v1/options/${id}?question=${question.id}`;
    const uid = JSON.parse(localStorage.getItem("UID") as string);

    const data = {
      uid: uid,
    };

    await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "Success") {
          setAnswerClick(true);
        } else {
          setAnswerClick(false);
          setAlert(true);
          setMessage(response.message);
          setTimeout(() => {
            setAlert(false);
          }, 1000);
        }
      });
  };

  useEffect(() => {
    setPercentages(getVotes());
  }, [index]);

  return (
    <>
      <div className="absolute w-[400px] right-[10px] top-[10px]">
        {alert ? (
          <Alert message={message} type="warning" showIcon closable />
        ) : (
          ""
        )}
      </div>
      <div className="max-w-[1200px] h-screen mx-auto flex flex-col justify-center items-center relative">
        <div className="transition-all duration-100 ease-linear flex flex-col justify-center items-start gap-8">
          <p className="text-3xl pl-8 w-[700px]">
            {index + 1}.{question.question}
          </p>
          <div className="flex flex-col gap-6">
            {question.answers.map((answer, key) => {
              return (
                <div
                  key={key}
                  className="text-xl bg-transparent w-[700px] py-4 rounded-full p-8 text-primary border-2 border-primary active:bg-primary cursor-pointer active:text-white relative overflow-hidden"
                  onClick={() => addVote(answer.id)}
                >
                  {answer.option}
                  <div
                    className={`${
                      answerClick ? "translate-x-100" : "-translate-x-[100%]"
                    } bg-primary bg-opacity-20 absolute left-0 right-0 bottom-0 top-0 rounded-full transition-all duration-500 flex justify-center items-center text-secondary`}
                  >
                    {percentages[key]} %
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="bg-primary text-white py-4 w-[200px] rounded-full absolute left-0 bottom-[50px]"
          onClick={handleDecrement}
        >
          Previous Question
        </button>
        <button
          className="bg-primary text-white py-4 w-[200px] rounded-full absolute right-0 bottom-[50px]"
          onClick={handleIncrement}
        >
          Next Question
        </button>
      </div>
    </>
  );
};

export default Play;

export async function getServerSideProps() {
  const response = await fetch("http://localhost:8080/api/v1/questions")
    .then((res) => res.json())
    .then((data) => data.data);

  return {
    props: {
      response,
    },
  };
}
