import { app } from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` SkillBridge AI API Server Running`);
  console.log(` Port: ${PORT}`);
  console.log(` Mode: ${config.nodeEnv}`);
  console.log(` Health: http://localhost:${PORT}/api/v1/health`);
  console.log(` AI Service: ${config.isAiConfigured ? `Configured (${config.geminiModel})` : 'Not Configured (Requires GEMINI_API_KEY)'}`);
  console.log(` Supabase: ${config.isSupabaseConfigured ? 'Configured' : 'Local Fallback Mode Active'}`);
  console.log(`=================================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
