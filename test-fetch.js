const botToken = "8071877950:AAEgNgYSYwBGOldHcD9JokuhzdYZBzMp94k";
const chatId = "7364043882";
const text = "Test message from API route replica!";
fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
}).then(res => res.json()).then(console.log).catch(console.error);
