import { useState } from "react";
import { Button, Card } from "antd";
import { useAuthStore } from "../auth/authStore";
import { useUserTickets } from "./useUserPortalApi";
import { UserPortalChat } from "./UserPortalChat";
import UserHeader from "@/components/UserHeader";
import { useTicketFilters, useTicketForm, useTicketDetail } from "./hooks";
import {
  TicketTable,
  TicketFilters,
  CreateTicketDrawer,
  TicketDetailDrawer,
} from "./components";
import type { TicketRecord } from "./types";

export function UserPortal() {
  const { payload } = useAuthStore();

  const { params, updateStatus, updatePagination } = useTicketFilters();
  const { data: ticketResp, isLoading } = useUserTickets(params);

  const [createOpen, setCreateOpen] = useState(false);

  const { form, files, setFiles, handleCreate, resetForm, isSubmitting } = 
    useTicketForm(() => {
      setCreateOpen(false);
    });

  const {
    selectedTicket,
    feedbackForm,
    openTicket,
    closeTicket,
    handleSubmitFeedback,
    isSubmittingFeedback,
  } = useTicketDetail();

  const tickets = (ticketResp?.data?.content ?? []) as TicketRecord[];
  const total = ticketResp?.data?.total_elements ?? 0;

  const handleCreateTicket = () => {
    handleCreate(payload?.user_id);
  };

  return (
    <>
      <UserHeader />
      <div className="p-4 md:p-6">
        <Card
          title="Danh sách tickets"
          extra={
            <Button type="primary" onClick={() => setCreateOpen(true)}>
              + Tạo ticket
            </Button>
          }
        >
          <TicketFilters
            status={params.status}
            onStatusChange={updateStatus}
          />

          <TicketTable
            tickets={tickets}
            loading={isLoading}
            currentPage={params.page}
            pageSize={params.page_size}
            total={total}
            onPageChange={updatePagination}
            onViewTicket={openTicket}
          />
        </Card>

        <CreateTicketDrawer
          open={createOpen}
          form={form}
          files={files}
          setFiles={setFiles}
          isSubmitting={isSubmitting}
          onCreate={handleCreateTicket}
          onClose={() => setCreateOpen(false)}
        />

        <TicketDetailDrawer
          open={!!selectedTicket}
          ticket={selectedTicket}
          feedbackForm={feedbackForm}
          isSubmittingFeedback={isSubmittingFeedback}
          onSubmitFeedback={handleSubmitFeedback}
          onClose={closeTicket}
        />

        <UserPortalChat />
      </div>
    </>
  );
}

