const fs = require('fs')
const Discord = require('discord.js');
const Client = require('./client/Client');
const {
  prefix,
  token,
} = require('./config.json');
const client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(` ${client.users.size} users. Prefix: - 🖤 Developer: https://dashaputra.com`, {
    type: 'WATCHING'
  }); //PLAYING, LISTENING, WATCHING
  client.user.setStatus('dnd'); //online, idle, invisible, dnd
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('message', async message => {
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  try {
    command.execute(message);
  } catch (error) {
    console.error(error);
}
});

client.login(token);
