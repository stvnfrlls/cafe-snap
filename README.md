# ☕ Cafe Snap

A minimalist, photo-driven map for discovering and pinning cafes. Drop a pin on any location, attach a photo, and share it with everyone.

---

## Features

- 🗺️ Flat, minimalist map powered by MapLibre GL + OpenFreeMap tiles
- 📍 Add pins to any location with a cafe name and photo
- 🖼️ Click any pin to view the uploaded photo
- 🏪 Overlay existing cafe locations from OpenStreetMap (via Overpass API)
- 🔐 Login and registration via Supabase Auth
- 🌍 All pins are public — everyone sees everyone's finds

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | Vue 3 + Vite |
| Map | MapLibre GL JS |
| Map Tiles | OpenFreeMap (free, no API key) |
| Existing cafés | Overpass API (OpenStreetMap) |
| Auth | Supabase Auth |
| Database | Supabase Postgres |
| Image Storage | Supabase Storage |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier)

### Installation

```bash
git clone https://github.com/stvnfrlls/cafe-snap.git
cd cafe-snap
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from your Supabase dashboard under **Settings → API**.

### Run Locally

```bash
npm run dev
```

---

## Supabase Setup

### 1. Create the `pins` table

```sql
create table pins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  cafe_name text not null,
  lat float8 not null,
  lng float8 not null,
  image_url text not null,
  created_at timestamptz default now()
);
```

### 2. Enable Row Level Security

```sql
alter table pins enable row level security;

-- Anyone can read pins
create policy "Public read"
  on pins for select using (true);

-- Only the owner can insert
create policy "Auth insert"
  on pins for insert
  with check (auth.uid() = user_id);

-- Only the owner can delete
create policy "Auth delete"
  on pins for delete
  using (auth.uid() = user_id);
```

### 3. Create a Storage Bucket

- Go to **Storage → New Bucket**
- Name it `cafe-images`
- Set visibility to **Public**
- Allow authenticated users to upload

---

## Project Structure

```
src/
├── components/
│   ├── MapView.vue        # MapLibre map + pin rendering
│   ├── PinMarker.vue      # Custom pin UI
│   ├── PinPopup.vue       # Photo + cafe name on pin click
│   ├── AddPinModal.vue    # Upload photo + enter cafe name
│   └── AuthModal.vue      # Login / Register
├── stores/
│   ├── auth.js            # Pinia — user session
│   └── pins.js            # Pinia — pins CRUD
├── lib/
│   └── supabase.js        # Supabase client
└── App.vue
```

---

## How Pins Work

1. Click anywhere on the map while logged in
2. A modal opens — enter a cafe name and upload a photo
3. The photo is stored in Supabase Storage
4. A pin is saved to the database with the coordinates and image URL
5. The pin appears on the map for everyone instantly

---

## Existing Cafe Overlay

Cafes from OpenStreetMap are loaded via the Overpass API and shown as secondary markers on the map. These are distinct from user-added pins — they serve as a reference layer and are not tied to any uploaded photos.

---

## Deployment

This project is set up for deployment on [Vercel](https://vercel.com).

```bash
npm run build
```

Add your environment variables in the Vercel project settings before deploying.

---

## Supabase Free Tier Limits

| Resource | Limit |
|---|---|
| Database | 500 MB |
| File storage | 1 GB |
| Bandwidth | 2 GB / month |
| Inactivity pause | After 1 week |

Sufficient for a portfolio project. Upgrade if needed.

---

## License

MIT