const { Client, GatewayIntentBits, Events } = require("discord.js");
const { registerMainRunnerModule } = require("./mainrunnerpanel.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Registrar los comandos y botones del Main Runner
registerMainRunnerModule(client);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Bot conectado exitosamente como ${readyClient.user.tag}`);
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("❌ Error: Falta la variable de entorno DISCORD_TOKEN en Railway.");
  process.exit(1);
}

client.login(token);
