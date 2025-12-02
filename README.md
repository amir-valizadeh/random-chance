# VIRAD Wheel 🎡

A beautiful, fully responsive spinning wheel web application built with Next.js 14, TypeScript, and Tailwind CSS. Perfect for random selection, giveaways, team assignments, and more!

![VIRAD Wheel](public/logo.png)

## ✨ Features

- 🎨 **Beautiful UI** - Smooth animations with Framer Motion
- 📱 **Fully Responsive** - Works perfectly on mobile and desktop
- 🎯 **Weighted Random Selection** - Assign different probabilities to participants
- 🎉 **Confetti Animation** - Celebrate winners with confetti effects
- 🔊 **Sound Effects** - Spin and win sounds using Web Audio API
- 📊 **Participant Management** - Add, edit, remove participants with ease
- 📥 **Excel/CSV Import & Export** - Bulk manage participants
- 🗑️ **Remove Winner** - One-click option to remove winner from list
- 🌓 **Dark/Light Mode** - Automatic theme switching
- 💾 **Auto-Save** - Participants saved to localStorage
- 📴 **PWA Ready** - Works offline as a Progressive Web App
- 🚀 **Deploy-Ready** - Optimized for Vercel deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd /Users/edy/Desktop/learning/random-shans
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

That's it! Vercel will automatically detect Next.js and configure everything.

## 📁 Project Structure

```
random-shans/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
├── components/
│   ├── Wheel.tsx         # Spinning wheel component
│   ├── ParticipantList.tsx  # Participant management
│   └── WinnerModal.tsx   # Winner display with confetti
├── lib/
│   ├── utils.ts          # Utility functions
│   └── sound.ts          # Web Audio API sound effects
├── types/
│   └── index.ts          # TypeScript type definitions
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── logo.png          # VIRAD logo
│   └── icon-*.png        # PWA icons
└── package.json
```

## 🎮 Usage

### Adding Participants

1. Enter a name in the input field
2. Set the weight (default is 1)
3. Click the "+" button or press Enter

### Importing from Excel/CSV

1. Click the upload icon
2. Select your Excel (.xlsx, .xls) or CSV file
3. File should have columns: `Name` and `Weight`

Example Excel format:
| Name    | Weight |
|---------|--------|
| Alice   | 1      |
| Bob     | 2      |
| Charlie | 1      |

### Spinning the Wheel

1. Click the big "SPIN" button
2. Wait for the wheel to stop
3. Winner is displayed with confetti animation
4. Option to remove winner from the list

### Exporting Participants

1. Click the download icon
2. Excel file will be downloaded with all participants

## 🎨 Customization

### Change Colors

Edit the participant colors in `types/index.ts`:

```typescript
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', ...];
```

### Modify Spin Duration

Edit the spin animation in `components/Wheel.tsx`:

```typescript
transition: {
  duration: 5, // Change this value (in seconds)
  ease: [0.15, 0.25, 0.25, 1],
}
```

### Replace Logo

Replace `/public/logo.png` with your own logo image.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Excel/CSV**: SheetJS (xlsx)
- **Confetti**: react-confetti
- **PWA**: @ducanh2912/next-pwa

## 📱 PWA Features

The app is configured as a Progressive Web App:

- ✅ Installable on mobile and desktop
- ✅ Works offline
- ✅ App-like experience
- ✅ Fast loading with service worker caching

To install on mobile:
1. Open the app in your browser
2. Tap the "Add to Home Screen" option
3. The app will install like a native app

## 🔧 Environment Variables

No environment variables required! The app works out of the box.

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and use this project as you wish!

## 💡 Tips

- **Weights**: Higher weight = higher chance of winning
- **Dark Mode**: Automatically follows system preference
- **Sound**: Toggle sound on/off with the speaker icon
- **Data Persistence**: Participants are automatically saved to browser storage
- **Mobile**: Touch-friendly design optimized for mobile devices

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors, try:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### PWA Not Working

PWA only works in production mode. Build and run:
```bash
npm run build
npm start
```

## 📞 Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Made with ❤️ using Next.js 14**
