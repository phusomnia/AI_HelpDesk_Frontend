import { Input, Select, Table, Button } from 'antd';
import { ManagementLayout } from '@/layouts/ManagementLayout';
import { useAuthStore } from '@/app/auth/authStore';
import { ROLE_OPTIONS } from './constants/accountConstants';
import { useAccounts, useDeleteAccount, useAccountFilters, useAccountModal } from './hooks';
import { AccountModal } from './components';
import { accountColumns } from './columns';

export function AccountComponent() {
  return (
    <ManagementLayout>
      <AccountManagement />
    </ManagementLayout>
  );
}

export function AccountManagement() {
  const { isAdmin } = useAuthStore();
  const { params, setParams, handlePageChange, handleSearch } = useAccountFilters();
  const { modalVisible, selectedAccount, modalType, handleAddAccount, handleEditAccount, closeModal } = useAccountModal();
  const { data: accounts, isLoading: isLoadingAccounts, error: errorAccounts } = useAccounts(params);
  const deleteAccountMutation = useDeleteAccount();

  if (!isAdmin()) {
    return <div>Bạn không có quyền truy cập trang này</div>;
  }

  if (isLoadingAccounts) return <div>Loading...</div>;
  if (errorAccounts) return <div>Error: {errorAccounts.message}</div>;

  const handleDeleteAccount = (id: string) => {
    deleteAccountMutation.mutate(id);
  };

  const columns = accountColumns({
    onEdit: handleEditAccount,
    onDelete: handleDeleteAccount,
  });

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex gap-2 items-center">
          <Select
            allowClear
            placeholder="Vai trò"
            style={{ width: 150 }}
            value={params.role || undefined}
            onChange={(value) => setParams({ ...params, role: value })}
            options={ROLE_OPTIONS}
          />
          <Input
            placeholder="Phòng ban..."
            style={{ width: 150 }}
            value={params.department_name}
            onChange={(e) => setParams({ ...params, department_name: e.target.value })}
          />
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </div>

        <div className="flex justify-between items-center">
          <Button type="primary" onClick={handleAddAccount}>
            Thêm tài khoản
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={accounts?.data?.content || accounts?.data}
          rowKey="id"
          pagination={{
            current: accounts?.data?.page_number || 1,
            pageSize: accounts?.data?.page_size || 10,
            total: accounts?.data?.total_elements || 0,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showQuickJumper: true,
            showTotal: (total: any, range: any) => `${range[0]}-${range[1]} trong ${total} mục`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          loading={isLoadingAccounts}
        />

        <AccountModal type={modalType} visible={modalVisible} onCancel={closeModal} selectedAccount={selectedAccount} />
      </div>
    </>
  );
}
