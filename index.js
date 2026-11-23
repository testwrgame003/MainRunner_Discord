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
    return msg.reply("❌ Solo administradores / Admins only.");
  }

  await msg.delete().catch(() => {});

  const mainEmbed = new EmbedBuilder()
    .setColor(0x0ea5e9)
    .setTitle("⚡ Zenith Main Runner 24/7")
    .setDescription(
      "🇪🇸 **Panel nube para tu cuenta Main** con protección **Anti-Ban (Sigilo Emulador)**, credenciales locales y sincronización automática con Discord.\n" +
      "🇺🇸 **Cloud runner for your Main account** with **Anti-Ban (Emulator Stealth)**, local credentials, and automatic Discord sync."
    )
    .setFooter({ text: "Zenith Rise • Sigilo Emulador + IP Residencial • Local AES-256" });

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("🇪🇸 Abrir Panel Web (ES)")
      .setStyle(ButtonStyle.Link)
      .setURL(MAIN_RUNNER_URL + "/?lang=es"),
    new ButtonBuilder()
      .setLabel("🇺🇸 Open Web Panel (EN)")
      .setStyle(ButtonStyle.Link)
      .setURL(MAIN_RUNNER_URL + "/?lang=en")
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("features_info")
      .setLabel("✨ Funciones / Features")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("guide_es")
      .setLabel("📖 Guía (ES)")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("guide_en")
      .setLabel("📖 Guide (EN)")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("sec_info")
      .setLabel("🛡️ Anti-Ban")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("live_st")
      .setLabel("📊 Status")
      .setStyle(ButtonStyle.Success)
  );

  await msg.channel.send({ embeds: [mainEmbed], components: [row1, row2] });
});

client.on(Events.InteractionCreate, async (i) => {
  if (!i.isButton()) return;

  // ===================== FUNCIONES INCLUIDAS (DESPLEGABLE) =====================
  if (i.customId === "features_info") {
    const emb = new EmbedBuilder()
      .setColor(0x0ea5e9)
      .setTitle("✨ Funciones Incluidas / Included Features")
      .addFields(
        {
          name: "🇪🇸 Español",
          value:
            "• 🤝 **Auto-Accept:** Tandas estilo emulador + estado Online automático en Discord.\n" +
            "• ✨ **Radar GP (Manual):** Revisa tus Elecciones Mágicas sin gastar energía, verifica si es un God Pack real y te da el tiempo restante, imagen y link al post.\n" +
            "• 🧪 **GP Test VIP:** Limpieza segura 1 a 1 conservando la lista VIP y tus IDs Protegidas.\n" +
            "• ⏰ **Horario UTC:** Encendido diario automático + apagado Pre-Reset (`05:45 UTC`).\n" +
            "• 🔒 **Privacidad Local:** Tus credenciales quedan guardadas en tu propio navegador.",
          inline: false,
        },
        {
          name: "🇺🇸 English",
          value:
            "• 🤝 **Auto-Accept:** Emulator-paced batches + automatic Discord Online sync.\n" +
            "• ✨ **GP Radar (Manual):** Checks Wonder Picks without spending stamina, verifies true God Packs, and shows time remaining, image & forum link.\n" +
            "• 🧪 **VIP GP Test:** Safe 1-by-1 cleanup keeping VIPs and your Protected IDs.\n" +
            "• ⏰ **UTC Schedule:** Daily auto-start + Pre-Reset cutoff (`05:45 UTC`).\n" +
            "• 🔒 **Local Privacy:** Your credentials stay stored locally in your browser.",
          inline: false,
        },
        {
          name: "📦 Primer Paso / First Step",
          value:
            "🇪🇸 Ejecuta `CloneMain.ahk` dentro de tu carpeta `accounts` para crear tu `_secure.zip` y luego abre el Panel Web.\n" +
            "🇺🇸 Run `CloneMain.ahk` inside your `accounts` folder to create your `_secure.zip`, then open the Web Panel.",
          inline: false,
        }
      )
      .setFooter({ text: "Zenith Rise • Pulsa Guía (ES/EN) para el tutorial paso a paso" });

    return i.reply({ embeds: [emb], ephemeral: true });
  }

  // ===================== GUÍA COMPLETA (ESPAÑOL) =====================
  if (i.customId === "guide_es") {
    const emb = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setTitle("🇪🇸 Guía Completa — Zenith Main Runner")
      .setDescription(
        "🔒 **Tus credenciales se guardan de forma local en tu navegador (`localStorage`).** Tu archivo `_secure.zip` se descifra en tu propio dispositivo y nunca se sube al servidor."
      )
      .addFields(
        {
          name: "1️⃣ Clonar tu cuenta (Solo la primera vez)",
          value:
            "• Ve a tu carpeta `accounts` y ejecuta **`CloneMain.ahk`** *(requiere 7-Zip instalado)*.\n" +
            "• Elige tu instancia de MuMu, escribe un nombre sin espacios y una contraseña.\n" +
            "• Pulsa **Clone ZIP**: creará `<nombre>_secure.zip` cifrado con AES-256 **sin cerrar el juego ni borrar tu cuenta del emulador**.\n" +
            "• *(Opcional móvil)* Si también juegas en teléfono, copia el `dc.bin` del ZIP a `Android/data/jp.pokemon.pokemontcgp/files/dc.bin`.",
        },
        {
          name: "2️⃣ Configurar Paso 1 en el Panel Web",
          value:
            "• Abre **🇪🇸 Abrir Panel Web (ES)**, carga tu `_secure.zip`, ingresa tu contraseña y toca **🔓 Desbloquear y Guardar**.\n" +
            "• Escribe tu **ID de 16 dígitos** y elige tu grupo (**Elite Four** o **Gym Leader**).\n" +
            "• Selecciona tu **País** *(IP Residencial)* y el **Dispositivo Virtual** que coincida con tu emulador o teléfono.",
        },
        {
          name: "3️⃣ Control en Vivo y Modo Espera",
          value:
            "• **▶️ PONER ONLINE:** Acepta solicitudes automáticamente y te marca Online en Discord *(se mantiene conectado incluso si actualizamos el servidor)*.\n" +
            "• **📱 VOY A JUGAR:** Pausa la sesión para que juegues tranquilo. Si olvidas pulsarlo y abres el juego, el sistema se pausará solo.\n" +
            "• **⏹️ APAGAR SESIÓN:** Te pone Offline al instante.",
        },
        {
          name: "4️⃣ ✨ Revisar Elecciones Mágicas (Radar GP)",
          value:
            "• Función **100% manual** (solo se ejecuta cuando pulsas el botón; tiene espera de 60s).\n" +
            "• Revisa tus Elecciones Mágicas **sin gastar energía**, valida si es un **God Pack real** *(distinguiéndolo de sobres normales en cuentas `[2P]`)*, te muestra el **tiempo restante**, la **imagen** y el **link directo al post en Discord**.",
        },
        {
          name: "5️⃣ 🧪 GP Test VIP y ⏰ Horario Automático (UTC)",
          value:
            "• **IDs Protegidas:** Agrega las IDs de 16 dígitos que nunca quieres borrar (amigos reales o cuentas propias).\n" +
            "• **GP Test:** Elimina amigos no-VIP respetando pausas seguras. Puedes lanzarlo manual o activar **Auto GP Test** (por límite de amigos y antes del reset).\n" +
            "• **Horario UTC (Paso 4):** Programa tu hora diaria de inicio y apagado. A las **05:45 UTC** (15m antes del reset) todo se apaga automáticamente.",
        }
      )
      .setFooter({ text: "Zenith Rise • Usa '🗑️ Apagar Todo y Borrar Datos' cuando quieras limpiar tu navegador" });

    return i.reply({ embeds: [emb], ephemeral: true });
  }

  // ===================== COMPLETE GUIDE (ENGLISH) =====================
  if (i.customId === "guide_en") {
    const emb = new EmbedBuilder()
      .setColor(0x38bdf8)
      .setTitle("🇺🇸 Complete Guide — Zenith Main Runner")
      .setDescription(
        "🔒 **Your credentials stay stored locally in your browser (`localStorage`).** Your `_secure.zip` is decrypted client-side on your own device and is never uploaded."
      )
      .addFields(
        {
          name: "1️⃣ Clone Your Account (First-time setup)",
          value:
            "• Open your `accounts` folder and run **`CloneMain.ahk`** *(requires 7-Zip installed)*.\n" +
            "• Select your MuMu instance, enter a file name (no spaces), and set a ZIP password.\n" +
            "• Click **Clone ZIP**: it creates an AES-256 `<name>_secure.zip` **without closing the game or deleting your account from MuMu**.\n" +
            "• *(Optional mobile)* If you also play on Android, copy `dc.bin` from the ZIP to `Android/data/jp.pokemon.pokemontcgp/files/dc.bin`.",
        },
        {
          name: "2️⃣ Configure Step 1 in the Web Panel",
          value:
            "• Open **🇺🇸 Open Web Panel (EN)**, pick your `_secure.zip`, enter your password, and tap **🔓 Unlock & Save**.\n" +
            "• Enter your **16-digit Main ID** and choose your group (**Elite Four** or **Gym Leader**).\n" +
            "• Pick your **Country** *(Residential IP)* and select the **Virtual Device** matching your emulator or phone.",
        },
        {
          name: "3️⃣ Live Control & Standby Mode",
          value:
            "• **▶️ GO ONLINE NOW:** Auto-accepts friend requests and marks you Online in Discord *(stays Online seamlessly through server updates)*.\n" +
            "• **📱 I'M GOING TO PLAY:** Pauses the runner so you can play safely. If you open the game directly, Smart-Yield pauses it automatically.\n" +
            "• **⏹️ STOP SESSION:** Disconnects and marks you Offline immediately.",
        },
        {
          name: "4️⃣ ✨ Check Wonder Picks (GP Radar)",
          value:
            "• **100% manual** on-demand button (60s cooldown).\n" +
            "• Checks your Wonder Pick board **without spending stamina**, verifies **true God Packs** *(filtering out pre-GP normal packs on `[2P]` accounts)*, and shows **time remaining**, **card image**, and a **direct Discord forum link**.",
        },
        {
          name: "5️⃣ 🧪 VIP GP Test & ⏰ Auto Schedule (UTC)",
          value:
            "• **Protected IDs:** Add 16-digit IDs that must never be removed (friends or alt accounts).\n" +
            "• **GP Test:** Removes non-VIP friends at a safe emulator pace. Run it manually or enable **Auto GP Test** (by friend limit & pre-reset).\n" +
            "• **UTC Schedule (Step 4):** Set daily auto start/stop times. At **05:45 UTC** (15m before reset) all runners shut down automatically.",
        }
      )
      .setFooter({ text: "Zenith Rise • Use '🗑️ Stop All & Wipe Data' anytime to clear your browser" });

    return i.reply({ embeds: [emb], ephemeral: true });
  }

  // ===================== SEGURIDAD, PRIVACIDAD & ANTI-BAN =====================
  if (i.customId === "sec_info") {
    const emb = new EmbedBuilder()
      .setColor(0x22c55e)
      .setTitle("🛡️ Seguridad Local y Protecciones Anti-Ban (ES / EN)")
      .addFields(
        {
          name: "🇪🇸 Privacidad Local de Credenciales",
          value:
            "• **Descifrado 100% en tu navegador:** Ni tu `_secure.zip` (AES-256) ni su contraseña se envían al servidor.\n" +
            "• **Almacenamiento local:** Tus datos se quedan guardados en tu dispositivo (`localStorage`) para que no tengas que subir el ZIP cada día.\n" +
            "• **Control total:** Al pulsar **Apagar Todo y Borrar Datos**, se detiene tu sesión y se limpia cualquier dato temporal o horario cifrado.",
        },
        {
          name: "🇪🇸 Mejoras Anti-Ban (Sigilo Emulador)",
          value:
            "• **IP Residencial por País (Sticky 120m):** Cada cuenta usa su propio puerto residencial pegajoso en lugar de IPs de datacenter compartidas.\n" +
            "• **Dispositivo Virtual Coherente:** Simula el modelo Android que elijas con secuencia de inicio y telemetría real.\n" +
            "• **Ritmo de Emulador:** Acepta en tandas de ~10 con pausas naturales de recarga y borra en GP Test respetando la ventana segura de **9 bajas / 5 min**.\n" +
            "• **Smart-Yield:** Si abres el juego, cede la sesión automáticamente sin conflictos.",
        },
        {
          name: "🇺🇸 Local Credential Privacy",
          value:
            "• **100% Client-Side Decryption:** Neither your `_secure.zip` (AES-256) nor its password is ever uploaded.\n" +
            "• **Local Storage:** Credentials remain saved in your device's browser (`localStorage`).\n" +
            "• **Full Control:** Tapping **Stop All & Wipe Data** halts your session and purges any temporary/scheduled encrypted state.",
        },
        {
          name: "🇺🇸 Anti-Ban Hardening (Emulator Stealth)",
          value:
            "• **Country Residential Sticky IP (120m):** Dedicated sticky residential port per account instead of shared datacenter IPs.\n" +
            "• **Consistent Virtual Device:** Matches your chosen Android model with realistic login & telemetry.\n" +
            "• **Emulator Pacing:** Accepts in ~10-request batches with natural refresh delays, and caps GP Test deletions at **9 ops / 5 min**.\n" +
            "• **Smart-Yield:** Automatically yields if you open the game to avoid login conflicts.",
        }
      )
      .setFooter({ text: "Zenith Rise • Always-On Stealth Architecture" });

    return i.reply({ embeds: [emb], ephemeral: true });
  }

// ===================== LIVE SERVER STATUS =====================
  if (i.customId === "live_st") {
    await i.deferReply({ ephemeral: true });
    try {
      const r = await fetch(MAIN_RUNNER_URL + "/api/public/stats?include_users=1", {
        signal: AbortSignal.timeout(6000),
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const s = await r.json();

      const hrs = Math.floor((s.seconds_until_cutoff || 0) / 3600);
      const mins = Math.floor(((s.seconds_until_cutoff || 0) % 3600) / 60);
      const cutoffText = s.in_pre_reset_cutoff
        ? "🛑 ACTIVO (05:45 - 06:00 UTC)"
        : `${hrs}h ${mins}m (05:45 UTC)`;

      const netBadge = s.dataimpulse_enabled
        ? "🌐 Residencial Sticky 120m"
        : "⚪ Directo";

      const usersList = Array.isArray(s.online_users) ? s.online_users : [];
      let onlineText = "— Ninguno / None";
      if (usersList.length > 0) {
        let acc = "";
        let shown = 0;
        for (const u of usersList) {
          const icon = u.state === "gp_test" ? "🧪" : "🟢";
          const grp = u.group ? ` \`${u.group.replace("_", " ")}\`` : "";
          const secTag = u.is_sec ? " *(Sec)*" : "";
          const label = u.discord_id ? `<@${u.discord_id}>` : `**${u.name}**`;
          const line = `${icon} ${label}${secTag}${grp}\n`;
          if ((acc + line).length > 960) break;
          acc += line;
          shown++;
        }
        const extra = usersList.length - shown;
        onlineText = acc.trim() + (extra > 0 ? `\n*...y ${extra} más*` : "");
      }

      const emb = new EmbedBuilder()
        .setColor(s.in_pre_reset_cutoff ? 0xef4444 : 0x22c55e)
        .setTitle("🟢 Zenith Main Runner — Live Status")
        .addFields(
          {
            name: "📡 Actividad / Activity",
            value:
              `• **Online / En Línea:** \`${s.online_runners ?? 0}\`\n` +
              `• **Standby / En Espera:** \`${s.holding_runners ?? 0}\`\n` +
              `• **GP Test Activos:** \`${s.gp_testing_runners ?? 0}\`\n` +
              `• **Horarios / Scheduled:** \`${s.scheduled_runners ?? 0}\``,
            inline: true,
          },
          {
            name: "🛡️ Sistema / System",
            value:
              `• **Aceptadas / Accepted:** \`${s.total_accepted ?? 0}\`\n` +
              `• **Modo:** \`Sigilo Emulador\`\n` +
              `• **Red / Proxy:** \`${netBadge}\`\n` +
              `• **Pre-Reset:** \`${cutoffText}\``,
            inline: true,
          },
          {
            name: `👥 Usuarios Online (${usersList.length})`,
            value: onlineText,
            inline: false,
          }
        )
        .setFooter({ text: "Zenith Rise • Zero-Downtime Cloud Runner" })
        .setTimestamp();

      return i.editReply({ embeds: [emb] });
    } catch (e) {
      return i.editReply(
        `⚠️ **Main Runner:** ${MAIN_RUNNER_URL}\n🇪🇸 El servidor se está actualizando o reiniciando.\n🇺🇸 The server is currently updating or restarting.`
      );
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("Falta DISCORD_TOKEN");
  process.exit(1);
}
client.login(token);
