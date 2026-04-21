import { useState } from 'react';
import type { ModalType } from '../constants/ticketConstants';
import type { TicketRecord } from '../types';

export const useTicketModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);
  const [modalType, setModalType] = useState<ModalType>('add');

  const openModal = (type: ModalType, ticket?: TicketRecord) => {
    setModalType(type);
    setSelectedTicket(ticket || null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTicket(null);
  };

  return {
    modalVisible,
    selectedTicket,
    modalType,
    openModal,
    closeModal,
  };
};
