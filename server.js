const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');

// 🔴 APNE CREDENTIALS NICHE QUOTES "" ME REPLACE KAREIN
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8787033544:AAEFzjn-N5agaF7aDI0OuDnJ_n2tnpfMc6Y";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://vmjtehhbdbobgnqitagc.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtanRlaGhiZGJvYmducWl0YWdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODIwMzY5NywiZXhwIjoyMTAzNzc5Njk3fQ.tVXMsM50hQ-LfLUo5-Ojm--3zYAPXApxLqSSo3Cxhs8";
const ADMIN_ID = process.env.ADMIN_TELEGRAM_ID || "1969155890";

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Security Guard Middleware
bot.use((ctx, next) => {
  if (ctx.from?.id.toString() !== ADMIN_ID.toString()) {
    return ctx.reply("⛔ Access Denied: Authorized Admin Only.");
  }
  return next();
});

// /dashboard
bot.command('dashboard', async (ctx) => {
  const { count: pollsCount } = await supabase.from('polls').select('*', { count: 'exact' }).eq('status', 'active');
  const { count: votesCount } = await supabase.from('votes').select('*', { count: 'exact' });
  const { data: topReq } = await supabase.from('requests').select('artist_name');

  ctx.reply(
    `🎛 **ADMIN DASHBOARD**\n\n` +
    `🟢 Live Polls: ${pollsCount || 0}\n` +
    `🗳 Total Votes: ${votesCount || 0}\n` +
    `💬 Total Requests: ${topReq?.length || 0}`
  );
});

// /requests
bot.command('requests', async (ctx) => {
  const { data, error } = await supabase.from('requests').select('artist_name');
  if (error) return ctx.reply("Failed to load requests.");

  // Count occurrences
  const counts = {};
  data.forEach(r => counts[r.artist_name] = (counts[r.artist_name] || 0) + 1);

  let msg = "🔥 **TOP REQUESTS**\n\n";
  Object.entries(counts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([artist, count], i) => {
      msg += `${i+1}. ${artist} — ${count}\n`;
    });

  ctx.reply(msg);
});

bot.launch();
