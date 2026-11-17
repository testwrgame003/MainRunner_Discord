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

const RAW_URL = process.env.MAIN_RUNNER_URL || "https://tu-main-runner.up.railway.app";
const MAIN_RUNNER_URL = RAW_URL.replace(/\/$/, "");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log("Bot conectado como: " + readyClient.user.tag);
  console.log("Main Runner URL: " + MAIN_RUNNER_URL);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.content.trim().toLowerCase() === "!setup-runner") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return message.reply({ content: "Solo administradores / Admins only." });
    }

    await message.delete().catch(() => {});

    const descLines = [
      "🇪🇸 **Español:** Acepta solicitudes automáticamente 24/7 en la nube desde tu móvil o PC.",
      "🔒 **Privacidad Zero-Storage:** Tus datos **se quedan en el almacenamiento local de tu dispositivo** y al cerrar sesión **se borran de la RAM del servidor (0 bytes)**.",
      "",
      "───",
      "",
      "🇺🇸 **English:** Automatically accept friend requests 24/7 in the cloud from your phone or PC.",
      "🔒 **Zero-Storage Privacy:** Your credentials **stay in your device's local storage** and once you log out **they are wiped from server RAM (0 bytes)**."
    ];

    const esSummary = [
      "**1.** Abre el panel web (ES) y desbloquea tu `_secure.zip` en tu navegador.",
      "**2.** Pulsa **▶️ ACTIVAR**.",
      "**3.** Al abrir el juego en el móvil, pasa a **📱 Modo Espera** solo sin error de doble login."
    ];

    const enSummary = [
      "**1.** Open the Web Panel (EN) and unlock your `_secure.zip` in your browser.",
      "**2.** Tap **▶️ START**.",
      "**3.** When you open the game on mobile, it enters **📱 Standby Mode** to avoid double-login errors."
    ];

    const mainEmbed = new EmbedBuilder()
      .setColor(0x0ea5e9)
      .setTitle("⚡ Zenith Main Runner 24/7 — Auto-Accept (ES 🇪🇸 / EN 🇺🇸)")
      .setDescription(descLines.join("\n"))
      .addFields(
        { name: "🇪🇸 Resumen Rápido", value: esSummary.join("\n"), inline: true },
        { name: "🇺🇸 Quick Summary", value: enSummary.join("\n"), inline: true }
      )
      .setFooter({ text: "Zenith Rise • Local AES-256 Decryption & Ephemeral RAM Engine" })
      .setTimestamp();

    const rowWeb = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("🇪🇸 Abrir Panel Web (Español)")
        .setStyle(ButtonStyle.Link)
        .setURL(MAIN_RUNNER_URL + "/?lang=es"),
      new ButtonBuilder()
        .setLabel("🇺🇸 Open Web Panel (English)")
        .setStyle(ButtonStyle.Link)
        .setURL(MAIN_RUNNER_URL + "/?lang=en")
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

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "runner_guide_es") {
    const guideEs = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setTitle("🇪🇸 Guía Paso a Paso — Cómo usar el Main Runner")
      .setDescription(
        "🔒 **Importante:** Tus credenciales **se quedan únicamente en el almacenamiento local de tu dispositivo** y al cerrar sesión **se borran del servidor (0 bytes)**."
      )
      .addFields(
        {
          name: "🔹 Paso 1: Sincronizar tu Teléfono (Solo la primera vez)",
          value: [
            "• Abre tu `_secure.zip` en tu móvil con **ZArchiver** usando tu contraseña.",
            "• Copia el `dc.bin` y pégalo en: `Android/data/jp.pokemon.pokemontcgp/files/dc.bin`.",
            "• Así tu teléfono y tu archivo `.zip` compartirán la misma llave."
          ].join("\n")
        },
        {
          name: "🔹 Paso 2: Desbloquear tu ZIP en tu Navegador",
          value: [
            "• Pulsa el botón **🇪🇸 Abrir Panel Web (Español)**.",
            "• Selecciona tu `_secure.zip`, pon tu contraseña y toca **🔓 Desbloquear ZIP**.",
            "• *(Opcional)* Pulsa **💾 Recordar en mi Móvil** para guardarlo localmente."
          ].join("\n")
        },
        {
          name: "🔹 Paso 3: Activar el Auto-Accept en RAM",
          value: [
            "• En el Paso 2 de la web, elige la duración y pulsa **▶️ ACTIVAR / REANUDAR AHORA**.",
            "• Cuando diga **🟢 En
