# TaskDuty

Start the backend in one PowerShell terminal:

```powershell
cd "C:\Users\HP\OneDrive\Desktop\TASK ONE\server"
npm run dev
```

Start the frontend in another terminal:

```powershell
cd "C:\Users\HP\OneDrive\Desktop\TASK ONE\client"
npm run dev
```

Open http://localhost:5173. Create an account or log in. Tasks are saved in MongoDB and belong to the signed-in account. Search matches titles and descriptions, and works together with tag and completion filters. Sessions survive page refresh within the same browser tab; Log out clears the session.

The Vite development server forwards /api requests to http://localhost:5000. The backend requires MONGODB_URI and JWT_SECRET in server/.env. Keep credentials out of source control.

For a separately hosted frontend, set VITE_API_URL to the backend URL including /api before building, and configure the backend CORS origin for your frontend domain. The current setup is ready for local development; hosting requires those environment-specific settings.

Checks:

```powershell
# client
npm run build
npm run lint
# server
npm run build
```

## Search tasks

Use the Filters button to choose status, tag, and a due-date range. Quick-filter buttons and removable search chips keep all active filters visible. Clear all resets the search.

Examples:

- `website is:pending tag:urgent` — pending urgent tasks containing website.
- `title:"website update"` — a phrase in the title only.
- `description:report -meeting` — report in the description, excluding meeting in either field.
- `after:2026-12-01 before:2027-01-01` — due strictly between these dates.
- `-is:completed` — exclude completed tasks.

All terms combine with AND. Search is case-insensitive and treats punctuation literally. Dates apply to due dates; tasks without due dates do not match a date range. Supported operators are is, tag, title, description, before, and after. This is task-specific syntax inspired by Gmail; mail operators such as from and has:attachment are not supported.

Run backend search regression checks with `npm test` from the server folder.
