// app.ts
import express from 'express';
import dotenv from "dotenv";
import {createTables }  from './data/createTable';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Database connection check
createTables();

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});