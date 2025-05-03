import Image from "next/image";
import Link from "next/link";
import Nav from "./ui/nav";
import Hero from "./ui/hero";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-base-100">
      <Nav />
      <Hero />
    </div>
  );
}
