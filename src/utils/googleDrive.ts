import { getAccessToken, googleSignIn } from './firebaseAuth';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  hasThumbnail?: boolean;
}

export interface GalleryPhoto {
  id: number;
  url: string;
  caption: string;
  driveFileId?: string;
  fileName?: string;
}

export const PRINCESS_CAPTIONS = [
  'You look like a princess 👑✨',
  'You are so beautiful 🌸💖',
  'Your smile is so sweet 🥰💕',
  'So charming and graceful 🌷💫',
  'Radiant like sunshine ☀️💛',
  'Sweetest princess vibe 👸🤍',
  'Cute and lovely moments 🎀✨',
  'Always shining bright 🌟💎',
  'The sweetest birthday girl 🎂💖',
];

// Helper to extract a number from a filename like "1.jpg", "foto 2.png", "03.webp", etc.
export const extractOrderNumber = (filename: string): number => {
  const clean = filename.replace(/\.[^/.]+$/, ''); // remove extension
  const matches = clean.match(/\d+/);
  if (matches) {
    return parseInt(matches[0], 10);
  }
  return 999;
};

// Search Google Drive for a folder named "foto desima"
export const findDesimaFolder = async (folderName = 'foto desima'): Promise<{ id: string; name: string } | null> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Silakan masuk dengan Google Drive terlebih dahulu');

  // Try exact match first
  const query = encodeURIComponent(`mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`);
  const fields = encodeURIComponent('files(id, name)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=10`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Drive API Error: ${errorText}`);
  }

  const data = await res.json();
  if (data.files && data.files.length > 0) {
    return data.files[0];
  }

  // Fallback: search with name contains
  const fuzzyQuery = encodeURIComponent(`mimeType = 'application/vnd.google-apps.folder' and name contains 'desima' and trashed = false`);
  const fuzzyUrl = `https://www.googleapis.com/drive/v3/files?q=${fuzzyQuery}&fields=${fields}&pageSize=10`;
  const fuzzyRes = await fetch(fuzzyUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (fuzzyRes.ok) {
    const fuzzyData = await fuzzyRes.json();
    if (fuzzyData.files && fuzzyData.files.length > 0) {
      return fuzzyData.files[0];
    }
  }

  return null;
};

// List files inside a specific folder, filtered and sorted from 1 to 9
export const listPhotosInFolder = async (folderId: string): Promise<DriveFile[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Belum terhubung ke Google Drive');

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent('files(id, name, mimeType, thumbnailLink, webContentLink)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Gagal membaca isi folder dari Google Drive');
  }

  const data = await res.json();
  const files: DriveFile[] = data.files || [];

  // Sort files 1 to 9 sequentially
  files.sort((a, b) => {
    const numA = extractOrderNumber(a.name);
    const numB = extractOrderNumber(b.name);
    if (numA !== numB) {
      return numA - numB;
    }
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  return files.slice(0, 9);
};

// Download image binary from Google Drive as a Base64 Data URL
export const fetchDriveImageAsDataUrl = async (fileId: string): Promise<string> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Belum terhubung ke Google Drive');

  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    // If alt=media fails (e.g. large file or permission), try thumbnail or high-res thumbnail
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Full synchronization routine:
// 1. Ensures token
// 2. Finds folder 'foto desima'
// 3. Lists files 1 to 9
// 4. Downloads image data as data URLs
// 5. Posts to backend API /api/gallery-photos so that anyone opening the site sees the same photos
export const syncPhotosFromGoogleDrive = async (
  onProgress?: (status: string, current: number, total: number) => void,
  targetFolderId?: string
): Promise<GalleryPhoto[]> => {
  let token = await getAccessToken();
  if (!token) {
    onProgress?.('Menghubungkan ke Google Drive...', 0, 9);
    const signResult = await googleSignIn();
    if (!signResult) {
      throw new Error('Login Google dibatalkan');
    }
    token = signResult.accessToken;
  }

  let folderId = targetFolderId;
  let folderName = 'foto desima';

  if (!folderId) {
    onProgress?.('Mencari folder "foto desima" di Google Drive...', 0, 9);
    const folder = await findDesimaFolder('foto desima');
    if (folder) {
      folderId = folder.id;
      folderName = folder.name;
    } else {
      folderId = '1VD6YjN4BgFEuqCMuhx2Wet2Ic_jcI8W0';
    }
  }

  onProgress?.(`Mengambil urutan foto 1 sampai 9 dari Google Drive...`, 0, 9);
  const driveFiles = await listPhotosInFolder(folderId);

  if (driveFiles.length === 0) {
    throw new Error(`Tidak ada file foto yang ditemukan di folder.`);
  }

  const galleryItems: GalleryPhoto[] = [];

  for (let i = 0; i < driveFiles.length && i < 9; i++) {
    const file = driveFiles[i];
    onProgress?.(`Mengunduh foto ${i + 1} dari 9 (${file.name})...`, i + 1, driveFiles.length);

    try {
      const dataUrl = await fetchDriveImageAsDataUrl(file.id);
      galleryItems.push({
        id: i + 1,
        url: dataUrl,
        caption: PRINCESS_CAPTIONS[i] || 'Princess Desima 👑✨',
        driveFileId: file.id,
        fileName: file.name,
      });
    } catch (err) {
      console.warn(`Gagal mengunduh foto ${file.name}, menggunakan direct link:`, err);
      galleryItems.push({
        id: i + 1,
        url: `https://lh3.googleusercontent.com/d/${file.id}`,
        caption: PRINCESS_CAPTIONS[i] || 'Princess Desima 👑✨',
        driveFileId: file.id,
        fileName: file.name,
      });
    }
  }

  onProgress?.('Menyimpan foto ke server agar dapat dilihat di semua perangkat...', 9, 9);

  // Send to backend API
  try {
    const res = await fetch('/api/gallery-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos: galleryItems }),
    });
    if (!res.ok) {
      console.warn('Gagal menyimpan ke server backend, menyimpan di localStorage');
    }
  } catch (backendErr) {
    console.warn('Backend API tidak merespon, menyimpan lokal:', backendErr);
  }

  // Backup in localStorage
  try {
    localStorage.setItem('desima_clean_photos_v1', JSON.stringify(galleryItems));
    localStorage.setItem('desima_drive_synced_photos', JSON.stringify(galleryItems));
  } catch {
    // quota exceeded, ignore
  }

  return galleryItems;
};

// Fetch currently saved gallery photos from backend server or local cache
export const getSavedGalleryPhotos = async (): Promise<GalleryPhoto[] | null> => {
  try {
    const res = await fetch('/api/gallery-photos');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.photos) && json.photos.length > 0) {
        return json.photos;
      }
    }
  } catch {
    // fallback
  }

  try {
    const staticRes = await fetch('/gallery_photos.json');
    if (staticRes.ok) {
      const json = await staticRes.json();
      const list = Array.isArray(json) ? json : json.photos;
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch {
    // fallback
  }

  try {
    const local = localStorage.getItem('desima_drive_synced_photos') || localStorage.getItem('desima_clean_photos_v1');
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (!parsed[0]?.url?.includes('unsplash.com')) {
          return parsed;
        }
      }
    }
  } catch {
    // ignore
  }

  return null;
};
