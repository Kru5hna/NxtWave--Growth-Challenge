/* ============================================================
   NxtWave AI Workshop — Frontend JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ---- CONFIG ----
  const WORKSHOP_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const BASE_REGISTERED = 0; // Real-time verified count
  const SITE_URL = window.location.origin;
  const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? ''
    : 'https://nxtwave-growth-challenge-ohbz.onrender.com';

  // ---- DOM CACHE ----
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {
    countdown: {
      days: $('#cd-days'),
      hours: $('#cd-hours'),
      mins: $('#cd-mins'),
      secs: $('#cd-secs'),
    },
    registeredCount: $('#registeredCount'),
    form: $('#registerForm'),
    submitBtn: $('#submitBtn'),
    referralSection: $('#referral'),
    referralLink: $('#referralLink'),
    copyBtn: $('#copyBtn'),
    copyIcon: $('#copyIcon'),
    whatsappShareBtn: $('#whatsappShareBtn'),
    fabWhatsapp: $('#fabWhatsapp'),
    leaderboardBody: $('#leaderboardBody'),
    referralCount: $('#referralCount'),
    toast: $('#toast'),
    particleCanvas: $('#particleCanvas'),
    footerYear: $('#footerYear'),
  };

  // ---- UTILITY ----
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function showToast(message, type = 'success') {
    dom.toast.textContent = message;
    dom.toast.className = 'toast toast--visible toast--' + type;
    clearTimeout(dom.toast._timer);
    dom.toast._timer = setTimeout(() => {
      dom.toast.className = 'toast';
    }, 3000);
  }

  function getStoredReferral() {
    try {
      return JSON.parse(localStorage.getItem('nw_referral'));
    } catch {
      return null;
    }
  }

  function setStoredReferral(data) {
    localStorage.setItem('nw_referral', JSON.stringify(data));
  }

  function getWhatsAppShareURL(referralLink) {
    const msg = '\u{1F680} Hey! I just registered for a *free AI workshop* by NxtWave \u2014 you can build your first AI project in just 60 minutes!\n\n\u{1F393} Free certificate included.\n\n\u{1F449} Register here: ' + referralLink + '\n\nLet\'s do this together! \u{1F4AA}';
    return 'https://api.whatsapp.com/send?text=' + encodeURIComponent(msg);
  }

  // ---- COUNTDOWN TIMER ----
  function updateCountdown() {
    const now = Date.now();
    let diff = WORKSHOP_DATE.getTime() - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dom.countdown.days.textContent = pad(days);
    dom.countdown.hours.textContent = pad(hours);
    dom.countdown.mins.textContent = pad(mins);
    dom.countdown.secs.textContent = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---- SOCIAL PROOF COUNTER ----
  function animateCounter(el, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function tick(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  function fetchRegisteredCount() {
    // Attempt to fetch from API; fall back to base count
    fetch(API_BASE + '/api/registered-count')
      .then((r) => {
        if (!r.ok) throw new Error('API unavailable');
        return r.json();
      })
      .then((data) => {
        const count = data.count || BASE_REGISTERED;
        animateCounter(dom.registeredCount, count);
      })
      .catch(() => {
        animateCounter(dom.registeredCount, BASE_REGISTERED);
      });
  }

  // Trigger counter animation when hero becomes visible
  let counterAnimated = false;
  function onHeroVisible() {
    if (!counterAnimated) {
      counterAnimated = true;
      fetchRegisteredCount();
    }
  }

  // ---- INTERSECTION OBSERVER (Scroll Animations) ----
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Trigger counter when hero social proof is visible
        if (entry.target.closest('.hero')) {
          onHeroVisible();
        }

        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  $$('.animate-on-scroll').forEach((el) => scrollObserver.observe(el));

  // ---- SMOOTH SCROLL ----
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = $('#nav').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- FORM VALIDATION ----
  const validators = {
    name: (v) => {
      if (!v.trim()) return 'Full name is required.';
      if (v.trim().length < 2) return 'Please enter a valid name.';
      return '';
    },
    email: (v) => {
      if (!v.trim()) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address.';
      return '';
    },
    college: (v) => {
      if (!v.trim()) return 'College name is required.';
      return '';
    },
    whatsapp: (v) => {
      if (!v.trim()) return 'WhatsApp number is required.';
      if (!/^\d{10}$/.test(v.trim())) return 'Enter a valid 10-digit number.';
      return '';
    },
    year: (v) => {
      if (!v) return 'Select your year of study.';
      return '';
    },
    branch: (v) => {
      if (!v) return 'Select your branch.';
      return '';
    },
  };

  function validateField(name) {
    const input = dom.form.elements[name];
    const error = $(`#${name}-error`);
    const msg = validators[name](input.value);
    if (msg) {
      error.textContent = msg;
      input.classList.add('form__input--error');
      return false;
    }
    error.textContent = '';
    input.classList.remove('form__input--error');
    return true;
  }

  function validateAll() {
    let valid = true;
    Object.keys(validators).forEach((name) => {
      if (!validateField(name)) valid = false;
    });
    return valid;
  }

  // Live validation on blur
  Object.keys(validators).forEach((name) => {
    const input = dom.form.elements[name];
    if (input) {
      input.addEventListener('blur', () => validateField(name));
      input.addEventListener('input', () => {
        if (input.classList.contains('form__input--error')) {
          validateField(name);
        }
      });
    }
  });

  // ---- FORM SUBMISSION ----
  dom.form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateAll()) {
      // Scroll to first error
      const firstError = dom.form.querySelector('.form__input--error');
      if (firstError) firstError.focus();
      return;
    }

    const submitBtn = dom.submitBtn;
    submitBtn.classList.add('form__submit--loading');
    submitBtn.disabled = true;

    // Collect referrer from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = urlParams.get('ref') || '';

    const payload = {
      name: dom.form.elements.name.value.trim(),
      email: dom.form.elements.email.value.trim(),
      college: dom.form.elements.college.value.trim(),
      whatsapp: '+91' + dom.form.elements.whatsapp.value.trim(),
      year: dom.form.elements.year.value,
      branch: dom.form.elements.branch.value,
      referrer: referrer,
    };

    try {
      const res = await fetch(API_BASE + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // Success
      showToast('🎉 Registration successful!', 'success');

      // Store referral info
      const referralData = {
        code: data.referralCode,
        name: payload.name,
        email: payload.email,
      };
      setStoredReferral(referralData);

      // Show referral section
      showReferralSection(referralData);

      // Hide form
      dom.form.closest('.register').style.display = 'none';

      // Re-fetch leaderboard
      fetchLeaderboard();

      // Update counter
      fetchRegisteredCount();
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn.classList.remove('form__submit--loading');
      submitBtn.disabled = false;
    }
  });

  // ---- REFERRAL SECTION ----
  function showReferralSection(referralData) {
    const link = SITE_URL + '/?ref=' + encodeURIComponent(referralData.code);
    dom.referralLink.value = link;
    dom.referralSection.style.display = '';

    // Scroll to referral section
    setTimeout(() => {
      dom.referralSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    // Re-observe for animations
    dom.referralSection.querySelectorAll('.animate-on-scroll').forEach((el) => {
      el.classList.remove('is-visible');
      scrollObserver.observe(el);
    });

    // Update WhatsApp share links
    const waURL = getWhatsAppShareURL(link);
    dom.whatsappShareBtn.href = waURL;
    dom.fabWhatsapp.href = waURL;

    // Fetch referral count
    fetchReferralCount(referralData.code);
  }

  function fetchReferralCount(code) {
    fetch(API_BASE + '/api/referral-count?code=' + encodeURIComponent(code))
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        dom.referralCount.textContent = data.count || 0;
      })
      .catch(() => {
        dom.referralCount.textContent = '0';
      });
  }

  // ---- COPY REFERRAL LINK ----
  dom.copyBtn.addEventListener('click', async function () {
    const text = dom.referralLink.value;
    try {
      await navigator.clipboard.writeText(text);
      dom.copyIcon.textContent = '✅';
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => {
        dom.copyIcon.textContent = '📋';
      }, 2000);
    } catch {
      // Fallback
      dom.referralLink.select();
      document.execCommand('copy');
      dom.copyIcon.textContent = '✅';
      showToast('Link copied!', 'success');
      setTimeout(() => {
        dom.copyIcon.textContent = '📋';
      }, 2000);
    }
  });

  // ---- LEADERBOARD ----
  function fetchLeaderboard() {
    fetch(API_BASE + '/api/leaderboard')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const leaders = data.leaderboard || data || [];
        if (!Array.isArray(leaders) || leaders.length === 0) {
          dom.leaderboardBody.innerHTML =
            '<tr><td colspan="3" class="leaderboard__empty">No referrals yet — be the first! 🚀</td></tr>';
          return;
        }

        dom.leaderboardBody.innerHTML = leaders
          .slice(0, 10)
          .map((entry, i) => {
            const rank = i + 1;
            let rankClass = '';
            let medal = '';
            if (rank === 1) { rankClass = 'leaderboard__rank--gold'; medal = '🥇'; }
            else if (rank === 2) { rankClass = 'leaderboard__rank--silver'; medal = '🥈'; }
            else if (rank === 3) { rankClass = 'leaderboard__rank--bronze'; medal = '🥉'; }

            // Mask name for privacy: "Rahul S."
            const nameParts = (entry.name || 'Anonymous').split(' ');
            const displayName =
              nameParts[0] + (nameParts.length > 1 ? ' ' + nameParts[1][0] + '.' : '');

            return `<tr>
              <td><span class="leaderboard__rank ${rankClass}">${medal || rank}</span></td>
              <td>${escapeHtml(displayName)}</td>
              <td>${entry.referralCount || entry.count || 0}</td>
            </tr>`;
          })
          .join('');
      })
      .catch(() => {
        dom.leaderboardBody.innerHTML =
          '<tr><td colspan="3" class="leaderboard__empty">Leaderboard unavailable right now.</td></tr>';
      });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- FLOATING WHATSAPP FAB ----
  // Default share URL (before registration)
  const defaultShareMsg = '\u{1F680} Check out this free AI workshop by NxtWave \u2014 build your first AI project in 60 minutes!\n\n\u{1F449} ' + SITE_URL + '\n\nFree certificate included! \u{1F393}';
  dom.fabWhatsapp.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(defaultShareMsg);

  // ---- PARTICLE ANIMATION ----
  function initParticles() {
    const canvas = dom.particleCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;
    let width, height;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    // Determine particle count based on screen width (perf-conscious)
    function getParticleCount() {
      if (width < 640) return 30;
      if (width < 1024) return 50;
      return 70;
    }

    function createParticles() {
      particles = [];
      const count = getParticleCount();
      const colors = [
        '255, 107, 53', // Orange #FF6B35
        '255, 61, 129', // Pink #FF3D81
        '255, 200, 87', // Yellow #FFC857
      ];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 2 + 0.6,
          dx: (Math.random() - 0.5) * 0.35,
          dy: (Math.random() - 0.5) * 0.35,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        // Wrap around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 107, 53, ${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(draw);
    }

    // Reduce work when tab not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrame);
      } else {
        animFrame = requestAnimationFrame(draw);
      }
    });

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    resize();
    createParticles();
    draw();
  }

  // ---- INIT ON LOAD ----
  function init() {
    // Footer year
    if (dom.footerYear) {
      dom.footerYear.textContent = new Date().getFullYear();
    }

    // Particles
    initParticles();

    // Check if user already registered
    const stored = getStoredReferral();
    if (stored && stored.code) {
      showReferralSection(stored);
      // Still show the form section but pre-fill message
      dom.form.closest('.register').style.display = 'none';
    }

    // Fetch leaderboard
    fetchLeaderboard();

    // Trigger hero animation immediately
    onHeroVisible();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
