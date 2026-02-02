# Emotional Intelligence Quiz Platform

A minimal quiz platform built with Next.js 14, shadcn/ui, and Vercel KV for testing emotional intelligence.

## Features

- Clean, dark-themed UI with centered layouts
- 5 multiple-choice questions
- Linear quiz flow (no back button)
- Response storage using Vercel KV
- Hidden results page for viewing all submissions
- Fully responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Storage**: Vercel KV (Redis-based key-value store)
- **Deployment**: Vercel

## Project Structure

```
quiz/
├── app/
│   ├── layout.tsx          # Root layout with dark theme
│   ├── page.tsx            # Landing page
│   ├── quiz/
│   │   └── page.tsx        # Quiz page with MCQ questions
│   ├── thankyou/
│   │   └── page.tsx        # Thank you page after submission
│   ├── result/
│   │   └── page.tsx        # Hidden results page
│   └── api/
│       ├── submit/
│       │   └── route.ts    # POST endpoint to save responses
│       └── results/
│           └── route.ts    # GET endpoint for fetching all responses
├── components/
│   └── ui/                 # shadcn components (Button, Card, RadioGroup)
├── lib/
│   ├── questions.ts        # Quiz questions
│   └── utils.ts            # Utility functions
└── package.json
```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000)

**Note**: For local development without Vercel KV, the API endpoints will fail. You need to set up Vercel KV (see deployment section) or mock the KV functions.

## Deployment to Vercel

1. **Push your code to GitHub** (or GitLab/Bitbucket)

2. **Import the project to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Set up Vercel KV:**
   - In your Vercel project dashboard, go to the "Storage" tab
   - Click "Create Database" → Select "KV" (Redis)
   - Follow the prompts to create your KV store
   - Vercel will automatically add the required environment variables to your project

4. **Deploy:**
   - Vercel will automatically deploy your project
   - Every push to the main branch will trigger a new deployment

## Environment Variables

The following environment variables are automatically set by Vercel when you create a KV store:

- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

No manual configuration is needed if you're using Vercel KV through the Vercel dashboard.

## Pages

### Public Pages
- `/` - Landing page with "Start Quiz" button
- `/quiz` - Interactive quiz with 5 questions
- `/thankyou` - Confirmation page after submission

### Hidden Page
- `/result` - View all quiz submissions (not linked anywhere in the app)

## Customizing Questions

To update the quiz questions, edit `/lib/questions.ts`:

```typescript
export const questions: Question[] = [
  {
    id: "q1",
    text: "Your question here?",
    options: [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ]
  },
  // Add more questions...
];
```

## Storage Schema

Vercel KV stores responses using the following structure:

```typescript
// Key: "response:{uuid}"
// Value: {
//   id: string,
//   answers: { q1: string, q2: string, ... },
//   submittedAt: string (ISO timestamp)
// }

// Key: "response_ids" (Set of all response IDs)
```

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- The results page (`/result`) is intentionally hidden and only accessible via direct URL
- No authentication is implemented - suitable for 5-10 users in a trusted environment
- All responses are stored indefinitely in Vercel KV
- The quiz enforces a linear flow - users cannot go back to previous questions
