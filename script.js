// script.js – Comorade dashboard logic

// ✅ Extract guildId from URL
const urlParams = new URLSearchParams(window.location.search);
const guildId = urlParams.get('guildId');

if (!guildId) {
  console.warn('No guildId found in URL. Redirecting to server picker...');
  window.location.href = '/servers.html';
}

// ✅ Load server stats for the selected guild
async function loadServerStats() {
  try {
    const res = await fetch(`/server-stats?guildId=${guildId}`);
    if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
    const stats = await res.json();

    console.log('Server stats loaded:', stats);

    // Update stat cards
    document.getElementById('memberCount').innerText = stats.memberCount ?? 'Unavailable';
    document.getElementById('onlineCount').innerText = stats.onlineCount ?? 'Unavailable';
    document.getElementById('modCount').innerText = stats.modCount ?? 'Unavailable';

    // ✅ Optional: show server name + icon if available
    if (stats.guildName) {
      document.querySelector('header h1').innerText = `Comorade Dashboard – ${stats.guildName}`;
    }
    if (stats.guildIcon) {
      const iconEl = document.getElementById('guildIcon');
      if (iconEl) {
        iconEl.src = stats.guildIcon;
        iconEl.style.display = 'inline-block';
      }
    }
  } catch (err) {
    console.error('Error loading server stats:', err);
    document.getElementById('memberCount').innerText = 'Error';
    document.getElementById('onlineCount').innerText = 'Error';
    document.getElementById('modCount').innerText = 'Error';
  }
}

// ✅ Run on page load
window.onload = () => {
  console.log('Dashboard loaded for guild:', guildId);
  loadServerStats();
};