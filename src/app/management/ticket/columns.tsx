import {
  Space,
  Button,
} from "antd";

export const ticketColumns = (props: any) => [
  {
    title: "Mã ticket",
    dataIndex: "id",
    key: "id",
    sorter: (a: any, b: any) => a.id?.localeCompare(b.id),
  },
  {
    title: "Tiêu đề",
    dataIndex: "subject",
    key: "subject"
  },
  {
    title: "Danh mục",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Thao tác",
    key: "actions",
    fixed: "right",
    render: (_: any, record: any) => (
      <Space>
        <Button
          onClick={() => {
            props.setSelectedTicket(record);
            props.setModalType('view');
            props.setModalVisible(true);
            console.log("View ticket:", record);
          }}
        >
          Xem
        </Button>

        <Button
          type="link"
          onClick={() => {
            props.setSelectedTicket(record);
            props.setModalType('edit');
            props.setModalVisible(true);
            console.log("Edit ticket:", record);
          }}
        >
          Cập nhật
        </Button>
        
        {/* <Popconfirm
          title="Xóa sản phẩm?"
          description="Bạn có chắc muốn xóa sản phẩm này?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={async () => {
            console.log("Delete ticket:", record.id);
            await props.deleteTicketMutation.mutateAsync(
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
          <Button type="link" danger>
            Xóa
          </Button>
        </Popconfirm> */}
        
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