/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import React, { useState, useEffect, useRef } from "react";
import shikimori from "~/utils/shikan";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import useModal from "~/hooks/use-modal";
import { DropMenu } from "../drop-menu";
import { type Anime } from "~/types";
import { Input } from "../ui/input";

export const SearchBar = () => {
  const [error, setError] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const [query, setQuery] = React.useState("");
  const [searchParam] = React.useState(["name"]);
  const { isModalOpen, handleOpenModal, handleCloseModal } = useModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event: React.FormEvent<HTMLFormElement>) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (!query) {
      return;
    }
    void (fetch(`https://shikimori.one/api/animes?search=${query}`)
      .then((res) => res.json())
      .then((result) => {
        setIsLoaded(true);
        setItems(result);
      }),
    (error: React.SetStateAction<null>) => {
      setIsLoaded(true);
      setError(error);
    });
  }, [query]);

  function SearchAnime(items: Anime[]) {
    return items.filter((item) => {
      if (item.name) {
        return searchParam.some((newItem) => {
          return (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            item[newItem]
              .toString()
              .toLowerCase()
              .indexOf(query.toLowerCase()) !== -1
          );
        });
      } else {
        return searchParam.some((newItem) => {
          return (
            item[newItem]
              .toString()
              .toLowerCase()
              .indexOf(query.toLowerCase()) !== -1
          );
        });
      }
    });
  }

  const handleSearch = () => {
    handleCloseModal();
  };

  return (
    <div className="flex items-center">
      <div>
        <div className="relative flex w-full flex-wrap items-stretch">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            placeholder="Search anime..."
            aria-label="Search"
            aria-describedby="button-addon3"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          <DropMenu isOpen={dropdownOpen}>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="flex w-full rounded-xl border bg-zinc-950 hover:bg-zinc-800"
              >
                <ul className="mx-2 flex w-screen flex-col text-white">
                  {SearchAnime(items).map((item) => (
                    <Link key={item.id} href={`/anime/${item.id}`}>
                      <li className="flex gap-3 py-2">
                        <div className="relative min-h-[47px] min-w-[47px] flex-1 rounded-full p-2">
                          <Image
                            src={`https://shikimori.one${item.image.original}`}
                            alt={item.name}
                            width={47}
                            height={47}
                            className="h-full w-full rounded "
                          />
                        </div>
                        <div className="relative items-center ">
                          <h3 className="overflow-auto font-bold text-white">
                            {item.name}
                          </h3>
                          <div className="border-t" />
                          <p>Aired: {item.aired_on}</p>
                          <p className="">{`Kind: ${item.kind}`}</p>
                          <p>Episodes: {item.episodes}</p>

                          <p>Rate: {item.score}</p>
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            )}
          </DropMenu>
        </div>
      </div>
    </div>
  );
};
