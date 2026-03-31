# AI HelpDesk Frontend

Hệ thống hỗ trợ khách hàng thông minh sử dụng AI, được xây dựng với Astro framework.

## 🚀 Project Structure

Cấu trúc thư mục của dự án AI HelpDesk Frontend:

```text
/
├── public/                     # Static assets (images, icons, etc.)
├── src/
│   ├── app/                    # Các trang chính của ứng dụng
│   │   ├── auth/              # Xác thực người dùng
│   │   │   ├── login.astro
│   │   │   └── register.astro
│   │   ├── management/        # Quản trị viên
│   │   │   ├── chat/
│   │   │   ├── dashboard/
│   │   │   └── settings/
│   │   └── user/              # Giao diện người dùng
│   │       ├── UserChat.tsx
│   │       └── dashboard/
│   ├── components/            # Components tái sử dụng
│   │   ├── ui/               # UI components cơ bản
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── constants/            # Constants và configurations
│   │   └── constant.ts
│   ├── context/              # React Context providers
│   ├── features/             # Feature-based modules
│   ├── hooks/                # Custom React hooks
│   ├── layouts/              # Astro layouts
│   │   └── RootLayout.astro
│   ├── lib/                  # Utility functions
│   └── styles/               # Global styles
├── .gitignore
├── astro.config.mjs
├── package.json
└── tsconfig.json

## 🧞 Commands
| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Cài đặt dependencies                            |
| `bun dev`                 | Khởi động dev server tại `localhost:4321`        |
| `bun build`               | Build production site đến `./dist/`             |
| `bun preview`             | Xem trước bản build trước khi deploy            |
| `bun astro ...`           | Chạy CLI commands như `astro add`, `astro check` |

## 🛠 Tech Stack
- **Framework**: Astro
- **Language**: TypeScript
- **Package Manager**: Bun
- **Styling**: Tailwind CSS (nếu có)
- **UI Components**: Custom components
## 🚀 Deployment