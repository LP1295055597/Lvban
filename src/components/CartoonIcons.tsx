// 卡通风格的景点和美食图标组件
export const CartoonIcons = {
  // 景点图标
  scenicIcons: {
    '丽江古城': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="20" y="40" width="60" height="50" fill="#8B5A3C" rx="2"/>
        <path d="M 10 45 L 50 20 L 90 45" fill="#C87137" stroke="#6B4423" strokeWidth="2"/>
        <rect x="35" y="60" width="12" height="20" fill="#5C4033"/>
        <rect x="53" y="60" width="12" height="20" fill="#5C4033"/>
        <rect x="38" y="50" width="6" height="6" fill="#FFE4B5"/>
        <rect x="56" y="50" width="6" height="6" fill="#FFE4B5"/>
        <circle cx="30" cy="30" r="3" fill="#FFD700"/>
        <circle cx="70" cy="28" r="2.5" fill="#FFD700"/>
      </svg>
    ),
    '玉龙雪山': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M 10 80 L 30 40 L 50 20 L 70 45 L 90 80 Z" fill="#E8F4F8"/>
        <path d="M 10 80 L 30 40 L 50 20 L 70 45 L 90 80 Z" fill="#B8D8E8" opacity="0.7"/>
        <path d="M 40 30 L 50 20 L 60 35 Z" fill="#FFFFFF"/>
        <circle cx="20" cy="25" r="4" fill="#87CEEB" opacity="0.6"/>
        <circle cx="80" cy="30" r="3.5" fill="#87CEEB" opacity="0.6"/>
        <path d="M 0 80 Q 50 75 100 80" fill="#8BC34A"/>
      </svg>
    ),
    '束河古镇': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="15" y="45" width="70" height="40" fill="#A0826D" rx="3"/>
        <path d="M 10 50 L 50 25 L 90 50" fill="#D4A574" stroke="#8B6F47" strokeWidth="2"/>
        <rect x="30" y="60" width="15" height="25" fill="#6B4423"/>
        <rect x="55" y="60" width="15" height="25" fill="#6B4423"/>
        <path d="M 20 70 Q 40 65 40 80" stroke="#4A90E2" strokeWidth="2" fill="none"/>
        <circle cx="25" cy="35" r="2" fill="#90EE90"/>
      </svg>
    ),
    '蓝月谷': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="55" rx="40" ry="30" fill="#4FC3F7"/>
        <ellipse cx="50" cy="55" rx="30" ry="22" fill="#81D4FA"/>
        <path d="M 10 70 Q 50 85 90 70" fill="#A5D6A7"/>
        <circle cx="30" cy="30" r="8" fill="#FFF59D" opacity="0.8"/>
        <path d="M 35 45 Q 40 40 45 45" fill="#FFFFFF" opacity="0.6"/>
        <path d="M 55 50 Q 60 45 65 50" fill="#FFFFFF" opacity="0.6"/>
      </svg>
    ),
    '虎跳峡': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="0" y="30" width="30" height="60" fill="#8D6E63"/>
        <rect x="70" y="25" width="30" height="65" fill="#795548"/>
        <path d="M 30 50 Q 50 40 70 55" stroke="#29B6F6" strokeWidth="4" fill="none"/>
        <path d="M 25 60 Q 50 50 75 65" stroke="#4FC3F7" strokeWidth="3" fill="none"/>
        <circle cx="50" cy="50" r="3" fill="#FFFFFF"/>
        <circle cx="45" cy="55" r="2" fill="#FFFFFF"/>
      </svg>
    ),
    '泸沽湖': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="60" rx="45" ry="30" fill="#2196F3"/>
        <ellipse cx="50" cy="60" rx="35" ry="23" fill="#42A5F5"/>
        <path d="M 5 75 Q 50 80 95 75" fill="#66BB6A"/>
        <path d="M 40 45 L 45 30 L 50 45 L 55 30 L 60 45" stroke="#F57C00" strokeWidth="2" fill="none"/>
        <circle cx="20" cy="25" r="10" fill="#FFD54F"/>
        <rect x="35" y="55" width="30" height="3" fill="#8D6E63" rx="1"/>
      </svg>
    ),
    '黑龙潭公园': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="65" rx="40" ry="25" fill="#1976D2"/>
        <path d="M 10 75 Q 50 80 90 75" fill="#81C784"/>
        <circle cx="35" cy="40" r="12" fill="#66BB6A"/>
        <circle cx="65" cy="35" r="10" fill="#81C784"/>
        <circle cx="50" cy="45" r="8" fill="#A5D6A7"/>
        <path d="M 40 50 L 45 30 L 42 50" fill="#4CAF50"/>
        <circle cx="80" cy="20" r="6" fill="#FFB74D"/>
      </svg>
    ),
    '木府': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="25" y="50" width="50" height="40" fill="#8B4513" rx="2"/>
        <path d="M 20 55 L 50 30 L 80 55" fill="#A0522D"/>
        <rect x="42" y="65" width="16" height="25" fill="#654321"/>
        <rect x="30" y="60" width="8" height="8" fill="#DEB887"/>
        <rect x="62" y="60" width="8" height="8" fill="#DEB887"/>
        <rect x="15" y="55" width="70" height="3" fill="#D2691E"/>
        <path d="M 40 40 L 50 30 L 60 40" fill="#FFD700"/>
      </svg>
    ),
  },
  
  // 美食图标
  foodIcons: {
    '腊排骨火锅': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="60" rx="35" ry="15" fill="#D84315"/>
        <ellipse cx="50" cy="50" rx="35" ry="30" fill="#F4511E"/>
        <path d="M 30 45 Q 35 35 40 45" stroke="#FFCCBC" strokeWidth="3" fill="none"/>
        <path d="M 50 42 Q 55 32 60 42" stroke="#FFCCBC" strokeWidth="3" fill="none"/>
        <path d="M 65 48 Q 68 40 72 48" stroke="#FFCCBC" strokeWidth="3" fill="none"/>
        <circle cx="35" cy="40" r="2" fill="#FF5722"/>
        <circle cx="55" cy="38" r="2" fill="#FF5722"/>
        <path d="M 25 52 Q 30 48 35 52" stroke="#FFA726" strokeWidth="2" fill="none"/>
      </svg>
    ),
    '鸡豆凉粉': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="20" y="45" width="60" height="35" fill="#FFF9C4" rx="5"/>
        <rect x="20" y="45" width="60" height="5" fill="#F9A825"/>
        <line x1="30" y1="55" x2="30" y2="75" stroke="#FBC02D" strokeWidth="2"/>
        <line x1="40" y1="55" x2="40" y2="75" stroke="#FBC02D" strokeWidth="2"/>
        <line x1="50" y1="55" x2="50" y2="75" stroke="#FBC02D" strokeWidth="2"/>
        <line x1="60" y1="55" x2="60" y2="75" stroke="#FBC02D" strokeWidth="2"/>
        <line x1="70" y1="55" x2="70" y2="75" stroke="#FBC02D" strokeWidth="2"/>
        <circle cx="35" cy="40" r="2" fill="#8BC34A"/>
        <circle cx="65" cy="38" r="2" fill="#8BC34A"/>
      </svg>
    ),
    '纳西烤鱼': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="50" rx="35" ry="20" fill="#FF6F00"/>
        <ellipse cx="45" cy="50" rx="28" ry="16" fill="#FF8F00"/>
        <circle cx="38" cy="45" r="3" fill="#212121"/>
        <path d="M 15 50 L 25 45 L 25 55 Z" fill="#FF6F00"/>
        <path d="M 75 45 L 85 50 L 75 55 Z" fill="#FF6F00"/>
        <path d="M 35 48 L 65 48" stroke="#D84315" strokeWidth="1"/>
        <path d="M 35 52 L 65 52" stroke="#D84315" strokeWidth="1"/>
        <circle cx="55" cy="40" r="2" fill="#C62828"/>
        <circle cx="48" cy="42" r="1.5" fill="#C62828"/>
      </svg>
    ),
    '米灌肠': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="20" y="40" width="60" height="35" fill="#6D4C41" rx="17"/>
        <rect x="22" y="42" width="56" height="31" fill="#8D6E63" rx="15"/>
        <line x1="35" y1="40" x2="35" y2="75" stroke="#5D4037" strokeWidth="2"/>
        <line x1="50" y1="40" x2="50" y2="75" stroke="#5D4037" strokeWidth="2"/>
        <line x1="65" y1="40" x2="65" y2="75" stroke="#5D4037" strokeWidth="2"/>
        <ellipse cx="30" cy="57" rx="3" ry="2" fill="#FFEB3B"/>
      </svg>
    ),
    '酥油茶': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="30" y="55" width="40" height="30" fill="#D84315" rx="2"/>
        <ellipse cx="50" cy="55" rx="20" ry="8" fill="#E64A19"/>
        <rect x="48" y="40" width="4" height="15" fill="#8D6E63"/>
        <ellipse cx="50" cy="45" rx="15" ry="5" fill="#A1887F"/>
        <path d="M 35 65 Q 40 60 45 65" stroke="#FFCCBC" strokeWidth="2" fill="none"/>
        <circle cx="42" cy="62" r="1.5" fill="#FF5722"/>
        <circle cx="58" cy="64" r="1.5" fill="#FF5722"/>
      </svg>
    ),
    '丽江粑粑': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="30" fill="#FFD54F"/>
        <circle cx="50" cy="50" r="28" fill="#FFC107"/>
        <circle cx="45" cy="45" r="3" fill="#F57C00"/>
        <circle cx="55" cy="48" r="3" fill="#F57C00"/>
        <circle cx="50" cy="55" r="3" fill="#F57C00"/>
        <circle cx="60" cy="52" r="2.5" fill="#F57C00"/>
        <circle cx="42" cy="52" r="2.5" fill="#F57C00"/>
        <path d="M 40 50 Q 50 45 60 50" stroke="#F9A825" strokeWidth="2" fill="none"/>
      </svg>
    ),
    '野生菌火锅': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="60" rx="35" ry="15" fill="#BF360C"/>
        <ellipse cx="50" cy="50" rx="35" ry="30" fill="#D84315"/>
        <path d="M 35 40 Q 35 30 40 35 Q 40 30 40 40" fill="#8BC34A"/>
        <ellipse cx="40" cy="35" rx="6" ry="4" fill="#C62828"/>
        <path d="M 55 42 Q 55 32 60 37 Q 60 32 60 42" fill="#FFEB3B"/>
        <ellipse cx="60" cy="37" rx="7" ry="5" fill="#FF5722"/>
        <path d="M 45 45 Q 45 38 48 42 Q 48 38 48 45" fill="#D32F2F"/>
        <circle cx="30" cy="48" r="2" fill="#4CAF50"/>
      </svg>
    ),
    '水性杨花': (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="60" rx="30" ry="12" fill="#1976D2"/>
        <circle cx="40" cy="45" r="8" fill="#E8F5E9"/>
        <circle cx="38" cy="43" r="2" fill="#FFEB3B"/>
        <circle cx="55" cy="42" r="9" fill="#F1F8E9"/>
        <circle cx="53" cy="40" r="2.5" fill="#FDD835"/>
        <circle cx="48" cy="48" r="7" fill="#E8F5E9"/>
        <circle cx="46" cy="46" r="2" fill="#FBC02D"/>
        <path d="M 42 52 Q 42 58 40 58" stroke="#4CAF50" strokeWidth="2" fill="none"/>
        <path d="M 55 50 Q 57 56 55 58" stroke="#66BB6A" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
};

// 获取图标的辅助函数
export function getScenicIcon(name: string) {
  return CartoonIcons.scenicIcons[name as keyof typeof CartoonIcons.scenicIcons] || CartoonIcons.scenicIcons['丽江古城'];
}

export function getFoodIcon(name: string) {
  return CartoonIcons.foodIcons[name as keyof typeof CartoonIcons.foodIcons] || CartoonIcons.foodIcons['腊排骨火锅'];
}

// 获取所有景点名称
export function getScenicNames() {
  return Object.keys(CartoonIcons.scenicIcons);
}

// 获取所有美食名称
export function getFoodNames() {
  return Object.keys(CartoonIcons.foodIcons);
}
