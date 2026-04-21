import { useState } from 'react';

export const useFileModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const openModal = () => {
    setSelectedAttachment(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAttachment(null);
  };

  return {
    modalVisible,
    selectedAttachment,
    openModal,
    closeModal,
  };
};
