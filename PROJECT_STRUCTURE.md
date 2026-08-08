# Project Structure

This project is organized to keep UI, data, state, and helpers separated for fast development and production readiness.

```
amishlive/
├── src/
│   ├── store.ts         # Redux store setup and typed hooks
│   ├── components/      # Reusable UI components
│   ├── data/            # Dummy data and mock data helpers
│   ├── features/        # Feature slices (theme state)
│   ├── hooks/           # Custom hooks and hook exports
│   ├── pages/           # Route pages for app views
│   ├── services/        # API service layer and mocks
│   ├── types/           # Shared TypeScript domain models
│   └── utils/           # Formatting and storage utilities
├── README.md
├── RUNNING.md
├── PROJECT_STRUCTURE.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```
