'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./../styles/globals.css"

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  }, [])
  return (
    <></>
  );
};

export default Home;
