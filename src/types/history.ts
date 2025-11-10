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

// 联合类型
export type HistoryItem = ClothingHistoryItem | PoseHistoryItem

// 历史记录类型枚举
export enum HistoryType {
  CLOTHING = 'clothing',
  POSE = 'pose'
}

// 历史记录类型字符串
export type HistoryTypeString = 'clothing' | 'pose'