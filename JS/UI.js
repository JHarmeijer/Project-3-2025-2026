// ---------------- Achtergrondmuziek ----------------
const bgMusic = document.getElementById("bgMusic");

// Laad opgeslagen volume uit localStorage of default 0.5
const savedVolume = localStorage.getItem("gameVolume");
bgMusic.volume = savedVolume !== null ? savedVolume / 100 : 0.5;

// Start muziek zodra speler interactie heeft (om autoplay restrictions te voorkomen)
function playMusicOnce() {
  bgMusic.play().catch(() => {});
  document.removeEventListener("click", playMusicOnce);
}
document.addEventListener("click", playMusicOnce);

// ---------------- Volume Slider ----------------
const volumeSlider = document.getElementById("volumeSlider");
const volumeValue = document.getElementById("volumeValue");

if(volumeSlider){
  // Zet slider op huidig volume
  volumeSlider.value = Math.floor(bgMusic.volume * 100);
  volumeValue.textContent = volumeSlider.value;

  // Update volume realtime
  volumeSlider.addEventListener("input", () => {
    const vol = volumeSlider.value;
    bgMusic.volume = vol / 100;          // Zet audio volume
    volumeValue.textContent = vol;       // Update label
    localStorage.setItem("gameVolume", vol); // Sla op voor later
  });
}

// ---------------- Storage event (als slider in ander tab verandert) ----------------
window.addEventListener("storage", (e) => {
  if(e.key === "gameVolume"){
    const newVol = e.newValue;
    bgMusic.volume = newVol / 100;
    if(volumeSlider) volumeSlider.value = newVol;
    if(volumeValue) volumeValue.textContent = newVol;
  }
});