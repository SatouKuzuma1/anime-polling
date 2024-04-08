"use client";

import { useState } from "react";
const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    console.log("opened");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    console.log("closed");
  };

  return { isModalOpen, handleOpenModal, handleCloseModal };
};

export default useModal;
