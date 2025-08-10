# Wearr - AI-Powered Outfit Planner 🌤️👔

A Progressive Web App that provides personalized outfit recommendations based on real-time weather forecasts.

## Features

- **Weather-Based Outfit Recommendations**: Get smart clothing suggestions based on current conditions
- **7-Day Forecast**: Plan your wardrobe for the entire week
- **Location Detection**: Auto-detect your location or search for any city
- **PWA Capabilities**: Install as an app, works offline
- **Responsive Design**: Beautiful on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Weather Data**: WeatherAPI.com
- **PWA**: Service Worker, Web App Manifest

## Getting Started

### Prerequisites

- Node.js 18+ installed
- WeatherAPI.com API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nkumrob/wearr.git
cd wearr
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your WeatherAPI key:
```env
WEATHER_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
wearr/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── page.tsx         # Home page
│   └── week/            # Weekly forecast page
├── components/          # React components
├── lib/                 # Utilities and services
│   ├── server/          # Server-side code
│   └── client/          # Client-side code
├── types/               # TypeScript type definitions
├── hooks/               # Custom React hooks
└── public/              # Static assets & PWA files
```

## Deployment

This app is ready to deploy on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nkumrob/wearr)

## Future Enhancements

- [ ] AI-generated outfit images using OpenAI/Gemini
- [ ] User preferences and style profiles
- [ ] Virtual closet feature
- [ ] Push notifications for weather changes
- [ ] Social sharing of outfits

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

Built with ❤️ using Next.js and Claude Code