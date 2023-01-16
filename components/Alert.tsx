import React from "react";
import { Alert } from "antd";

const CustomAlert = (
  { message }: { message: string },
  { success }: { success: string }
) => {
  return (
    <div className="absolute top-[10px] w-[300px] left-[50%] -ml-[150px]">
      <Alert
        message={message}
        type={`${success ? "success" : "error"}`}
        showIcon
      />
    </div>
  );
};

export default CustomAlert;
