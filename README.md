# Potluck - Recipe Collection & Sharing App

A modern web application for collecting, organizing, and sharing your favorite recipes with friends and family.

## Features

### 🎯 Smart Recipe Import
- **URL Import**: Paste any recipe URL and AI extracts all details
- **Text Import**: Paste recipe text directly for parsing
- **AI-Powered**: Uses OpenAI to intelligently parse recipe data
- **Copyright Respectful**: Summarizes instructions rather than copying verbatim

### 📚 Recipe Management
- **JSON-Based Storage**: Flexible schema using PostgreSQL JSONB
- **Rich Recipe Data**: Ingredients with sections, step-by-step instructions, nutrition info
- **Serving Adjustments**: Scale recipes up or down dynamically
- **Ingredient Checkboxes**: Track what you've added while cooking

### 🔐 Privacy & Sharing
- **Private**: Only you can see your recipes
- **Link Sharing**: Generate unique links to share specific recipes
- **Friends Only**: Share with your connected friends (coming soon)
- **Public**: Make recipes discoverable by everyone

### 🎨 User Experience
- **Clean Recipe View**: Distraction-free cooking mode
- **Step-by-Step Mode**: Navigate instructions one at a time
- **Mobile Responsive**: Works great on phones and tablets
- **Print Optimized**: Clean print layout for physical copies

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth with email magic links
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI API for recipe parsing
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key (optional, for AI parsing)

### Environment Setup

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/potluck"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (for magic links)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@potluck.app"

# OpenAI (optional)
OPENAI_API_KEY="sk-your-api-key"
```

### Installation

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the app.

## Database Schema

The app uses a simplified JSON-oriented schema with 3 main tables:

- **recipes**: Core recipe data with JSONB storage
- **collections**: User recipe organization
- **shares**: Sharing permissions and tokens

## API Routes

- `GET /api/recipes` - List user's recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/[id]` - Get specific recipe
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe
- `POST /api/recipes/import/url` - Import from URL
- `POST /api/recipes/import/text` - Import from text
- `POST /api/recipes/[id]/share` - Create share link

## Development

```bash
# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## Future Enhancements

- [ ] Photo import with OCR
- [ ] Recipe collections and meal planning
- [ ] Social features (comments, ratings)
- [ ] Nutrition calculation
- [ ] Shopping list generation
- [ ] Recipe forking and variations
- [ ] Advanced search and filtering
- [ ] Bookmarklet for one-click import

## License

MIT