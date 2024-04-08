import Image from "next/image";

function Hero() {
  return (
    <>
      <header className="container flex w-full justify-center gap-0 px-8 py-16 max-lg:flex-col sm:gap-16 sm:p-16 lg:items-center">
        <img
          src="/hero.jpg"
          alt="anime"
          className="absolute inset-0 h-[80vh] w-full object-cover opacity-25"
        />
        <div className="relative flex flex-1 flex-col gap-10">
          <h1 className="text-5xl font-bold leading-[140%] text-white sm:text-6xl lg:max-w-lg">
            Vote Your{" "}
            <span className="bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
              Favourite Animes
            </span>{" "}
            To Let Studios
            <span className="bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Know What You
            </span>{" "}
            Want To Watch{" "}
            <span className="bg-gradient-to-r from-red-700 to-orange-500 bg-clip-text text-transparent">
              Next
            </span>
          </h1>
        </div>
        <div className="relative hidden h-[50vh] w-full justify-center rounded-lg md:flex lg:flex-1 ">
          <Image
            src="/anime.jpg"
            alt="anime"
            fill
            className="flex rounded-lg object-contain"
          />
        </div>
      </header>
    </>
  );
}

export default Hero;
