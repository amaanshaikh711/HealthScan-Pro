# 🏥 HealthScan Pro

**Your Personal AI-Powered Nutritionist & Health Companion**

HealthScan Pro is a cutting-edge web application designed to revolutionize how you track your nutrition. Combining real-time barcode scanning, deep health analysis, and AI-driven consultations, it's the only tool you need to master your diet and achieve your wellness goals.
![Landing-page](./screenshots/ss--1.png)

---

## 🌟 Key Features

### 1. **Interactive Dashboard**
Get a high-level view of your daily health stats. Track calories, water intake, and macronutrient distribution through beautiful, animated glassmorphic widgets.
![Dashboard](./screenshots/ss--2.png)

<!-- ### 2. **AI Food Scanner** -->
<!-- Instantly scan product barcodes. We fetch real-time data from global databases to provide you with NutriScores, allergen alerts, and detailed nutritional breakdowns.
![Scanner](./screenshots/ss--3.png) -->

### 2. **Professional BMI & Health Analysis**
Beyond just BMI. Get personalized advice based on your BMR, TDEE, and activity levels. Our AI analyzes your data to suggest optimal calorie and macronutrient splits.
![BMI Analysis](./screenshots/ss--3.png)
![BMI Analysis](./screenshots/ss--4.png)

### 4. **Weekly Meal Planner**
Organize your nutrition with a vibrant, intuitive planner. Add meals manually or generate AI plans, track calories per meal, and manage your entire week's diet in one place.
![Meal Planner](./screenshots/ss--5.png)

### 5. **Ask Nova (AI Nutritionist Doctor)**
Meet Dr. Nova—your 24/7 AI health consultant. Powered by Gemini Pro, Nova provides evidence-based medical-grade nutritional advice, remembers your conversation history, and helps you navigate complex health queries.
![Ask Nova](./screenshots/ss--6.png)

---

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS (Glassmorphism, Gradients)
- **Animations**: Framer Motion
- **AI Engine**: Google Gemini 1.5 (Generative AI)
- **Data Source**: OpenFoodFacts API
- **Icons**: Lucide React
- **Scanning**: @zxing/browser

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/your-username/health-scan-pro.git
   cd health-scan-pro
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   node index.js
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create a `.env` file in the client and server directories if you wish to use your own MongoDB or Gemini API keys.

---

## 📸 Screenshots

| Landing Page | Dashboard |
| :---: | :---: |
| ![Landing](./screenshots/landing.png) | ![Dashboard](./screenshots/dashboard.png) |

| Food Scanner | Meal Planner |
| :---: | :---: |
| ![Scanner](./screenshots/scanner.png) | ![Meal Planner](./screenshots/meal-planner.png) |

---

## 🛡️ Medical Disclaimer

The information provided by HealthScan Pro and its AI assistant, Dr. Nova, is for educational and informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by Amaan S.*
