export interface Album {
  id: string
  name: string
  description?: string
  coverImage?: string
  createdAt: Date
  updatedAt: Date
  imageCount: number
  tags?: string[]
}

export interface GalleryImage {
  id: string
  url: string
  title: string
  description?: string
  category: string
  albumId?: string
  createdAt: Date
  size: {
    width: number
    height: number
  }
  fileSize?: string
  tags?: string[]
}

export type GroupByType = 'all' | 'day' | 'month' | 'year' | 'album'

export interface AlbumGroup {
  key: string
  title: string
  album?: Album
  images: GalleryImage[]
  count: number
}

export interface CreateAlbumData {
  name: string
  description?: string
  tags?: string[]
}

export interface MoveToAlbumData {
  imageIds: string[]
  albumId: string
}