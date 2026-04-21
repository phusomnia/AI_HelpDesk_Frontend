export const ticketFormRules = {
  subject: [
    { required: true, message: 'Nhập tiêu đề', whitespace: true },
    { max: 120, message: 'Tiêu đề không quá 120 ký tự' },
  ],
  description: [
    { max: 2000, message: 'Mô tả không quá 2000 ký tự' },
  ],
};

export const feedbackFormRules = {
  satisfaction_rating: [
    { required: true, message: 'Vui lòng chọn số sao đánh giá' },
  ],
  customer_feedback: [
    { max: 500, message: 'Nhận xét không quá 500 ký tự' },
  ],
};
