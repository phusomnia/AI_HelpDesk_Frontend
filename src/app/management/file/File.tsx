import { useAttachmentStore } from "@/constants/constant";
import { ManagementLayout } from "@/layouts/ManagementLayout";
import { useAttachments, useDeleteFile } from "./useFile";
import { attchmentColumns } from "./columns";
import { Button, Table } from "antd";
import { useFileFilters, useFileModal } from "./hooks";
import { AttachmentModal } from "./components";

export function FileLayout() {
  return (
    <ManagementLayout>
      <FileManagement />
    </ManagementLayout>
  );
}

export function FileManagement() {
  const { params, handlePageChange } = useFileFilters();
  const { modalVisible, openModal, closeModal } = useFileModal();

  const deleteFileMutation = useDeleteFile();
  const { labels } = useAttachmentStore();

  const { data: attachments, isLoading, error } = useAttachments(params);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const columns: any = attchmentColumns({
    attachments,
    setSelectedAttachment: () => {},
    setModalVisible: openModal,
    labels,
    setParams: () => {},
    params,
    deleteFileMutation,
  });

  const handleUploadFile = () => {
    openModal();
  };

  return (
    <div className="upload-file">
      <Button onClick={handleUploadFile}>{labels.upload}</Button>

      <Table
        columns={columns}
        dataSource={attachments?.data.content}
        rowKey="id"
        pagination={{
          current: attachments?.data.page_number,
          pageSize: attachments?.data.page_size,
          total: attachments?.data.total_elements,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showQuickJumper: true,
          showTotal: (total: any, range: any) =>
            `${range[0]}-${range[1]} trong ${total} mục`,
          onChange: handlePageChange,
          onShowSizeChange: handlePageChange,
        }}
        loading={isLoading}
      />

      <AttachmentModal visible={modalVisible} onCancel={closeModal} />
    </div>
  );
}