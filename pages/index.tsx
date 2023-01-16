import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-10">
      <div>
        <div className="text-3xl text-primary font-bold animate-bounce uppercase">
          Questionary
        </div>
        <div className="text-gray-dark text-sm font-bold text-center">
          By Yim Sotharoth
        </div>
      </div>
      <Link
        href="/manage"
        className="w-[500px] h-[60px] rounded-full text-white text-xl bg-primary uppercase border-2 border-transparent hover:bg-transparent hover:border-primary hover:text-primary duration-100 ease-linear flex justify-center items-center"
      >
        Manage Questions
      </Link>
      <Link
        href="/play"
        className="w-[500px] h-[60px] rounded-full text-white text-xl bg-primary uppercase border-2 border-transparent hover:bg-transparent hover:border-primary hover:text-primary duration-100 ease-linear flex justify-center items-center"
      >
        Play with us
      </Link>
    </div>
  );
};

export default Home;
