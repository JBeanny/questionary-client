import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { BsTrash } from "react-icons/bs";

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

const ActionModal = ({ selected }: { selected: Question }) => {
  const [popup, setPopup] = useState<boolean>(false);

  return (
    <>
      <div
        className={`${
          selected ? "scale-100" : "scale-0"
        } border-2 border-secondary border-opacity-50 rounded-xl w-[500px] h-full duration-200 ease-linear transition-all p-2 flex flex-col gap-4 shadow-lg drop-shadow-lg sticky top-[10px]`}
      >
        {/* 1 */}
        <div className="uppercase">question</div>
        {/* 2 */}
        <div className="flex gap-4 justify-between">
          <input
            id="question"
            className="bg-primary p-4 text-white rounded-lg w-[350px] focus:bg-transparent focus:outline-primary focus:text-secondary h-[50px]"
            value={(selected as any)?.question}
          ></input>
          <label
            className="px-4 h-[50px] bg-primary rounded-lg text-white cursor-pointer flex justify-center items-center"
            htmlFor="question"
          >
            Edit
          </label>
        </div>
        {/* 3 */}
        <div className="uppercase">Options: {selected?.answers.length}</div>
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
                      htmlFor={`option-${index + 1}`}
                      className="px-4 h-[50px] bg-primary border-2 border-transparent flex justify-center items-center rounded-lg cursor-pointer text-white active:animate-ping"
                    >
                      <BsTrash className="text-xl" />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="uppercase border-secondary border-2 text-secondary py-4 rounded-lg shadow-md drop-shadow-md active:animate-ping"
          onClick={() => setPopup(true)}
        >
          add option
        </button>
      </div>
      <button
        className={`${
          selected ? "hidden" : "flex"
        } px-4 py-2 bg-primary h-[50px] w-[200px] text-white rounded-lg active:animate-ping flex justify-center items-center transition-all duration-100 ease-linear sticky top-[10px]`}
      >
        Add Question
      </button>
    </>
  );
};

export default ActionModal;
