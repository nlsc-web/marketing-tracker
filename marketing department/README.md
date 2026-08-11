# Marketing department — daily tracker

## Folder structure
```
marketing-tracker/
├── index.html          # page structure
├── css/
│   └── style.css        # all styling
├── js/
│   ├── firebase-config.js  # <- paste your Firebase keys here
│   └── app.js               # app logic (login, entry form, dashboard)
└── README.md
```

## Setup (one-time)

1. Create a free Firebase project at console.firebase.google.com.
2. Enable **Firestore Database** (Build > Firestore Database > Create database > Start in test mode).
3. Register a **web app** in the project (the `</>` icon on the project overview page).
4. Copy the `firebaseConfig` object it gives you and paste the values into
   `js/firebase-config.js`, replacing the placeholder strings.
5. Open `index.html` in a browser (or deploy the whole folder — see below) and
   it will connect to your Firestore database automatically.

## Coordinator PINs

Set in `js/app.js` at the top (`COORD_PINS`). Defaults:

| Coordinator | PIN |
|---|---|
| Ms. Nirmala | 1010 |
| Sumudu | 2020 |
| Ishini | 3030 |
| Ruchira | 4040 |
| Tharusha | 5050 |
| Kasundi | 6060 |
| Sajani | 7070 |

Change these before real use.

## Deploying for free

1. Go to app.netlify.com, sign up free.
2. Drag and drop the whole `marketing-tracker` folder onto the deploy area.
3. Netlify gives a free `.netlify.app` URL — share that with your team.
4. A custom domain can be connected later from Netlify's Domain settings.

## Notes

- Data is shared for everyone using the app (stored in Firestore, not per-device).
- Firestore's free tier is generous — plenty for a small team's daily use.
- "Start in test mode" leaves the database open to anyone with the URL. For
  production use, tighten Firestore security rules later.
