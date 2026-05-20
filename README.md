# KeetaPay

KeetaPay is a modern, responsive web application for managing cryptocurrency payments seamlessly. It leverages the KeetaNet SDK (`@keetanetwork/keetanet-client`) to provide secure and efficient token transfers, single and bulk payments, payment link generation, and wallet integration.

**Shared App URL:** [KeetaPay Preview](https://ais-pre-rlva6oso2onrp4gs2ikrkv-293444333089.europe-west2.run.app)

## 🚀 Features

- **Wallet Connection:** Connect to Keeta wallets securely and view real-time account balances and transaction history.
- **Single Payments:** Send tokens instantly to any Keeta address exactly and effortlessly.
- **Bulk Payments:** Execute mass payouts to multiple recipients natively.
- **Payment Links & QR Codes:** Generate reusable payment links and QR codes to request payments, making it easier for users to pay.
- **Live Transaction Feed:** Monitor recent and live transactions occurring on your account or payment links.
- **Robust Security:** Built utilizing state-of-the-art Web3 standards to ensure maximum safety during token transactions and wallet integrations.

## 🛠 Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind)
- **Routing:** React Router v6
- **Data Fetching:** React Query (TanStack Query)
- **Forms & Validation:** React Hook Form + Zod
- **Web3 Integration:** @keetanetwork/keetanet-client
- **Icons:** Lucide React

## 📦 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Damilola145/KeetaPay.git
   cd KeetaPay
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add necessary environment variables. (See `.env.example` if applicable, otherwise ensure your KeetaNet configuration respects the required keys).

### Running the App Locally

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` (or the port specified by Vite/your proxy).

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

This will generate a `dist` folder. If using a service like Netlify, Vercel, or AWS, simply map the publish/build directory to `dist/`.

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## 📂 Project Structure

```bash
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # Reusable React components (UI components, layouts, feature-based)
│   │   ├── layout/         # Application layout components (Navbar, Sidebar)
│   │   ├── payment/        # Payment-specific components (Forms, LinkGenerator)
│   │   ├── ui/             # Shadcn reusable UI primitives
│   │   └── wallet/         # Wallet connection components
│   ├── lib/                # Utilities, SDK wrappers, hooks, and context
│   │   ├── keeta.js        # Core Keeta SDK integration
│   │   └── AuthContext.jsx # Authentication and App-wide State
│   ├── pages/              # Application Routes/Views (Home, Pay, BulkPay)
│   ├── App.jsx             # Main Application routing and entry point
│   ├── index.css           # Global Tailwind CSS and Custom Styles
│   └── main.jsx            # Application root
├── components.json         # shadcn UI CLI configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies and script commands
```

## 🌐 SDK Integration

KeetaPay leverages `@keetanetwork/keetanet-client` for seamless interactions:
- `initBuilder()` handles the core builder pattern for constructing operations.
- Transactions are securely signed utilizing your defined secure private seed locally.
- Computations check `computeBuilderBlocks()` prior to publishing.
- Live network states and endpoints default to Keeta testnet/mainnet depending on mode context.

## 🤝 Contributing

We welcome contributions! To contribute to KeetaPay:
1. Fork the repo.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "Add some feature"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a Pull Request.

Please ensure your code follows the established formatting standard and includes proper comments for any complicated logic. Keep your commits clean and descriptive.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
