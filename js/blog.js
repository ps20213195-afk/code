const blogPostsElement = document.getElementById('blogPosts');
const blogStatusElement = document.getElementById('blogStatus');
const blogMenuElement = document.getElementById('blogMenu');
const blogPostForm = document.getElementById('blogPostForm');
const BLOG_INDEX_URL = './blog/index.json';
const BLOG_REPOSITORY_API = 'https://api.github.com/repos/ps20213195-afk/code/contents/blog?ref=main';
const GUEST_POSTS_KEY = 'skybase-guest-blog-posts';
const GUEST_COMMENTS_KEY = 'skybase-guest-blog-comments';
let selectedBlogPostId = null;

function readGuestStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

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
    id: `file-${filename}`,
    filename,
    title: metadata.TITLE || filename,
    date: formattedDate,
    author: metadata.AUTHOR_NAME || '',
    flair: metadata.AUTHOR_FLAIR || metadata.AUTOR_FLAIR || '',
    body: lines.slice(bodyStart).join('\n').trim(),
    source: 'file'
  };
}

function getSafeLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

function getLinkKind(url) {
  const host = url.hostname.toLowerCase();
  if (host === 'giphy.com' || host.endsWith('.giphy.com')) return 'giphy';
  if (/\.(?:avif|bmp|jpe?g|png|webp)$/i.test(url.pathname)) return 'image';
  if (/\.gif$/i.test(url.pathname)) return 'file';
  return 'file';
}

function filenameFromUrl(url) {
  const lastPart = url.pathname.split('/').filter(Boolean).pop();
  if (!lastPart) return url.hostname;
  try {
    return decodeURIComponent(lastPart);
  } catch {
    return lastPart;
  }
}

function renderLink(value, className = 'blog-post-media') {
  const url = getSafeLink(value);
  if (!url) return null;
  const kind = getLinkKind(url);
  const wrapper = document.createElement('div');
  wrapper.className = className;

  if (kind === 'image') {
    const anchor = document.createElement('a');
    anchor.href = url.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    const image = document.createElement('img');
    image.src = url.href;
    image.alt = filenameFromUrl(url);
    image.loading = 'lazy';
    image.referrerPolicy = 'no-referrer';
    anchor.append(image);
    wrapper.append(anchor);
    return wrapper;
  }

  const isGiphy = url.hostname === 'giphy.com' || url.hostname.endsWith('.giphy.com');
  const mediaMatch = isGiphy && url.pathname.match(/^\/media\/([A-Za-z0-9]+)\/(?:[^/]+\.)?gif$/i);
  if (mediaMatch) {
    const image = document.createElement('img');
    image.src = url.href;
    image.alt = 'GIPHY GIF';
    image.loading = 'lazy';
    image.referrerPolicy = 'no-referrer';
    wrapper.append(image);
    return wrapper;
  }
  const embedMatch = isGiphy && url.pathname.match(/^\/embed\/([A-Za-z0-9]+)/i);
  const gifPathMatch = isGiphy && url.pathname.match(/^\/gifs\/(?:.*-)?([A-Za-z0-9]+)\/?$/i);
  const gifId = embedMatch?.[1] || gifPathMatch?.[1];
  if (gifId) {
    const frame = document.createElement('iframe');
    frame.src = `https://giphy.com/embed/${encodeURIComponent(gifId)}`;
    frame.title = 'GIPHY GIF';
    frame.loading = 'lazy';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    wrapper.append(frame);
    return wrapper;
  }

  const anchor = document.createElement('a');
  anchor.href = url.href;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.textContent = filenameFromUrl(url);
  anchor.className = 'blog-link-filename';
  wrapper.append(anchor);
  return wrapper;
}

function appendBodyWithLinks(container, body) {
  const urlPattern = /https:\/\/[^\s<>"']+/gi;
  let currentIndex = 0;
  for (const match of body.matchAll(urlPattern)) {
    const rawUrl = match[0];
    const cleanUrl = rawUrl.replace(/[),.!?;:]+$/, '');
    const punctuation = rawUrl.slice(cleanUrl.length);
    container.append(document.createTextNode(body.slice(currentIndex, match.index)));
    const rendered = renderLink(cleanUrl, 'blog-inline-media');
    if (rendered) container.append(rendered);
    else container.append(document.createTextNode(cleanUrl));
    if (punctuation) container.append(document.createTextNode(punctuation));
    currentIndex = match.index + rawUrl.length;
  }
  container.append(document.createTextNode(body.slice(currentIndex)));
}

function renderBlogPost(post) {
  const article = document.createElement('article');
  article.className = 'blog-post';
  article.dataset.blogPostId = post.id;
  const header = document.createElement('header');
  header.className = 'blog-post-header';
  const title = document.createElement('h2');
  title.className = 'blog-post-title';
  title.textContent = post.title;
  header.append(title);

  const meta = document.createElement('p');
  meta.className = 'blog-post-meta';
  const dateValue = post.created_at || post.date;
  if (dateValue) {
    const date = document.createElement('time');
    const parsedDate = new Date(dateValue);
    date.textContent = Number.isNaN(parsedDate.getTime()) ? dateValue : parsedDate.toLocaleString();
    if (!Number.isNaN(parsedDate.getTime())) date.dateTime = parsedDate.toISOString();
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
  if (post.source === 'file' && window.marked && window.DOMPurify) {
    content.innerHTML = window.DOMPurify.sanitize(window.marked.parse(post.body));
  } else {
    content.style.whiteSpace = 'pre-wrap';
    appendBodyWithLinks(content, post.body || '');
  }
  if (post.media_url) {
    const media = renderLink(post.media_url);
    if (media) content.append(media);
  }
  article.append(header, content);
  if (post.source === 'community' || post.source === 'guest') appendComments(article, post);
  return article;
}

function renderBlogMenu(posts) {
  blogMenuElement.replaceChildren();
  posts.forEach((post, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'blog-menu-item';
    button.textContent = post.title;
    button.setAttribute('aria-pressed', String(post.id === selectedBlogPostId || (!selectedBlogPostId && index === 0)));
    button.addEventListener('click', () => {
      selectedBlogPostId = post.id;
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

async function loadStaticPosts() {
  const files = await getBlogFiles();
  const results = await Promise.all(files.map(async ({ filename, url }) => {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Could not load ${filename}`);
      return parseBlogPost(await response.text(), filename);
    } catch (error) {
      console.warn('Could not load blog post.', error);
      return null;
    }
  }));
  return results.filter(Boolean);
}

async function loadCommunityPosts() {
  if (window.GUEST_MODE) {
    return readGuestStorage(GUEST_POSTS_KEY).map((post) => ({
      ...post,
      source: 'guest',
      author: 'Guest',
      flair: 'Local preview'
    }));
  }
  const { data, error } = await _supabase
    .from('blog_posts')
    .select('id, title, body, media_url, author_id, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  const posts = data || [];
  const authorIds = [...new Set(posts.map((post) => post.author_id).filter(Boolean))];
  const profiles = new Map();
  if (authorIds.length) {
    const { data: rows, error: profileError } = await _supabase
      .from('profiles')
      .select('id, username, flair')
      .in('id', authorIds);
    if (!profileError) (rows || []).forEach((profile) => profiles.set(profile.id, profile));
  }
  return posts.map((post) => ({
    ...post,
    id: `community-${post.id}`,
    databaseId: post.id,
    author: profiles.get(post.author_id)?.username || 'Skybase user',
    flair: profiles.get(post.author_id)?.flair || '',
    source: 'community'
  }));
}

function showBlogEmpty(message) {
  const empty = document.createElement('p');
  empty.className = 'blog-post-empty';
  empty.textContent = message;
  blogPostsElement.replaceChildren(empty);
}

async function appendComments(article, post) {
  const section = document.createElement('section');
  section.className = 'blog-comments';
  const heading = document.createElement('h3');
  heading.textContent = 'Comments';
  const list = document.createElement('div');
  list.className = 'blog-comment-list';
  const status = document.createElement('p');
  status.className = 'blog-comment-status';
  status.textContent = 'Loading comments...';
  section.append(heading, list, status);

  const form = document.createElement('form');
  form.className = 'blog-comment-form';
  const bodyLabel = document.createElement('label');
  bodyLabel.textContent = 'Comment';
  const bodyInput = document.createElement('textarea');
  bodyInput.name = 'body';
  bodyInput.maxLength = 2000;
  bodyInput.rows = 3;
  bodyInput.placeholder = 'Write a comment...';
  bodyInput.required = true;
  bodyLabel.append(bodyInput);
  const mediaLabel = document.createElement('label');
  mediaLabel.textContent = 'Picture, file, or GIPHY link (optional)';
  const mediaInput = document.createElement('input');
  mediaInput.name = 'media_url';
  mediaInput.type = 'url';
  mediaInput.maxLength = 2048;
  mediaInput.placeholder = 'https://...';
  mediaLabel.append(mediaInput);
  const giphyLabel = document.createElement('label');
  giphyLabel.textContent = 'Find a GIF on GIPHY';
  const searchRow = document.createElement('span');
  searchRow.className = 'blog-giphy-search';
  const queryInput = document.createElement('input');
  queryInput.type = 'search';
  queryInput.placeholder = 'Search GIFs';
  const searchButton = document.createElement('button');
  searchButton.type = 'button';
  searchButton.className = 'btn-secondary';
  searchButton.textContent = 'Search';
  searchButton.addEventListener('click', () => openGiphySearch(queryInput.value));
  searchRow.append(queryInput, searchButton);
  giphyLabel.append(searchRow);
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Add comment';
  form.append(bodyLabel, mediaLabel, giphyLabel, submit);
  section.append(form);
  article.append(section);

  let data;
  let error;
  if (window.GUEST_MODE) {
    data = readGuestStorage(GUEST_COMMENTS_KEY).filter((comment) => comment.post_id === post.databaseId);
  } else {
    ({ data, error } = await _supabase
      .from('blog_comments')
      .select('id, body, media_url, author_id, created_at')
      .eq('post_id', post.databaseId)
      .order('created_at', { ascending: true })
      .limit(200));
  }
  if (error) {
    status.textContent = 'Comments unavailable. Apply blog-rls.sql in Supabase.';
  } else {
    const comments = data || [];
    const authorIds = [...new Set(comments.map((comment) => comment.author_id).filter(Boolean))];
    const profiles = new Map();
    if (authorIds.length) {
      const { data: rows } = await _supabase.from('profiles').select('id, username').in('id', authorIds);
      (rows || []).forEach((profile) => profiles.set(profile.id, profile));
    }
    list.replaceChildren();
    comments.forEach((comment) => {
      const item = document.createElement('article');
      item.className = 'blog-comment';
      const meta = document.createElement('p');
      meta.className = 'blog-comment-meta';
      meta.textContent = `${window.GUEST_MODE ? 'Guest' : profiles.get(comment.author_id)?.username || 'Skybase user'} · ${new Date(comment.created_at).toLocaleString()}`;
      const text = document.createElement('p');
      text.className = 'blog-comment-body';
      appendBodyWithLinks(text, comment.body);
      item.append(meta, text);
      if (comment.media_url) {
        const media = renderLink(comment.media_url);
        if (media) item.append(media);
      }
      list.append(item);
    });
    status.textContent = comments.length ? `${comments.length} comment${comments.length === 1 ? '' : 's'}` : 'No comments yet.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Posting comment...';
    const { data: { user } } = window.GUEST_MODE
      ? { data: { user: null } }
      : await _supabase.auth.getUser();
    if (!window.GUEST_MODE && !user) {
      status.textContent = 'Sign in to comment.';
      return;
    }
    const body = bodyInput.value.trim();
    const mediaUrl = mediaInput.value.trim();
    if (!body) return;
    if (mediaUrl && !isAllowedMediaUrl(mediaUrl)) {
      status.textContent = 'Use an HTTPS image, file, or GIPHY link.';
      return;
    }
    const newComment = {
      post_id: post.databaseId,
      author_id: user?.id || null,
      body,
      media_url: mediaUrl || null,
      created_at: new Date().toISOString()
    };
    let insertError = null;
    if (window.GUEST_MODE) {
      const comments = readGuestStorage(GUEST_COMMENTS_KEY);
      comments.push(newComment);
      localStorage.setItem(GUEST_COMMENTS_KEY, JSON.stringify(comments));
    } else {
      ({ error: insertError } = await _supabase.from('blog_comments').insert(newComment));
    }
    if (insertError) {
      status.textContent = 'Could not post comment. Apply blog-rls.sql in Supabase.';
      console.error('Could not post blog comment.', insertError);
      return;
    }
    selectedBlogPostId = post.id;
    await loadBlogPosts();
  });
}

function isAllowedMediaUrl(value) {
  return Boolean(getSafeLink(value));
}

function openGiphySearch(query) {
  window.open(`https://giphy.com/search/${encodeURIComponent(query.trim())}`, '_blank', 'noopener,noreferrer');
}

async function loadBlogPosts() {
  if (!blogPostsElement || !blogStatusElement || !blogMenuElement) return;
  blogStatusElement.textContent = 'Loading posts...';
  try {
    const staticPosts = await loadStaticPosts();
    let communityPosts = [];
    let communityUnavailable = false;
    try {
      communityPosts = await loadCommunityPosts();
    } catch (error) {
      communityUnavailable = true;
      console.warn('Could not load community blog posts.', error);
    }

    const posts = [...communityPosts, ...staticPosts].sort((left, right) => {
      const leftDate = new Date(left.created_at || left.date || 0).getTime() || 0;
      const rightDate = new Date(right.created_at || right.date || 0).getTime() || 0;
      return rightDate - leftDate;
    });
    if (!posts.length) {
      selectedBlogPostId = null;
      blogMenuElement.replaceChildren();
      showBlogEmpty('No blog posts found.');
    } else {
      if (!posts.some((post) => post.id === selectedBlogPostId)) selectedBlogPostId = posts[0].id;
      renderBlogMenu(posts);
      const selectedPost = posts.find((post) => post.id === selectedBlogPostId) || posts[0];
      blogPostsElement.replaceChildren(renderBlogPost(selectedPost));
    }
    blogStatusElement.textContent = `${posts.length} post${posts.length === 1 ? '' : 's'}${window.GUEST_MODE ? ' · local guest preview' : communityUnavailable ? ' · community posts unavailable (apply blog-rls.sql)' : ''}`;
  } catch (error) {
    console.error('Could not load blog posts.', error);
    blogStatusElement.textContent = 'Blog files unavailable';
    showBlogEmpty('Could not load the blog posts.');
  }
}

blogPostForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = blogPostForm.querySelector('.blog-form-status');
  status.textContent = 'Publishing...';
  const { data: { user } } = window.GUEST_MODE
    ? { data: { user: null } }
    : await _supabase.auth.getUser();
  if (!window.GUEST_MODE && !user) {
    status.textContent = 'Sign in to publish a post.';
    return;
  }
  const title = document.getElementById('blogTitleInput').value.trim();
  const body = document.getElementById('blogBodyInput').value.trim();
  const mediaUrl = document.getElementById('blogMediaInput').value.trim();
  if (!title || !body) {
    status.textContent = 'Add a title and post text.';
    return;
  }
  if (mediaUrl && !isAllowedMediaUrl(mediaUrl)) {
    status.textContent = 'Use an HTTPS image, file, or GIPHY link.';
    return;
  }
  const post = {
    title,
    body,
    media_url: mediaUrl || null,
    author_id: user?.id || null,
    created_at: new Date().toISOString()
  };
  let error = null;
  if (window.GUEST_MODE) {
    post.id = `guest-${crypto.randomUUID()}`;
    post.databaseId = post.id;
    post.source = 'guest';
    const posts = readGuestStorage(GUEST_POSTS_KEY);
    posts.unshift(post);
    localStorage.setItem(GUEST_POSTS_KEY, JSON.stringify(posts));
  } else {
    ({ error } = await _supabase.from('blog_posts').insert(post));
  }
  if (error) {
    status.textContent = 'Could not publish. Apply blog-rls.sql in Supabase.';
    console.error('Could not publish blog post.', error);
    return;
  }
  blogPostForm.reset();
  status.textContent = window.GUEST_MODE ? 'Saved to this browser only.' : 'Post published.';
  await loadBlogPosts();
});

document.getElementById('blogGiphySearchButton')?.addEventListener('click', () => {
  openGiphySearch(document.getElementById('blogGiphyQuery').value);
});

document.querySelector('[data-view="blog"]')?.addEventListener('click', loadBlogPosts);
loadBlogPosts();