import React from "react";

type DropMenuProps = {
  isOpen: boolean;
  children: React.ReactNode;
};

export const DropMenu = ({ isOpen, children }: DropMenuProps) => {
  return (
    <div className="absolute top-10 z-10 min-h-14 w-full  ">{children}</div>
  );
};
