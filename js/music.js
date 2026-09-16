const musicPlayBtn = document.getElementById('musicPlayBtn');
const musicVolume = document.getElementById('musicVolume');
const musicAudio = document.getElementById('musicAudio');
const musicDescription = document.getElementById('musicDescription');
const softlyTrackBtn = document.getElementById('softlyTrackBtn');
const publishedMusic = document.getElementById('publishedMusic');
const musicAdminForm = document.getElementById('musicAdminForm');
const musicAdminStatus = document.getElementById('musicAdminStatus');
const musicFileInput = document.getElementById('musicFileInput');
const ADMIN_UUID = '13df2e26-2285-43de-855d-ba42c9c9ff8d';
const MUSIC_BUCKET = 'music';
const MAX_MUSIC_FILE_SIZE = 50 * 1024 * 1024;

async function toggleMusic() {
  if (musicAudio.paused) {
    await musicAudio.play();
    musicPlayBtn.textContent = '||';
    musicPlayBtn.title = 'Pause music';
    musicPlayBtn.setAttribute('aria-label', 'Pause music');
  } else {
    musicAudio.pause();
    musicPlayBtn.textContent = '▶';
    musicPlayBtn.title = 'Play music';
    musicPlayBtn.setAttribute('aria-label', 'Play music');
  }
}

musicPlayBtn.addEventListener('click', toggleMusic);
musicVolume.addEventListener('input', () => {
  musicAudio.volume = Number(musicVolume.value);
});
musicAudio.volume = Number(musicVolume.value);
musicAudio.addEventListener('pause', () => {
  musicPlayBtn.textContent = '▶';
  musicPlayBtn.title = 'Play music';
  musicPlayBtn.setAttribute('aria-label', 'Play music');
});

softlyTrackBtn.addEventListener('click', () => {
  setMusicTrack('Softly', './assets/music-softly.ogg');
});

function setMusicTrack(title, url) {
  musicAudio.pause();
  musicAudio.src = url;
  musicAudio.load();
  document.getElementById('musicStatus').textContent = title;
  musicDescription.textContent = `Current song: ${title}`;
  musicPlayBtn.textContent = '▶';
  musicPlayBtn.title = 'Play music';
  musicPlayBtn.setAttribute('aria-label', 'Play music');
}

function renderPublishedMusic(tracks) {
  publishedMusic.replaceChildren();
  if (!tracks.length) return;
  const label = document.createElement('span');
  label.className = 'published-music-label';
  label.textContent = 'Published tracks';
  publishedMusic.append(label);
  tracks.forEach((track) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'music-track';
    button.textContent = track.title;
    button.addEventListener('click', () => setMusicTrack(track.title, track.url));
    publishedMusic.append(button);
  });
}

async function loadPublishedMusic() {
  const { data, error } = await _supabase.from('music').select('id, title, url').order('created_at', { ascending: false });
  if (error) {
    musicAdminStatus.textContent = 'Published music is unavailable.';
    return;
  }
  renderPublishedMusic(data || []);
}

async function setupMusicAdmin() {
  const { data: { user } } = await _supabase.auth.getUser();
  musicAdminForm.hidden = user?.id !== ADMIN_UUID;
}

const musicAdminCheck = setInterval(async () => {
  await setupMusicAdmin();
  if (!musicAdminForm.hidden) clearInterval(musicAdminCheck);
}, 1000);

_supabase.auth.onAuthStateChange((event, session) => {
  musicAdminForm.hidden = session?.user?.id !== ADMIN_UUID;
});

musicAdminForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('musicTitleInput').value.trim();
  const url = document.getElementById('musicUrlInput').value.trim();
  const file = musicFileInput.files[0];
  if (!file && !/^https?:\/\//i.test(url)) {
    musicAdminStatus.textContent = 'Choose an audio file or enter a valid http or https URL.';
    return;
  }
  if (file && file.size > MAX_MUSIC_FILE_SIZE) {
    musicAdminStatus.textContent = 'Audio files must be 50 MB or smaller.';
    return;
  }
  if (file && file.type && !file.type.startsWith('audio/')) {
    musicAdminStatus.textContent = 'Choose a supported audio file.';
    return;
  }
  musicAdminStatus.textContent = 'Publishing...';
  const { data: { user } } = await _supabase.auth.getUser();
  if (user?.id !== ADMIN_UUID) {
    musicAdminStatus.textContent = 'Admin access required.';
    return;
  }
  let publishedUrl = url;
  if (file) {
    const safeFileName = file.name.replace(/[^a-z0-9._-]/gi, '-');
    const filePath = `${user.id}/${crypto.randomUUID()}-${safeFileName}`;
    const { error: uploadError } = await _supabase.storage.from(MUSIC_BUCKET).upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type || 'audio/mpeg',
      upsert: false
    });
    if (uploadError) {
      musicAdminStatus.textContent = `Could not upload: ${uploadError.message}`;
      return;
    }
    const { data: publicUrlData } = _supabase.storage.from(MUSIC_BUCKET).getPublicUrl(filePath);
    publishedUrl = publicUrlData.publicUrl;
  }
  const { error } = await _supabase.from('music').insert({ title, url: publishedUrl, created_by: user.id });
  if (error) {
    musicAdminStatus.textContent = `Could not publish: ${error.message}`;
    return;
  }
  musicAdminForm.reset();
  musicAdminStatus.textContent = 'Track published.';
  await loadPublishedMusic();
});

loadPublishedMusic();
setupMusicAdmin();