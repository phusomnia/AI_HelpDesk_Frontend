import { useAttachmentStore } from "@/constants/constant";
import { FileFilled, FileTextOutlined, TikTokOutlined } from "@ant-design/icons";
import {
  Space,
  Button,
  notification,
  Popconfirm,
} from "antd";

export const attchmentColumns = (props: any) => [
  {
    title: "Mã file",
    dataIndex: "id",
    key: "id",
    sorter: (a: any, b: any) => a.id?.localeCompare(b.id),
  },
  {
    title: "Preview",
    dataIndex: "url",
    key: "url",
    render: (url: string) => {
      console.log(url)
      const pathname = new URL(url).pathname;
      const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(pathname);

      console.log(isImage)
      if (isImage) {
        return (
          <div className="flex justify-center">
            <img
              src={url}
              alt="preview"
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                borderRadius: 4,
                cursor: 'pointer'
              }}
              onClick={() => window.open(url, '_blank')}
            />
          </div>
        );
      } else {
        return <>
          {/* <div className="flex justify-center">
            <div className="truncate w-[150px]">
              {url.split("_")[1].split("?")[0]}
            </div>
          </div> */}
        </>
      }
    }
  },
  {
    title: "Tên file",
    dataIndex: "file_name",
    key: "file_name",
    render: (filename: string) => {
      return <>
        <div className="truncate w-[200px]">
          {filename}
        </div>
      </>
    }
  },
  {
    title: "Thao tác",
    key: "actions",
    fixed: "right",
    render: (_: any, record: any) => (
      <Space>
        <Button
          onClick={async () => {
            const _url = record.url
            console.log(_url)
            const response = await fetch(_url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/octet-stream',
              }
            });
            // console.log(await response.json())

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = record.file_name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Cleanup
            window.URL.revokeObjectURL(url);
          }}
        >
          {props.labels.download}
        </Button>

        {/* <Button
          type="link"
          onClick={() => {
            props.setSelectedTicket(record);
            props.setModalType('edit');
            props.setModalVisible(true);
            console.log("Edit ticket:", record);
          }}
        >
          Cập nhật
        </Button> */}

        <Popconfirm
          title="Xóa sản phẩm?"
          description="Bạn có chắc muốn xóa file này?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={async () => {
            console.log("Delete ticket:", record.id);
            await props.deleteFileMutation.mutateAsync(
              { id: record.id },
              {
                onSuccess: (data: any) => {
                  notification.success({
                    description: data.message,
                  });

                  setTimeout(() => {
                    if (props.tickets?.data.content.length === 1 && props.params.page > 1) {
                      const prevPage = props.params.page - 1;
                      const newParams = new URLSearchParams(window.location.search);
                      newParams.set('page', prevPage.toString());
                      window.location.search = `?${newParams.toString()}`;
                    }
                  }, 500)
                }
              }
            );
          }}
        >
          <Button danger>
            {props.labels.delete}
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];

export const departmentColumns = () => [
  {
    title: "Tên phòng ban",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  }
]