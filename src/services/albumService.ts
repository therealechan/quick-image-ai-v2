import type { Album, GalleryImage, CreateAlbumData } from '@/types/album'

export class AlbumService {
  private albums: Album[] = []
  private images: GalleryImage[] = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage(): void {
    try {
      const storedAlbums = localStorage.getItem('quick-image-ai-albums')
      const storedImages = localStorage.getItem('quick-image-ai-images')
      
      if (storedAlbums) {
        this.albums = JSON.parse(storedAlbums).map((album: Album & { createdAt: string; updatedAt: string }) => ({
          ...album,
          createdAt: new Date(album.createdAt),
          updatedAt: new Date(album.updatedAt)
        }))
      }
      
      if (storedImages) {
        this.images = JSON.parse(storedImages).map((image: GalleryImage & { createdAt: string }) => ({
          ...image,
          createdAt: new Date(image.createdAt)
        }))
      }
    } catch (error) {
      console.error('Failed to load from storage:', error)
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('quick-image-ai-albums', JSON.stringify(this.albums))
      localStorage.setItem('quick-image-ai-images', JSON.stringify(this.images))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  getAllAlbums(): Album[] {
    return [...this.albums]
  }

  getAllImages(): GalleryImage[] {
    return [...this.images]
  }

  getAlbumById(id: string): Album | undefined {
    return this.albums.find(album => album.id === id)
  }

  getImagesByAlbumId(albumId: string): GalleryImage[] {
    return this.images.filter(image => image.albumId === albumId)
  }

  getImagesWithoutAlbum(): GalleryImage[] {
    return this.images.filter(image => !image.albumId)
  }

  createAlbum(data: CreateAlbumData): Album {
    const newAlbum: Album = {
      id: `album-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      imageCount: 0,
      tags: data.tags || []
    }

    this.albums.push(newAlbum)
    this.saveToStorage()
    return newAlbum
  }

  updateAlbum(id: string, data: Partial<CreateAlbumData>): Album | null {
    const albumIndex = this.albums.findIndex(album => album.id === id)
    if (albumIndex === -1) return null

    const album = this.albums[albumIndex]
    if (!album) return null
    
    if (data.name !== undefined) album.name = data.name
    if (data.description !== undefined) album.description = data.description
    if (data.tags !== undefined) album.tags = data.tags
    
    album.updatedAt = new Date()
    this.updateAlbumImageCount(id)
    this.saveToStorage()
    
    return album
  }

  deleteAlbum(id: string): boolean {
    const albumIndex = this.albums.findIndex(album => album.id === id)
    if (albumIndex === -1) return false

    this.images.forEach(image => {
      if (image.albumId === id) {
        image.albumId = undefined
      }
    })

    this.albums.splice(albumIndex, 1)
    this.saveToStorage()
    return true
  }

  moveImagesToAlbum(imageIds: string[], albumId: string): boolean {
    const album = this.getAlbumById(albumId)
    if (!album) return false

    let updated = false
    this.images.forEach(image => {
      if (imageIds.includes(image.id)) {
        image.albumId = albumId
        updated = true
      }
    })

    if (updated) {
      this.updateAlbumImageCount(albumId)
      album.updatedAt = new Date()
      this.saveToStorage()
    }

    return updated
  }

  removeImagesFromAlbum(imageIds: string[]): boolean {
    let updated = false
    const affectedAlbums = new Set<string>()

    this.images.forEach(image => {
      if (imageIds.includes(image.id) && image.albumId) {
        affectedAlbums.add(image.albumId)
        image.albumId = undefined
        updated = true
      }
    })

    if (updated) {
      affectedAlbums.forEach(albumId => {
        this.updateAlbumImageCount(albumId)
        const album = this.getAlbumById(albumId)
        if (album) {
          album.updatedAt = new Date()
        }
      })
      this.saveToStorage()
    }

    return updated
  }

  addImages(images: GalleryImage[]): void {
    this.images.push(...images)
    this.saveToStorage()
  }

  removeImages(imageIds: string[]): boolean {
    const initialLength = this.images.length
    const affectedAlbums = new Set<string>()

    this.images = this.images.filter(image => {
      if (imageIds.includes(image.id)) {
        if (image.albumId) {
          affectedAlbums.add(image.albumId)
        }
        return false
      }
      return true
    })

    if (this.images.length !== initialLength) {
      affectedAlbums.forEach(albumId => {
        this.updateAlbumImageCount(albumId)
        const album = this.getAlbumById(albumId)
        if (album) {
          album.updatedAt = new Date()
        }
      })
      this.saveToStorage()
      return true
    }

    return false
  }

  private updateAlbumImageCount(albumId: string): void {
    const album = this.getAlbumById(albumId)
    if (album) {
      album.imageCount = this.getImagesByAlbumId(albumId).length
    }
  }

  updateAlbumCover(albumId: string, coverImageUrl: string): boolean {
    const album = this.getAlbumById(albumId)
    if (!album) return false

    album.coverImage = coverImageUrl
    album.updatedAt = new Date()
    this.saveToStorage()
    return true
  }

  searchAlbums(query: string): Album[] {
    if (!query.trim()) return this.getAllAlbums()

    const lowerQuery = query.toLowerCase()
    return this.albums.filter(album => 
      album.name.toLowerCase().includes(lowerQuery) ||
      album.description?.toLowerCase().includes(lowerQuery) ||
      album.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  initializeWithMockData(albums: Album[], images: GalleryImage[]): void {
    if (this.albums.length === 0 && this.images.length === 0) {
      this.albums = albums
      this.images = images
      this.saveToStorage()
    }
  }
}

export const albumService = new AlbumService()