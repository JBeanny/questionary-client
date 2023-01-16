import React, { useState } from "react";

interface Option {
  id: number;
  option: string;
  chosen: number;
}

const Modal = ({ setValue }: { setValue: (parameter: any) => void }) => {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<Array<Option>>([
    {
      id: 1,
      option: "",
      chosen: 0,
    },
  ]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleAddMoreOption = () => {
    setOptions([...options, { id: options.length + 1, option: "", chosen: 0 }]);
  };

  const handleChangeOption = (e: any, index: number) => {
    const data = e.target.value;
    const newOptions = [...options];
    newOptions[index].option = data;
    setOptions(newOptions);
  };

  const handleAddQuestion = async () => {
    const api = "http://localhost:8080/api/v1/questions";
    const data = {
      question: question,
      answers: options,
      start_date: startDate,
      end_date: endDate,
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
          console.log(response.message);
          setValue(false);
        } else {
          setValue(false);
        }
      });
  };
  console.log(startDate, endDate);
  return (
    <>
      <div className="w-[500px] h-[800px] bg-white shadow-md drop-shadow-md rounded-lg flex flex-col p-2 gap-4">
        <div className="uppercase">add new question</div>
        <div
          className="uppercase absolute right-[10px] top-[10px] cursor-pointer text-red"
          onClick={() => setValue(false)}
        >
          close
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="question">Question</label>
          <input
            id="question"
            placeholder="Question ..."
            className="py-2 px-4 outline-primary border-2 border-primary rounded-md"
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div>Options</div>
          <div className="flex flex-col gap-2">
            {options.map((option, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-8 justify-between"
                >
                  <label htmlFor={`option${index + 1}`}>
                    Option {index + 1}
                  </label>
                  <input
                    id={`option${index + 1}`}
                    placeholder="Option ..."
                    className="py-2 px-4 outline-primary border-2 border-primary rounded-md "
                    onChange={(e) => handleChangeOption(e, index)}
                  />
                </div>
              );
            })}
          </div>
          <button
            className="uppercase py-2 px-4 bg-primary text-white rounded-md"
            onClick={handleAddMoreOption}
          >
            Add more option
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="start_date">Start Date</label>
            <input
              type="datetime-local"
              id="start_date"
              className="border-2 border-primary rounded-lg px-4 py-2"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="end_date">End Date</label>
            <input
              type="datetime-local"
              id="end_date"
              className="border-2 border-primary rounded-lg px-4 py-2"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button
          className="uppercase py-4 px-4 bg-primary fixed bottom-[10px] left-[10px] right-[10px] rounded-md text-white"
          onClick={handleAddQuestion}
        >
          add question
        </button>
      </div>
    </>
  );
};

export default Modal;
