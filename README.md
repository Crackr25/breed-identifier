# Snake Species Identifier

A Next.js application that uses AI to identify snake species from uploaded images and determine whether they are venomous or not.

## Features

- 🐍 **Image Upload**: Drag and drop or click to upload snake images
- 🔍 **Species Identification**: AI-powered snake species recognition
- ⚠️ **Venomous Detection**: Determines if the identified snake is venomous
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Set up OpenRouter.ai API:
   - Sign up at [OpenRouter.ai](https://openrouter.ai/)
   - Create an API key at [https://openrouter.ai/keys](https://openrouter.ai/keys)
   - Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   - Edit `.env.local` and replace `your_openrouter_api_key_here` with your actual API key

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How It Works

1. **Upload an Image**: Users can upload an image of a snake through the web interface
2. **AI Analysis**: The backend sends the image to OpenRouter.ai using Claude 3.5 Sonnet for advanced computer vision analysis
3. **Species Identification**: The AI model analyzes body patterns, coloration, head shape, and other distinctive features to identify the species
4. **Results Display**: Shows the identified species, confidence level, venomous status, and detailed description

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Image Processing**: Sharp (for future enhancements)

## API Endpoints

- `POST /api/identify` - Upload an image for snake identification
- `GET /api/identify` - API information

## Supported Image Formats

- JPEG
- PNG
- GIF
- WebP

## Disclaimer

This application is for educational purposes. The AI identification should not be used as the sole basis for determining if a snake is dangerous. Always exercise caution around unknown snakes and consult with local wildlife experts when in doubt.

## Future Enhancements

- Integration with real computer vision models (TensorFlow.js, OpenAI Vision API)
- Expanded species database
- Geographic location-based species filtering
- Historical identification logs
- Batch image processing
