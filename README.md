# ByBinBashir Luxury Watches

Welcome to the **ByBinBashir** premium e-commerce platform codebase, built using React v19, Tailwind CSS v4, Vite, and Supabase.

Follow the instructions below to set up and run the application locally on your machine.

---

## 🚀 Local Setup & Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/muhammadahsan552005/bybinbashir.git
cd bybinbashir
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root of the project by copying the example file:
```bash
cp .env.example .env
```
Open the newly created `.env` file and populate it with the required credentials:
```env
# Supabase Configuration
VITE_SUPABASE_URL="<your-supabase-url>"
VITE_SUPABASE_ANON_KEY="<your-supabase-anon-key>"
VITE_SUPABASE_PROJECT_ID="<your-supabase-project-id>"

# EmailJS Configuration (for checkout notifications)
VITE_EMAILJS_SERVICE_ID="<your-email-service-id>"
VITE_EMAILJS_TEMPLATE_ID="<your-email-template-id>"
VITE_EMAILJS_PUBLIC_KEY="<your-email-public-key>"
```

### Step 3: Install Dependencies
Install all package dependencies. Peer dependency resolution is automated via the root `.npmrc` file, so a standard install is fully sufficient:
```bash
npm install
```

### Step 4: Run the Development Server
Start the local server:
```bash
npm run dev
```
The application will launch and be accessible at:
👉 **[http://localhost:8080](http://localhost:8080)**

---

## 🛠️ Build & Verification
To test compile and build the production bundle locally:
```bash
npm run build
```
This compiles the website with native Tailwind CSS v4 compilation, generating optimized, minified production assets inside the `/dist` directory.
