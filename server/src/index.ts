import { createApp } from './api/createApp.js';

const PORT = 3001;
const app = createApp();
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
