# Xeref.ai - An AI Innovation Lab

Welcome to the public repository for Xeref.ai. This project is not a traditional B2B SaaS application; it is an **AI Innovation Lab** where we build in public, explore cutting-edge artificial intelligence, and share our findings.

Our mission is to move beyond generic business applications and create bespoke, outcome-driven AI solutions that deliver measurable results. We document our journey, share our proof-of-concepts, and contribute to the broader conversation around AI implementation.

This repository serves as a living portfolio of our work, showcasing our technical credibility and our commitment to transparent innovation.

## The Vision: From Software to Strategic Partner

We are repositioning Xeref.ai from a software vendor to a **strategic AI partner**. Our focus is on:

-   **Custom Implementations:** Building tailored AI solutions that solve specific, high-impact business problems.
-   **Outcome-Driven Results:** We measure success by the results we deliver, such as "2x faster decisions" or a "20% boost in accuracy."
-   **Thought Leadership:** Sharing our research, insights, and the lessons we learn from building next-generation AI systems.

This shift is aimed at collaborating directly with C-suite executives (CTOs, CIOs) who are looking to leverage AI for a strategic advantage.

## Getting Started

### Firebase Project Architecture

This project uses multiple Firebase projects to ensure a clear separation of concerns between environments. Before running the application, ensure you have access to the correct Firebase project for your needs.

```
📁 Firebase Organization (Master Account: bugrakarsli@gmail.com)
├── 🚀 xeref-ai-production (Primary Owner: bugra@xeref.ai)
├── 🧪 xeref-ai-staging    (Primary Owner: bugra@xeref.ai)
└── 🔬 development-sandbox (Primary Owner: bugrakarsli@gmail.com)
```

### Local Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Configuration:**
    - Create a `.env.local` file.
    - Populate it with the Firebase configuration credentials for the **`development-sandbox`** project.
3.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

This will start the development server on `http://localhost:3000`, connected to your development sandbox environment.

## Join the Journey

Our work here is part of a larger "Startup Diary" where we document our journey of building an AI innovation lab from the ground up. You can follow our progress and insights on [LinkedIn](https://www.linkedin.com/in/bugrakarsli/) and see our other projects on [GitHub](https://github.com/your-github-username).
