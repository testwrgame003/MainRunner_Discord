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

client.once(Events.ClientReady, (c) => {
  console.log("Bot conectado: " + c.user.tag);
});

client.on(Events.MessageCreate, async (msg) => {
  if (msg.author.bot || !msg.guild) return;
  if (msg.content.trim().toLowerCase() !== "!setup-runner") return;

  if (!msg.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
    return msg.reply("Solo administradores / Admins only.");
  }

  await msg.delete().catch(() => {});

  const mainEmbed = new EmbedBuilder()
    .setColor(0x0ea5e9)
    .setTitle("⚡ Zenith Main Runner 24/7 — Auto-Accept (ES 🇪🇸 / EN 🇺🇸)")
    .setDescription(
      "🇪🇸 **Español:** Acepta solicitudes 24/7 en la nube desde tu móvil o PC.\n" +
      "🔒 **Zero-Storage:** Tus datos **se quedan en el almacenamiento local de tu dispositivo** y al cerrar sesión **se borran de la RAM del servidor (0 bytes)**.\n\n" +
      "🇺🇸 **English:** Auto-accept friend requests 24/7 in the cloud from mobile or PC.\n" +
      "🔒 **Zero-Storage:** Your credentials **stay in your device's local storage** and on logout **are wiped from server RAM (0 bytes)**."
    )
    .addFields(
      {
        name: "🇪🇸 Resumen Rápido",
        value: "1. Abre el Panel Web (ES) y desbloquea tu _secure.zip.\n2. Pulsa ▶️ ACTIVAR.\n3. Si abres el juego en el móvil, pasa a 📱 Modo Espera sin doble login.",
        inline: true,
      },
      {
        name: "🇺🇸 Quick Summary",
        value: "1. Open Web Panel (EN) and unlock your _secure.zip.\n2. Tap ▶️ START.\n3. Opening the game on mobile switches to 📱 Standby Mode safely.",
        inline: true,
      }
    )
    .setFooter({ text: "Zenith Rise • Local AES-256 & Ephemeral RAM Engine" });

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setLabel("🇪🇸 Abrir Panel Web (ES)").setStyle(ButtonStyle.Link).setURL(MAIN_RUNNER_URL + "/?lang=es"),
    new ButtonBuilder().setLabel("🇺🇸 Open Web Panel (EN)").setStyle(ButtonStyle.Link).setURL(MAIN_RUNNER_URL + "/?lang=en")
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("guide_es").setLabel("📖 Guía (ES)").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("guide_en").setLabel("📖 Guide (EN)").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("sec_info").setLabel("🛡️ Zero-Storage").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("live_st").setLabel("📊 Status").setStyle(ButtonStyle.Success)
  );

  await msg.channel.send({ embeds: [mainEmbed], components: [row1, row2] });
});

client.on(Events.InteractionCreate, async (i) => {
  if (!i.isButton()) return;

  if (i.customId === "guide_es") {
    const emb = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setTitle("🇪🇸 Guía Paso a Paso — Main Runner")
      .setDescription("🔒 **Importante:** Tus datos **se quedan en el almacenamiento local de tu dispositivo** y al cerrar sesión **se borran del servidor (0 bytes)**.")
      .addFields(
        { name: "Paso 1: Sincronizar Móvil (1ra vez)", value: "Extrae dc.bin de tu _secure.zip con ZArchiver y pégalo en Android/data/jp.pokemon.pokemontcgp/files/dc.bin." },
        { name: "Paso 2: Desbloquear en Navegador", value: "Entra al Panel Web (ES), elige tu _secure.zip, pon tu clave y toca 🔓 Desbloquear. Usa 💾 Recordar en mi Móvil para guardarlo localmente." },
        { name: "Paso 3: Activar en RAM", value: "Elige el tiempo y pulsa ▶️ ACTIVAR. Cuando diga En Línea ya puedes bloquear tu pantalla." },
        { name: "Paso 4: Jugar sin doble login", value: "Al abrir el juego en tu celular, el sistema pasa a 📱 En Espera automáticamente. Al salir del juego, toca ▶️ ACTIVAR / REANUDAR." },
        { name: "Paso 5: Cerrar y Purgar", value: "Pulsa ⏹️ CERRAR SESIÓN para borrar todo de la memoria RAM del servidor al instante." }
      );
    return i.reply({ embeds: [emb], ephemeral: true });
  }

  if (i.customId === "guide_en") {
    const emb = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setTitle("🇺🇸 Step-by-Step Guide — Main Runner")
      .setDescription("🔒 **Important:** Your credentials **stay in your device's local storage** and on logout **are wiped from the server (0 bytes)**.")
      .addFields(
        { name: "Step 1: Sync Phone (One-time)", value: "Extract dc.bin from your _secure.zip using ZArchiver and paste it into Android/data/jp.pokemon.pokemontcgp/files/dc.bin." },
        { name: "Step 2: Unlock in Browser", value: "Open Web Panel (EN), select your _secure.zip, enter password and tap 🔓 Unlock. Tap 💾 Save on Device to store locally." },
        { name: "Step 3: Start in RAM", value: "Choose duration and tap ▶️ START. Once Online, you can lock your phone screen." },
        { name: "Step 4: Play without double-login", value: "When you open the game on mobile, the server enters 📱 Standby Mode automatically. When done playing, tap ▶️ START / RESUME." },
        { name: "Step 5: Log Out & Wipe", value: "Tap ⏹️ LOG OUT & WIPE to immediately clear your session from server RAM." }
      );
    return i.reply({ embeds: [emb], ephemeral: true });
  }

  if (i.customId === "sec_info") {
    const emb = new EmbedBuilder()
      .setColor(0x22c55e)
      .setTitle("🛡️ Zero-Storage Privacy (ES / EN)")
      .addFields(
        { name: "🇪🇸 Privacidad Blindada", value: "• Tu _secure.zip (AES-256) se abre solo en tu navegador.\n• Se guarda únicamente en tu almacenamiento local (localStorage).\n• Al cerrar sesión se purga la RAM a 0 bytes." },
        { name: "🇺🇸 Blinded Privacy", value: "• Your _secure.zip (AES-256) is unlocked only in your browser.\n• Stored strictly in your device's localStorage.\n• Logging out purges server RAM to 0 bytes." }
      );
    return i.reply({ embeds: [emb], ephemeral: true });
  }

  if (i.customId === "live_st") {
    await i.deferReply({ ephemeral: true });
    try {
      const r = await fetch(MAIN_RUNNER_URL + "/api/public/stats", { signal: AbortSignal.timeout(6000) });
      const s = await r.json();
      const emb = new EmbedBuilder()
        .setColor(0x22c55e)
        .setTitle("🟢 Main Runner Server — Online 24/7")
        .setDescription(
          "• **Online / En Línea:** " + s.online_runners + "\n" +
          "• **Standby / En Espera:** " + s.holding_runners + "\n" +
          "• **Accepted / Aceptadas:** " + s.total_accepted + "\n" +
          "• **Disk / En Disco:** " + s.storage_bytes_on_disk + " bytes"
        );
      return i.editReply({ embeds: [emb] });
    } catch (e) {
      return i.editReply("⚠️ Server URL: " + MAIN_RUNNER_URL + "\nReiniciando / Restarting...");
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Falta DISCORD_TOKEN");
  process.exit(1);
}
client.login(token);
