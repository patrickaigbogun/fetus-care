# Smart Pregnancy Care Platform

A comprehensive platform designed to provide smart pregnancy care anytime, anywhere. This project aims to connect patients with healthcare professionals, offer AI-driven support, and facilitate remote consultations.

## Description

This platform offers a range of features to support expectant mothers and healthcare providers. Key functionalities include:

* **Professional Network:** Connect with doctors, midwives, and other healthcare professionals.
* **AI Chatbot:** 24/7 AI support for maternal queries and emergency guidance.
* **Video Consultations:** Conduct remote video call consultations with healthcare providers.
* **Emergency Alerts:** Automated SOS messages to designated contacts and healthcare providers.
* **Appointment Booking:** Easy scheduling of appointments with available professionals.

## Installation

To get the project up and running, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd fetus-care-fork
    ```

2. **Install the API dependencies:**

    ```bash
    cd api
    poetry install
    ```

3. **Install the frontend dependencies:**

    ```bash
    cd nextjs
    pnpm install
    ```

4. **Set up environment variables:**

    * Create a `.env` file in the `nextjs` directory.
    * Add the necessary environment variables as specified in `env.config.ts`. You'll need to set the following:

        ```
        NEON_DATABASE_URL= # Your Neon database URL
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME= # Your Cloudinary cloud name
        NEXT_PUBLIC_CLOUDINARY_API_KEY= # Your Cloudinary API key
        CLOUDINARY_API_SECRET= # Your Cloudinary API secret
        API_ENV_VARIABLE_CLOUDINARY_URL= # Your Cloudinary URL
        NEXT_PUBLIC_SUPABASE_URL= # Your Supabase URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY= # Your Supabase anon key
        SUPABASE_DATABASE_URL= # Your Supabase database URL
        NEXT_PUBLIC_AGORA_APP_ID= # Your Agora app ID
        NEXT_PUBLIC_AGORA_TEMP_TOKEN= # Your Agora temporary token
        BACKEND_API_ENDPOINT= # Your backend API endpoint
        ```

## Usage

### Running the API

1. Navigate to the `api` directory:

    ```bash
    cd api
    ```

2. Activate the Poetry shell:

    ```bash
    poetry shell
    ```

3. Run the FastAPI application:

    ```bash
    uvicorn main:app --reload
    ```

    This will start the API server, typically on `http://localhost:8000`.

### Running the Frontend

1. Navigate to the `frontend` directory:

    ```bash
    cd nextjs
    ```

2. Start the Next.js development server:

    ```bash
    pnpm dev
    ```

    This will start the frontend development server, usually on `http://localhost:3000`.

## API Endpoints

The API is built using FastAPI and exposes the following endpoints:

* **`POST /generate/`**: Generates text based on a prompt using the Ollama API.

  * **Payload:**

        ```json
        {
            "prompt": "Your prompt here",
            "model": "meditron:7b"
        }
        ```

  * **Response:** A stream of text responses.

## Database Setup

This project uses PostgreSQL for data storage, leveraging both Neon and Supabase.

1. **Neon Database:**
    * Configure the `NEON_DATABASE_URL` environment variable with your Neon database connection string in the `frontend/.env` file.
    * Run the Drizzle migrations to set up the database schema.

        ```bash
        cd frontend
        pnpm db:push
        pnpm db:generate
        ```

2. **Supabase:**
    * Ensure the `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_DATABASE_URL` environment variables are properly configured.

## Contribution

Contributions are welcome! To contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear, concise messages.
4. Submit a pull request with a detailed explanation of your changes.

## License

This project does not specify a license. All rights are reserved unless otherwise specified.

[![Built with Dokugen](https://img.shields.io/badge/Built%20with-Dokugen-brightgreen)](https://github.com/samueltuoyo15/Dokugen)
