const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  PermissionsBitField,
} = require("discord.js");

// 🔗 URL pública de tu servicio Main Runner en Railway (sin barra al final)
const MAIN_RUNNER_URL = (process.env.MAIN_RUNNER_URL || "https://tu-main-runner.up.railway.app").replace(/\/$/, "");

function registerMainRunnerModule(client) {
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

      // Fila 1: Enlaces directos a la Web en Español o en Inglés
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

      // Fila 2: Guías Paso a Paso interactivas (ES / EN), Privacidad y Estado en vivo
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

    // --- GUÍA PASO A PASO EN ESPAÑOL ---
    if (interaction.customId === "runner_guide_es") {
      const guideEs = new EmbedBuilder()
        .setColor(0x38bdf8)
        .setTitle("🇪🇸 Guía Paso a Paso — Cómo usar el Main Runner")
        .setDescription(
          "🔒 **Importante:** Tus credenciales **se quedan únicamente en el almacenamiento local de tu dispositivo (`localStorage`)** y en cuanto cierras sesión o expira el tiempo **se borran por completo del servidor (0 bytes)**."
        )
        .addFields(
          {
            name: "🔹 Paso 1: Sincronizar tu Teléfono (Solo la primera vez)",
            value:
              "• Abre tu archivo `_secure.zip` en tu móvil con **ZArchiver** ingresando tu contraseña.\n" +
              "• Copia el archivo `dc.bin` y pégalo en:\n" +
              "`Android/data/jp.pokemon.pokemontcgp/files/dc.bin` (usando ZArchiver + Shizuku o por cable USB desde PC).\n" +
              "• Así tu teléfono y tu archivo `.zip` compartirán la misma llave.",
          },
          {
            name: "🔹 Paso 2: Desbloquear tu ZIP en tu Navegador",
            value:
              "• Pulsa el botón **🇪🇸 Abrir Panel Web (Español)**.\n" +
              "• Selecciona tu archivo `_secure.zip`, escribe tu contraseña y toca **🔓 Desbloquear ZIP en mi Navegador**.\n" +
              "• *(Opcional)* Pulsa **💾 Recordar en mi Móvil** para guardarlo en tu almacenamiento local.",
          },
          {
            name: "🔹 Paso 3: Activar el Auto-Accept en RAM",
            value:
              "• En el Paso 2 de la web, elige la duración y pulsa **▶️ ACTIVAR / REANUDAR AHORA**.\n" +
              "• Cuando diga **🟢 En Línea**, ¡ya puedes apagar la pantalla de tu teléfono!",
          },
          {
            name: "🔹 Paso 4: Cómo jugar en tu teléfono sin error de doble login",
            value:
              "• Cuando quieras jugar, simplemente abre el juego en tu celular (o toca antes **📱 VOY A JUGAR**).\n" +
              "• El sistema detectará tu móvil y se pondrá en **📱 En Espera** automáticamente para no desconectarte.\n" +
              "• Al cerrar el juego, vuelve a la web y toca **▶️ ACTIVAR / REANUDAR AHORA**.",
          },
          {
            name: "🔹 Paso 5: Cerrar Sesión y Borrar Datos",
            value:
              "• Al terminar, pulsa **⏹️ CERRAR SESIÓN Y BORRAR DEL SERVIDOR** para destruir la sesión de la memoria RAM instantáneamente.",
          }
        )
        .setFooter({ text: "Zenith Rise • Tus datos permanecen bajo tu control local" });

      return interaction.reply({ embeds: [guideEs], ephemeral: true });
    }

    // --- STEP-BY-STEP GUIDE IN ENGLISH ---
    if (interaction.customId === "runner_guide_en") {
      const guideEn = new EmbedBuilder()
        .setColor(0x38bdf8)
        .setTitle("🇺🇸 Step-by-Step Guide — How to Use the Main Runner")
        .setDescription(
          "🔒 **Important:** Your credentials **stay exclusively in your device's local storage (`localStorage`)** and as soon as you log out or the timer expires, **they are completely wiped from the server (0 bytes)**."
        )
        .addFields(
          {
            name: "🔹 Step 1: Sync Your Phone (One-time setup)",
            value:
              "• Open your `_secure.zip` file on your phone using **ZArchiver** with your password.\n" +
              "• Copy the `dc.bin` file inside and paste it into:\n" +
              "`Android/data/jp.pokemon.pokemontcgp/files/dc.bin` (using ZArchiver + Shizuku or via USB cable from a PC).\n" +
              "• This ensures your phone and your `.zip` file share the exact same session key.",
          },
          {
            name: "🔹 Step 2: Unlock Your ZIP Locally in Browser",
            value:
              "• Click the **🇺🇸 Open Web Panel (English)** button.\n" +
              "• Select your `_secure.zip` file, type your password, and tap **🔓 Unlock ZIP in My Browser**.\n" +
              "• *(Optional)* Tap **💾 Save on Device** to keep your credentials in your browser's local storage.",
          },
          {
            name: "🔹 Step 3: Start Auto-Accept in RAM",
            value:
              "• In Step 2 of the web page, select your duration and tap **▶️ START / RESUME NOW**.\n" +
              "• Once it shows **🟢 Online**, you can lock your phone screen!",
          },
          {
            name: "🔹 Step 4: How to play on your phone without double-login errors",
            value:
              "• Whenever you want to play, simply open the game on your phone (or tap **📱 I'M GOING TO PLAY** first).\n" +
              "• The server will detect your phone and switch to **📱 Standby Mode** automatically so your game is never interrupted.\n" +
              "• Once you close the game, return to the web page and tap **▶️ START / RESUME NOW**.",
          },
          {
            name: "🔹 Step 5: Log Out & Wipe Server RAM",
            value:
              "• When finished, tap **⏹️ LOG OUT & WIPE FROM SERVER RAM** to immediately purge your session from memory.",
          }
        )
        .setFooter({ text: "Zenith Rise • Your credentials never leave your local control" });

      return interaction.reply({ embeds: [guideEn], ephemeral: true });
    }

    // --- EXPLICACIÓN DE PRIVACIDAD BILINGÜE ---
    if (interaction.customId === "runner_security_bilingual") {
      const secEmbed = new EmbedBuilder()
        .setColor(0x22c55e)
        .setTitle("🛡️ Privacidad Zero-Storage / Zero-Storage Privacy")
        .addFields(
          {
            name: "🇪🇸 ¿Cómo protegemos tu cuenta?",
            value:
              "• **Desencriptación Local:** Tu `_secure.zip` (AES-256) se abre dentro de tu propio navegador. Ni el archivo ZIP ni su contraseña se suben al servidor.\n" +
              "• **Almacenamiento Local:** Tus credenciales se guardan solo en el `localStorage` de tu teléfono/PC.\n" +
              "• **Purga Total en RAM:** Al cerrar sesión, el recolector de memoria (`gc.collect()`) borra todos los datos del servidor dejando **0 bytes**.",
          },
          {
            name: "🇺🇸 How do we protect your account?",
            value:
              "• **Client-Side Decryption:** Your `_secure.zip` (AES-256) is unlocked inside your own browser. Neither the ZIP file nor your password is ever uploaded to the server.\n" +
              "• **Local Storage Only:** Your credentials remain strictly in your browser's `localStorage`.\n" +
              "• **Full RAM Purge:** When you log out, garbage collection (`gc.collect()`) wipes all session data from server RAM leaving **0 bytes**.",
          }
        );

      return interaction.reply({ embeds: [secEmbed], ephemeral: true });
    }

    // --- ESTADO EN VIVO (BILINGÜE) ---
    if (interaction.customId === "runner_status_btn") {
      await interaction.deferReply({ ephemeral: true });
      try {
        const res = await fetch(`${MAIN_RUNNER_URL}/api/public/stats`, {
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const stats = await res.json();

        const statusEmbed = new EmbedBuilder()
          .setColor(0x22c55e)
          .setTitle("🟢 Main Runner Server — Online 24/7 (ES / EN)")
          .setDescription(
            `• **Active Online Runners / En Línea:** \`${stats.online_runners}\`\n` +
            `• **Standby Mode (Playing) / En Espera:** \`${stats.holding_runners}\`\n` +
            `• **Accepted Requests / Solicitudes Aceptadas:** \`${stats.total_accepted}\`\n` +
            `• **Disk Storage / Guardado en Disco:** \`${stats.storage_bytes_on_disk} bytes (Zero-Storage)\``
          )
          .setFooter({ text: "Railway Ephemeral RAM Engine" })
          .setTimestamp();

        return interaction.editReply({ embeds: [statusEmbed] });
      } catch (err) {
        return interaction.editReply({
          content: `⚠️ Server URL: ${MAIN_RUNNER_URL}\n🇪🇸 El servidor está reiniciando o actualizándose.\n🇺🇸 The server is currently restarting or updating.`,
        });
      }
    }
  });
}

module.exports = { registerMainRunnerModule };
