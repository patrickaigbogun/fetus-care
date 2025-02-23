
---

Revised Application Architecture

1. Frontend

Framework: Next.js

Core interface for the entire app, including the Maternal Hub, chat area, appointment booking, AI-powered pregnancy guide, and marketplace.

Agora SDK integrated directly into the frontend for video/audio calls.




---

2. Backend

Framework: Laravel

Laravel will now handle:

User authentication and profile management.

Appointment booking (CRUD for availability, user bookings, and confirmations).

Messaging system for storing chat logs and syncing messages between users and professionals.

Email notifications (e.g., appointment reminders).


Laravel API will serve data to the frontend and handle requests for real-time updates.




---

3. AI Services

Python:

Drives:

AI chatbot for maternal queries using an ollama model or an llm api

Analytic Engine:
This contains the Symptom checker and personalized pregnancy insights using various python libraries


Python-based API exposes functionality to Next.js for seamless integration.




---

4. Database

Primary Database: PostgreSQL

Use the guide below:
[Connect from Laravel to Neon - Neon Docs](https://neon.tech/docs/guides/laravel)

example connection string: 

postgresql://dbname_owner:npg_yellow_peas124gyW@ep-yellow-peases-api9p7t2n-pooler.gwc.azure.neon.tech/dbname?sslmode=require

 .env for laravel db:

PGHOST='po-yellow-peases-apip7t2n-pooler.gwc.azure.neon.tech'
PGDATABASE='dbname'
PGUSER='dbname_owner'
PGPASSWORD='npg_yellow_peas124gyW'

or

DB_CONNECTION=pgsql 
DB_PORT=5432 
DATABASE_URL=NEON_POSTGRES_CONNECTION_STRING

Used for structured data such as:

User profiles.

Appointments.

Chat history.

AI insights (e.g., pregnancy progress reports).





---

5. Notifications(optional)

Email Notifications Only (for now):

Laravel’s email system (via SMTP or services like SendGrid) will be used to notify users about:

Appointment reminders.

Important updates from professionals.





---

6. Real-time Communication

Agora SDK:

Integrated directly in the Next.js frontend for video/audio calls with healthcare professionals.




---


---

Revised Chat Area Flow

Overview of Chat Area

1. AI Chat:

Always pinned at the top of the chat list for easy access.

Accessible at any time via a fixed button in the chat area.



2. Recent Chats:

Displays a chronological list of conversations with healthcare professionals.

A chat is created automatically when:

The user messages a professional from the marketplace.

An appointment is booked with a professional.


New messages push the conversation to the top of the list.



3. Professional Chat Interface:

Similar to messaging apps:

Chat opens full-screen for detailed conversations.

Call buttons for video/audio directly from the chat window (using Agora SDK).






---

Chat Area Flow

1. User Interaction:

User navigates to the chat area from the Maternal Hub.

Sees:

AI chat pinned at the top.

Recent chats below (e.g., with doctors, midwives).




2. Starting a Chat:

With a Professional:

User finds a professional in the marketplace and sends a message.

Chat is created in both the user’s and professional’s recent chat list.


With AI:

User clicks the AI button at the top to ask a question or check symptoms.




3. In-Chat Features:

Text messaging.

Attachments (e.g., reports or images).

Call buttons for video/audio consultation with professionals.



4. Syncing and Persistence:

Laravel handles:

Syncing chat logs to the database.

Making chat history available across devices.



---
Simplified Tech Stack

Frontend

Next.js: User interface, Agora SDK for video/audio.


Backend

Laravel: Core backend logic, messaging system, appointment booking, and email notifications.

Python: AI services (chatbot, symptom checker, and insights).


Database

PostgreSQL: Unified database for structured data.



---
