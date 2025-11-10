# Claude 开发规范

## 字体和排版规范

### 字体栈 (Font Stack)

遵循现代 Web 最佳实践的字体配置：

```css
font-family: 
  'Inter', 
  -apple-system, 
  BlinkMacSystemFont, 
  'Segoe UI', 
  'Roboto', 
  'Oxygen', 
  'Ubuntu', 
  'Cantarell', 
  'Noto Sans', 
  sans-serif;
```

### 字体配置原则

1. **主要字体**: Inter - 现代、易读的无衬线字体，适合UI界面
2. **系统字体降级**: 优先使用系统原生字体以提高性能
3. **字体加载**: 使用 `font-display: swap` 避免FOIT (Flash of Invisible Text)
4. **字重范围**: 支持300-900字重，常用400(normal)、500(medium)、600(semibold)

### 字体大小规范 (Tailwind CSS)

```css
/* 标题层级 */
text-xs     /* 12px - 小标签、辅助文字 */
text-sm     /* 14px - 次要信息、说明文字 */
text-base   /* 16px - 正文文字 */
text-lg     /* 18px - 副标题 */
text-xl     /* 20px - 小标题 */
text-2xl    /* 24px - 二级标题 */
text-3xl    /* 30px - 一级标题 */
text-4xl    /* 36px - 页面主标题 */
```

### 行高规范

```css
leading-none    /* 1.0 - 大标题使用 */
leading-tight   /* 1.25 - 标题使用 */
leading-snug    /* 1.375 - 副标题使用 */
leading-normal  /* 1.5 - 正文使用 */
leading-relaxed /* 1.625 - 长文本阅读 */
```

### 字重使用指南

```css
font-light      /* 300 - 大标题装饰性文字 */
font-normal     /* 400 - 正文文字 */
font-medium     /* 500 - 强调文字、按钮文字 */
font-semibold   /* 600 - 标题、重要信息 */
font-bold       /* 700 - 主标题、强调标题 */
font-extrabold  /* 800 - 大型展示标题 */
font-black      /* 900 - 特殊强调文字 */
```

### 文字颜色规范

```css
/* 主要文字颜色 */
text-white      /* #ffffff - 主要文字 (深色背景) */
text-gray-100   /* #f3f4f6 - 次要文字 (深色背景) */
text-gray-400   /* #9ca3af - 辅助文字、说明文字 */
text-gray-500   /* #6b7280 - 次要信息 */

/* 语义化颜色 */
text-primary-300   /* 链接、强调文字 */
text-green-400     /* 成功状态 */
text-red-400       /* 错误、警告 */
text-yellow-400    /* 警示信息 */
```

### 必要的字体优化设置

```css
body {
  /* 字体渲染优化 */
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* 响应式字体大小 */
  font-size: 16px; /* 基础字体大小，不小于16px以确保可访问性 */
}
```

### 组件开发规范

1. **标题组件**:
   - H1: `text-3xl font-bold` 或更大
   - H2: `text-2xl font-semibold`
   - H3: `text-xl font-medium`
   - H4: `text-lg font-medium`

2. **按钮文字**:
   - 主要按钮: `text-sm font-medium` 或 `text-base font-medium`
   - 次要按钮: `text-sm font-normal`

3. **表单标签**:
   - `text-sm font-medium text-gray-200`

4. **说明文字**:
   - `text-xs text-gray-400` 或 `text-sm text-gray-400`

### 无障碍访问 (Accessibility)

1. **最小字体大小**: 正文文字不小于16px
2. **颜色对比度**: 确保文字与背景对比度符合WCAG 2.1 AA标准
3. **行高设置**: 正文行高至少1.5倍字体大小
4. **字体权重**: 避免过轻的字体权重影响可读性

### 性能优化

1. **字体预加载**:
   ```html
   <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
   ```

2. **字体显示策略**:
   ```css
   @font-face {
     font-family: 'Inter';
     src: url('/fonts/inter.woff2') format('woff2');
     font-display: swap;
   }
   ```

## 使用注意事项

- 所有新组件必须遵循以上字体规范
- 在创建自定义字体大小时，优先使用Tailwind预定义的尺寸
- 避免使用过多的字体权重，保持设计一致性
- 深色主题下注意文字颜色的对比度
- 移动端确保文字大小足够触摸友好

## 开发命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 代码检查
pnpm lint

# 类型检查
pnpm type-check
```