(function () {
  const cfg = window.TUSONG_CONFIG || {};

  function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  // --- Audio & Video Coordination (4 Samples + Video Reel) ---
  const heroVideo = document.getElementById("heroVideo");
  const audioPlayers = ["demo1", "demo2", "demo3", "demo4"].map((id) => ({
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

  // --- App State (100% Argentina) ---
  const state = {
    step: 1,
    occasion: "Aniversario / Pareja",
    style: "Balada acústica",
    voice: "Voz masculina",
  };

  const els = {
    priceOldDisplay: document.getElementById("priceOldDisplay"),
    priceNowDisplay: document.getElementById("priceNowDisplay"),
    headerCtaBtn: document.getElementById("headerCtaBtn"),
    heroCtaBtn: document.getElementById("heroCtaBtn"),
    mpDirectBtn: document.getElementById("mpDirectBtn"),
    aliasBox: document.getElementById("aliasBox"),
    aliasText: document.getElementById("aliasText"),
    aliasAmountText: document.getElementById("aliasAmountText"),
    copyAliasBtn: document.getElementById("copyAliasBtn"),
    sendChatBtn: document.getElementById("sendChatBtn"),
    checkoutStatus: document.getElementById("checkoutStatus"),

    panes: document.querySelectorAll(".step-pane"),
    stepCounter: document.getElementById("stepCounter"),
    stepperProgress: document.getElementById("stepperProgress"),
    occasionBtns: document.querySelectorAll("#occasionGrid .stepper-option"),
    occasionFeedback: document.getElementById("occasionFeedback"),
    styleBtns: document.querySelectorAll("#styleChips .chip-btn"),
    voiceBtns: document.querySelectorAll("#voiceChips .chip-btn"),
    recipientName: document.getElementById("recipientName"),
    senderName: document.getElementById("senderName"),
    memories: document.getElementById("memories"),
    clientEmail: document.getElementById("clientEmail"),
    clientWhatsapp: document.getElementById("clientWhatsapp"),
    fillExampleBtn: document.getElementById("fillExampleBtn"),

    prevOccasion: document.getElementById("prevOccasion"),
    prevRecipient: document.getElementById("prevRecipient"),
    prevStyle: document.getElementById("prevStyle"),
    prevVoice: document.getElementById("prevVoice"),
  };

  const priceText = cfg.priceDisplay || "$14.750";

  function applyPriceUI() {
    if (els.priceNowDisplay) els.priceNowDisplay.textContent = priceText;
    if (els.priceOldDisplay) {
      els.priceOldDisplay.textContent = cfg.priceOldDisplay || "";
      els.priceOldDisplay.style.display = cfg.priceOldDisplay ? "block" : "none";
    }
    if (els.headerCtaBtn) els.headerCtaBtn.textContent = `🎵 Crear mi canción · ${priceText}`;
    if (els.heroCtaBtn) els.heroCtaBtn.textContent = `🎵 Crear mi canción — ${priceText}`;
    if (els.mpDirectBtn) els.mpDirectBtn.textContent = `💳 Pagar con Mercado Pago (${priceText})`;
    if (els.aliasAmountText) els.aliasAmountText.textContent = `${priceText} ARS`;
    if (els.aliasText) els.aliasText.textContent = cfg.aliasMercadoPago || "tusong.oficial";
  }

  // --- Stepper Navigation & Preview ---
  function syncPreview() {
    if (els.prevOccasion) els.prevOccasion.textContent = state.occasion;
    if (els.prevRecipient) els.prevRecipient.textContent = els.recipientName.value.trim() || "Por definir";
    if (els.prevStyle) els.prevStyle.textContent = state.style;
    if (els.prevVoice) els.prevVoice.textContent = state.voice;
  }

  function goToStep(stepNum) {
    state.step = Math.max(1, Math.min(4, Number(stepNum)));
    els.panes.forEach((pane) => {
      pane.classList.toggle("active", Number(pane.dataset.step) === state.step);
    });
    if (els.stepCounter) {
      els.stepCounter.textContent = state.step === 4 ? "¡Paso 4 de 4 · Listo para enviar!" : `Paso ${state.step} de 4`;
    }
    if (els.stepperProgress) {
      els.stepperProgress.style.width = `${state.step * 25}%`;
    }
    syncPreview();
  }

  document.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => goToStep(btn.dataset.next));
  });

  document.querySelectorAll("[data-prev]").forEach((btn) => {
    btn.addEventListener("click", () => goToStep(btn.dataset.prev));
  });

  els.occasionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.occasionBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.occasion = btn.dataset.value || "Aniversario / Pareja";
      if (els.occasionFeedback && btn.dataset.reply) {
        els.occasionFeedback.textContent = btn.dataset.reply;
      }
      syncPreview();
      setTimeout(() => goToStep(2), 180);
    });
  });

  els.styleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.styleBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.style = btn.dataset.value;
      syncPreview();
    });
  });

  els.voiceBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      els.voiceBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.voice = btn.dataset.value;
      syncPreview();
    });
  });

  [els.recipientName, els.senderName].forEach((input) => {
    if (input) input.addEventListener("input", syncPreview);
  });

  if (els.fillExampleBtn) {
    els.fillExampleBtn.addEventListener("click", () => {
      if (!els.recipientName.value.trim()) els.recipientName.value = "Camila (mi pareja)";
      if (!els.senderName.value.trim()) els.senderName.value = "Damián";
      els.memories.value =
        "Nos conocimos en Córdoba hace 5 años, le digo 'Mi vida', siempre tomamos mate en la plaza y cantamos juntos en el auto.";
      syncPreview();
    });
  }

  // --- Validation & Order Serialization ---
  function getOrderPayload(statusTag) {
    return {
      status: statusTag || "DRAFT",
      country: "AR",
      currency: "ARS",
      price: priceText,
      occasion: state.occasion,
      recipient: els.recipientName.value.trim(),
      sender: els.senderName.value.trim(),
      style: state.style,
      voice: state.voice,
      memories: els.memories.value.trim(),
      email: els.clientEmail.value.trim(),
      whatsapp: els.clientWhatsapp.value.trim(),
      createdAt: new Date().toISOString(),
    };
  }

  function buildBriefText() {
    const p = getOrderPayload();
    const lines = [
      `🎵 *Pedido TuSong Argentina (${p.price})*`,
      `• *Ocasión:* ${p.occasion}`,
      `• *Para:* ${p.recipient || "(por definir)"}`,
    ];
    if (p.sender) lines.push(`• *De parte de:* ${p.sender}`);
    lines.push(`• *Estilo:* ${p.style} (${p.voice})`);
    if (p.memories) lines.push(`• *Historia:* ${p.memories}`);
    if (p.email) lines.push(`• *Email entrega:* ${p.email}`);
    if (p.whatsapp) lines.push(`• *WhatsApp:* ${p.whatsapp}`);
    return lines.join("\n");
  }

  function validateOrder() {
    const rec = els.recipientName.value.trim();
    const mem = els.memories.value.trim();
    const mail = els.clientEmail.value.trim();

    if (!rec) {
      goToStep(2);
      showStatus("Por favor indicá para quién es la canción.", true);
      els.recipientName.focus();
      return false;
    }
    if (!mem) {
      goToStep(3);
      showStatus("Contanos brevemente algunos recuerdos para incluir en la letra.", true);
      els.memories.focus();
      return false;
    }
    if (!mail || !mail.includes("@")) {
      goToStep(4);
      showStatus("Ingresá un correo electrónico válido para enviarte tu canción.", true);
      els.clientEmail.focus();
      return false;
    }
    return true;
  }

  function submitOrderToWebhook(statusTag) {
    const payload = getOrderPayload(statusTag);
    try {
      localStorage.setItem("tusong_last_order", JSON.stringify(payload));
      localStorage.setItem("tusong_last_brief", buildBriefText());
    } catch (_) {}

    if (!cfg.orderWebhookUrl) {
      return Promise.resolve();
    }

    const isGoogleScript = cfg.orderWebhookUrl.includes("script.google.com");

    const req = isGoogleScript
      ? fetch(cfg.orderWebhookUrl, {
          method: "POST",
          mode: "no-cors",
          keepalive: true,
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        }).catch(() => {})
      : fetch(cfg.orderWebhookUrl, {
          method: "POST",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        }).catch(() => {});

    // Esperar hasta 1.5s para asegurar el envío antes de redirigir a Mercado Pago
    return Promise.race([
      req,
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
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

  // --- Payment Button Handler (Argentina) ---
  if (els.mpDirectBtn) {
    els.mpDirectBtn.addEventListener("click", async () => {
      if (!validateOrder()) return;

      const originalBtnText = els.mpDirectBtn.textContent;
      els.mpDirectBtn.disabled = true;
      els.mpDirectBtn.textContent = "⏳ Guardando ficha y abriendo Mercado Pago...";

      await submitOrderToWebhook("AR_MERCADOPAGO_INITIATED");

      if (cfg.mercadoPagoUrl) {
        showStatus(`¡Ficha enviada! Redirigiendo a Mercado Pago (${priceText})...`, false);
        window.location.href = cfg.mercadoPagoUrl;
        return;
      }

      els.mpDirectBtn.disabled = false;
      els.mpDirectBtn.textContent = originalBtnText;

      if (els.aliasBox) {
        els.aliasBox.style.display = "block";
      }
      showStatus(
        "¡Tu historia quedó guardada! Transferí al Alias y envianos el comprobante por WhatsApp para comenzar hoy mismo.",
        false
      );
    });
  }

  if (els.copyAliasBtn) {
    els.copyAliasBtn.addEventListener("click", () => {
      const alias = cfg.aliasMercadoPago || "tusong.oficial";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(alias).catch(() => {});
      }
      els.copyAliasBtn.textContent = "✓ Alias copiado";
      setTimeout(() => {
        els.copyAliasBtn.textContent = "📋 Copiar Alias";
      }, 2000);
    });
  }

  if (els.sendChatBtn) {
    els.sendChatBtn.addEventListener("click", () => {
      const brief = buildBriefText();
      const waUrl = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(brief)}`;
      window.open(waUrl, "_blank", "noopener");
    });
  }

  // --- Floating Assistant Drawer ---
  const fab = document.getElementById("assistantFab");
  const drawer = document.getElementById("assistantDrawer");
  const closeBtn = document.getElementById("assistantClose");
  const messagesBox = document.getElementById("assistantMessages");
  const quickChips = document.querySelectorAll(".quick-chip");

  function toggleDrawer(open) {
    const shouldOpen = typeof open === "boolean" ? open : !drawer.classList.contains("open");
    drawer.classList.toggle("open", shouldOpen);
    fab.setAttribute("aria-expanded", String(shouldOpen));
  }

  if (fab) fab.addEventListener("click", () => toggleDrawer());
  if (closeBtn) closeBtn.addEventListener("click", () => toggleDrawer(false));

  quickChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.q;

      const answers = {
        precio: `El valor completo de tu canción personalizada es de <strong>${priceText} ARS</strong>. Abonás seguro con Mercado Pago (tarjeta, débito o transferencia).`,
        tiempo: `Apenas se acredita el pago, la producimos y te la enviamos en <strong>menos de 24 horas</strong> en MP3 HD + letra.`,
        entrega: `La recibís en tu email y WhatsApp lista para descargar, compartir o reproducir en cualquier parlante.`,
        hablar: `¡Claro! Tocá el botón de abajo para abrir nuestro WhatsApp Business oficial.`,
      };

      const userMsg = document.createElement("div");
      userMsg.className = "msg-bubble msg-user";
      userMsg.textContent = chip.textContent;
      messagesBox.appendChild(userMsg);

      const botMsg = document.createElement("div");
      botMsg.className = "msg-bubble msg-bot";
      botMsg.innerHTML = answers[key] || "Escribinos y te ayudamos enseguida.";
      messagesBox.appendChild(botMsg);

      if (key === "hablar") {
        const linkBtn = document.createElement("a");
        linkBtn.href = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent("¡Hola TuSong! Tengo una consulta sobre mi canción.")}`;
        linkBtn.target = "_blank";
        linkBtn.rel = "noopener";
        linkBtn.className = "btn btn-primary btn-sm";
        linkBtn.style.marginTop = "4px";
        linkBtn.textContent = "Abrir WhatsApp ↗";
        messagesBox.appendChild(linkBtn);
      }

      messagesBox.scrollTop = messagesBox.scrollHeight;
    });
  });

  // Init
  applyPriceUI();
  syncPreview();
})();
