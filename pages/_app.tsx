import "../styles/globals.css";
import type { AppProps } from "next/app";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Alert } from "antd";

const socket = io.connect("http://localhost:8080");

export default function App({ Component, pageProps }: AppProps) {
  const [notification, setNotification] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleClose = () => {
    setNotification("");
  };

  useEffect(() => {
    socket.on("notification", (data: any) => {
      setNotification(data.message);
      setDescription(data.description);
    });

    socket.on("get-uid", (data: any) => {
      localStorage.setItem("UID", JSON.stringify(data.uid));
    });
  }, [socket]);

  return (
    <>
      {notification ? (
        <div className="w-[500px] absolute top-[10px] right-[50px]">
          <Alert
            message={notification}
            type="warning"
            showIcon
            closable
            afterClose={handleClose}
            description={description}
          />
        </div>
      ) : (
        ""
      )}
      <Component {...pageProps} />
    </>
  );
}
