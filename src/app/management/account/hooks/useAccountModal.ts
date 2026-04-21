import { useState } from 'react';
import type { Account } from '../types';

export function useAccountModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setModalType('add');
    setModalVisible(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setModalType('edit');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return {
    modalVisible,
    selectedAccount,
    modalType,
    handleAddAccount,
    handleEditAccount,
    closeModal,
  };
}
