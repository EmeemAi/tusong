(function () {
  const cfg = window.TUSONG_CONFIG || {};

  function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  // --- Audio & Video Coordination ---
  const heroVideo = document.getElementById("heroVideo");
  const audioPlayers = ["demo1", "demo2"].map((id) => ({
    id,
    audio: document.getElementById(`audio-${id}`),
    card: document.querySelector(`[data-audio-card="${id}"]`),
    btn: document.querySelector(`[data-play-btn="${id}"]`),
    range: document.querySelector(`[data-range="${id}"]`),
    time: document.querySelector(`[data-time="${id}"]`),
  }));

  function pauseAllAudio(exceptId) {
    audioPlayers.forEach((p) => {
      if (p.id !== exceptId && p.audio && !p.audio.paused) {
        p.audio.pause();
      }
    });
  }

  if (heroVideo) {
    heroVideo.addEventListener("play", () => pauseAllAudio(null));
  }

  audioPlayers.forEach((p) => {
    if (!p.audio) return;

    const updateUI = () => {
      const dur = p.audio.duration || 0;
      const cur = p.audio.currentTime || 0;
      p.time.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
      if (dur > 0) {
        p.range.value = String(Math.round((cur / dur) * 100));
      }
    };

    p.audio.addEventListener("loadedmetadata", updateUI);
    p.audio.addEventListener("timeupdate", updateUI);

    p.audio.addEventListener("play", () => {
      pauseAllAudio(p.id);
      if (heroVideo && !heroVideo.paused) heroVideo.pause();
      p.btn.textContent = "❚❚";
      p.card.classList.add("is-playing");
    });

    p.audio.addEventListener("pause", () => {
      p.btn.textContent = "▶";
      p.card.classList.remove("is-playing");
    });

    p.audio.addEventListener("ended", () => {
      p.btn.textContent = "▶";
      p.card.classList.remove("is-playing");
      p.range.value = "0";
    });

    p.btn.addEventListener("click", () => {
      if (p.audio.paused) {
        p.audio.play().catch(() => {});
      } else {
        p.audio.pause();
      }
    });

    p.range.addEventListener("input", () => {
      const dur = p.audio.duration || 0;
      if (dur > 0) {
        p.audio.currentTime = (Number(p.range.value) / 100) * dur;
      }
    });
  });

  // --- Song Builder State & Live Preview ---
  const state = {
    occasion: "Aniversario / Pareja",
  };

  const els = {
    occasionChips: document.querySelectorAll("#occasionChips .chip-btn"),
    recipientName: document.getElementById("recipientName"),
    senderName: document.getElementById("senderName"),
    musicStyle: document.getElementById("musicStyle"),
    voiceType: document.getElementById("voiceType"),
    memories: document.getElementById("memories"),
    finalMessage: document.getElementById("finalMessage"),
    clientEmail: document.getElementById("clientEmail"),
    prevOccasion: document.getElementById("prevOccasion"),
    prevRecipient: document.getElementById("prevRecipient"),
    prevStyle: document.getElementById("prevStyle"),
    prevVoice: document.getElementById("prevVoice"),
    fillExampleBtn: document.getElementById("fillExampleBtn"),
    paypalDirectBtn: document.getElementById("paypalDirectBtn"),
    paypalContainer: document.getElementById("paypal-button-container"),
    sendChatBtn: document.getElementById("sendChatBtn"),
    checkoutStatus: document.getElementById("checkoutStatus"),
    priceNowDisplay: document.getElementById("priceNowDisplay"),
    priceOldDisplay: document.getElementById("priceOldDisplay"),
  };

  if (cfg.priceDisplay && els.priceNowDisplay) {
    els.priceNowDisplay.textContent = cfg.priceDisplay;
  }
  if (cfg.originalPriceDisplay && els.priceOldDisplay) {
    els.priceOldDisplay.textContent = cfg.originalPriceDisplay;
  }

  function syncPreview() {
    els.prevOccasion.textContent = state.occasion;
    els.prevRecipient.textContent = els.recipientName.value.trim() || "Por definir";
    els.prevStyle.textContent = els.musicStyle.value;
    els.prevVoice.textContent = els.voiceType.value;
  }

  els.occasionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      els.occasionChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.occasion = chip.dataset.value || chip.textContent.trim();
      syncPreview();
    });
  });

  [els.recipientName, els.musicStyle, els.voiceType].forEach((input) => {
    input.addEventListener("input", syncPreview);
    input.addEventListener("change", syncPreview);
  });

  if (els.fillExampleBtn) {
    els.fillExampleBtn.addEventListener("click", () => {
      if (!els.recipientName.value.trim()) els.recipientName.value = "Laura (mi pareja)";
      if (!els.senderName.value.trim()) els.senderName.value = "Carlos";
      els.memories.value =
        "Nos conocimos bajo la lluvia en Madrid hace 4 años, la llamo 'Mi pequeña', siempre cantamos en el coche rumbo a la playa y nos encanta tomar café juntos los domingos por la mañana.";
      els.finalMessage.value =
        "Quiero darle las gracias por estos 4 años y decirle que quiero caminar toda la vida a su lado.";
      syncPreview();
    });
  }

  function buildBriefText() {
    const recipient = els.recipientName.value.trim() || "(sin especificar)";
    const sender = els.senderName.value.trim() || "(sin especificar)";
    const memories = els.memories.value.trim() || "(sin especificar)";
    const finalMsg = els.finalMessage.value.trim() || "(sin especificar)";
    const contact = els.clientEmail.value.trim() || "(sin especificar)";

    return [
      `🎵 *Nuevo Pedido TuSong (${cfg.priceDisplay || "35 €"})*`,
      `• *Ocasión:* ${state.occasion}`,
      `• *Para:* ${recipient}`,
      `• *De parte de:* ${sender}`,
      `• *Estilo:* ${els.musicStyle.value}`,
      `• *Voz:* ${els.voiceType.value}`,
      `• *Recuerdos:* ${memories}`,
      `• *Mensaje final:* ${finalMsg}`,
      `• *Contacto entrega:* ${contact}`,
    ].join("\n");
  }

  function validateBrief() {
    if (!els.recipientName.value.trim() || !els.memories.value.trim() || !els.clientEmail.value.trim()) {
      showStatus(
        "Por favor completa al menos el nombre de la persona, tus recuerdos reales y tu WhatsApp o correo para poder enviarte la canción.",
        true
      );
      if (!els.recipientName.value.trim()) {
        els.recipientName.focus();
      } else if (!els.memories.value.trim()) {
        els.memories.focus();
      } else {
        els.clientEmail.focus();
      }
      return false;
    }
    return true;
  }

  function showStatus(msg, isWarning) {
    els.checkoutStatus.textContent = msg;
    els.checkoutStatus.style.background = isWarning
      ? "rgba(244, 162, 54, 0.22)"
      : "rgba(34, 197, 94, 0.2)";
    els.checkoutStatus.style.borderColor = isWarning
      ? "rgba(244, 162, 54, 0.5)"
      : "rgba(34, 197, 94, 0.45)";
    els.checkoutStatus.style.color = isWarning ? "#fef3c7" : "#d1fae5";
    els.checkoutStatus.classList.add("show");
  }

  function openChatWithBrief(prefixNote) {
    const brief = buildBriefText();
    const fullText = prefixNote ? `${prefixNote}\n\n${brief}` : brief;

    if (cfg.whatsappNumber) {
      const waUrl = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(fullText)}`;
      window.open(waUrl, "_blank", "noopener");
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }
    showStatus(
      "¡Tu ficha musical fue copiada! Se abrirá Messenger: solo pega el mensaje en el chat para que Dario reciba tu historia.",
      false
    );
    setTimeout(() => {
      window.open(cfg.messengerUrl || "https://m.me/584160754786937", "_blank", "noopener");
    }, 650);
  }

  // --- Embedded PayPal SDK or Direct PayPal Link ---
  if (cfg.paypalClientId) {
    els.paypalDirectBtn.style.display = "none";
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      cfg.paypalClientId
    )}&currency=EUR`;
    script.onload = () => {
      if (!window.paypal) return;
      window.paypal
        .Buttons({
          style: { layout: "vertical", shape: "pill", label: "pay" },
          onClick: (data, actions) => {
            if (!validateBrief()) {
              return actions.reject();
            }
            return actions.resolve();
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: `TuSong - Canción personalizada (${state.occasion})`,
                  amount: { currency_code: "EUR", value: cfg.priceEur || "35.00" },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(() => {
              showStatus(
                "¡Pago confirmado con éxito! Ahora envía tu ficha por chat para iniciar la producción inmediata.",
                false
              );
              openChatWithBrief("✅ ¡Pago realizado por PayPal!");
            });
          },
          onError: () => {
            showStatus(
              "Hubo un problema al abrir PayPal. Puedes usar el botón de chat para enviarnos tu idea.",
              true
            );
          },
        })
        .render("#paypal-button-container");
    };
    document.body.appendChild(script);
  } else {
    els.paypalDirectBtn.addEventListener("click", () => {
      if (!validateBrief()) return;
      try {
        localStorage.setItem("tusong_last_brief", buildBriefText());
      } catch (_) {}
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(buildBriefText()).catch(() => {});
      }
      showStatus(
        "¡Ficha guardada! Abriendo PayPal seguro (35 €). Al terminar, envíanos la ficha por el botón de chat.",
        false
      );
      window.open(cfg.paypalPaymentUrl, "_blank", "noopener");
    });
  }

  els.sendChatBtn.addEventListener("click", () => {
    if (!validateBrief()) return;
    openChatWithBrief("");
  });

  // --- Floating Assistant Drawer ---
  const fab = document.getElementById("assistantFab");
  const drawer = document.getElementById("assistantDrawer");
  const closeBtn = document.getElementById("assistantClose");
  const messagesBox = document.getElementById("assistantMessages");
  const quickChips = document.querySelectorAll(".quick-chip");

  const answers = {
    precio:
      "El precio promocional de lanzamiento en España es de <strong>35 €</strong> (todo incluido). Puedes pagar con tu cuenta PayPal o directamente con tu tarjeta Visa/Mastercard como invitado sin registrarte.",
    tiempo:
      "La producimos y te la entregamos en <strong>24 a 48 horas</strong> lista para escuchar y dedicar, junto con la letra en PDF.",
    cambios:
      "¡Sí! Incluye <strong>1 ajuste menor sin costo</strong> para asegurarnos de que nombres, pronunciación y frase queden perfectos.",
    hablar:
      "¡Claro! Si ya completaste tu historia arriba, toca el botón <em>Enviar mi ficha por Chat</em>. O si prefieres escribirnos directo ahora, abre nuestro chat oficial.",
  };

  function toggleDrawer(open) {
    const shouldOpen = typeof open === "boolean" ? open : !drawer.classList.contains("open");
    drawer.classList.toggle("open", shouldOpen);
    fab.setAttribute("aria-expanded", String(shouldOpen));
  }

  fab.addEventListener("click", () => toggleDrawer());
  closeBtn.addEventListener("click", () => toggleDrawer(false));

  quickChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.q;
      const userMsg = document.createElement("div");
      userMsg.className = "msg-bubble msg-user";
      userMsg.textContent = chip.textContent;
      messagesBox.appendChild(userMsg);

      const botMsg = document.createElement("div");
      botMsg.className = "msg-bubble msg-bot";
      botMsg.innerHTML = answers[key] || "Escríbenos y te ayudamos enseguida.";
      messagesBox.appendChild(botMsg);

      if (key === "hablar") {
        const linkBtn = document.createElement("a");
        linkBtn.href = cfg.whatsappNumber
          ? `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(
              "Hola! Tengo una consulta sobre una canción personalizada de TuSong."
            )}`
          : cfg.messengerUrl || "https://m.me/584160754786937";
        linkBtn.target = "_blank";
        linkBtn.rel = "noopener";
        linkBtn.className = "btn btn-primary btn-sm";
        linkBtn.style.marginTop = "6px";
        linkBtn.textContent = cfg.whatsappNumber ? "Abrir WhatsApp ↗" : "Abrir Messenger ↗";
        messagesBox.appendChild(linkBtn);
      }

      messagesBox.scrollTop = messagesBox.scrollHeight;
    });
  });

  syncPreview();
})();
