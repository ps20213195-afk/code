const blogPostsElement = document.getElementById('blogPosts');
const blogStatusElement = document.getElementById('blogStatus');
const blogMenuElement = document.getElementById('blogMenu');
const BLOG_INDEX_URL = './blog/index.json';
const BLOG_REPOSITORY_API = 'https://api.github.com/repos/ps20213195-afk/code/contents/blog?ref=main';

function parseBlogPost(rawText, filename) {
  const lines = rawText.replace(/^\uFEFF/, '').split(/\r?\n/);
  const metadata = {};
  let bodyStart = 0;

  for (; bodyStart < lines.length; bodyStart += 1) {
    const line = lines[bodyStart];
    if (!line.trim()) continue;
    const match = line.match(/^@([A-Z_]+):\s*(.*)$/i);
    if (!match) break;
    metadata[match[1].toUpperCase()] = match[2].trim();
  }

  const date = metadata.DATE || '';
  const formattedDate = /^\d{8}$/.test(date)
    ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`
    : date;
  return {
    filename,
    title: metadata.TITLE || filename,
    date: formattedDate,
    author: metadata.AUTHOR_NAME || '',
    flair: metadata.AUTHOR_FLAIR || metadata.AUTOR_FLAIR || '',
    markdown: lines.slice(bodyStart).join('\n').trim()
  };
}

function renderBlogPost(post) {
  const article = document.createElement('article');
  article.className = 'blog-post';

  const header = document.createElement('header');
  header.className = 'blog-post-header';
  const title = document.createElement('h2');
  title.className = 'blog-post-title';
  title.textContent = post.title;
  header.append(title);

  const meta = document.createElement('p');
  meta.className = 'blog-post-meta';
  if (post.date) {
    const date = document.createElement('time');
    date.textContent = post.date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(post.date)) date.dateTime = post.date;
    meta.append(date);
  }
  if (post.author) {
    const author = document.createElement('span');
    author.textContent = post.author;
    meta.append(author);
  }
  if (post.flair) {
    const flair = document.createElement('span');
    flair.className = 'blog-post-author-flair';
    flair.textContent = post.flair;
    meta.append(flair);
  }
  if (meta.childElementCount) header.append(meta);

  const content = document.createElement('div');
  content.className = 'blog-post-content';
  if (window.marked && window.DOMPurify) {
    content.innerHTML = window.DOMPurify.sanitize(window.marked.parse(post.markdown));
  } else {
    content.textContent = post.markdown;
  }

  article.append(header, content);
  return article;
}

function renderBlogMenu(posts) {
  blogMenuElement.replaceChildren();
  posts.forEach((post, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'blog-menu-item';
    button.textContent = post.title;
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', () => {
      [...blogMenuElement.children].forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      blogPostsElement.replaceChildren(renderBlogPost(post));
    });
    blogMenuElement.append(button);
  });
}

async function getBlogFiles() {
  try {
    const response = await fetch(BLOG_REPOSITORY_API, {
      cache: 'no-store',
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) throw new Error(`GitHub blog listing returned ${response.status}`);
    const entries = await response.json();
    return entries
      .filter((entry) => entry.type === 'file' && entry.name !== 'index.json')
      .map((entry) => ({ filename: entry.name, url: entry.download_url }))
      .filter((entry) => entry.url);
  } catch (error) {
    console.info('Using the local blog index because online discovery is unavailable.', error);
    const response = await fetch(BLOG_INDEX_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load ${BLOG_INDEX_URL}`);
    const filenames = await response.json();
    if (!Array.isArray(filenames)) throw new Error('Blog index must contain a list of filenames.');
    return filenames
      .filter((filename) => typeof filename === 'string' && /^[\w.-]+$/.test(filename))
      .map((filename) => ({ filename, url: `./blog/${encodeURIComponent(filename)}` }));
  }
}

async function loadBlogPosts() {
  if (!blogPostsElement || !blogStatusElement) return;
  try {
    const files = await getBlogFiles();
    const posts = await Promise.all(files.map(async ({ filename, url }) => {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Could not load ${filename}`);
        return parseBlogPost(await response.text(), filename);
      } catch (error) {
        console.warn('Could not load blog post.', error);
        return null;
      }
    }));

    const loadedPosts = posts.filter(Boolean).sort((left, right) => right.date.localeCompare(left.date));
    blogPostsElement.replaceChildren();
    if (!loadedPosts.length) {
      const empty = document.createElement('p');
      empty.className = 'blog-post-empty';
      empty.textContent = 'No Markdown blog posts found in the blog folder.';
      blogPostsElement.append(empty);
    } else {
      renderBlogMenu(loadedPosts);
      blogPostsElement.append(renderBlogPost(loadedPosts[0]));
    }
    blogStatusElement.textContent = `${loadedPosts.length} post${loadedPosts.length === 1 ? '' : 's'}`;
  } catch (error) {
    console.error('Could not load blog posts.', error);
    blogStatusElement.textContent = 'Unavailable';
    const message = document.createElement('p');
    message.className = 'blog-post-empty';
    message.textContent = 'Could not load the blog index.';
    blogPostsElement.replaceChildren(message);
  }
}

loadBlogPosts();