/* ============================================================
   VowViw Entertainment — GLG Industries Wiki
   JavaScript
   ============================================================ */

'use strict';

// ============ SMOOTH ANCHOR NAVIGATION ============
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const id = this.getAttribute('href').substring(1);
        const target = document.getElementById(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Update sidebar active
            document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
            const sideLink = document.querySelector(`.sidebar a[href="#${id}"]`);
            if (sideLink) sideLink.classList.add('active');
        }
    });
});

// ============ COLLAPSIBLE ============
function toggleCollapsible(header) {
    header.classList.toggle('open');
    const body = header.nextElementSibling;
    if (body) body.classList.toggle('open');
}

// ============ INTERSECTION OBSERVER — SIDEBAR ACTIVE ============
const sections = document.querySelectorAll('.section[id], div[id]');
const sideLinks = document.querySelectorAll('.sidebar a');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            sideLinks.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { rootMargin: '-15% 0px -70% 0px' });

sections.forEach(s => observer.observe(s));

// ============ SEARCH ============
const searchInput = document.getElementById('searchInput');
const searchToast = document.getElementById('searchToast');

let toastTimer = null;

function showToast(msg, duration = 3000) {
    if (toastTimer) clearTimeout(toastTimer);
    searchToast.textContent = msg;
    searchToast.classList.add('show');
    toastTimer = setTimeout(() => {
        searchToast.classList.remove('show');
    }, duration);
}

function clearHighlights() {
    document.querySelectorAll('.search-highlight').forEach(el => {
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.classList.remove('search-highlight');
    });
}

searchInput.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;

    const query = this.value.trim().toLowerCase();
    if (!query) return;

    clearHighlights();

    // Search targets: char cards, table cells, group cards, ch-box bodies
    const targets = [
        ...document.querySelectorAll('.char-card'),
        ...document.querySelectorAll('.wiki-table td'),
        ...document.querySelectorAll('.group-card-body'),
        ...document.querySelectorAll('.ch-box-body'),
        ...document.querySelectorAll('.char-desc'),
        ...document.querySelectorAll('.char-name'),
    ];

    let found = null;

    for (const el of targets) {
        if (el.textContent.toLowerCase().includes(query)) {
            found = el;
            break;
        }
    }

    if (found) {
        found.scrollIntoView({ behavior: 'smooth', block: 'center' });
        found.style.outline = '2px solid rgba(201,168,76,0.6)';
        found.style.outlineOffset = '3px';
        found.classList.add('search-highlight');
        setTimeout(clearHighlights, 3500);
        showToast(`Ditemukan: "${this.value.trim()}"`, 2500);
    } else {
        showToast(`Tidak ditemukan: "${this.value.trim()}"`, 3000);
    }
});

// ============ CHAR CARD EXPAND (click to expand desc) ============
document.querySelectorAll('.char-card').forEach(card => {
    let expanded = false;
    const desc = card.querySelector('.char-desc');
    const profile = card.querySelector('.char-profile');

    if (!desc) return;

    // Initially collapse long descriptions
    if (desc.textContent.trim().length > 200 && !card.classList.contains('featured')) {
        desc.style.maxHeight = '60px';
        desc.style.overflow = 'hidden';
        desc.style.maskImage = 'linear-gradient(180deg, rgba(0,0,0,1) 50%, transparent 100%)';
        desc.style.webkitMaskImage = 'linear-gradient(180deg, rgba(0,0,0,1) 50%, transparent 100%)';

        // Add expand hint
        const hint = document.createElement('div');
        hint.style.cssText = 'font-size:10px; color: rgba(201,168,76,0.5); font-family: DM Mono, monospace; cursor:pointer; margin-top:4px; letter-spacing:1px; text-transform:uppercase;';
        hint.textContent = '▼ Lihat lebih';
        desc.insertAdjacentElement('afterend', hint);

        function toggleExpand(e) {
            e.stopPropagation();
            expanded = !expanded;
            if (expanded) {
                desc.style.maxHeight = 'none';
                desc.style.maskImage = 'none';
                desc.style.webkitMaskImage = 'none';
                hint.textContent = '▲ Tutup';
            } else {
                desc.style.maxHeight = '60px';
                desc.style.maskImage = 'linear-gradient(180deg, rgba(0,0,0,1) 50%, transparent 100%)';
                desc.style.webkitMaskImage = 'linear-gradient(180deg, rgba(0,0,0,1) 50%, transparent 100%)';
                hint.textContent = '▼ Lihat lebih';
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }

        hint.addEventListener('click', toggleExpand);
        card.addEventListener('click', function (e) {
            if (e.target === hint || e.target.tagName === 'A') return;
            if (!expanded) toggleExpand(e);
        });
    }
});

// ============ ANIMATE BARS ON SCROLL ============
const barFills = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const targetWidth = el.style.width;
            el.style.width = '0';
            setTimeout(() => {
                el.style.width = targetWidth;
            }, 100);
            barObserver.unobserve(el);
        }
    });
}, { threshold: 0.1 });

barFills.forEach(b => {
    // Store target width before zeroing
    b.dataset.targetWidth = b.style.width;
    barObserver.observe(b);
});

// ============ ANIMATE CARDS ON SCROLL ============
const cards = document.querySelectorAll('.char-card, .group-card, .religion-card, .ch-box');
const cardObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const delay = Math.min(i * 50, 300);
            el.style.opacity = '0';
            el.style.transform = 'translateY(12px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, delay);
            cardObserver.unobserve(el);
        }
    });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

cards.forEach(c => {
    c.style.opacity = '0';
    cardObserver.observe(c);
});

// ============ TOPBAR SCROLL SHADOW ============
const topbar = document.querySelector('.topbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        topbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.5)';
    } else {
        topbar.style.boxShadow = 'none';
    }
}, { passive: true });

// ============ EASTER EGG: Konami Code ============
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;
document.addEventListener('keydown', e => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            konamiIndex = 0;
            showToast('🎮 VowViw Entertainment — Loop Activated!', 4000);
            // Briefly flash accent color on title
            const title = document.querySelector('.article-title');
            if (title) {
                title.style.transition = 'color 0.5s';
                title.style.color = '#f97316';
                setTimeout(() => { title.style.color = ''; }, 2000);
            }
        }
    } else {
        konamiIndex = 0;
    }
});

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c VowViw Entertainment — GLG Industries Wiki ', 'background:#0e0e12; color:#c9a84c; font-family:serif; font-size:16px; padding:6px 12px; border:1px solid #c9a84c;');
    console.log('%c Database Karakter Bab 1–8 · 68.618 Karakter ', 'background:#0e0e12; color:#7a7880; font-size:11px; padding:2px 12px;');
});
