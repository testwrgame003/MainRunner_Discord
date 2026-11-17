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

const RAW_URL =
  process.env.MAIN_RUNNER_URL ||
  "https://tu-main-runner.up.railway.app";
const MAIN_RUNNER_URL = RAW_URL.replace(/\/$/, "");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log("Bot conectado: " + readyClient.user.tag);
  console.log("URL: " + MAIN_RUNNER_URL);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.content.trim().toLowerCase() === "!setup-runner") {
    const isAdmin = message.member.permissions.has(
      PermissionsBitField.Flags.ManageGuild
    );
    if (!isAdmin) {
      return message.reply({
        content: `Solo administradores / Admins only.`,
      });
    }

    await message.delete().catch(() => {});

    const mainDesc = `🇪🇸 **Español:** Acepta solicitudes automáticamente 24/7 en la nube desde tu móvil o PC sin gastar batería.
🔒 **Privacidad Zero-Storage:** Tus datos **se quedan en el almacenamiento local de tu dispositivo** y al cerrar sesión **se borran de la RAM del servidor (0 bytes)**.

───

🇺🇸 **English:** Automatically accept friend requests 24/7 in the cloud from your phone or PC.
🔒 **Zero-Storage Privacy:** Your credentials **stay in your device's local storage** and once you log out **they are wiped from server RAM (0 bytes)**.`;

    const esSum = `**1.** Abre el panel web (ES) y desbloquea tu \`_secure.zip\` en tu navegador.
**2.** Pulsa **▶️ ACTIVAR**.
**3.** Al abrir el juego en el móvil, pasa a **📱 Modo Espera** sin error de doble login.`;

    const enSum = `**1.** Open the Web Panel (EN) and unlock your \`_secure.zip\` in your browser.
**2.** Tap **▶️ START**.
**3.** When you open the game on mobile, it enters **📱 Standby Mode** safely.`;

    const mainEmbed = new EmbedBuilder()
      .setColor(0x0ea5e9)
      .setTitle(
        `⚡ Zenith Main Runner 24/7 — Auto-Accept (ES 🇪🇸 / EN 🇺🇸)`
      )
      .setDescription(mainDesc)
      .addFields(
        { name: `🇪🇸 Resumen Rápido`, value: esSum, inline: true },
        { name: `🇺🇸 Quick Summary`, value: enSum, inline: true }
      )
      .setFooter({
        text: `Zenith Rise • Local AES-256 & Ephemeral RAM Engine`,
      })
      .setTimestamp();

    const rowWeb = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(`🇪🇸 Abrir Panel Web (Español)`)
        .setStyle(ButtonStyle.Link)
        .setURL(`${MAIN_RUNNER_URL}/?lang=es`),
      new ButtonBuilder()
        .setLabel(`🇺🇸 Open Web Panel (English)`)
        .setStyle(ButtonStyle.Link)
        .setURL(`${MAIN_RUNNER_URL}/?lang=en`)
    );

    const rowGuides = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`runner_guide_es`)
        .setLabel(`📖 Guía Paso a Paso (ES)`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`runner_guide_en`)
        .setLabel(`📖 Step-by-Step Guide (EN)`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`runner_security_bilingual`)
        .setLabel(`🛡️ Zero-Storage Info`)
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`runner_status_btn`)
        .setLabel(`📊 Live Status`)
        .setStyle(ButtonStyle.Success)
    );

    await message.channel.send({
      embeds: [mainEmbed],
      components: [rowWeb, rowGuides],
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "runner_guide_es") {
    const guideEs = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setTitle(`🇪🇸 Guía Paso a Paso — Main Runner`)
      .setDescription(
        `🔒 **Importante:** Tus credenciales **se quedan únicamente en el almacenamiento local de tu dispositivo** y al cerrar sesión **se borran del servidor (0 bytes)**.`
      )
      .addFields(
        {
          name: `🔹 Paso 1: Sincronizar tu Teléfono (1ra vez)`,
          value: `• Abre tu \`_secure.zip\` en tu móvil con **ZArchiver** usando tu clave.
• Copia \`dc.bin\` y pégalo en:
\`Android/data/jp.pokemon.pokemontcgp/files/dc.bin\`.
• Así tu móvil y tu \`.zip\` usarán la misma llave.`,
        },
        {
          name: `🔹 Paso 2: Desbloquear ZIP en tu Navegador`,
          value: `• Pulsa **🇪🇸 Abrir Panel Web (Español)**.
• Elige tu \`_secure.zip\`, pon tu clave y toca **🔓 Desbloquear**.
• Toca **💾 Recordar en mi Móvil** para guardarlo localmente.`,
        },
        {
          name: `🔹 Paso 3: Activar el Auto-Accept en RAM`,
          value: `• En el Paso 2 de la web, elige el tiempo y pulsa **▶️ ACTIVAR**.
• Cuando diga **🟢 En Línea**, ya puedes apagar la pantalla.`,
        },
        {
          name: `🔹 Paso 4: Jugar sin error de doble login`,
          value: `• Cuando quieras jugar, abre el juego en tu celular.
• El sistema pasará a **📱 En Espera** solo para no desconectarte.
• Al cerrar el juego, vuelve a la web y toca **▶️ ACTIVAR / REANUDAR**.`,
        },
        {
          name: `🔹 Paso 5: Cerrar Sesión y Borrar Datos`,
          value: `• Al terminar, pulsa **⏹️ CERRAR SESIÓN Y BORRAR DEL SERVIDOR** para limpiar la RAM.`,
        }
      )
      .setFooter({
        text: `Zenith Rise • Tus datos permanecen en tu almacenamiento local`,
      });

    return interaction.reply({ embeds: [guideEs], ephemeral: true });
  }

  if (interaction.customId === "runner_guide_en") {
    const guideEn = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setTitle(`🇺🇸 Step-by-Step Guide — Main Runner`)
      .setDescription(
        `🔒 **Important:** Your credentials **stay exclusively in your device's local storage** and once you log out **they are wiped from the server (0 bytes)**.`
      )
      .addFields(
        {
          name: `🔹 Step 1: Sync Your Phone (One-time setup)`,
          value: `• Open your \`_secure.zip\` on your phone with **ZArchiver**.
• Copy \`dc.bin\` inside and paste it into:
\`Android/data/jp.pokemon.pokemontcgp/files/dc.bin\`.
• This ensures your phone and \`.zip\` share the same key.`,
        },
        {
          name: `🔹 Step 2: Unlock ZIP Locally in Browser`,
          value: `• Click **🇺🇸 Open Web Panel (English)**.
• Select your \`_secure.zip\`, enter your password, and tap **🔓 Unlock**.
• Tap **💾 Save on Device** to keep it in local storage.`,
        },
        {
          name: `🔹 Step 3: Start Auto-Accept in RAM`,
          value: `• In Step 2 on the web, pick a duration and tap **▶️ START**.
• Once it shows **🟢 Online**, you can lock your phone screen.`,
        },
        {
          name: `🔹 Step 4: Play without double-login errors`,
          value: `• Whenever you want to play, just open the game on your phone.
• The server switches to **📱 Standby Mode** automatically.
• Once you close the game, return to the web and tap **▶️ START / RESUME**.`,
        },
        {
          name: `🔹 Step 5: Log Out & Wipe Server RAM`,
          value: `• When finished, tap **⏹️ LOG OUT & WIPE FROM SERVER RAM** to purge memory.`,
        }
      )
      .setFooter({
        text: `Zenith Rise • Your credentials stay in your local storage`,
      });

    return interaction.reply({ embeds: [guideEn], ephemeral: true });
  }

  if (interaction.customId === "runner_security_bilingual") {
    const secEmbed = new EmbedBuilder()
      .setColor(0x22c55e)
      .setTitle(`🛡️ Privacidad Zero-Storage / Zero-Storage Privacy`)
      .addFields(
        {
          name: `🇪🇸 ¿Cómo protegemos tu cuenta?`,
          value: `• **Desencriptación Local:** Tu \`_secure.zip\` (AES-256) se abre dentro de tu propio navegador.
• **Almacenamiento Local:** Tus datos se guardan solo en el \`localStorage\` de tu dispositivo.
• **Purga Total en RAM:** Al cerrar sesión, \`gc.collect()\` borra todo del servidor (0 bytes).`,
        },
        {
          name: `🇺🇸 How do we protect your account?`,
          value: `• **Client-Side Decryption:** Your \`_secure.zip\` (AES-256) is unlocked inside your browser.
• **Local Storage Only:** Credentials stay strictly in your browser's \`localStorage\`.
• **Full RAM Purge:** On log out, \`gc.collect()\` wipes all session data from RAM (0 bytes).`,
        }
      );

    return interaction.reply({ embeds: [secEmbed], ephemeral: true });
  }

  if (interaction.customId === "runner_status_btn") {
    await interaction.deferReply({ ephemeral: true });
    try {
      const res = await fetch(`${MAIN_RUNNER_URL}/api/public/stats`, {
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const s = await res.json();

      const stDesc = `• **Active Online Runners / En Línea:** \`${s.online_runners}\`
• **Standby Mode / En Espera:** \`${s.holding_runners}\`
• **Accepted Requests / Aceptadas:** \`${s.total_accepted}\`
• **Disk Storage / En Disco:** \`${s.storage_bytes_on_disk} bytes (Zero-Storage)\``;

      const statusEmbed = new EmbedBuilder()
        .setColor(0x22c55e)
        .setTitle(`🟢 Main Runner Server — Online 24/7`)
        .setDescription(stDesc)
        .setFooter({ text: `Railway Ephemeral RAM Engine` })
        .setTimestamp();

      return interaction.editReply({ embeds: [statusEmbed] });
    } catch (err) {
      return interaction.editReply
