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

  // --- Conversational Stepper State (Opción 1) ---
  const state = {
    step: 1,
    occasion: "Aniversario / Pareja",
    style: "Balada acústica con guitarra",
    voice: "Voz masculina",
  };

  const els = {
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
    prevOccasion: document.getElementById("prevOccasion"),
    prevRecipient: document.getElementById("prevRecipient"),
    prevStyle: document.getElementById("prevStyle"),
    prevVoice: document.getElementById("prevVoice"),
    fillExampleBtn: document.getElementById("fillExampleBtn"),
    instantChatBtn: document.getElementById("instantChatBtn"),
    skipToChatBtn: document.getElementById("skipToChatBtn"),
    doneChatBtn: document.getElementById("doneChatBtn"),
    doneSummaryText: document.getElementById("doneSummaryText"),
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
    els.prevStyle.textContent = state.style;
    els.prevVoice.textContent = state.voice;

    if (els.doneSummaryText) {
      const rec = els.recipientName.value.trim();
      const snd = els.senderName.value.trim();
      if (rec) {
        els.doneSummaryText.textContent = `¡Genial${snd ? ", " + snd : ""}! Ya tenemos armada la ficha base para la canción de ${rec} (${state.occasion}, estilo ${state.style}). Puedes reservar ahora por ${cfg.priceDisplay || "35 €"} o enviársela directo a Dario por chat para terminarla juntos.`;
      }
    }
  }

  function goToStep(stepNum) {
    state.step = Math.max(1, Math.min(5, Number(stepNum)));
    els.panes.forEach((pane) => {
      pane.classList.toggle("active", Number(pane.dataset.step) === state.step);
    });
    if (els.stepCounter) {
      els.stepCounter.textContent = state.step === 5 ? "¡Paso 5 de 5 · Listo!" : `Paso ${state.step} de 5`;
    }
    if (els.stepperProgress) {
      els.stepperProgress.style.width = `${state.step * 20}%`;
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
      setTimeout(() => goToStep(2), 200);
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
      if (!els.recipientName.value.trim()) els.recipientName.value = "Laura (mi pareja)";
      if (!els.senderName.value.trim()) els.senderName.value = "Carlos";
      els.memories.value =
        "Nos conocimos bajo la lluvia en Madrid hace 4 años, la llamo 'Mi pequeña', siempre cantamos en el coche rumbo a la playa y nos encanta tomar café juntos los domingos.";
      syncPreview();
    });
  }

  function buildFlexibleBrief() {
    const recipient = els.recipientName.value.trim();
    const sender = els.senderName.value.trim();
    const memories = els.memories.value.trim();
    const contact = els.clientEmail.value.trim();

    if (!recipient && !memories) {
      return `¡Hola TuSong! 👋 Escuché las demos y me gustaría consultar para crear una canción personalizada (${cfg.priceDisplay || "$20.000"}) para: ${state.occasion}.`;
    }

    const lines = [
      `🎵 *Ficha de Canción TuSong (${cfg.priceDisplay || "$20.000"})*`,
      `• *Ocasión:* ${state.occasion}`,
    ];
    if (recipient) lines.push(`• *Para:* ${recipient}`);
    if (sender) lines.push(`• *De parte de:* ${sender}`);
    lines.push(`• *Estilo:* ${state.style} (${state.voice})`);
    if (memories) lines.push(`• *Detalles/Recuerdos:* ${memories}`);
    if (contact) lines.push(`• *Mi WhatsApp:* ${contact}`);
    lines.push(`\n¡Hola! Les dejo mi historia para preparar el DEMO previo. 😊`);
    return lines.join("\n");
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

  function openChatDirect(prefixNote) {
    const brief = buildFlexibleBrief();
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
      "¡Mensaje copiado! Se abrirá Messenger: solo pégalo en el chat para hablar directo con Dario.",
      false
    );
    setTimeout(() => {
      window.open(cfg.messengerUrl || "https://m.me/584160754786937", "_blank", "noopener");
    }, 600);
  }

  [els.instantChatBtn, els.skipToChatBtn, els.doneChatBtn, els.sendChatBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => openChatDirect(""));
    }
  });

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
                "¡Pago confirmado! Ahora toca el botón de Chat para enviarle los detalles finales a Dario.",
                false
              );
              openChatDirect("✅ ¡Pago realizado por PayPal!");
            });
          },
          onError: () => {
            showStatus(
              "Hubo un problema al abrir PayPal. Puedes usar el botón de chat para hablar con Dario.",
              true
            );
          },
        })
        .render("#paypal-button-container");
    };
    document.body.appendChild(script);
  } else {
    els.paypalDirectBtn.addEventListener("click", () => {
      const brief = buildFlexibleBrief();
      try {
        localStorage.setItem("tusong_last_brief", brief);
      } catch (_) {}
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(brief).catch(() => {});
      }
      showStatus(
        "Abriendo PayPal seguro (35 €). Al terminar tu pago, toca el botón de chat para pasarnos tu historia.",
        false
      );
      window.open(cfg.paypalPaymentUrl, "_blank", "noopener");
    });
  }

  // --- Floating Assistant Drawer ---
  const fab = document.getElementById("assistantFab");
  const drawer = document.getElementById("assistantDrawer");
  const closeBtn = document.getElementById("assistantClose");
  const messagesBox = document.getElementById("assistantMessages");
  const quickChips = document.querySelectorAll(".quick-chip");

  const answers = {
    precio:
      "El valor promocional es de <strong>$20.000 ARS</strong> por la canción completa en MP3 HD (o $25.000 con portada en video). Lo mejor: <strong>te armamos un DEMO previo y abonás solo si te gusta</strong> por Mercado Pago o transferencia.",
    tiempo:
      "La demo la entregamos habitualmente <strong>en el día o en 24 horas</strong>. La versión original en alta calidad se envía inmediatamente tras la confirmación.",
    cambios:
      "¡Sí! Incluye <strong>1 ajuste menor sin costo</strong> para asegurarnos de que los nombres, pronunciación y anécdotas queden impecables.",
    hablar:
      "¡Claro! Tocá el botón de acá abajo para abrir chat directo por WhatsApp sin tener que llenar formularios.",
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
              "Hola Dario! Tengo una consulta sobre una canción personalizada de TuSong."
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
