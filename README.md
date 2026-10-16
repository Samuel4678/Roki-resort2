# ROKI Resort website
Static site for GitHub Pages, plus an optional free backend (Supabase) for the admin area.

## 1. Publish the site
1. Upload the **contents** of this folder to the repo root, so `index.html` is at the top level. Keep `.nojekyll`.
2. Settings → Pages → Deploy from branch → `main` / `(root)`.
3. Open `https://<username>.github.io/<repo>/`. If you see an old version, hard refresh (Ctrl+Shift+R).

## 2. Switch on the admin area (events, photo swapping, visitor activity)
GitHub Pages can't store data or check passwords, so these features use a free Supabase project.
1. Create a project at supabase.com.
2. SQL Editor → paste all of `supabase-setup.sql` → Run.
3. Authentication → Users → **Add user**: email `admin@rokiadmin.com`, choose a strong password, tick "Auto confirm user".
   Then Authentication → Sign In / Providers → turn **off** "Allow new users to sign up".
4. Project Settings → API: copy the **Project URL** and the **anon public key** into `config.js` (`supabaseUrl`, `supabaseKey`). Never paste the `service_role` key anywhere.
5. Upload the changed `config.js`. Log in at `/admin.html` with username `admin` and your password.

In the admin area you can: add and delete events (shown on the site under Events), swap any site photo (including the pool and conference photos), and see visitor activity (visits, chat questions, booking requests, taps on WhatsApp/call/directions, video plays).

## Contact details
Edit `config.js`: `phone`, `whatsapp` (e.g. `2547XXXXXXXX`), `email`.

## Photos and video
Default photos are in `images/` (also embedded in `styles.css` as a safety net). The celebrity video is `images/celebrities.mp4` with `celebrities-poster.jpg`. Photos swapped in the admin area override the defaults.

## Privacy
The site logs anonymous visit and chat activity (random session code, page, device type, chat question text, no names or phone numbers). A notice is in the footer. Only the admin can read the log.

## Theme
Dark by default; visitors switch with the sun/moon button. Colours are the variables at the top of `styles.css`.
