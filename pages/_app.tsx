import "../styles/globals.css";
import type { AppProps } from "next/app";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Alert } from "antd";
import Head from "next/head";

const socket = io.connect("http://localhost:8080");

interface Notification {
  id: number;
  question: string;
  votes: number;
}

export default function App({ Component, pageProps }: AppProps) {
  const [notification, setNotification] = useState<Array<Notification>>([]);

  useEffect(() => {
    socket.emit("join_room", { ID: localStorage.getItem("UID") as string });

    socket.on("notification", (data: any) => {
      console.log(data.notification);
      setNotification(data.notification);
    });

    socket.on("get-uid", (data: any) => {
      localStorage.setItem("UID", data.uid);
    });
  }, [socket]);

  if (notification.length > 0) {
    setTimeout(() => {
      setNotification([]);
    }, 5000);
  }

  return (
    <>
      <Head>
        <title>Questionary</title>
        <link rel="icon" href="/question.png" />
      </Head>
      <div
        className={`${
          notification.length > 0
            ? "scale-100 translate-x-100 opacity-100"
            : "scale-0"
        } w-[500px] absolute top-[10px] right-[50px] flex flex-col gap-1 transition-all duration-200`}
      >
        {notification.map((noti, index) => (
          <Alert
            message={`QID: ${noti.id} is expired`}
            type="warning"
            showIcon
            closable
            key={index}
            description={`Question: ${noti.question} with ${noti.votes} total votes`}
          />
        ))}
      </div>
      <Component {...pageProps} />
    </>
  );
}
