import { createApi } from './api.js';
import { createUI } from './ui.js';
import { createApp } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = createApp({
    api: createApi('http://localhost:3001'),
    ui: createUI(document),
  });
  app.start();
});