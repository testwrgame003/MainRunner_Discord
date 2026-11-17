const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  PermissionsBitField,
} = require("discord.js");

// 🔗 URL pública de tu servicio Main Runner en Railway (sin barra al final)
const MAIN_RUNNER_URL = (
  process.env.MAIN_RUNNER_URL || "https://tu-main-runner.up.railway.app"
).replace(/\/$/, "");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`✅ Bot conectado exitosamente como ${readyClient.user.tag}`);
  console.log(`🔗 Apuntando a Main Runner URL: ${MAIN_RUNNER_URL}`);
});

// 1. Comando de administrador (!setup-runner) para publicar el panel bilingüe (ES / EN)
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.content.trim().toLowerCase() === "!setup-runner") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({ content: "❌ Solo administradores / Admins only." });
    }

    await message.delete().catch(() => {});

    const mainEmbed = new EmbedBuilder()
      .setColor(0x0ea5e9)
      .setTitle("⚡ Zenith Main Runner 24/7 — Auto-Accept (ES 🇪🇸 / EN 🇺🇸)")
      .setDescription(
        "🇪🇸 **Español:** Acepta solicitudes de amistad automáticamente 24/7 en la nube desde tu móvil o PC sin gastar batería.\n" +
        "🔒 **Privacidad Zero-Storage:** Tus datos **se quedan en el almacenamiento local de tu dispositivo** y al cerrar sesión **se borran por completo de la memoria RAM del servidor (0 bytes)**.\n\n" +
        "───\n\n" +
        "🇺🇸 **English:** Automatically accept friend requests 24/7 in the cloud from your phone or PC without draining your battery.\n" +
        "🔒 **Zero-Storage Privacy:** Your credentials **stay in your device's local storage** and once you log out **they are completely wiped from server RAM (0 bytes)**."
      )
      .addFields(
        {
          name: "🇪🇸 Resumen Rápido",
          value:
            "**1.** Abre el panel web en Español y desbloquea tu `_secure.zip` en tu navegador.\n" +
            "**2.** Pulsa **▶️ ACTIVAR**.\n" +
            "**3.** Si abres el juego en tu teléfono, el sistema entra en **📱 Modo Espera** solo para evitar errores de doble login.",
          inline: true,
        },
        {
          name: "🇺🇸 Quick Summary",
          value:
            "**1.** Open the English Web Panel and unlock your `_secure.zip` in your browser.\n" +
            "**2.** Tap **▶️ START**.\n" +
            "**3.** If you open the game on your phone, the system automatically enters **📱 Standby Mode** to prevent double-login errors.",
          inline: true,
        }
      )
      .setFooter({
        text: "Zenith Rise • Local AES-256 Decryption & Ephemeral RAM Engine",
      })
      .setTimestamp();

    const rowWeb = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("🇪🇸 Abrir Panel Web (Español)")
        .setStyle(ButtonStyle.Link)
        .setURL(`${MAIN_RUNNER_URL}/?lang=es`),

      new ButtonBuilder()
        .setLabel("🇺🇸 Open Web Panel (English)")
        .setStyle(ButtonStyle.Link)
        .setURL(`${MAIN_RUNNER_URL}/?lang=en`)
    );

    const rowGuides = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("runner_guide_es")
        .setLabel("📖 Guía Paso a Paso (ES)")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("runner_guide_en")
        .setLabel("📖 Step-by-Step Guide (EN)")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("runner_security_bilingual")
        .setLabel("🛡️ Zero-Storage Info")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("runner_status_btn")
        .setLabel("📊 Live Status")
        .setStyle(ButtonStyle.Success)
    );

    await message.channel.send({ embeds: [mainEmbed], components: [rowWeb, rowGuides] });
  }
});

// 2. Manejador de botones interactivos en ambos idiomas
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "runner_guide_es") {
    const guideEs = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setTitle("🇪🇸 Guía Paso a Paso — Cómo usar el Main Runner")
      .setDescription(
        "🔒 **Importante:** Tus credenciales **se quedan únicamente en el almacenamiento local de tu dispositivo
