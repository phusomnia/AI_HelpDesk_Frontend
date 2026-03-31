import { defaultParams, useAttachmentStore } from "@/constants/constant";
import { ManagementLayout } from "@/layouts/ManagementLayout"
import { useEffect, useRef, useState } from "react";
import { useAttachments, useDeleteFile, useUploadFiles } from "./useFile";
import { attchmentColumns } from "./columns";
import { Button, Form, Modal, notification, Table } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { AttachementHandler } from "./handler";

export function FileLayout() {
  return <>
    <ManagementLayout>
      <FileManagement />
    </ManagementLayout>
  </>
}

export function FileManagement() {
  const [globalParams, setGlobalParams] = useState(
    () => new URLSearchParams(window.location.search),
  );

  const [params, setParams] = useState({
    ...defaultParams(globalParams)
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAttachement, setSelectedAttachment] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const deleteFileMutation = useDeleteFile();

  const { labels } = useAttachmentStore();

  const { data: attachments, isLoading: isLoadingAttachments, error: errorAttachments } = useAttachments(params);

  if (isLoadingAttachments) return <div>Loading...</div>;
  if (errorAttachments) return <div>Error: {errorAttachments.message}</div>;

  console.log(attachments)

  const columns: any = attchmentColumns({
    attachments,
    setSelectedAttachment,
    setModalVisible,
    // setModalType,
    labels,
    setParams,
    params,
    deleteFileMutation
  });

  const handlePageChange = (page: any, page_size: any) => {
    const filteredParams = new URLSearchParams();
    for (let [key, value] of globalParams.entries()) {
      if (key !== 'page' && key !== 'page_size') {
        filteredParams.set(key, value);
      }
    }

    filteredParams.set('page', page);
    filteredParams.set('page_size', page_size);

    window.location.search = `?${filteredParams}`;
  };

  const handleUploadFile = () => {
    setSelectedAttachment(null)
    setModalVisible(true)
  }

  return (
    <div className="upload-file">
      <Button
        onClick={() => {
          console.log('Button clicked');
          handleUploadFile();
        }}
      >
        {labels.upload}
      </Button>

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
        loading={isLoadingAttachments}
      />

      <AttachmentModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  )
}

function AttachmentModal(props: any): any {
  const [form] = Form.useForm();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { labels } = useAttachmentStore();

  const uploadFilesMutation = useUploadFiles();

  useEffect(() => {
    if (!props.visible) {
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [props.visible]);

  return <>
    <Modal
      title={labels.upload}
      open={props.visible}
      onCancel={props.onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={props.onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" loading={props.loading} onClick={async () => {
          await AttachementHandler.handleSubmit(uploadFilesMutation, selectedFiles, props.onCancel)
        }}>Upload</Button>
      ]}
    >
      <Form form={form}>
        <Form.Item
          name="file"
          label="File"
          rules={[{ required: true, message: 'Please upload a file' }]}
        >
          <div className='attachment'>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => AttachementHandler.handleFileChange(e, selectedFiles, setSelectedFiles)}
              multiple
              accept="*"
              title="Chọn file để tải lên"
              className="sr-only"
            />
            <Button
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              chọn file đính kèm
            </Button>
            {/*  */}
            <div className='preview-file flex gap-2'>
              {selectedFiles && selectedFiles.map((file: File, index) => (
                <div
                  key={index}
                  className="relative flex p-2 gap-2 items-center justify-center"
                >
                  {AttachementHandler.renderPreviewAttachment(file)}
                  <button
                    type='button'
                    onClick={() => {
                      AttachementHandler.handleRemoveSelectedAttachment(
                        fileInputRef,
                        file,
                        setSelectedFiles
                      )
                    }}
                    className="absolute -top-[0px] -right-[0px] bg-[#6F6F6F] text-white rounded-full w-5 h-5 text-xs"
                  >
                    <CloseOutlined />
                  </button>
                </div>
              ))}
            </div>

            {/* <button
              onClick={() => console.log(selectedFiles, fileInputRef.current?.value)}
            >
              X
            </button> */}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  </>
}