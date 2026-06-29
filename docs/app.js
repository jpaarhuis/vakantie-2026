const content = document.querySelector('#content');
const themeButton = document.querySelector('#toggleTheme');

const markdownFiles = new Set([
  'travel-plan.md',
  'chargers.md',
  'locations/beauval.md',
  'locations/carcassonne.md',
  'locations/sant-antoni.md',
  'locations/nimes-pont-du-gard.md',
  'locations/beaune.md'
]);

const legacyMarkdownFiles = new Map([
  ['locations/calonge.md', 'locations/sant-antoni.md']
]);

const storedTheme = localStorage.getItem('roadtrip-theme');
if (storedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

themeButton?.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem(
    'roadtrip-theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
});

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function scrollToHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;
  const target = document.getElementById(decodeURIComponent(hash));
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getMarkdownFile() {
  const requestedFile = new URLSearchParams(window.location.search).get('file') || 'travel-plan.md';
  if (legacyMarkdownFiles.has(requestedFile)) return legacyMarkdownFiles.get(requestedFile);
  return markdownFiles.has(requestedFile) ? requestedFile : 'travel-plan.md';
}

function updateActiveNavigation(markdownFile) {
  document.querySelectorAll('[data-file]').forEach((link) => {
    if (link.dataset.file === markdownFile) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function wireInternalMarkdownLinks() {
  content.querySelectorAll('a[href$=".md"]').forEach((link) => {
    const file = link.getAttribute('href');
    if (!markdownFiles.has(file)) return;

    link.href = `?file=${encodeURIComponent(file)}`;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      window.history.pushState({}, '', link.href);
      loadMarkdown(file);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

document.querySelectorAll('[data-file]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const file = link.dataset.file;
    window.history.pushState({}, '', link.href);
    loadMarkdown(file);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

window.addEventListener('popstate', () => loadMarkdown());

async function loadMarkdown(markdownFile = getMarkdownFile()) {
  updateActiveNavigation(markdownFile);
  content.innerHTML = '<p>Reisplan wordt geladen...</p>';

  try {
    const response = await fetch(markdownFile, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();

    if (window.marked) {
      marked.setOptions({ gfm: true, breaks: false });
      content.innerHTML = marked.parse(markdown);
    } else {
      content.textContent = markdown;
    }

    content.querySelectorAll('h1, h2, h3').forEach((heading) => {
      if (!heading.id) heading.id = slugify(heading.textContent);
    });

    content.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    wireInternalMarkdownLinks();
    scrollToHash();
  } catch (error) {
    content.innerHTML = `
      <h2>Deze stop laadt even niet</h2>
      <p>Probeer de pagina te verversen of kies een andere stop in de balk hierboven.</p>
    `;
  }
}

loadMarkdown();
