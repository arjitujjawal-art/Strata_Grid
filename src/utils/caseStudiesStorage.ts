import { CaseStudy, GalleryItem } from '../types';
import { MOCK_CASE_STUDIES, MOCK_GALLERY } from '../data/mockData';

const CASE_STUDIES_STORAGE_KEY = 'stratagrid_custom_case_studies';
const GALLERY_STORAGE_KEY = 'stratagrid_custom_gallery_items';
const SYNC_EVENT_NAME = 'stratagrid_studies_synced';

/**
 * Retrieves all case studies (combining official mock pilots + user-submitted & AI verified studies)
 */
export function getAllCaseStudies(): CaseStudy[] {
  try {
    const raw = localStorage.getItem(CASE_STUDIES_STORAGE_KEY);
    if (!raw) return MOCK_CASE_STUDIES;
    const customStudies: CaseStudy[] = JSON.parse(raw);
    // Combine custom studies first, then standard pilots
    return [...customStudies, ...MOCK_CASE_STUDIES];
  } catch (err) {
    console.error('Error loading custom case studies:', err);
    return MOCK_CASE_STUDIES;
  }
}

/**
 * Retrieves all gallery items (combining standard gallery + verified field inspection scans)
 */
export function getAllGalleryItems(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return MOCK_GALLERY;
    const customItems: GalleryItem[] = JSON.parse(raw);
    return [...customItems, ...MOCK_GALLERY];
  } catch (err) {
    console.error('Error loading custom gallery items:', err);
    return MOCK_GALLERY;
  }
}

/**
 * Saves a new AI-verified case study and its corresponding Inspection Gallery item
 */
export function saveVerifiedCaseStudy(
  caseStudy: CaseStudy,
  galleryItem?: GalleryItem
): void {
  try {
    // 1. Save Case Study
    const rawStudies = localStorage.getItem(CASE_STUDIES_STORAGE_KEY);
    const existingStudies: CaseStudy[] = rawStudies ? JSON.parse(rawStudies) : [];
    // Deduplicate if id exists
    const updatedStudies = [caseStudy, ...existingStudies.filter(s => s.id !== caseStudy.id)];
    localStorage.setItem(CASE_STUDIES_STORAGE_KEY, JSON.stringify(updatedStudies));

    // 2. Save Gallery Item if present
    if (galleryItem) {
      const rawGallery = localStorage.getItem(GALLERY_STORAGE_KEY);
      const existingGallery: GalleryItem[] = rawGallery ? JSON.parse(rawGallery) : [];
      const updatedGallery = [galleryItem, ...existingGallery.filter(g => g.id !== galleryItem.id)];
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedGallery));
    }

    // 3. Broadcast sync event to all components
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, {
      detail: { caseStudy, galleryItem }
    }));
  } catch (err) {
    console.error('Error saving verified case study:', err);
  }
}

/**
 * Deletes a user-submitted case study and its linked gallery item
 */
export function deleteCustomCaseStudy(caseStudyId: string): void {
  try {
    const rawStudies = localStorage.getItem(CASE_STUDIES_STORAGE_KEY);
    if (rawStudies) {
      const existingStudies: CaseStudy[] = JSON.parse(rawStudies);
      const updatedStudies = existingStudies.filter(s => s.id !== caseStudyId);
      localStorage.setItem(CASE_STUDIES_STORAGE_KEY, JSON.stringify(updatedStudies));
    }

    const rawGallery = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (rawGallery) {
      const existingGallery: GalleryItem[] = JSON.parse(rawGallery);
      const updatedGallery = existingGallery.filter(g => g.caseStudyId !== caseStudyId);
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updatedGallery));
    }

    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME));
  } catch (err) {
    console.error('Error deleting custom case study:', err);
  }
}

/**
 * Subscribes a React component to sync updates
 */
export function subscribeToStudiesSync(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(SYNC_EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(SYNC_EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
