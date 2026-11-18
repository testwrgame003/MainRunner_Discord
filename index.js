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

let RAW_URL = (process.env.MAIN_RUNNER_URL || "https://headlessproxy-production.up.railway.app").trim();
if (!RAW_URL.startsWith("http://") && !RAW_URL.startsWith("https://")) RAW_URL = "https://" + RAW_URL;
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
      "🇪🇸 **Español:** Acepta solicitudes de forma **continua (sin límite de tiempo)** en la nube desde tu móvil o PC.\n" +
      "🔒 **Zero-Storage:** Tus datos **se quedan en el almacenamiento local de tu dispositivo** y al cerrar sesión **se borran de la RAM del servidor (0 bytes)**.\n" +
      "⏰ **Regla Pre-Reset (05:45 UTC):** 15 minutos antes del reset diario (06:00 UTC), todas las sesiones se apagan automáticamente.\n\n" +
      "🇺🇸 **English:** Auto-accept friend requests **continuously (no time limit)** in the cloud from mobile or PC.\n" +
      "🔒 **Zero-Storage:** Your credentials **stay in your device's local storage** and on logout **are wiped from server RAM (0 bytes)**.\n" +
      "⏰ **Pre-Reset Rule (05:45 UTC):** 15 minutes before the daily reset (06:00 UTC), all active sessions shut down automatically."
    )
    .addFields(
      {
        name: "🇪🇸 Resumen Rápido",
        value: "1. Abre el Panel Web (ES) y desbloquea tu _secure.zip.\n2. Pulsa ▶️ ACTIVAR (queda Online hasta que des Offline o abras el juego).\n3. Se apaga solo a las 05:45 UTC (15m antes del reset).",
        inline: true,
      },
      {
        name: "🇺🇸 Quick Summary",
        value: "1. Open Web Panel (EN) and unlock your _secure.zip.\n2. Tap ▶️ START (stays Online until you go Offline or open the game).\n3. Auto-stops at 05:45 UTC (15m before reset).",
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
        { name: "Paso 3: Modo Continuo en RAM", value: "Pulsa ▶️ ACTIVAR. Tu cuenta quedará Online indefinidamente hasta que des Offline o entres al juego." },
        { name: "Paso 4: Pausa por Doble Login", value: "Al abrir el juego en tu celular, el sistema detiene la recepción y pasa a 📱 En Espera automáticamente. Al salir del juego, toca ▶️ ACTIVAR / REANUDAR." },
        { name: "Paso 5: Apagado Pre-Reset (05:45 UTC)", value: "Por regla del Reroll, 15 minutos antes del reset diario (06:00 UTC) todos los runners se apagan y borran de la RAM automáticamente." }
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
        { name: "Step 3: Continuous Mode in RAM", value: "Tap ▶️ START. Your account stays Online indefinitely until you turn it off or open the game." },
        { name: "Step 4: Double-Login Standby", value: "When you open the game on mobile, the server stops and enters 📱 Standby Mode automatically. When done playing, tap ▶️ START / RESUME." },
        { name: "Step 5: Pre-Reset Cutoff (05:45 UTC)", value: "Per Reroll rules, 15 minutes before the daily reset (06:00 UTC) all active runners shut down and wipe server RAM automatically." }
      );
    return i.reply({ embeds: [emb], ephemeral: true });
  }

  if (i.customId === "sec_info") {
    const emb = new EmbedBuilder()
      .setColor(0x22c55e)
      .setTitle("🛡️ Zero-Storage Privacy (ES / EN)")
      .addFields(
        { name: "🇪🇸 Privacidad Blindada", value: "• Tu _secure.zip (AES-256) se abre solo en tu navegador.\n• Se guarda únicamente en tu almacenamiento local (localStorage).\n• Al cerrar sesión o a las 05:45 UTC se purga la RAM a 0 bytes." },
        { name: "🇺🇸 Blinded Privacy", value: "• Your _secure.zip (AES-256) is unlocked only in your browser.\n• Stored strictly in your device's localStorage.\n• Logging out or reaching 05:45 UTC purges server RAM to 0 bytes." }
      );
    return i.reply({ embeds: [emb], ephemeral: true });
  }

  if (i.customId === "live_st") {
    await i.deferReply({ ephemeral: true });
    try {
      const r = await fetch(MAIN_RUNNER_URL + "/api/public/stats", { signal: AbortSignal.timeout(6000) });
      const s = await r.json();
      const hrs = Math.floor((s.seconds_until_cutoff || 0) / 3600);
      const mins = Math.floor(((s.seconds_until_cutoff || 0) % 3600) / 60);
      const cutoffText = s.in_pre_reset_cutoff
        ? "🛑 ACTIVO (05:45 - 06:00 UTC)"
        : hrs + "h " + mins + "m (05:45 UTC)";

      const emb = new EmbedBuilder()
        .setColor(s.in_pre_reset_cutoff ? 0xef4444 : 0x22c55e)
        .setTitle("🟢 Main Runner Server — Online 24/7")
        .setDescription(
          "• **Online / En Línea:** " + s.online_runners + "\n" +
          "• **Standby / En Espera:** " + s.holding_runners + "\n" +
          "• **Accepted / Aceptadas:** " + s.total_accepted + "\n" +
          "• **Pre-Reset Cutoff:** " + cutoffText + "\n" +
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
