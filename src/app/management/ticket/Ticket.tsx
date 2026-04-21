import React from 'react';
import { Table, Button } from 'antd';
import { ticketColumns } from './columns.tsx';
import { useTickets, useDeleteTicket } from './useTickets.ts';
import { useTicketFilters, useTicketModal } from './hooks';
import { TicketFilters, TicketModal } from './components';
import { MODAL_TYPES } from './constants/ticketConstants';
import { useDepartments } from './useDeparments';

export function TicketManagement() {
  const { params, updateFilter, handleSearch, handlePageChange } = useTicketFilters();
  const { modalVisible, selectedTicket, modalType, openModal, closeModal } = useTicketModal();
  const { data: departments } = useDepartments();

  const { data: tickets, isLoading, error } = useTickets(params);
  const deleteTicketMutation = useDeleteTicket();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const columns: any = ticketColumns({
    tickets,
    setSelectedTicket: (ticket: any) => openModal(MODAL_TYPES.VIEW, ticket),
    setModalType: (type: string, ticket: any) => openModal(type as any, ticket),
    deleteTicketMutation,
    setParams: () => {},
    params,
  });

  const handleAddTicket = () => {
    openModal(MODAL_TYPES.ADD);
  };

  return (
    <>
      <div className='w-full'>
        <Button type="primary" onClick={handleAddTicket}>
          Thêm mới Ticket
        </Button>
        <TicketFilters
          category={params.category || ''}
          department_name={params.department_name || ''}
          status={params.status || ''}
          priority={params.priority || ''}
          departments={departments?.data?.content || []}
          onCategoryChange={(value) => updateFilter('category', value)}
          onDepartmentChange={(value) => updateFilter('department_name', value)}
          onStatusChange={(value) => updateFilter('status', value)}
          onPriorityChange={(value) => updateFilter('priority', value)}
          onSearch={handleSearch}
        />
        <Table
          columns={columns}
          dataSource={tickets?.data.content}
          rowKey="id"
          pagination={{
            current: tickets?.data.page_number,
            pageSize: tickets?.data.page_size,
            total: tickets?.data.total_elements,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            showTotal: (total: any, range: any) =>
              `${range[0]}-${range[1]} trong ${total} mục`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          loading={isLoading}
        />

        <TicketModal
          type={modalType}
          visible={modalVisible}
          onCancel={closeModal}
          selectedTicket={selectedTicket}
        />
      </div>
    </>
  );
}

