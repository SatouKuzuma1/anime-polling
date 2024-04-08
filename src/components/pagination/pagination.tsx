"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import Link from "next/link";
import { cn } from "~/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

import { Pagination, PaginationContent } from "../ui/pagination";
import { type Metadata } from "~/types";

export function PaginationMain(metadata: Metadata) {
  const { totalPages, hasMore } = metadata;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  const previousPage = currentPage - 1;
  let nextPage = currentPage + 1;
  if (currentPage == totalPages) {
    nextPage = 0;
  }
  return (
    <Pagination className="mt-2">
      <PaginationContent className="gap-5">
        <Link
          scroll={false}
          className={cn(
            "gap-1 rounded-md border border-zinc-300 px-2 py-2 pl-2.5 text-sm font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600",
            currentPage === 1 ? " pointer-events-none bg-zinc-500" : "",
          )}
          href={createPageURL(previousPage)}
        >
          <ChevronLeftIcon />
        </Link>

        <Link
          scroll={false}
          className={cn(
            "rounded-md border border-zinc-300 px-2 py-2 text-sm font-medium hover:bg-zinc-300 dark:hover:bg-zinc-600",
            currentPage == totalPages ? "pointer-events-none bg-zinc-500" : "",
          )}
          href={!hasMore || currentPage === 1 ? {} : createPageURL(nextPage)}
        >
          <ChevronRightIcon />
        </Link>
      </PaginationContent>
    </Pagination>
  );
}
