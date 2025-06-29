# Data Alchemist 🧪

Data Alchemist is a powerful, AI-driven web application designed to streamline the process of cleaning, validating, and preparing data for resource allocation. This tool allows users to upload their raw data, identify and fix errors with the help of AI, define business rules using natural language, and export cleaned datasets and configuration files.

**Live Application**: [**data-alchemist.onrender.com**](https://[YOUR-DEPLOYED-APP-URL])

![Data Alchemist Screenshot](https://i.imgur.com/your-screenshot-url.png)
*(Suggestion: Take a screenshot of your running application and replace the URL above to showcase your work)*

---

## Features

This project was built to solve the common problem of messy spreadsheet data by leveraging modern AI capabilities.

* **Smart Data Ingestion**: Upload `CSV` files for clients, workers, and tasks. The system is designed to handle and parse this data into a usable format.
* **Editable Data Grids**: All uploaded data is displayed in clear, interactive tables.
* **Automatic Data Validation**: Upon upload, the data is automatically validated against a set of core business rules (e.g., duplicate IDs, out-of-range values, broken JSON), with errors clearly highlighted in the UI.
* **AI-Powered Fixes**: For any validation error, users can click an "AI" button to receive a context-aware suggestion for a fix, powered by the Groq LLaMA-3 model.
* **Natural Language Data Modification**: Users can type commands in plain English (e.g., "Set the PriorityLevel to 5 for client 'Innovate Inc'") to make changes to the data, which the AI translates into specific actions for user approval.
* **AI Rule Recommendations**: The application can analyze the uploaded data to identify patterns and proactively suggest helpful business rules (e.g., "Tasks T01 and T02 are often requested together. Create a 'Co-run' rule for them?").
* **Flexible Rule and Priority Management**: A dedicated UI allows users to define custom business rules and set priority weights for different criteria using interactive sliders.
* **Data and Config Export**: Users can download the cleaned and validated data as new `CSV` files and export all defined rules and priorities as a `rules.json` file.

---

## Tech Stack

* **Frontend**: Vite, React, TypeScript, Tailwind CSS
* **UI Components**: `shadcn/ui`
* **Backend**: Node.js, Express.js
* **AI Integration**: Groq SDK for real-time AI suggestions and modifications.
* **Deployment**: Render

---

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

* Node.js (v18 or later)
* npm
* A Groq API Key (for AI features)

### Local Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Shubham00-3/data-alchemist.git](https://github.com/Shubham00-3/data-alchemist.git)
    cd data-alchemist
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    * Create a file named `.env` in the root of the project.
    * Add your Groq API key to this file:
        ```
        GROQ_API_KEY="your-groq-api-key-here"
        ```

4.  **Run the development server:**
    * This command will start both the frontend (Vite) and backend (Express) servers concurrently.
    * ```bash
        npm run dev
        ```

5.  **Open the application:**
    * Navigate to `http://localhost:8080` in your web browser.

---

This README will give anyone who visits your GitHub repository a complete and professional overview of your project. After you've updated it, make sure to commit and push the changes!
# data-alchemist
