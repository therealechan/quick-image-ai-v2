// 生成状态枚举
export enum GenerationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// 生成状态类型
export type GenerationStatusType = 'pending' | 'processing' | 'completed' | 'failed'

// 上传图片接口（用于视频生成）
export interface UploadedImage {
  id: string
  url: string              // 图片 URL
  file?: File             // 原始文件（上传时）
  width: number
  height: number
  size: number            // 文件大小（bytes）
  aspectRatio: number     // 宽高比
}

// 视频比例接口
export interface AspectRatio {
  id: string
  name: string
  width: number
  height: number
}

// 基础历史记录接口
export interface BaseHistoryItem {
  id: string
  timestamp: Date
  prompt: string
  results: Array<{
    id: string
    url: string
  }>
  isFavorite: boolean
  status: GenerationStatusType
}

// 服装生成历史记录（原有的）
export interface ClothingHistoryItem extends BaseHistoryItem {
  type: 'clothing'
  models: any[]
  tops: any[]
  bottoms: any[]
  accessories: any[]
  background?: any
  batchMode: boolean
}

// 姿势生成历史记录
export interface PoseHistoryItem extends BaseHistoryItem {
  type: 'pose'
  model: any | null  // 选择的模特（来自图库）
  uploadedModel: string | null  // 上传的模特图片URL
  selectedPose: any | null  // 选择的姿势模板
  uploadedPose: string | null  // 上传的姿势参考图
  promptTemplate: any | null  // 选择的prompt模板
  generationCount: number
  aspectRatio: any | null  // 选择的图片比例
}

// 拼装生成历史记录
export interface CollageHistoryItem extends BaseHistoryItem {
  type: 'collage'
  referenceImages: Array<{
    id: string
    url: string
    order: number  // 1-4
  }>
  photoType: any | null  // 选择的照片类型模板
  generationCount: number
  aspectRatio: any | null  // 选择的图片比例
}

// 视频生成历史记录
export interface VideoHistoryItem {
  id: string
  type: 'video'
  timestamp: Date
  images: UploadedImage[]  // 上传的 2-4 张图片
  description: string      // 场景描述
  negativePrompt: string   // 负面提示
  aspectRatio: AspectRatio // 视频比例
  highQuality: boolean     // 是否高清
  result?: {               // 生成的视频
    id: string
    url: string
    thumbnail: string      // 视频缩略图
    duration: number       // 视频时长（秒）
  }
  isFavorite: boolean
  status: GenerationStatusType
}

// 联合类型
export type HistoryItem = ClothingHistoryItem | PoseHistoryItem | CollageHistoryItem | VideoHistoryItem

// 历史记录类型枚举
export enum HistoryType {
  CLOTHING = 'clothing',
  POSE = 'pose',
  COLLAGE = 'collage',
  VIDEO = 'video'
}

// 历史记录类型字符串
export type HistoryTypeString = 'clothing' | 'pose' | 'collage' | 'video'