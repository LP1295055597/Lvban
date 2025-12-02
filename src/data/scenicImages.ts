// 丽江景点和美食的真实图片映射
export const scenicImages: Record<string, string> = {
  // 景点图片
  '丽江古城': 'https://images.unsplash.com/photo-1637872937209-e1a5ccdc90cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMaWppYW5nJTIwb2xkJTIwdG93bnxlbnwxfHx8fDE3NjQ2MDU0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '玉龙雪山': 'https://images.unsplash.com/photo-1677922069769-0164b29e2c1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxKYWRlJTIwRHJhZ29uJTIwU25vdyUyME1vdW50YWlufGVufDF8fHx8MTc2NDYwNTQ5MXww&ixlib=rb-4.1.0&q=80&w=1080',
  '束河古镇': 'https://images.unsplash.com/photo-1663609968423-657ff4f0dd5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTaHVoZSUyMGFuY2llbnQlMjB0b3dufGVufDF8fHx8MTc2NDYwNTQ5MXww&ixlib=rb-4.1.0&q=80&w=1080',
  '蓝月谷': 'https://images.unsplash.com/photo-1750981697143-804825aa50f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCbHVlJTIwTW9vbiUyMFZhbGxleSUyMGxha2V8ZW58MXx8fHwxNzY0NjA1NDkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  '虎跳峡': 'https://images.unsplash.com/photo-1516941072577-aecd44b927bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaWdlciUyMExlYXBpbmclMjBHb3JnZXxlbnwxfHx8fDE3NjQ2MDU0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '泸沽湖': 'https://images.unsplash.com/photo-1667568988187-ab4417235c12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMdWd1JTIwTGFrZXxlbnwxfHx8fDE3NjQ2MDU0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // 美食图片
  '过桥米线': 'https://images.unsplash.com/photo-1672842035316-d21a9a5614d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxZdW5uYW4lMjByaWNlJTIwbm9vZGxlc3xlbnwxfHx8fDE3NjQ2MDU0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '腊排骨': 'https://images.unsplash.com/photo-1760259901896-817a66802917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGluZXNlJTIwcG9yayUyMHJpYnN8ZW58MXx8fHwxNzY0NjA1NDk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '酥油茶': 'https://images.unsplash.com/photo-1703578283529-68a4100a543b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGluZXNlJTIwYnV0dGVyJTIwdGVhfGVufDF8fHx8MTc2NDYwNTQ5NXww&ixlib=rb-4.1.0&q=80&w=1080',
  '丽江粑粑': 'https://images.unsplash.com/photo-1740797922980-5beddbf6005e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGluZXNlJTIwYmFiYSUyMGJyZWFkfGVufDF8fHx8MTc2NDYwNTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
  '黑山羊火锅': 'https://images.unsplash.com/photo-1668627631641-804af7ce4a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxZYWslMjBtZWF0JTIwaG90cG90fGVufDF8fHx8MTc2NDYwNTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
  '汽锅鸡': 'https://images.unsplash.com/photo-1604899207144-d9c0f7d0238e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDaGluZXNlJTIwY2hpY2tlbiUyMGhvdHBvdHxlbnwxfHx8fDE3NjQ2MDU0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
};

// 获取景点或美食图片
export function getItemImage(name: string): string {
  return scenicImages[name] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
}

// 卡通化CSS滤镜效果
export const cartoonFilter = 'saturate(1.3) contrast(1.1) brightness(1.05)';
