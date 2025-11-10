<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import GenerationHistory from '../components/GenerationHistory.vue'
import { Upload, Download, Edit2, Check, Search, ChevronDown, ChevronUp, Star, Filter } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)

// History panel state
const isHistoryCollapsed = ref(true)
const historyRef = ref<InstanceType<typeof GenerationHistory>>()

// Queue Item interface
interface QueueItem {
  id: string
  model: any
  top: any  
  bottom: any
  accessories: any[]
  background?: any
  prompt: string
  promptTemplate?: any
  count: number
  aspectRatio?: any
  createdAt: Date
}

// Selection states - Changed to single select for queue mode
const selectedTops = ref<any[]>([])
const selectedBottoms = ref<any[]>([])
const selectedModels = ref<any[]>([])
const selectedBackground = ref<any>(null)
const selectedAccessories = ref<any[]>([])

// Queue management states
const generationQueue = ref<QueueItem[]>([])
const showQueuePanel = ref(false)
const editingQueueItem = ref<QueueItem | null>(null)

// Legacy batch mode states (keep for compatibility)
const selectedCombinations = ref<any[]>([]) // Generated combinations
const showCombinationPreview = ref(false)
const uploadedTop = ref<string | null>(null)
const uploadedBottom = ref<string | null>(null)
const uploadedModel = ref<string | null>(null)
const uploadedAccessory = ref<string | null>(null)
const uploadedBackground = ref<string | null>(null)
const selectedPose = ref<any>(null)
const uploadedPose = ref<string | null>(null)
const generatedResults = ref<any[]>([])
const isGenerating = ref(false)
const generationCount = ref(3)
const batchMode = ref(false) // Toggle between single and batch mode

// Result selection and editing states
const selectedResults = ref<Set<string>>(new Set())
const showEditModal = ref(false)
const editingResults = ref<any[]>([])
const editPrompt = ref('')
const isRegenerating = ref(false)
const selectedPromptTemplate = ref<any>(null)
const customPrompt = ref('')

// Aspect ratio selection
const selectedAspectRatio = ref<any>(null)
const showAllAspectRatios = ref(false)

// Material management states
const showMaterialModal = ref({
  tops: false,
  bottoms: false,
  accessories: false,
  backgrounds: false
})

const modalSearchQueries = ref({
  tops: '',
  bottoms: '',
  accessories: '',
  backgrounds: ''
})

const modalCategoryFilters = ref({
  tops: '',
  bottoms: '',
  accessories: '',
  backgrounds: ''
})

const modalSortByFavorite = ref(false)

// Mock data with enhanced structure for material management
const topClothingItems = ref([
  { id: '1', name: '白色衬衫', thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&h=150&fit=crop', category: 'shirt', isFavorite: true, tags: ['经典', '商务'], usageCount: 15, createdAt: new Date('2024-01-01') },
  { id: '2', name: '蓝色牛仔衬衫', thumbnail: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=150&h=150&fit=crop', category: 'shirt', isFavorite: false, tags: ['休闲', '百搭'], usageCount: 8, createdAt: new Date('2024-01-02') },
  { id: '3', name: '黑色T恤', thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop', category: 'casual', isFavorite: false, tags: ['简约', '基础款'], usageCount: 22, createdAt: new Date('2024-01-03') },
  { id: '4', name: '西装外套', thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=150&h=150&fit=crop', category: 'formal', isFavorite: true, tags: ['正式', '商务'], usageCount: 12, createdAt: new Date('2024-01-04') },
  { id: '5', name: '运动上衣', thumbnail: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d8e?w=150&h=150&fit=crop', category: 'sport', isFavorite: false, tags: ['运动', '舒适'], usageCount: 5, createdAt: new Date('2024-01-05') },
  { id: '6', name: '毛衣', thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=150&h=150&fit=crop', category: 'casual', isFavorite: false, tags: ['保暖', '秋冬'], usageCount: 9, createdAt: new Date('2024-01-06') },
  { id: '7', name: '条纹衬衫', thumbnail: 'https://images.unsplash.com/photo-1603252109303-2751441b83e2?w=150&h=150&fit=crop', category: 'shirt', isFavorite: false, tags: ['条纹', '时尚'], usageCount: 3, createdAt: new Date('2024-01-07') },
  { id: '8', name: '针织开衫', thumbnail: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150&h=150&fit=crop', category: 'casual', isFavorite: true, tags: ['针织', '温柔'], usageCount: 7, createdAt: new Date('2024-01-08') }
])

const bottomClothingItems = ref([
  { id: '1', name: '蓝色牛仔裤', thumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=150&h=150&fit=crop', category: 'casual', isFavorite: true, tags: ['牛仔', '百搭'], usageCount: 18, createdAt: new Date('2024-01-01') },
  { id: '2', name: '黑色西裤', thumbnail: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=150&h=150&fit=crop', category: 'formal', isFavorite: false, tags: ['正式', '商务'], usageCount: 10, createdAt: new Date('2024-01-02') },
  { id: '3', name: '运动裤', thumbnail: 'https://images.unsplash.com/photo-1506629905607-0e2dbec85709?w=150&h=150&fit=crop', category: 'sport', isFavorite: false, tags: ['运动', '舒适'], usageCount: 6, createdAt: new Date('2024-01-03') },
  { id: '4', name: '短裤', thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=150&h=150&fit=crop', category: 'casual', isFavorite: false, tags: ['夏季', '清爽'], usageCount: 4, createdAt: new Date('2024-01-04') },
  { id: '5', name: '红色连衣裙', thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=150&h=150&fit=crop', category: 'dress', isFavorite: true, tags: ['优雅', '晚装'], usageCount: 8, createdAt: new Date('2024-01-05') },
  { id: '6', name: '职业裙装', thumbnail: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=150&h=150&fit=crop', category: 'formal', isFavorite: false, tags: ['职业', '正式'], usageCount: 7, createdAt: new Date('2024-01-06') },
  { id: '7', name: '休闲阔腿裤', thumbnail: 'https://images.unsplash.com/photo-1542272454315-7ad9f1b1a5a6?w=150&h=150&fit=crop', category: 'casual', isFavorite: false, tags: ['阔腿', '舒适'], usageCount: 5, createdAt: new Date('2024-01-07') },
  { id: '8', name: '白色九分裤', thumbnail: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc6c564?w=150&h=150&fit=crop', category: 'casual', isFavorite: true, tags: ['九分', '清新'], usageCount: 12, createdAt: new Date('2024-01-08') }
])

const modelOptions = ref([
  { id: '1', name: '女性模特 A', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop', type: 'female', style: 'elegant' },
  { id: '2', name: '女性模特 B', thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=200&fit=crop', type: 'female', style: 'casual' },
  { id: '3', name: '男性模特 A', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop', type: 'male', style: 'professional' },
  { id: '4', name: '男性模特 B', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop', type: 'male', style: 'casual' },
  { id: '5', name: '女性模特 C', thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop', type: 'female', style: 'fashion' },
  { id: '6', name: '男性模特 C', thumbnail: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=200&fit=crop', type: 'male', style: 'sport' }
])

const accessoryOptions = ref([
  { id: '1', name: '太阳镜', thumbnail: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=150&h=150&fit=crop', category: 'eyewear', isFavorite: true, tags: ['时尚', '遮阳'], usageCount: 12, createdAt: new Date('2024-01-01') },
  { id: '2', name: '手表', thumbnail: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=150&h=150&fit=crop', category: 'watch', isFavorite: false, tags: ['精致', '商务'], usageCount: 8, createdAt: new Date('2024-01-02') },
  { id: '3', name: '项链', thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop', category: 'jewelry', isFavorite: true, tags: ['优雅', '奢华'], usageCount: 15, createdAt: new Date('2024-01-03') },
  { id: '4', name: '手包', thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop', category: 'bag', isFavorite: false, tags: ['实用', '时尚'], usageCount: 6, createdAt: new Date('2024-01-04') },
  { id: '5', name: '帽子', thumbnail: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=150&h=150&fit=crop', category: 'hat', isFavorite: false, tags: ['休闲', '防晒'], usageCount: 4, createdAt: new Date('2024-01-05') },
  { id: '6', name: '围巾', thumbnail: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=150&h=150&fit=crop', category: 'scarf', isFavorite: true, tags: ['保暖', '时尚'], usageCount: 9, createdAt: new Date('2024-01-06') }
])

const backgroundOptions = ref([
  { id: '1', name: '纯色背景', thumbnail: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=150&h=150&fit=crop', type: 'solid', isFavorite: true, tags: ['简约', '干净'], usageCount: 20, createdAt: new Date('2024-01-01') },
  { id: '2', name: '咖啡店', thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&h=150&fit=crop', type: 'indoor', isFavorite: false, tags: ['温馨', '休闲'], usageCount: 8, createdAt: new Date('2024-01-02') },
  { id: '3', name: '办公室', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150&h=150&fit=crop', type: 'indoor', isFavorite: true, tags: ['商务', '专业'], usageCount: 14, createdAt: new Date('2024-01-03') },
  { id: '4', name: '公园', thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop', type: 'outdoor', isFavorite: false, tags: ['自然', '清新'], usageCount: 6, createdAt: new Date('2024-01-04') },
  { id: '5', name: '街道', thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=150&h=150&fit=crop', type: 'outdoor', isFavorite: false, tags: ['都市', '现代'], usageCount: 5, createdAt: new Date('2024-01-05') },
  { id: '6', name: '摄影棚', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop', type: 'studio', isFavorite: true, tags: ['专业', '摄影'], usageCount: 12, createdAt: new Date('2024-01-06') }
])

// Aspect ratio options
const aspectRatioOptions = ref([
  { id: 'auto', name: 'Auto', width: 4, height: 3, isAuto: true, isDefault: true },
  { id: '1:1', name: '1:1', width: 1, height: 1, isDefault: true },
  { id: '9:16', name: '9:16', width: 9, height: 16, isDefault: true },
  { id: '3:4', name: '3:4', width: 3, height: 4, isDefault: true },
  { id: '2:3', name: '2:3', width: 2, height: 3, isDefault: true },
  { id: '4:5', name: '4:5', width: 4, height: 5, isDefault: true },
  { id: '16:9', name: '16:9', width: 16, height: 9, isDefault: false },
  { id: '21:9', name: '21:9', width: 21, height: 9, isDefault: false },
  { id: '4:3', name: '4:3', width: 4, height: 3, isDefault: false },
  { id: '3:2', name: '3:2', width: 3, height: 2, isDefault: false },
  { id: '5:4', name: '5:4', width: 5, height: 4, isDefault: false }
])

// Computed properties for aspect ratios
const defaultAspectRatios = computed(() => 
  aspectRatioOptions.value.filter(ratio => ratio.isDefault)
)

const extraAspectRatios = computed(() => 
  aspectRatioOptions.value.filter(ratio => !ratio.isDefault)
)

const displayedAspectRatios = computed(() => {
  return showAllAspectRatios.value ? aspectRatioOptions.value : defaultAspectRatios.value
})

// Prompt templates for model generation
const promptTemplates = ref([
  { id: '1', name: '时尚商业', prompt: '时尚模特，专业摄影，商业广告，完美光线，高品质' },
  { id: '2', name: '街头潮流', prompt: '街头时尚，潮流穿搭，城市背景，年轻活力，自然姿态' },
  { id: '3', name: '职业正装', prompt: '职业模特，正装形象，商务环境，专业自信，正式场合' },
  { id: '4', name: '休闲日常', prompt: '日常休闲，自然放松，生活化场景，舒适穿搭，温馨氛围' },
  { id: '5', name: '运动健康', prompt: '运动模特，健康活力，运动装备，动态姿势，健身环境' }
])

const sampleResults = ref([
  { id: '1', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop' },
  { id: '2', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop' },
  { id: '3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop' },
  { id: '4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop' }
])

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const selectTop = (item: any) => {
  // Always single select now
  selectedTops.value = [item]
}

const selectBottom = (item: any) => {
  // Always single select now
  selectedBottoms.value = [item]
}

const selectModel = (model: any) => {
  // Always single select now
  selectedModels.value = [model]
}

const selectAccessory = (accessory: any) => {
  // Support multi-select for accessories
  const index = selectedAccessories.value.findIndex(item => item.id === accessory.id)
  if (index > -1) {
    // Remove if already selected
    selectedAccessories.value.splice(index, 1)
  } else {
    // Add to selection
    selectedAccessories.value.push(accessory)
  }
}

const selectBackground = (background: any) => {
  selectedBackground.value = background
  // Clear uploaded background when selecting predefined background
  uploadedBackground.value = null
}

const selectAspectRatio = (ratio: any) => {
  selectedAspectRatio.value = ratio
}

// Accessory conflict detection
const checkAccessoryConflicts = (accessories: any[]) => {
  const categoryCounts = accessories.reduce((acc, accessory) => {
    const category = accessory.category
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const conflicts = Object.entries(categoryCounts)
    .filter(([_, count]) => (count as number) > 1)
    .map(([category, count]) => ({
      category,
      count: count as number,
      items: accessories.filter(acc => acc.category === category)
    }))
  
  return conflicts
}

const getAccessoryConflictMessage = (conflicts: any[]) => {
  if (conflicts.length === 0) return ''
  
  const messages = conflicts.map(conflict => {
    const categoryNames = {
      'eyewear': '眼镜',
      'watch': '手表', 
      'jewelry': '首饰',
      'bag': '包包',
      'hat': '帽子',
      'scarf': '围巾'
    }
    const categoryName = categoryNames[conflict.category as keyof typeof categoryNames] || conflict.category
    
    const itemNames = conflict.items.map((item: any) => item.name).join('、')
    return `${categoryName}类：选择了${conflict.count}个（${itemNames}），最终只会随机显示1个`
  })
  
  return `检测到配饰冲突：\n${messages.join('\n')}\n\n是否继续生成？`
}

const getCategoryDisplayName = (category: string) => {
  const categoryNames = {
    'eyewear': '眼镜',
    'watch': '手表', 
    'jewelry': '首饰',
    'bag': '包包',
    'hat': '帽子',
    'scarf': '围巾'
  }
  return categoryNames[category as keyof typeof categoryNames] || category
}

// Material management functions
const openMaterialModal = (type: keyof typeof showMaterialModal.value) => {
  showMaterialModal.value[type] = true
}

const closeMaterialModal = () => {
  // Close all modals
  showMaterialModal.value = {
    tops: false,
    bottoms: false,
    accessories: false,
    backgrounds: false
  }
  // Clear searches when closing modal
  modalSearchQueries.value = {
    tops: '',
    bottoms: '',
    accessories: '',
    backgrounds: ''
  }
  modalCategoryFilters.value = {
    tops: '',
    bottoms: '',
    accessories: '',
    backgrounds: ''
  }
  modalSortByFavorite.value = false
}

const toggleModalSortByFavorite = () => {
  modalSortByFavorite.value = !modalSortByFavorite.value
}

const toggleFavorite = (item: any, type: string) => {
  item.isFavorite = !item.isFavorite
  // Save to localStorage for persistence
  const itemMap = {
    topClothing: topClothingItems,
    bottomClothing: bottomClothingItems,
    accessories: accessoryOptions,
    backgrounds: backgroundOptions
  }
  const items = itemMap[type as keyof typeof itemMap]
  if (items) {
    localStorage.setItem(`${type}Items`, JSON.stringify(items.value))
  }
}

// Main interface - only show favorite materials
const favoriteTopItems = computed(() => {
  return topClothingItems.value
    .filter(item => item.isFavorite)
    .sort((a, b) => b.usageCount - a.usageCount)
})

const favoriteBottomItems = computed(() => {
  return bottomClothingItems.value
    .filter(item => item.isFavorite)
    .sort((a, b) => b.usageCount - a.usageCount)
})

const favoriteAccessoryItems = computed(() => {
  return accessoryOptions.value
    .filter(item => item.isFavorite)
    .sort((a, b) => b.usageCount - a.usageCount)
})

const favoriteBackgroundItems = computed(() => {
  return backgroundOptions.value
    .filter(item => item.isFavorite)
    .sort((a, b) => b.usageCount - a.usageCount)
})

// Modal filters for complete material library
const modalFilteredTopItems = computed(() => {
  let items = topClothingItems.value
  
  if (modalSearchQueries.value.tops) {
    const query = modalSearchQueries.value.tops.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  if (modalCategoryFilters.value.tops) {
    items = items.filter(item => item.category === modalCategoryFilters.value.tops)
  }
  
  return items.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return b.usageCount - a.usageCount
  })
})

const modalFilteredBottomItems = computed(() => {
  let items = bottomClothingItems.value
  
  if (modalSearchQueries.value.bottoms) {
    const query = modalSearchQueries.value.bottoms.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  if (modalCategoryFilters.value.bottoms) {
    items = items.filter(item => item.category === modalCategoryFilters.value.bottoms)
  }
  
  return items.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return b.usageCount - a.usageCount
  })
})

const modalFilteredAccessoryItems = computed(() => {
  let items = accessoryOptions.value
  
  if (modalSearchQueries.value.accessories) {
    const query = modalSearchQueries.value.accessories.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  if (modalCategoryFilters.value.accessories) {
    items = items.filter(item => item.category === modalCategoryFilters.value.accessories)
  }
  
  return items.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return b.usageCount - a.usageCount
  })
})

const modalFilteredBackgroundItems = computed(() => {
  let items = backgroundOptions.value
  
  if (modalSearchQueries.value.backgrounds) {
    const query = modalSearchQueries.value.backgrounds.toLowerCase()
    items = items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  if (modalCategoryFilters.value.backgrounds) {
    items = items.filter(item => item.type === modalCategoryFilters.value.backgrounds)
  }
  
  return items.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return b.usageCount - a.usageCount
  })
})

// Accessory conflicts computed property
const accessoryConflicts = computed(() => {
  if (selectedAccessories.value.length <= 1) return []
  return checkAccessoryConflicts(selectedAccessories.value)
})

const uploadTopFile = () => {
  // 模拟上衣文件上传
  uploadedTop.value = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop'
}

const uploadBottomFile = () => {
  // 模拟下装文件上传
  uploadedBottom.value = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop'
}

const uploadModelFile = () => {
  // 模拟模特文件上传
  uploadedModel.value = 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=200&fit=crop'
}

const uploadAccessoryFile = () => {
  // 模拟配饰文件上传
  uploadedAccessory.value = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=150&h=150&fit=crop'
}

const uploadBackgroundFile = () => {
  // 模拟背景文件上传
  uploadedBackground.value = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop'
  // Clear selected background when uploading custom background
  selectedBackground.value = null
}

const selectPose = (pose: any) => {
  selectedPose.value = pose
}

const uploadPoseFile = () => {
  // 模拟姿势文件上传
  uploadedPose.value = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=200&fit=crop'
}

// Computed property to group results by combination
const groupedResults = computed(() => {
  if (!batchMode.value || !generatedResults.value[0]?.combination) return []
  
  const grouped = new Map()
  
  generatedResults.value.forEach(result => {
    const combinationId = result.combination.id
    if (!grouped.has(combinationId)) {
      grouped.set(combinationId, {
        combination: result.combination,
        images: []
      })
    }
    grouped.get(combinationId).images.push(result)
  })
  
  return Array.from(grouped.values())
})

const selectPromptTemplate = (template: any) => {
  selectedPromptTemplate.value = template
  customPrompt.value = template.prompt
}

// Generate outfit combinations
const generateCombinations = () => {
  const combinations = []
  const models = selectedModels.value.length > 0 ? selectedModels.value : (uploadedModel.value ? [{ id: 'uploaded', name: '上传的模特', isUploaded: true }] : [])
  const tops = selectedTops.value.length > 0 ? selectedTops.value : (uploadedTop.value ? [{ id: 'uploaded', name: '上传的上装', isUploaded: true }] : [])
  const bottoms = selectedBottoms.value.length > 0 ? selectedBottoms.value : (uploadedBottom.value ? [{ id: 'uploaded', name: '上传的下装', isUploaded: true }] : [])
  
  for (const model of models) {
    for (const top of tops) {
      for (const bottom of bottoms) {
        combinations.push({
          id: `${model.id}-${top.id}-${bottom.id}`,
          model,
          top,
          bottom,
          accessories: [...selectedAccessories.value],
          name: `${model.name} + ${top.name} + ${bottom.name}`,
          selected: true
        })
      }
    }
  }
  
  return combinations
}

const previewCombinations = () => {
  if ((selectedModels.value.length === 0 && !uploadedModel.value)) {
    alert('请先选择模特')
    return
  }
  
  if ((selectedTops.value.length === 0 && !uploadedTop.value) || (selectedBottoms.value.length === 0 && !uploadedBottom.value)) {
    alert('请选择至少一个上装和一个下装')
    return
  }
  
  selectedCombinations.value = generateCombinations()
  showCombinationPreview.value = true
}

const toggleCombinationSelection = (combination: any) => {
  combination.selected = !combination.selected
}

const selectAllCombinations = () => {
  selectedCombinations.value.forEach(combo => combo.selected = true)
}

const deselectAllCombinations = () => {
  selectedCombinations.value.forEach(combo => combo.selected = false)
}

const generateImages = () => {
  if (batchMode.value) {
    generateBatchImages()
  } else {
    generateSingleImage()
  }
}

const generateSingleImage = () => {
  if ((selectedModels.value.length === 0 && !uploadedModel.value) || (selectedTops.value.length === 0 && !uploadedTop.value) || !customPrompt.value.trim()) {
    alert('请选择模特、上装和prompt')
    return
  }
  
  isGenerating.value = true
  
  // 模拟生成过程
  setTimeout(() => {
    const mockImages = [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=600&fit=crop'
    ]
    
    generatedResults.value = Array.from({ length: generationCount.value }, (_, index) => ({
      id: String(index + 1),
      url: mockImages[index % mockImages.length],
      config: { 
        model: uploadedModel.value ? '上传的模特' : selectedModels.value[0]?.name,
        top: selectedTops.value[0]?.name || '上传的上装',
        bottom: selectedBottoms.value[0]?.name || '上传的下装',
        prompt: customPrompt.value.substring(0, 50) + '...',
        aspectRatio: selectedAspectRatio.value?.name || '3:4'
      },
      aspectRatio: selectedAspectRatio.value
    }))
    
    // Save to history
    saveToHistory()
    
    isGenerating.value = false
  }, 4000)
}

const generateQueueItems = () => {
  if (generationQueue.value.length === 0) {
    alert('队列为空，请先添加搭配到队列中')
    return
  }
  
  if (!confirm(`确定要生成队列中的 ${generationQueue.value.length} 个搭配吗？\n总共将生成 ${generationQueue.value.reduce((sum, item) => sum + item.count, 0)} 张图片`)) {
    return
  }
  
  isGenerating.value = true
  
  // 模拟批量生成过程
  setTimeout(() => {
    const mockImages = [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=600&fit=crop'
    ]
    
    const results: any[] = []
    let imageIndex = 0
    
    generationQueue.value.forEach((queueItem) => {
      for (let i = 0; i < queueItem.count; i++) {
        results.push({
          id: `${queueItem.id}-${i + 1}`,
          url: mockImages[imageIndex % mockImages.length],
          queueItem: queueItem,
          config: {
            model: queueItem.model.name,
            top: queueItem.top.name,
            bottom: queueItem.bottom.name,
            accessories: queueItem.accessories.map(acc => acc.name).join(', ') || null,
            background: queueItem.background?.name || '默认背景',
            prompt: queueItem.prompt.substring(0, 50) + (queueItem.prompt.length > 50 ? '...' : '')
          }
        })
        imageIndex++
      }
    })
    
    generatedResults.value = results
    
    // Save to history with queue data
    saveQueueToHistory()
    
    // Clear the queue after successful generation
    generationQueue.value = []
    saveQueueToStorage()
    
    isGenerating.value = false
  }, 6000)
}

// Legacy batch function for compatibility
const generateBatchImages = () => {
  // For new queue mode, redirect to queue generation
  if (batchMode.value) {
    generateQueueItems()
    return
  }
  
  // Keep old logic for any legacy usage
  const selectedCombos = selectedCombinations.value.filter(combo => combo.selected)
  
  if (selectedCombos.length === 0) {
    alert('请选择至少一个搭配组合')
    return
  }
  
  isGenerating.value = true
  showCombinationPreview.value = false
  
  // 模拟批量生成过程
  setTimeout(() => {
    const mockImages = [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=600&fit=crop'
    ]
    
    const results: any[] = []
    selectedCombos.forEach((combo, comboIndex) => {
      for (let i = 0; i < generationCount.value; i++) {
        results.push({
          id: `${combo.id}-${i + 1}`,
          url: mockImages[(comboIndex * generationCount.value + i) % mockImages.length],
          combination: combo,
          config: {
            model: uploadedModel.value ? '上传的模特' : selectedModels.value[0]?.name,
            top: combo.top.name,
            bottom: combo.bottom.name,
            accessories: combo.accessories.map((acc: any) => acc.name).join(', ') || null,
            prompt: customPrompt.value.substring(0, 50) + '...'
          }
        })
      }
    })
    
    generatedResults.value = results
    
    // Save to history  
    saveToHistory()
    
    isGenerating.value = false
  }, 6000)
}

// Result selection functions
const toggleResultSelection = (resultId: string) => {
  if (selectedResults.value.has(resultId)) {
    selectedResults.value.delete(resultId)
  } else {
    selectedResults.value.add(resultId)
  }
}

const selectAllResults = () => {
  selectedResults.value.clear()
  generatedResults.value.forEach(result => {
    selectedResults.value.add(result.id)
  })
}

const deselectAllResults = () => {
  selectedResults.value.clear()
}

// Download functions
const downloadSingleResult = async (result: any) => {
  try {
    const response = await fetch(result.url)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `generated-${result.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download failed:', error)
    alert('下载失败，请重试')
  }
}

const downloadSelectedResults = async () => {
  const selectedResultsList = generatedResults.value.filter(result => 
    selectedResults.value.has(result.id)
  )
  
  if (selectedResultsList.length === 0) {
    alert('请先选择要下载的结果')
    return
  }

  // For simplicity, download each file individually
  // In a real app, you might want to create a ZIP file
  for (const result of selectedResultsList) {
    await downloadSingleResult(result)
    // Add small delay between downloads
    await new Promise(resolve => setTimeout(resolve, 200))
  }
}

// Edit functions
const editSingleResult = (result: any) => {
  editingResults.value = [result]
  editPrompt.value = result.config?.prompt || customPrompt.value
  showEditModal.value = true
}

const editSelectedResults = () => {
  const selectedResultsList = generatedResults.value.filter(result => 
    selectedResults.value.has(result.id)
  )
  
  if (selectedResultsList.length === 0) {
    alert('请先选择要编辑的结果')
    return
  }

  editingResults.value = selectedResultsList
  // Use the first result's prompt or the original custom prompt
  editPrompt.value = selectedResultsList[0].config?.prompt || customPrompt.value
  showEditModal.value = true
}

const regenerateWithEdit = async () => {
  if (!editPrompt.value.trim()) {
    alert('请输入编辑prompt')
    return
  }

  isRegenerating.value = true
  showEditModal.value = false

  // Simulate regeneration process
  setTimeout(() => {
    const mockImages = [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop'
    ]

    // Update each editing result with new version
    editingResults.value.forEach((editResult, index) => {
      const resultIndex = generatedResults.value.findIndex(r => r.id === editResult.id)
      if (resultIndex !== -1) {
        // Keep original data and update with edited version
        generatedResults.value[resultIndex] = {
          ...editResult,
          url: mockImages[index % mockImages.length],
          config: {
            ...editResult.config,
            prompt: editPrompt.value,
            editedAt: new Date().toLocaleString()
          },
          isEdited: true
        }
      }
    })

    isRegenerating.value = false
    editingResults.value = []
    editPrompt.value = ''
  }, 3000)
}

// History functions
const saveToHistory = () => {
  if (!historyRef.value) return
  
  const currentModels = [...selectedModels.value]
  if (uploadedModel.value) {
    currentModels.push({
      id: 'uploaded',
      name: '上传的模特',
      thumbnail: uploadedModel.value
    })
  }
  
  const currentTops = [...selectedTops.value]
  if (uploadedTop.value) {
    currentTops.push({
      id: 'uploaded',
      name: '上传的上衣',
      thumbnail: uploadedTop.value
    })
  }
  
  const currentBottoms = [...selectedBottoms.value] 
  if (uploadedBottom.value) {
    currentBottoms.push({
      id: 'uploaded', 
      name: '上传的下装',
      thumbnail: uploadedBottom.value
    })
  }
  
  const currentAccessories = [...selectedAccessories.value]
  if (uploadedAccessory.value) {
    currentAccessories.push({
      id: 'uploaded',
      name: '上传的配饰', 
      thumbnail: uploadedAccessory.value
    })
  }
  
  const currentBackground = uploadedBackground.value ? 
    { id: 'uploaded', name: '上传的背景', thumbnail: uploadedBackground.value } : 
    selectedBackground.value

  historyRef.value.addHistoryItem({
    type: 'clothing',
    models: currentModels,
    tops: currentTops,
    bottoms: currentBottoms,
    accessories: currentAccessories,
    background: currentBackground,
    prompt: customPrompt.value,
    results: generatedResults.value,
    batchMode: batchMode.value
  })
}

// Save queue generation to history
const saveQueueToHistory = () => {
  if (!historyRef.value || generationQueue.value.length === 0) return
  
  // Create a combined history entry for the entire queue
  const allModels = generationQueue.value.map(item => item.model)
  const allTops = generationQueue.value.map(item => item.top)
  const allBottoms = generationQueue.value.map(item => item.bottom)
  const allAccessories = generationQueue.value.flatMap(item => item.accessories)
  const combinedPrompt = generationQueue.value.map(item => `${item.count}x ${item.prompt}`).join(' | ')
  
  historyRef.value.addHistoryItem({
    type: 'clothing',
    models: allModels,
    tops: allTops,
    bottoms: allBottoms,
    accessories: allAccessories,
    background: generationQueue.value[0]?.background || null,
    prompt: combinedPrompt,
    results: generatedResults.value,
    batchMode: true
  })
}

const useHistoryItem = (item: any) => {
  // Clear current selections
  selectedModels.value = []
  selectedTops.value = []
  selectedBottoms.value = []
  selectedAccessories.value = []
  uploadedModel.value = null
  uploadedTop.value = null
  uploadedBottom.value = null
  uploadedAccessory.value = null
  uploadedBackground.value = null
  
  // Restore selections from history
  selectedModels.value = item.models.filter((m: any) => m.id !== 'uploaded')
  selectedTops.value = item.tops.filter((t: any) => t.id !== 'uploaded')
  selectedBottoms.value = item.bottoms.filter((b: any) => b.id !== 'uploaded')
  selectedAccessories.value = item.accessories.filter((a: any) => a.id !== 'uploaded')
  
  if (item.background?.id === 'uploaded') {
    uploadedBackground.value = item.background.thumbnail
    selectedBackground.value = null
  } else {
    selectedBackground.value = item.background
  }
  
  customPrompt.value = item.prompt
  batchMode.value = item.batchMode
  
  // Restore uploaded items
  const uploadedModelItem = item.models.find((m: any) => m.id === 'uploaded')
  if (uploadedModelItem) {
    uploadedModel.value = uploadedModelItem.thumbnail
  }
  
  const uploadedTopItem = item.tops.find((t: any) => t.id === 'uploaded')
  if (uploadedTopItem) {
    uploadedTop.value = uploadedTopItem.thumbnail
  }
  
  const uploadedBottomItem = item.bottoms.find((b: any) => b.id === 'uploaded')
  if (uploadedBottomItem) {
    uploadedBottom.value = uploadedBottomItem.thumbnail
  }
  
  const uploadedAccessoryItem = item.accessories.find((a: any) => a.id === 'uploaded')
  if (uploadedAccessoryItem) {
    uploadedAccessory.value = uploadedAccessoryItem.thumbnail
  }
  
  // Show feedback
  alert('已恢复历史记录设置')
}

const toggleHistoryCollapse = () => {
  isHistoryCollapsed.value = !isHistoryCollapsed.value
}

const scrollToTop = async () => {
  await nextTick()
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Queue management functions
const validateCurrentSelection = () => {
  const errors = []
  
  if (selectedModels.value.length === 0 && !uploadedModel.value) {
    errors.push('请选择模特')
  }
  
  if (selectedTops.value.length === 0 && !uploadedTop.value) {
    errors.push('请选择上装')
  }
  
  if (selectedBottoms.value.length === 0 && !uploadedBottom.value) {
    errors.push('请选择下装')
  }
  
  if (!customPrompt.value.trim()) {
    errors.push('请输入Prompt')
  }
  
  if (generationCount.value < 1) {
    errors.push('生成数量必须大于0')
  }
  
  return errors
}

const addToQueue = async () => {
  const errors = validateCurrentSelection()
  if (errors.length > 0) {
    alert(errors.join('\n'))
    return
  }
  
  const queueItem: QueueItem = {
    id: Date.now().toString(),
    model: uploadedModel.value ? 
      { id: 'uploaded', name: '上传的模特', thumbnail: uploadedModel.value } : 
      selectedModels.value[0],
    top: uploadedTop.value ? 
      { id: 'uploaded', name: '上传的上装', thumbnail: uploadedTop.value } : 
      selectedTops.value[0],
    bottom: uploadedBottom.value ? 
      { id: 'uploaded', name: '上传的下装', thumbnail: uploadedBottom.value } : 
      selectedBottoms.value[0],
    accessories: uploadedAccessory.value ? 
      [{ id: 'uploaded', name: '上传的配饰', thumbnail: uploadedAccessory.value }] : 
      [...selectedAccessories.value],
    background: uploadedBackground.value ? 
      { id: 'uploaded', name: '上传的背景', thumbnail: uploadedBackground.value } : 
      selectedBackground.value,
    prompt: customPrompt.value,
    promptTemplate: selectedPromptTemplate.value,
    count: generationCount.value,
    aspectRatio: selectedAspectRatio.value,
    createdAt: new Date()
  }
  
  generationQueue.value.push(queueItem)
  clearCurrentSelection()
  saveQueueToStorage()
  
  // Scroll to top for better UX
  await scrollToTop()
}

const clearCurrentSelection = () => {
  selectedModels.value = []
  selectedTops.value = []
  selectedBottoms.value = []
  selectedAccessories.value = []
  selectedBackground.value = null
  uploadedModel.value = null
  uploadedTop.value = null
  uploadedBottom.value = null
  uploadedAccessory.value = null
  uploadedBackground.value = null
  customPrompt.value = ''
  selectedPromptTemplate.value = null
  generationCount.value = 3
  // Set default aspect ratio to Auto
  selectedAspectRatio.value = aspectRatioOptions.value.find(ratio => ratio.id === 'auto')
}

const removeFromQueue = (id: string) => {
  generationQueue.value = generationQueue.value.filter(item => item.id !== id)
  saveQueueToStorage()
}

const editQueueItem = async (item: QueueItem) => {
  // Load the queue item data back to current selection
  if (item.model.id === 'uploaded') {
    uploadedModel.value = item.model.thumbnail
    selectedModels.value = []
  } else {
    selectedModels.value = [item.model]
    uploadedModel.value = null
  }
  
  if (item.top.id === 'uploaded') {
    uploadedTop.value = item.top.thumbnail
    selectedTops.value = []
  } else {
    selectedTops.value = [item.top]
    uploadedTop.value = null
  }
  
  if (item.bottom.id === 'uploaded') {
    uploadedBottom.value = item.bottom.thumbnail
    selectedBottoms.value = []
  } else {
    selectedBottoms.value = [item.bottom]
    uploadedBottom.value = null
  }
  
  if (item.accessories && item.accessories.length > 0) {
    const uploadedAcc = item.accessories.find(acc => acc.id === 'uploaded')
    if (uploadedAcc) {
      uploadedAccessory.value = uploadedAcc.thumbnail
      selectedAccessories.value = item.accessories.filter(acc => acc.id !== 'uploaded')
    } else {
      selectedAccessories.value = [...item.accessories]
      uploadedAccessory.value = null
    }
  }
  
  if (item.background?.id === 'uploaded') {
    uploadedBackground.value = item.background.thumbnail
    selectedBackground.value = null
  } else {
    selectedBackground.value = item.background
    uploadedBackground.value = null
  }
  
  customPrompt.value = item.prompt
  selectedPromptTemplate.value = item.promptTemplate
  generationCount.value = item.count
  selectedAspectRatio.value = item.aspectRatio || aspectRatioOptions.value.find(ratio => ratio.id === 'auto')
  
  // Remove the item from queue after loading it for editing
  removeFromQueue(item.id)
  editingQueueItem.value = null
  
  // Scroll to top for better UX
  await scrollToTop()
}

const clearQueue = () => {
  if (confirm(`确定要清空队列中的 ${generationQueue.value.length} 个搭配吗？`)) {
    generationQueue.value = []
    saveQueueToStorage()
  }
}

const saveQueueToStorage = () => {
  localStorage.setItem('modelGenerationQueue', JSON.stringify(generationQueue.value))
}

const loadQueueFromStorage = () => {
  const stored = localStorage.getItem('modelGenerationQueue')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      generationQueue.value = parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt)
      }))
    } catch (error) {
      console.error('Failed to load queue from localStorage:', error)
    }
  }
}

onMounted(() => {
  // 页面初始化
  loadQueueFromStorage()
  
  // Set default aspect ratio to Auto
  selectedAspectRatio.value = aspectRatioOptions.value.find(ratio => ratio.id === 'auto')
})
</script>

<template>
  <div class="h-screen bg-gray-950 flex overflow-hidden">
    <!-- Sidebar -->
    <DashboardSidebar
      :is-mobile-menu-open="isMobileMenuOpen"
      @toggle-mobile-menu="toggleMobileMenu"
      @close-mobile-menu="closeMobileMenu"
    />

    <!-- History Panel -->
    <GenerationHistory
      ref="historyRef"
      :is-collapsed="isHistoryCollapsed"
      @use-history="useHistoryItem"
      @toggle-collapse="toggleHistoryCollapse"
    />

    <!-- Main Content -->
    <main class="flex-1 flex overflow-hidden">
      <!-- Left Panel - Controls -->
      <div :class="[
        'bg-gray-950 p-6 overflow-y-auto border-r border-gray-800',
        'w-full',
        'lg:w-2/5',
        'xl:w-1/3'
      ]">
        <div class="max-w-lg mx-auto">
          <!-- Header -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-white mb-2">模特图生成</h1>
            <p class="text-gray-400 text-sm">选择模特、服装搭配和背景，生成完整的模特展示图</p>
            
            <!-- Batch Mode Toggle -->
            <div class="mt-4 flex items-center space-x-3">
              <span class="text-gray-300 text-sm">生成模式:</span>
              <button
                @click="batchMode = false"
                :class="[
                  'px-3 py-1 rounded-md text-xs font-medium transition-all',
                  !batchMode ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                单搭配
              </button>
              <button
                @click="batchMode = true"
                :class="[
                  'px-3 py-1 rounded-md text-xs font-medium transition-all',
                  batchMode ? 'bg-primary-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                批量搭配
              </button>
            </div>
            
            <div v-if="batchMode" class="mt-2 text-xs text-primary-400">
              批量模式：选择多个服装生成所有搭配组合
            </div>
          </div>

          <!-- Model Selection -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white">选择模特 <span class="text-red-400">*</span></h2>
              <div v-if="selectedModels.length > 0" class="text-xs text-primary-400">
                已选择: {{ selectedModels[0].name }}
              </div>
            </div>
            <div class="grid grid-cols-4 gap-3">
              <div
                v-for="model in modelOptions"
                :key="model.id"
                @click="selectModel(model)"
                :class="[
                  'relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedModels[0]?.id === model.id ? 'border-primary-500 ring-1 ring-primary-500/50' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="model.thumbnail"
                  :alt="model.name"
                  class="w-full h-full object-cover"
                />
                <!-- Selected indicator -->
                <div v-if="selectedModels[0]?.id === model.id" class="absolute top-2 right-2">
                  <div class="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <!-- Model name overlay -->
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 text-center">
                  {{ model.name }}
                </div>
              </div>
            </div>
            
            <!-- Upload Model Option -->
            <div
              @click="uploadModelFile"
              class="mt-4 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-6 w-6 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传模特图</p>
            </div>

            <div v-if="uploadedModel" class="mt-3 p-3 bg-gray-800 rounded-lg">
              <img :src="uploadedModel" alt="Uploaded model" class="w-16 h-20 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">模特图上传成功</p>
            </div>
            
          </div>

          <!-- Top Clothing Selection -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white">选择上装 <span class="text-red-400">*</span></h2>
              <div v-if="selectedTops.length > 0" class="text-xs text-primary-400">
                已选择: {{ selectedTops[0].name }}
              </div>
            </div>
            
            <!-- Favorite Top Items -->
            <div v-if="favoriteTopItems.length > 0" class="grid grid-cols-4 gap-3 mb-4">
              <div
                v-for="item in favoriteTopItems"
                :key="item.id"
                @click="selectTop(item)"
                :class="[
                  'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedTops[0]?.id === item.id ? 'border-primary-500 ring-1 ring-primary-500/50' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="item.thumbnail"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                
                <!-- Favorite Star -->
                <div class="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-50">
                  <Star class="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                
                <!-- Selected indicator -->
                <div v-if="selectedTops[0]?.id === item.id" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center ring-2 ring-white">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Item name overlay -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-2">
                  <div class="text-xs font-medium">{{ item.name }}</div>
                </div>
              </div>
            </div>
            
            <!-- Browse More Button -->
            <button
              @click="openMaterialModal('tops')"
              class="w-full mb-4 py-2 px-3 bg-gray-800 border border-gray-700 hover:border-primary-500 rounded-lg text-gray-300 hover:text-white transition-all group text-sm"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <span>浏览所有上装</span>
              </div>
            </button>
            
            <!-- Upload Top Option -->
            <div
              @click="uploadTopFile"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-6 w-6 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传上装</p>
            </div>

            <div v-if="uploadedTop" class="mt-3 p-3 bg-gray-800 rounded-lg">
              <img :src="uploadedTop" alt="Uploaded top" class="w-16 h-16 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">上装上传成功</p>
            </div>
          </div>

          <!-- Bottom Clothing Selection -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white">选择下装 <span class="text-red-400">*</span></h2>
              <div v-if="selectedBottoms.length > 0" class="text-xs text-primary-400">
                已选择: {{ selectedBottoms[0].name }}
              </div>
            </div>
            
            <!-- Favorite Bottom Items -->
            <div v-if="favoriteBottomItems.length > 0" class="grid grid-cols-4 gap-3 mb-4">
              <div
                v-for="item in favoriteBottomItems"
                :key="item.id"
                @click="selectBottom(item)"
                :class="[
                  'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedBottoms[0]?.id === item.id ? 'border-primary-500 ring-1 ring-primary-500/50' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="item.thumbnail"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                
                <!-- Favorite Star -->
                <div class="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-50">
                  <Star class="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                
                <!-- Selected indicator -->
                <div v-if="selectedBottoms[0]?.id === item.id" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center ring-2 ring-white">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Item name overlay -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-2">
                  <div class="text-xs font-medium">{{ item.name }}</div>
                </div>
              </div>
            </div>
            
            <!-- Browse More Button -->
            <button
              @click="openMaterialModal('bottoms')"
              class="w-full mb-4 py-2 px-3 bg-gray-800 border border-gray-700 hover:border-primary-500 rounded-lg text-gray-300 hover:text-white transition-all group text-sm"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <span>浏览所有下装</span>
              </div>
            </button>
            
            <!-- Upload Bottom Option -->
            <div
              @click="uploadBottomFile"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-6 w-6 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传下装</p>
            </div>

            <div v-if="uploadedBottom" class="mt-3 p-3 bg-gray-800 rounded-lg">
              <img :src="uploadedBottom" alt="Uploaded bottom" class="w-16 h-16 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">下装上传成功</p>
            </div>
          </div>

          <!-- Accessory Selection -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-lg font-semibold text-white">选择配饰</h2>
              <div v-if="selectedAccessories.length > 0" class="text-xs text-primary-400">
                已选择 {{ selectedAccessories.length }} 个: {{ selectedAccessories.map(acc => acc.name).join(', ') }}
              </div>
            </div>
            
            <!-- Accessory Selection Notice -->
            <div class="mb-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
              <p class="text-sm text-gray-300 mb-1">
                💡 <span class="font-medium">配饰选择说明：</span>
              </p>
              <p class="text-xs text-gray-400">
                • 可以同时选择多个配饰（如手表+项链+太阳镜）<br>
                • 如果选择了多个同类型配饰（如多个背包），最终只会随机显示其中一个
              </p>
            </div>
            
            <!-- Accessory Conflict Warning -->
            <div v-if="accessoryConflicts.length > 0" class="mb-4 p-3 bg-yellow-900/50 border border-yellow-600 rounded-lg">
              <p class="text-sm text-yellow-300 mb-1">
                ⚠️ <span class="font-medium">检测到配饰冲突：</span>
              </p>
              <div class="text-xs text-yellow-200 space-y-1">
                <div v-for="conflict in accessoryConflicts" :key="conflict.category">
                  <span class="font-medium">{{ getCategoryDisplayName(conflict.category) }}类：</span>
                  选择了{{ conflict.count }}个（{{ conflict.items.map(item => item.name).join('、') }}），
                  <span class="text-yellow-300">最终只会随机显示1个</span>
                </div>
              </div>
            </div>
            
            <!-- Favorite Accessory Items -->
            <div v-if="favoriteAccessoryItems.length > 0" class="grid grid-cols-4 gap-3 mb-4">
              <div
                v-for="accessory in favoriteAccessoryItems"
                :key="accessory.id"
                @click="selectAccessory(accessory)"
                :class="[
                  'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedAccessories.some(acc => acc.id === accessory.id) ? 'border-primary-500 ring-1 ring-primary-500/50' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="accessory.thumbnail"
                  :alt="accessory.name"
                  class="w-full h-full object-cover"
                />
                
                <!-- Favorite Star -->
                <div class="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-50">
                  <Star class="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                
                <!-- Selected indicator -->
                <div v-if="selectedAccessories.some(acc => acc.id === accessory.id)" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center ring-2 ring-white">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Item name overlay -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-2">
                  <div class="text-xs font-medium">{{ accessory.name }}</div>
                </div>
              </div>
            </div>
            
            <!-- Browse More Button -->
            <button
              @click="openMaterialModal('accessories')"
              class="w-full mb-4 py-2 px-3 bg-gray-800 border border-gray-700 hover:border-primary-500 rounded-lg text-gray-300 hover:text-white transition-all group text-sm"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <span>浏览所有配饰</span>
              </div>
            </button>
            
            <!-- Upload Accessory Option -->
            <div
              @click="uploadAccessoryFile"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-6 w-6 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传配饰</p>
            </div>

            <div v-if="uploadedAccessory" class="mt-3 p-3 bg-gray-800 rounded-lg">
              <img :src="uploadedAccessory" alt="Uploaded accessory" class="w-16 h-16 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">配饰上传成功</p>
            </div>
          </div>

          <!-- Background Selection -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-white">选择背景</h2>
              <div v-if="selectedBackground" class="text-xs text-primary-400">
                已选择: {{ selectedBackground.name }}
              </div>
            </div>
            
            <!-- Favorite Background Items -->
            <div v-if="favoriteBackgroundItems.length > 0" class="grid grid-cols-4 gap-3 mb-4">
              <div
                v-for="background in favoriteBackgroundItems"
                :key="background.id"
                @click="selectBackground(background)"
                :class="[
                  'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
                  selectedBackground?.id === background.id ? 'border-primary-500 ring-1 ring-primary-500/50' : 'border-gray-700 hover:border-gray-600'
                ]"
              >
                <img
                  :src="background.thumbnail"
                  :alt="background.name"
                  class="w-full h-full object-cover"
                />
                
                <!-- Favorite Star -->
                <div class="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-50">
                  <Star class="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                
                <!-- Selected indicator -->
                <div v-if="selectedBackground?.id === background.id" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center ring-2 ring-white">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Item name overlay -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-2">
                  <div class="text-xs font-medium">{{ background.name }}</div>
                </div>
              </div>
            </div>
            
            <!-- Browse More Button -->
            <button
              @click="openMaterialModal('backgrounds')"
              class="w-full mb-4 py-2 px-3 bg-gray-800 border border-gray-700 hover:border-primary-500 rounded-lg text-gray-300 hover:text-white transition-all group text-sm"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <span>浏览所有背景</span>
              </div>
            </button>
            
            <!-- Upload Background Option -->
            <div
              @click="uploadBackgroundFile"
              class="border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload class="h-6 w-6 text-gray-500 group-hover:text-gray-400 mx-auto mb-2" />
              <p class="text-gray-500 group-hover:text-gray-400 text-sm">上传背景图</p>
            </div>

            <div v-if="uploadedBackground" class="mt-3 p-3 bg-gray-800 rounded-lg">
              <img :src="uploadedBackground" alt="Uploaded background" class="w-16 h-16 object-cover rounded mx-auto mb-2" />
              <p class="text-green-400 text-sm text-center">背景图上传成功</p>
            </div>
          </div>

          <!-- Generation Count -->  
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">生成数量</h2>
            <input
              v-model.number="generationCount"
              type="number"
              min="1"
              max="8"
              class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              placeholder="输入生成数量 (1-8)"
            />
          </div>

          <!-- Aspect Ratio Selection -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">图片比例</h2>
            
            <!-- Default aspect ratios (always shown) -->
            <div class="grid grid-cols-3 gap-2 mb-3">
              <div
                v-for="ratio in defaultAspectRatios"
                :key="ratio.id"
                @click="selectAspectRatio(ratio)"
                :class="[
                  'relative cursor-pointer transition-all hover:scale-105 border-2 rounded-lg p-3',
                  selectedAspectRatio?.id === ratio.id ? 'border-primary-500 bg-primary-500/10' : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                ]"
              >
                <!-- Visual preview of ratio -->
                <div class="flex items-center justify-center mb-2 h-10">
                  <div 
                    :class="[
                      'bg-gray-600 border border-gray-500 rounded-sm',
                      selectedAspectRatio?.id === ratio.id ? 'bg-primary-400' : ''
                    ]"
                    :style="{
                      width: Math.min(28, (ratio.width / Math.max(ratio.width, ratio.height)) * 28) + 'px',
                      height: Math.min(28, (ratio.height / Math.max(ratio.width, ratio.height)) * 28) + 'px'
                    }"
                  ></div>
                </div>
                <!-- Ratio label -->
                <div class="text-center">
                  <span :class="[
                    'text-xs font-medium',
                    selectedAspectRatio?.id === ratio.id ? 'text-white' : 'text-gray-300'
                  ]">{{ ratio.name }}</span>
                </div>
                <!-- Selected indicator -->
                <div v-if="selectedAspectRatio?.id === ratio.id" class="absolute top-1 right-1">
                  <div class="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Toggle button for more options -->
            <button
              @click="showAllAspectRatios = !showAllAspectRatios"
              class="w-full py-2 px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition-colors border border-gray-700 mb-3"
            >
              <span v-if="!showAllAspectRatios">显示更多比例选项 ({{ extraAspectRatios.length }})</span>
              <span v-else>收起比例选项</span>
              <svg 
                :class="[
                  'w-4 h-4 ml-2 inline transition-transform',
                  showAllAspectRatios ? 'rotate-180' : ''
                ]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Extra aspect ratios (collapsible) -->
            <div v-if="showAllAspectRatios" class="grid grid-cols-5 gap-2 mb-3">
              <div
                v-for="ratio in extraAspectRatios"
                :key="ratio.id"
                @click="selectAspectRatio(ratio)"
                :class="[
                  'relative cursor-pointer transition-all hover:scale-105 border-2 rounded-lg p-2',
                  selectedAspectRatio?.id === ratio.id ? 'border-primary-500 bg-primary-500/10' : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                ]"
              >
                <!-- Visual preview of ratio -->
                <div class="flex items-center justify-center mb-1 h-8">
                  <div 
                    :class="[
                      'bg-gray-600 border border-gray-500 rounded-sm',
                      selectedAspectRatio?.id === ratio.id ? 'bg-primary-400' : ''
                    ]"
                    :style="{
                      width: Math.min(24, (ratio.width / Math.max(ratio.width, ratio.height)) * 24) + 'px',
                      height: Math.min(24, (ratio.height / Math.max(ratio.width, ratio.height)) * 24) + 'px'
                    }"
                  ></div>
                </div>
                <!-- Ratio label -->
                <div class="text-center">
                  <span :class="[
                    'text-xs font-medium',
                    selectedAspectRatio?.id === ratio.id ? 'text-white' : 'text-gray-300'
                  ]">{{ ratio.name }}</span>
                </div>
                <!-- Selected indicator -->
                <div v-if="selectedAspectRatio?.id === ratio.id" class="absolute top-1 right-1">
                  <div class="w-3 h-3 bg-primary-500 rounded-full flex items-center justify-center">
                    <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedAspectRatio" class="mt-3 text-center">
              <span class="text-primary-400 text-sm">已选择: {{ selectedAspectRatio.name }}</span>
            </div>
          </div>

          <!-- Prompt Templates -->
          <div class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">Prompt模板 <span class="text-red-400">*</span></h2>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
              <button
                v-for="template in promptTemplates"
                :key="template.id"
                @click="selectPromptTemplate(template)"
                :class="[
                  'p-3 rounded-lg text-left transition-all border-2',
                  selectedPromptTemplate?.id === template.id 
                    ? 'border-primary-500 bg-primary-500/10 text-white' 
                    : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                ]"
              >
                <div class="font-medium text-sm mb-1">{{ template.name }}</div>
                <div class="text-xs text-gray-400 line-clamp-2">{{ template.prompt }}</div>
              </button>
            </div>

            <!-- Custom Prompt -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">自定义Prompt</label>
              <textarea
                v-model="customPrompt"
                placeholder="输入自定义的prompt描述..."
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none text-sm"
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Queue Actions (Batch Mode) -->
          <div v-if="batchMode" class="mb-4 space-y-3">
            <button
              @click="addToQueue"
              :disabled="validateCurrentSelection().length > 0"
              class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
            >
              加入队列
            </button>
            
            <div class="flex space-x-2">
              <div class="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg font-medium text-center">
                队列中: {{ generationQueue.length }} 个搭配
              </div>
              <button
                v-if="generationQueue.length > 0"
                @click="generateQueueItems"
                class="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white py-2 px-4 rounded-lg font-medium transition-all"
              >
                生成 {{ generationQueue.reduce((sum, item) => sum + item.count, 0) }} 张图片（消耗{{ generationQueue.reduce((sum, item) => sum + item.count, 0) }}积分）
              </button>
            </div>
            
            <div class="text-center text-xs text-gray-500">
              创建多个搭配组合，然后一次性批量生成
            </div>
          </div>

          <!-- Generate Button (Single Mode Only) -->
          <div v-if="!batchMode">
            <button
              @click="generateImages"
              :disabled="(selectedModels.length === 0 && !uploadedModel) || (selectedTops.length === 0 && !uploadedTop) || !customPrompt.trim() || isGenerating"
              class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-4 rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
            >
              <span v-if="isGenerating">生成中...</span>
              <span v-else>生成 {{ generationCount }} 张图片（消耗{{ generationCount }}积分）</span>
            </button>

            <div class="mt-4 text-center">
              <p class="text-gray-500 text-sm">
                预计生成时间：3-5分钟
              </p>
            </div>
          </div>
          
          <!-- Batch Mode Info -->
          <div v-if="batchMode" class="text-center">
            <p class="text-gray-500 text-sm">
              批量模式：每次选择一个完整搭配加入队列
            </p>
            <p class="text-gray-500 text-xs">
              队列中的搭配显示在右侧面板
            </p>
          </div>
        </div>
        
      </div>

      <!-- Right Panel - Queue & Results -->
      <div :class="[
        'hidden lg:block bg-gray-900 p-6 overflow-y-auto',
        'lg:w-3/5',
        'xl:w-2/3'
      ]">
        <div class="max-w-lg mx-auto">
          <!-- Queue Panel (Batch Mode) -->
          <div v-if="batchMode" class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-white">搭配队列</h2>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-400">{{ generationQueue.length }} 个搭配</span>
                <button
                  v-if="generationQueue.length > 0"
                  @click="clearQueue"
                  class="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  清空
                </button>
              </div>
            </div>
            
            <div v-if="generationQueue.length === 0" class="text-center py-8 bg-gray-800 rounded-lg">
              <div class="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <p class="text-gray-400 text-sm mb-1">队列为空</p>
              <p class="text-gray-500 text-xs">选择搭配后点击"加入队列"添加搭配</p>
            </div>
            
            <div v-else class="space-y-3">
              <div class="bg-gray-800 rounded-lg max-h-64 overflow-y-auto">
                <div
                  v-for="(item, index) in generationQueue"
                  :key="item.id"
                  class="p-4 hover:bg-gray-750 transition-colors border-b border-gray-700 last:border-b-0"
                >
                  <div class="flex items-start space-x-3">
                    <!-- Preview Images -->
                    <div class="flex space-x-1 flex-shrink-0">
                      <img :src="item.model.thumbnail" alt="Model" class="w-8 h-8 object-cover rounded" />
                      <img :src="item.top.thumbnail" alt="Top" class="w-8 h-8 object-cover rounded" />
                      <img :src="item.bottom.thumbnail" alt="Bottom" class="w-8 h-8 object-cover rounded" />
                      <img v-for="accessory in item.accessories" :key="accessory.id" :src="accessory.thumbnail" alt="Accessory" class="w-8 h-8 object-cover rounded" />
                      <img v-if="item.background" :src="item.background.thumbnail" alt="Background" class="w-8 h-8 object-cover rounded" />
                    </div>
                    
                    <!-- Item Details -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-medium text-white">搭配 {{ index + 1 }}</span>
                        <span class="text-xs text-primary-400">{{ item.count }}张</span>
                      </div>
                      <div class="text-xs text-gray-400 space-y-0.5">
                        <p>{{ item.model.name }} • {{ item.top.name }} • {{ item.bottom.name }}</p>
                        <p v-if="item.accessories && item.accessories.length > 0">配饰: {{ item.accessories.map(acc => acc.name).join(', ') }}</p>
                        <p v-if="item.background">背景: {{ item.background.name }}</p>
                        <p v-if="item.aspectRatio">比例: {{ item.aspectRatio.name }}</p>
                        <p class="truncate">{{ item.prompt }}</p>
                      </div>
                    </div>
                    
                    <!-- Actions -->
                    <div class="flex flex-col space-y-1">
                      <button
                        @click="editQueueItem(item)"
                        class="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                        title="编辑"
                      >
                        <Edit2 class="w-4 h-4" />
                      </button>
                      <button
                        @click="removeFromQueue(item.id)"
                        class="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        title="删除"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-800 rounded-lg p-4">
                <div class="text-center text-xs text-gray-400 mb-3">
                  总计：{{ generationQueue.reduce((sum, item) => sum + item.count, 0) }} 张图片将被生成（消耗{{ generationQueue.reduce((sum, item) => sum + item.count, 0) }}积分）
                </div>
                <button
                  @click="generateQueueItems"
                  class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  生成 {{ generationQueue.reduce((sum, item) => sum + item.count, 0) }} 张图片（消耗{{ generationQueue.reduce((sum, item) => sum + item.count, 0) }}积分）
                </button>
              </div>
            </div>
          </div>

          <!-- Results Section -->
          <div v-if="!batchMode || generatedResults.length > 0" class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-white">生成结果</h2>
              <div v-if="generatedResults.length > 0" class="text-xs text-gray-400">
                {{ generatedResults.length }} 张图片
              </div>
            </div>

          </div>

          <div v-if="isGenerating" class="text-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p class="text-gray-400">正在生成模特图...</p>
          </div>

          <div v-else-if="generatedResults.length > 0" class="space-y-6">
            <!-- Batch Results (Grouped by Combination) -->
            <div v-if="batchMode && generatedResults[0]?.combination">
              <div v-for="(group, index) in groupedResults" :key="index" class="mb-8">
                <div class="mb-4 p-3 bg-gray-800 rounded-lg">
                  <h4 class="text-white font-medium">{{ group.combination.name }}</h4>
                  <div class="text-xs text-gray-400 mt-1">
                    {{ group.images.length }} 张图片
                  </div>
                </div>
                
                <div class="grid grid-cols-3 gap-3">
                  <div
                    v-for="result in group.images"
                    :key="result.id"
                    @click="toggleResultSelection(result.id)"
                    :class="[
                      'relative group cursor-pointer transition-all',
                      selectedResults.has(result.id) ? 'ring-2 ring-primary-500 rounded-lg' : ''
                    ]"
                  >
                    <img
                      :src="result.url"
                      :alt="`Generated result ${result.id}`"
                      :class="[
                        'w-full object-cover rounded-lg',
                        (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '1:1' ? 'aspect-square' :
                        (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '4:3' ? 'aspect-[4/3]' :
                        (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '3:2' ? 'aspect-[3/2]' :
                        (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '5:4' ? 'aspect-[5/4]' :
                        (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '9:16' ? 'aspect-[9/16]' :
                        (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '16:9' ? 'aspect-[16/9]' :
                        (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '21:9' ? 'aspect-[21/9]' :
                        (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '2:3' ? 'aspect-[2/3]' :
                        (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '4:5' ? 'aspect-[4/5]' :
                        'aspect-[3/4]'
                      ]"
                    />
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg">
                      <!-- Selection Checkbox -->
                      <div class="absolute top-2 right-2">
                        <div 
                          :class="[
                            'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                            selectedResults.has(result.id) 
                              ? 'bg-primary-500 border-primary-500' 
                              : 'bg-gray-800 border-gray-600 opacity-60 group-hover:opacity-100'
                          ]"
                        >
                          <Check v-if="selectedResults.has(result.id)" class="w-3 h-3 text-white" />
                        </div>
                      </div>
                      
                      <!-- Action buttons -->
                      <div class="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          @click.stop="editSingleResult(result)"
                          class="p-2 bg-green-500 rounded-full text-white hover:bg-green-400 transition-colors"
                        >
                          <Edit2 class="h-3 w-3" />
                        </button>
                        <button 
                          @click.stop="downloadSingleResult(result)"
                          class="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-400 transition-colors"
                        >
                          <Download class="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    <!-- Combination label -->
                    <div class="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {{ result.combination.name }}
                    </div>
                    
                    <!-- Edited indicator -->
                    <div v-if="result.isEdited" class="absolute bottom-2 left-2">
                      <div class="bg-green-500 text-white text-xs px-2 py-1 rounded">
                        已编辑
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Single Mode Results -->
            <div v-else>
              <div class="grid grid-cols-3 gap-3">
                <div
                  v-for="result in generatedResults"
                  :key="result.id"
                  @click="toggleResultSelection(result.id)"
                  :class="[
                    'relative group cursor-pointer transition-all',
                    selectedResults.has(result.id) ? 'ring-2 ring-primary-500 rounded-lg' : ''
                  ]"
                >
                  <img
                    :src="result.url"
                    :alt="`Generated result ${result.id}`"
                    :class="[
                      'w-full object-cover rounded-lg',
                      (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '1:1' ? 'aspect-square' :
                      (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '4:3' ? 'aspect-[4/3]' :
                      (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '3:2' ? 'aspect-[3/2]' :
                      (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '5:4' ? 'aspect-[5/4]' :
                      (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '9:16' ? 'aspect-[9/16]' :
                      (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '16:9' ? 'aspect-[16/9]' :
                      (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '21:9' ? 'aspect-[21/9]' :
                      (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '2:3' ? 'aspect-[2/3]' :
                      (result.aspectRatio?.id || result.queueItem?.aspectRatio?.id) === '4:5' ? 'aspect-[4/5]' :
                      'aspect-[3/4]'
                    ]"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg">
                    <!-- Selection Checkbox -->
                    <div class="absolute top-2 right-2">
                      <div 
                        :class="[
                          'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                          selectedResults.has(result.id) 
                            ? 'bg-primary-500 border-primary-500' 
                            : 'bg-gray-800 border-gray-600 opacity-60 group-hover:opacity-100'
                        ]"
                      >
                        <Check v-if="selectedResults.has(result.id)" class="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <!-- Action buttons -->
                    <div class="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        @click.stop="editSingleResult(result)"
                        class="p-2 bg-green-500 rounded-full text-white hover:bg-green-400 transition-colors"
                      >
                        <Edit2 class="h-3 w-3" />
                      </button>
                      <button 
                        @click.stop="downloadSingleResult(result)"
                        class="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-400 transition-colors"
                      >
                        <Download class="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Edited indicator -->
                  <div v-if="result.isEdited" class="absolute top-2 left-2">
                    <div class="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      已编辑
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Generation Info -->
            <div class="bg-gray-800 p-4 rounded-lg">
              <h3 class="text-white font-medium mb-2">生成信息</h3>
              <div class="text-sm text-gray-400 space-y-1">
                <p v-if="selectedModels.length > 0 || uploadedModel">模特：{{ uploadedModel ? '上传的模特' : (batchMode ? `${selectedModels.length} 位模特` : selectedModels[0]?.name) }}</p>
                <p v-if="!batchMode && (selectedTops[0] || uploadedTop)">上装：{{ selectedTops[0]?.name || '上传的上装' }}</p>
                <p v-if="!batchMode && (selectedBottoms[0] || uploadedBottom)">下装：{{ selectedBottoms[0]?.name || '上传的下装' }}</p>
                <p v-if="batchMode">搭配数量：{{ new Set(generatedResults.map(r => r.combination?.id)).size }} 个</p>
                <p v-if="batchMode">总图片数：{{ generatedResults.length }} 张</p>
                <p v-if="selectedAccessories.length > 0 || uploadedAccessory">配饰：{{ uploadedAccessory ? '上传的配饰' : selectedAccessories.map(acc => acc.name).join(', ') }}</p>
                <p v-if="selectedBackground || uploadedBackground">背景：{{ uploadedBackground ? '上传的背景' : selectedBackground.name }}</p>
                <p v-if="selectedAspectRatio">图片比例：{{ selectedAspectRatio.name }}</p>
                <p v-if="customPrompt">Prompt：{{ customPrompt.length > 50 ? customPrompt.substring(0, 50) + '...' : customPrompt }}</p>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="text-center py-16">
              <h3 class="text-lg font-semibold text-white mb-4">优秀案例</h3>
              <div class="grid grid-cols-3 gap-3">
                <div
                  v-for="sample in sampleResults"
                  :key="sample.id"
                  class="relative"
                >
                  <img
                    :src="sample.url"
                    :alt="`Sample ${sample.id}`"
                    class="w-full aspect-[3/4] object-cover rounded-lg opacity-60"
                  />
                </div>
              </div>
              <p class="text-gray-500 text-sm mt-4">选择模特和服装后开始生成</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Combination Preview Modal -->
    <div 
      v-if="showCombinationPreview" 
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showCombinationPreview = false"
    >
      <div class="bg-gray-900 rounded-lg p-8 w-[80vw] h-[80vh] overflow-y-auto mx-4">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h3 class="text-2xl font-bold text-white">搭配组合预览</h3>
            <p class="text-gray-400 text-base mt-2">选择要生成的搭配组合 · 共 {{ selectedCombinations.length }} 个组合</p>
          </div>
          <button
            @click="showCombinationPreview = false"
            class="text-gray-400 hover:text-white p-3 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Batch Actions -->
        <div class="flex justify-between items-center mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div class="flex space-x-3">
            <button
              @click="selectAllCombinations"
              class="px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white text-sm rounded-lg font-medium transition-colors"
            >
              全选
            </button>
            <button
              @click="deselectAllCombinations"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg font-medium transition-colors"
            >
              全不选
            </button>
          </div>
          <div class="text-sm text-gray-300 font-medium">
            已选择: <span class="text-primary-400">{{ selectedCombinations.filter(c => c.selected).length }}</span> / {{ selectedCombinations.length }}
          </div>
        </div>

        <!-- Combinations Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
          <div
            v-for="(combination, index) in selectedCombinations"
            :key="combination.id"
            @click="toggleCombinationSelection(combination)"
            :class="[
              'border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1',
              combination.selected 
                ? 'border-primary-500 bg-primary-500/10 shadow-primary-500/20' 
                : [
                    'border-gray-700 hover:border-gray-500',
                    index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-700/30'
                  ]
            ]"
          >
            <!-- Header with combination name and selection -->
            <div class="flex justify-between items-center mb-3">
              <div>
                <h5 class="text-white font-medium text-sm">组合 {{ index + 1 }}</h5>
                <p class="text-xs text-gray-400">{{ combination.name }}</p>
              </div>
              <div 
                :class="[
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                  combination.selected 
                    ? 'bg-primary-500 border-primary-500 shadow-lg' 
                    : 'bg-gray-700 border-gray-600'
                ]"
              >
                <Check v-if="combination.selected" class="w-4 h-4 text-white" />
              </div>
            </div>

            <!-- Horizontal Combination Preview -->
            <div class="flex items-center space-x-3">
              <!-- Model -->
              <div class="flex-shrink-0">
                <img
                  :src="combination.model.isUploaded ? uploadedModel : combination.model.thumbnail"
                  :alt="combination.model.name"
                  class="w-12 h-12 object-cover rounded-lg border border-gray-600"
                />
                <p class="text-xs text-gray-400 mt-1 text-center truncate w-12">模特</p>
              </div>
              
              <!-- Plus -->
              <div class="text-gray-500 text-lg font-medium">+</div>
              
              <!-- Top Item -->
              <div class="flex-shrink-0">
                <img
                  :src="combination.top.isUploaded ? uploadedTop : combination.top.thumbnail"
                  :alt="combination.top.name"
                  class="w-12 h-12 object-cover rounded-lg border border-gray-600"
                />
                <p class="text-xs text-gray-400 mt-1 text-center truncate w-12">上装</p>
              </div>
              
              <!-- Plus -->
              <div class="text-gray-500 text-lg font-medium">+</div>
              
              <!-- Bottom Item -->
              <div class="flex-shrink-0">
                <img
                  :src="combination.bottom.isUploaded ? uploadedBottom : combination.bottom.thumbnail"
                  :alt="combination.bottom.name"
                  class="w-12 h-12 object-cover rounded-lg border border-gray-600"
                />
                <p class="text-xs text-gray-400 mt-1 text-center truncate w-12">下装</p>
              </div>
            </div>

            <!-- Item names -->
            <div class="mt-3 space-y-1">
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">模特:</span>
                <span class="text-gray-300 truncate ml-2">{{ combination.model.name }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">上装:</span>
                <span class="text-gray-300 truncate ml-2">{{ combination.top.name }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">下装:</span>
                <span class="text-gray-300 truncate ml-2">{{ combination.bottom.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="border-t border-gray-700 pt-6 mt-6">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              @click="showCombinationPreview = false"
              class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              取消
            </button>
            
            <div class="text-center">
              <div class="text-lg text-gray-200 font-medium">
                将生成 {{ selectedCombinations.filter(c => c.selected).length * generationCount }} 张图片（消耗{{ selectedCombinations.filter(c => c.selected).length * generationCount }}积分）
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ selectedCombinations.filter(c => c.selected).length }} 个搭配 × {{ generationCount }} 张/搭配
              </div>
            </div>
            
            <button
              @click="generateImages"
              :disabled="selectedCombinations.filter(c => c.selected).length === 0"
              class="px-6 py-3 bg-primary-500 hover:bg-primary-400 disabled:bg-gray-700 text-white rounded-lg disabled:cursor-not-allowed font-medium transition-colors"
            >
              生成选中的搭配
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Floating Action Toolbar (shown when results are selected) -->
    <div 
      v-if="selectedResults.size > 0" 
      class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-gray-800 border border-primary-500 rounded-lg shadow-lg p-4 max-w-md w-full mx-4"
    >
      <div class="flex justify-between items-center mb-3">
        <span class="text-white text-sm font-medium">
          已选择 {{ selectedResults.size }} 张图片
        </span>
        <div class="flex space-x-2">
          <button
            @click="selectAllResults"
            class="text-xs text-primary-400 hover:text-primary-300 transition-colors"
          >
            全选
          </button>
          <button
            @click="deselectAllResults"
            class="text-xs text-gray-400 hover:text-gray-300 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="downloadSelectedResults"
          class="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition-colors"
        >
          <Download class="h-3 w-3" />
          <span>批量下载</span>
        </button>
        <button
          @click="editSelectedResults"
          class="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs rounded transition-colors"
        >
          <Edit2 class="h-3 w-3" />
          <span>批量编辑</span>
        </button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div 
      v-if="showEditModal" 
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showEditModal = false"
    >
      <div class="bg-gray-900 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[85vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-bold text-white">编辑 Prompt</h3>
            <p class="text-gray-400 text-sm mt-1">
              {{ editingResults.length === 1 ? '编辑单个结果' : `批量编辑 ${editingResults.length} 个结果` }}
            </p>
          </div>
          <button
            @click="showEditModal = false"
            class="text-gray-400 hover:text-white p-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Preview of images being edited -->
        <div v-if="editingResults.length > 0" class="mb-8">
          <h4 class="text-white font-medium mb-4">待编辑的图片 ({{ editingResults.length }} 张)</h4>
          <div 
            :class="[
              'grid gap-3',
              editingResults.length <= 6 ? 'grid-cols-6' : 
              editingResults.length <= 8 ? 'grid-cols-8' : 
              'grid-cols-10'
            ]"
          >
            <div
              v-for="result in editingResults"
              :key="result.id"
              class="relative aspect-[3/4] rounded-lg overflow-hidden"
            >
              <img
                :src="result.url"
                :alt="`Edit ${result.id}`"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-primary-500 bg-opacity-20"></div>
              <!-- Result ID -->
              <div class="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded">
                #{{ result.id }}
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Prompt -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-300 mb-3">
            新 Prompt *
          </label>
          <textarea
            v-model="editPrompt"
            placeholder="输入修改后的prompt描述..."
            class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 resize-none min-h-[120px] text-sm"
            rows="5"
          ></textarea>
        </div>

        <!-- Edit Info -->
        <div class="mb-6 text-center">
          <p class="text-sm text-gray-400">
            {{ editingResults.length > 1 ? `此prompt将应用于所有选中的 ${editingResults.length} 张图片` : '修改后将重新生成此图片' }}
          </p>
        </div>


        <!-- Modal Actions -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-700">
          <button
            @click="showEditModal = false"
            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            取消
          </button>
          
          <div class="text-center">
            <div class="text-lg text-gray-300 font-medium">
              {{ editingResults.length > 1 ? `将重新生成 ${editingResults.length} 张图片（消耗${editingResults.length}积分）` : '将重新生成 1 张图片（消耗1积分）' }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              预计时间：{{ editingResults.length * 0.5 }} 分钟
            </div>
          </div>
          
          <button
            @click="regenerateWithEdit"
            :disabled="!editPrompt.trim() || isRegenerating"
            class="px-6 py-3 bg-primary-500 hover:bg-primary-400 disabled:bg-gray-700 text-white rounded-lg disabled:cursor-not-allowed transition-colors font-medium"
          >
            {{ isRegenerating ? '生成中...' : '重新生成' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Regeneration Progress -->
    <div v-if="isRegenerating" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-gray-900 rounded-lg p-6 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <h3 class="text-white font-medium mb-2">正在重新生成</h3>
        <p class="text-gray-400 text-sm">
          正在根据新prompt生成 {{ editingResults.length }} 张图片...
        </p>
      </div>
    </div>

    <!-- Material Library Modal -->
    <div 
      v-if="showMaterialModal.tops || showMaterialModal.bottoms || showMaterialModal.accessories || showMaterialModal.backgrounds" 
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="closeMaterialModal()"
    >
      <div class="bg-gray-900 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h3 class="text-lg font-bold text-white">
              {{ showMaterialModal.tops ? '上装图库' : 
                  showMaterialModal.bottoms ? '下装图库' :
                  showMaterialModal.accessories ? '配饰图库' : '背景图库' }}
            </h3>
            <p class="text-gray-400 text-sm mt-1">点击星星收藏/取消收藏，收藏的素材会在主界面显示</p>
          </div>
          <button
            @click="closeMaterialModal()"
            class="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Search and Filter Controls -->
        <div class="mb-6 space-y-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="modalSearchQueries.tops"
              v-if="showMaterialModal.tops"
              type="text"
              placeholder="搜索上装名称或标签..."
              class="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 text-sm"
            />
            <input
              v-model="modalSearchQueries.bottoms"
              v-if="showMaterialModal.bottoms"
              type="text"
              placeholder="搜索下装名称或标签..."
              class="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 text-sm"
            />
            <input
              v-model="modalSearchQueries.accessories"
              v-if="showMaterialModal.accessories"
              type="text"
              placeholder="搜索配饰名称或标签..."
              class="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 text-sm"
            />
            <input
              v-model="modalSearchQueries.backgrounds"
              v-if="showMaterialModal.backgrounds"
              type="text"
              placeholder="搜索背景名称或标签..."
              class="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 text-sm"
            />
          </div>
          
          <div class="flex space-x-3">
            <select
              v-model="modalCategoryFilters.tops"
              v-if="showMaterialModal.tops"
              class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-primary-500 text-sm"
            >
              <option value="">所有分类</option>
              <option value="shirt">衬衫</option>
              <option value="casual">休闲</option>
              <option value="formal">正装</option>
              <option value="sport">运动</option>
            </select>
            <select
              v-model="modalCategoryFilters.bottoms"
              v-if="showMaterialModal.bottoms"
              class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-primary-500 text-sm"
            >
              <option value="">所有分类</option>
              <option value="casual">休闲</option>
              <option value="formal">正装</option>
              <option value="sport">运动</option>
              <option value="dress">连衣裙</option>
            </select>
            <select
              v-model="modalCategoryFilters.accessories"
              v-if="showMaterialModal.accessories"
              class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-primary-500 text-sm"
            >
              <option value="">所有分类</option>
              <option value="jewelry">首饰</option>
              <option value="bag">包包</option>
              <option value="hat">帽子</option>
              <option value="belt">腰带</option>
            </select>
            <select
              v-model="modalCategoryFilters.backgrounds"
              v-if="showMaterialModal.backgrounds"
              class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-primary-500 text-sm"
            >
              <option value="">所有分类</option>
              <option value="indoor">室内</option>
              <option value="outdoor">户外</option>
              <option value="studio">影棚</option>
              <option value="abstract">抽象</option>
            </select>

            <button
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors flex items-center space-x-2 text-sm"
              @click="toggleModalSortByFavorite()"
            >
              <Star :class="['h-4 w-4', modalSortByFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400']" />
              <span>{{ modalSortByFavorite ? '显示全部' : '只看收藏' }}</span>
            </button>
          </div>
        </div>

        <!-- Results Info -->
        <div class="mb-4 text-sm text-gray-400">
          找到 {{ 
            showMaterialModal.tops ? modalFilteredTopItems.length :
            showMaterialModal.bottoms ? modalFilteredBottomItems.length :
            showMaterialModal.accessories ? modalFilteredAccessoryItems.length :
            modalFilteredBackgroundItems.length 
          }} 个素材
        </div>

        <!-- Material Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <!-- Top Clothing Items -->
          <div
            v-if="showMaterialModal.tops"
            v-for="item in modalFilteredTopItems"
            :key="item.id"
            @click="selectTop(item); closeMaterialModal()"
            :class="[
              'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
              selectedTops[0]?.id === item.id ? 'border-primary-500 ring-2 ring-primary-500/50' : 'border-gray-700 hover:border-gray-600'
            ]"
          >
            <img
              :src="item.thumbnail"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            
            <!-- Favorite Star -->
            <button
              @click.stop="toggleFavorite(item, 'topClothing')"
              class="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-all"
            >
              <Star 
                :class="[
                  'h-5 w-5 transition-colors',
                  item.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300'
                ]"
              />
            </button>
            
            <!-- Usage Count -->
            <div class="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
              {{ item.usageCount }}
            </div>
            
            <!-- Selected indicator -->
            <div v-if="selectedTops[0]?.id === item.id" class="absolute inset-0 bg-primary-500 bg-opacity-20 flex items-center justify-center">
              <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center ring-2 ring-white">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            
            <!-- Item info -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-3">
              <div class="text-sm font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-300 mt-1 flex flex-wrap gap-1">
                <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="bg-gray-600 px-2 py-0.5 rounded">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Clothing Items -->
          <div
            v-if="showMaterialModal.bottoms"
            v-for="item in modalFilteredBottomItems"
            :key="item.id"
            @click="selectBottom(item); closeMaterialModal()"
            :class="[
              'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
              selectedBottoms[0]?.id === item.id ? 'border-primary-500 ring-2 ring-primary-500/50' : 'border-gray-700 hover:border-gray-600'
            ]"
          >
            <img
              :src="item.thumbnail"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            
            <!-- Favorite Star -->
            <button
              @click.stop="toggleFavorite(item, 'bottomClothing')"
              class="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-all"
            >
              <Star 
                :class="[
                  'h-5 w-5 transition-colors',
                  item.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300'
                ]"
              />
            </button>
            
            <!-- Usage Count -->
            <div class="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
              {{ item.usageCount }}
            </div>
            
            <!-- Selected indicator -->
            <div v-if="selectedBottoms[0]?.id === item.id" class="absolute inset-0 bg-primary-500 bg-opacity-20 flex items-center justify-center">
              <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center ring-2 ring-white">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            
            <!-- Item info -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-3">
              <div class="text-sm font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-300 mt-1 flex flex-wrap gap-1">
                <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="bg-gray-600 px-2 py-0.5 rounded">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Accessory Items -->
          <div
            v-if="showMaterialModal.accessories"
            v-for="item in modalFilteredAccessoryItems"
            :key="item.id"
            @click="selectAccessory(item); closeMaterialModal()"
            :class="[
              'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
              selectedAccessories[0]?.id === item.id ? 'border-primary-500 ring-2 ring-primary-500/50' : 'border-gray-700 hover:border-gray-600'
            ]"
          >
            <img
              :src="item.thumbnail"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            
            <!-- Favorite Star -->
            <button
              @click.stop="toggleFavorite(item, 'accessories')"
              class="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-all"
            >
              <Star 
                :class="[
                  'h-5 w-5 transition-colors',
                  item.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300'
                ]"
              />
            </button>
            
            <!-- Usage Count -->
            <div class="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
              {{ item.usageCount }}
            </div>
            
            <!-- Selected indicator -->
            <div v-if="selectedAccessories[0]?.id === item.id" class="absolute inset-0 bg-primary-500 bg-opacity-20 flex items-center justify-center">
              <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center ring-2 ring-white">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            
            <!-- Item info -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-3">
              <div class="text-sm font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-300 mt-1 flex flex-wrap gap-1">
                <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="bg-gray-600 px-2 py-0.5 rounded">{{ tag }}</span>
              </div>
            </div>
          </div>

          <!-- Background Items -->
          <div
            v-if="showMaterialModal.backgrounds"
            v-for="item in modalFilteredBackgroundItems"
            :key="item.id"
            @click="selectBackground(item); closeMaterialModal()"
            :class="[
              'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 border-2',
              selectedBackground?.id === item.id ? 'border-primary-500 ring-2 ring-primary-500/50' : 'border-gray-700 hover:border-gray-600'
            ]"
          >
            <img
              :src="item.thumbnail"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            
            <!-- Favorite Star -->
            <button
              @click.stop="toggleFavorite(item, 'backgrounds')"
              class="absolute top-2 left-2 p-1 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-all"
            >
              <Star 
                :class="[
                  'h-5 w-5 transition-colors',
                  item.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-300'
                ]"
              />
            </button>
            
            <!-- Usage Count -->
            <div class="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
              {{ item.usageCount }}
            </div>
            
            <!-- Selected indicator -->
            <div v-if="selectedBackground?.id === item.id" class="absolute inset-0 bg-primary-500 bg-opacity-20 flex items-center justify-center">
              <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center ring-2 ring-white">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            
            <!-- Item info -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent text-white p-3">
              <div class="text-sm font-medium">{{ item.name }}</div>
              <div class="text-xs text-gray-300 mt-1 flex flex-wrap gap-1">
                <span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="bg-gray-600 px-2 py-0.5 rounded">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-center pt-4 border-t border-gray-700">
          <button
            @click="closeMaterialModal()"
            class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary-400: #8b5cf6;
  --primary-500: #7c3aed;
  --primary-600: #6d28d9;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>