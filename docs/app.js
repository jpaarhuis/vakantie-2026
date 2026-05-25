const content = document.querySelector('#content');
const themeButton = document.querySelector('#toggleTheme');

const markdownFiles = new Set([
  'travel-plan.md',
  'locations/beauval.md',
  'locations/carcassonne.md',
  'locations/calonge.md',
  'locations/nimes-pont-du-gard.md',
  'locations/beaune.md'
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

function getMarkdownFile() {
  const requestedFile = new URLSearchParams(window.location.search).get('file') || 'travel-plan.md';
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
  } catch (error) {
    content.innerHTML = `
      <h2>Kon het reisplan niet laden</h2>
      <p>Controleer of <code>${markdownFile}</code> in de map <code>docs</code> staat.</p>
      <p><code>${error.message}</code></p>
    `;
  }
}

loadMarkdown();
