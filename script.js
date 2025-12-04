/* --------------------------------------------------
   DIGITAL POSTCARD MAKER — FINAL JS (UPDATED)
   Cute mode stickers + proper toggles + fixed logic
-------------------------------------------------- */

// INPUT ELEMENTS
const toInput = document.getElementById('toInput');
const messageInput = document.getElementById('messageInput');
const fromInput = document.getElementById('fromInput');

// PREVIEW TEXT TARGETS
const toPreview = document.getElementById('toPreview');
const messagePreview = document.getElementById('messagePreview');
const fromPreview = document.getElementById('fromPreview');
const postcard = document.getElementById('postcard');

// FONT SELECTS
const fontTo = document.getElementById('fontTo');
const fontMessage = document.getElementById('fontMessage');
const fontFrom = document.getElementById('fontFrom');

// STYLE BUTTONS
const styleBtns = document.querySelectorAll('[data-style]');
const bgSolid = document.getElementById('bgSolid');
const bgGrad = document.getElementById('bgGrad');

// SWATCHES
const swatches = document.querySelectorAll('.swatch');

// DOWNLOAD
const downloadBtn = document.getElementById('downloadBtn');

// DECORATIONS
const tapeTL = document.getElementById('tape-top-left');
const tapeTR = document.getElementById('tape-top-right');
const stampBox = document.getElementById('stamp-box');
const cuteIcons = document.getElementById('cute-icons');
const fromStamp = document.getElementById('from-stamp');
const cuteSticker1 = document.getElementById('cute-sticker-1');
const cuteSticker2 = document.getElementById('cute-sticker-2');

//-----------------------------------------------------
// TEXT UPDATES
//-----------------------------------------------------
function applyText(input, preview, fallback) {
  preview.textContent = input.value.trim() || fallback;
}

toInput.addEventListener('input', () => applyText(toInput, toPreview, 'Dear Friend,'));
messageInput.addEventListener('input', () => applyText(messageInput, messagePreview, 'Your message here...'));
fromInput.addEventListener('input', () => applyText(fromInput, fromPreview, '— From me'));

//-----------------------------------------------------
// FONT CHANGES
//-----------------------------------------------------
fontTo.addEventListener('change', () => {
  toPreview.style.fontFamily = fontTo.value;
});
fontMessage.addEventListener('change', () => {
  messagePreview.style.fontFamily = fontMessage.value;
});
fontFrom.addEventListener('change', () => {
  fromPreview.style.fontFamily = fontFrom.value;
});

//-----------------------------------------------------
// STYLE SWITCHING: MINIMAL / CUTE / SCRAPBOOK
//-----------------------------------------------------
function hideAllDecor() {
  stampBox.style.display = 'none';
  cuteIcons.style.display = 'none';
  tapeTL.style.display = 'none';
  tapeTR.style.display = 'none';
  fromStamp.style.display = 'none';
  cuteSticker1.style.display = 'none';
  cuteSticker2.style.display = 'none';
}

styleBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    styleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const style = btn.dataset.style;
    postcard.classList.remove('minimal', 'cute', 'scrap');
    postcard.classList.add(style);

    hideAllDecor();

    // DECOR VISIBILITY
    if (style === 'minimal') {
      stampBox.style.display = 'block';
    }
    if (style === 'cute') {
      cuteIcons.style.display = 'block';
      cuteSticker1.style.display = 'block';
      cuteSticker2.style.display = 'block';
    }
    if (style === 'scrap') {
      tapeTL.style.display = 'block';
      tapeTR.style.display = 'block';
      fromStamp.style.display = 'block';
    }
  });
});

//-----------------------------------------------------
// BACKGROUND / GRADIENT LOGIC
//-----------------------------------------------------
function applyBackground() {
  const selected = document.querySelector('.swatch.selected');
  if (!selected) return;
  const color = selected.dataset.color;

  if (bgSolid.classList.contains('active')) {
    postcard.style.background = color;
  } else {
    postcard.style.background = `linear-gradient(135deg, ${color}, #fff7ea 75%)`;
  }

  autoContrast(color);
}

function autoContrast(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  const text = lum < 0.55 ? '#fff' : '#222';
  toPreview.style.color = text;
  messagePreview.style.color = text;
  fromPreview.style.color = text;
}

swatches.forEach(s => {
  s.addEventListener('click', () => {
    swatches.forEach(x => x.classList.remove('selected'));
    s.classList.add('selected');
    applyBackground();
  });
});

bgSolid.addEventListener('click', () => {
  bgSolid.classList.add('active');
  bgGrad.classList.remove('active');
  applyBackground();
});

bgGrad.addEventListener('click', () => {
  bgGrad.classList.add('active');
  bgSolid.classList.remove('active');
  applyBackground();
});

//-----------------------------------------------------
// DOWNLOAD PNG
//-----------------------------------------------------
async function downloadPostcard() {
  downloadBtn.disabled = true;
  downloadBtn.textContent = 'Rendering...';

  try {
    const canvas = await html2canvas(postcard, { backgroundColor: null, scale: 2 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'postcard.png';
    link.click();
  } catch (e) {
    console.error(e);
    alert('Error generating image.');
  }

  downloadBtn.disabled = false;
  downloadBtn.textContent = '⬇️ Download Postcard';
}

downloadBtn.addEventListener('click', downloadPostcard);

//-----------------------------------------------------
// INIT DEFAULT STATE
//-----------------------------------------------------
(function init() {
  hideAllDecor();

  // Scrapbook default
  tapeTL.style.display = 'block';
  tapeTR.style.display = 'block';
  fromStamp.style.display = 'block';

  // Default color
  const selected = document.querySelector('.swatch.selected');
  if (selected) selected.click();

  // Apply fonts
  fontTo.dispatchEvent(new Event('change'));
  fontMessage.dispatchEvent(new Event('change'));
  fontFrom.dispatchEvent(new Event('change'));
})();

