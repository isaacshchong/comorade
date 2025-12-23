import dotenv from 'dotenv'
dotenv.config()
import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';

// Step 1: Create the Discord client with message intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Step 2: Load filter.json
const filterPath = path.join(process.cwd(), 'filter.json');
const filterData = JSON.parse(fs.readFileSync(filterPath, 'utf8'));
const badWords = filterData.badWords;

// Step 3: Listen for messages
client.on('messageCreate', async message => {
  // Ignore bots and DMs
  if (message.author.bot || !message.guild) return;

  const content = message.content.toLowerCase();

  // Step 4: Check against badWords
  if (badWords.some(word => content.includes(word))) {
    try {
      await message.delete(); // remove the message
      await message.channel.send(
        `${message.author}, your message contained a filtered word and was removed.`
      );
    } catch (err) {
      console.error('Failed to delete filtered message:', err);
    }
  }
});

// Step 5: Log in
client.login(process.env.BOT_TOKEN);