# AI Studio

A professional React + Express starter for an AI image/video creative platform.

## Included
- Text-to-video UI
- Text-to-image UI
- Cartoon, anime, cinematic and photorealistic styles
- Duration controls up to 2 minutes at the product level
- Native-audio option in the UI
- Reference upload endpoint
- Library
- Community
- Admin control center
- Responsive mobile-first dark UI
- Render deployment configuration
- Demo mode so the site can be tested without an AI API key

## Run locally
```bash
npm install
npm run dev
```

For production:
```bash
npm install
npm run build
npm start
```

## Deploy on Render
Connect this repository to Render as a Web Service.
Build:
`npm install && npm run build`
Start:
`npm start`

The included `render.yaml` defaults to DEMO_MODE=true.

## Real AI generation
The browser must never receive provider secret keys. Add the real generation adapter to `server/index.js` and store the provider key in Render Environment Variables.

The product-level duration selector can create longer projects by composing/continuing multiple supported model clips; it is not claiming that every provider returns a single 2-minute generation in one API call.
