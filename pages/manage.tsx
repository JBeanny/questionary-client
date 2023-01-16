import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";
import { MdDone } from "react-icons/md";
import CustomModal from "../components/Modal";
import { Modal } from "antd";
import Link from "next/link";
import CustomAlert from "../components/Alert";

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

interface OptionToAdd {
  option: string;
  chosen: number;
}

const Manage = ({ response }: { response: { questions: Array<Question> } }) => {
  const questions = response.questions;
  const [selected, setSelected] = useState<Question | null>(null);
  const [popup, setPopup] = useState<boolean>(false);
  const [addingOption, setAddingOption] = useState<Array<OptionToAdd>>([]);
  const [alert, setAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(true);
  const [isQuestionEdit, setIsQuestionEdit] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAddOption = async () => {
    const api = `http://localhost:8080/api/v1/options?question=${selected?.id}`;

    await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addingOption),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "Success") {
          setAlert(true);
          setMessage(response.message);
          setSuccess(true);
        } else {
          setAlert(true);
          setMessage(response.message);
          setSuccess(false);
        }
      });
  };

  // const handleQuestionChange = (e: any) => {
  //   setIsQuestionEdit(true);
  //   setSelected({
  //     id: selected?.id,
  //     question: e.target.value,
  //     answers: selected?.answers,
  //   });
  // };

  // const handleUpdateQuestion = async () => {
  //   const api = `http://localhost:8080/questions/${selected?.id}`;

  //   await fetch(api, {
  //     method: "PATCH",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(selected),
  //   })
  //     .then((res) => res.json())
  //     .then((response) => {
  //       if (response.status === "Success") {
  //         window.location.reload();
  //       } else {
  //         setError(response.message);
  //       }
  //     });
  //   setIsQuestionEdit(false);
  // };

  const handleDeleteQuestion = async () => {
    const api = `http://localhost:8080/api/v1/questions/${selected?.id}`;

    await fetch(api, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "Success") {
          setAlert(true);
          setMessage(response.message);
          setSuccess(true);
        } else {
          setAlert(true);
          setMessage(response.message);
          setSuccess(false);
        }
      });
    setIsModalOpen(false);
  };

  const handleDeleteOption = async (id: number) => {
    const api = `http://localhost:8080/api/v1/options/${id}?question=${selected?.id}`;

    await fetch(api, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "Success") {
          setAlert(true);
          setMessage(response.message);
          setSuccess(true);
        } else {
          setAlert(true);
          setMessage(response.message);
          setSuccess(false);
        }
      });
  };

  const addMoreOption = () => {
    setAddingOption([...addingOption, { option: "", chosen: 0 }]);
  };

  const clearOption = () => {
    setAddingOption([]);
  };

  const handleOptionChange = (e: any, index: number) => {
    const data = e.target.value;
    const newOption = [...addingOption];
    newOption[index].option = data;
    setAddingOption(newOption);
  };

  return (
    <>
      {alert ? <CustomAlert message={message} success={success} /> : ""}
      <div
        className={`transition-all duration-100 ease-linear ${
          popup ? "scale-100" : "scale-0"
        } absolute left-[50%] top-[50%] z-50 -ml-[250px] -mt-[400px] `}
      >
        <CustomModal setValue={setPopup} />
      </div>
      <Modal
        title="Confirmation"
        open={isModalOpen}
        onOk={handleDeleteQuestion}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <button
            key={1}
            onClick={() => setIsModalOpen(false)}
            className="w-[50px] px-4 py-2 mr-[50px] bg-white"
          >
            Cancel
          </button>,
          <button
            key={2}
            onClick={handleDeleteQuestion}
            className="w-[50px] px-4 py-2 bg-primary text-white rounded-md"
          >
            OK
          </button>,
        ]}
      >
        Are you sure you want to delete this ?
      </Modal>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pt-8 pb-8">
        <div className="text-2xl">Questions : {questions.length}</div>
        <div className="flex justify-between">
          <div className="flex flex-col justify-center items-center gap-10">
            {questions.map((question, index) => {
              return (
                <div
                  key={index}
                  className="w-[600px] bg-white shadow-md drop-shadow-md rounded-md px-8 py-2 flex flex-col gap-4 border-2 border-transparent duration-100 ease-linear hover:border-primary cursor-pointer"
                  onClick={() => setSelected(question)}
                >
                  <div className="text-2xl">
                    {index + 1} . {question.question}
                  </div>
                  <div className="flex flex-col gap-2">
                    {question.answers.map((answer, index) => {
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center border-2 border-secondary rounded-xl border-opacity-50 p-2 py-4"
                        >
                          <div>
                            <span className="text-primary">
                              Option {index + 1} :
                            </span>
                            &nbsp; <span>{answer.option}</span>
                          </div>
                          <div className="text-primary">
                            {answer.chosen > 1
                              ? `${answer.chosen} votes`
                              : `${answer.chosen} vote`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-4 h-full sticky top-[10px] w-[500px] p-2">
            <div
              className={`${
                selected ? "scale-100" : "scale-0"
              } border-2 border-secondary border-opacity-50 rounded-xl h-full duration-200 ease-linear transition-all p-2 flex flex-col gap-4`}
            >
              {/* 1 */}
              <div className="uppercase flex justify-between">
                <div>question</div>
                <div
                  className="text-red cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  delete
                </div>
              </div>

              {/* 2 */}
              <div className="flex gap-4 justify-between">
                <input
                  id="quest"
                  className="bg-primary p-4 text-white rounded-lg w-[350px] focus:bg-transparent focus:outline-primary focus:text-secondary h-[50px]"
                  value={(selected as any)?.question}
                  // onChange={(e) => handleQuestionChange(e)}
                ></input>
                {isQuestionEdit ? (
                  <button
                    className="px-4 h-[50px] w-[60px] bg-primary rounded-lg text-white cursor-pointer flex justify-center items-center"
                    // onClick={handleUpdateQuestion}
                  >
                    <MdDone />
                  </button>
                ) : (
                  <label
                    className="px-4 h-[50px] bg-primary rounded-lg text-white cursor-pointer flex justify-center items-center"
                    htmlFor="quest"
                  >
                    Edit
                  </label>
                )}
              </div>

              {/* 3 */}
              <div className="uppercase">
                Options: {selected?.answers.length}
              </div>

              <div className="flex flex-col gap-4">
                {selected?.answers.map((answer, index) => {
                  return (
                    <div className="flex flex-col gap-2" key={index}>
                      <div>Option {index + 1}</div>
                      <div className="flex gap-4 justify-between">
                        <input
                          id={`option-${index + 1}`}
                          className="text-white flex items-center bg-primary rounded-lg px-4 h-[50px] w-[300px] focus:bg-transparent focus:outline-primary focus:text-primary"
                          value={answer.option}
                        ></input>
                        <div className="flex gap-4">
                          <label
                            htmlFor={`option-${index + 1}`}
                            className="px-4 h-[50px] bg-transparent border-2 border-primary flex justify-center items-center rounded-lg cursor-pointer text-primary active:animate-ping"
                          >
                            <FiEdit className="text-xl" />
                          </label>
                          <label
                            className="px-4 h-[50px] bg-primary border-2 border-transparent flex justify-center items-center rounded-lg cursor-pointer text-white active:animate-ping"
                            onClick={() => handleDeleteOption(selected?.id)}
                          >
                            <BsTrash className="text-xl" />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {addingOption.map((option, index) => {
                return (
                  <input
                    key={index}
                    placeholder="Option ..."
                    className="px-4 py-4 bg-transprent border-2 border-primary text-secondary rounded-md"
                    onChange={(e) => handleOptionChange(e, index)}
                  />
                );
              })}

              <button
                className="uppercase border-secondary border-2 text-secondary py-4 rounded-lg"
                onClick={addMoreOption}
              >
                add option
              </button>

              {addingOption.length > 0 ? (
                <div className="flex gap-4">
                  <button
                    className="bg-transparent w-[50%] border-2 border-primary px-4 py-4 rounded-md text-primary"
                    onClick={clearOption}
                  >
                    Clear
                  </button>
                  <button
                    className="bg-primary w-[50%] px-4 py-4 rounded-md text-white"
                    onClick={handleAddOption}
                  >
                    Add
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>

            <button
              className={`${
                selected ? "scale-100" : "scale-0"
              } transition-all duration-100 ease-linear text-xl`}
              onClick={() => setSelected(null)}
            >
              Go to add question
            </button>
          </div>

          {/* 4 */}
          <div className="flex flex-col gap-4">
            <button
              className={`${
                selected ? "hidden" : "flex"
              } px-4 py-2 bg-primary h-[50px] w-[200px] text-white rounded-lg active:animate-ping flex justify-center items-center transition-all duration-100 ease-linear`}
              onClick={() => setPopup(true)}
            >
              Add Question
            </button>
            <Link
              href="/play"
              className={`${
                selected ? "hidden" : "flex"
              } border-2 border-primary rounded-lg bg-white px-4 py-2 h-[50px] w-[200px] flex justify-center items-center`}
            >
              Play with us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Manage;

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
