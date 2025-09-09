# Asset Management System

This project uses a centralized asset management system similar to Flutter's approach, making it easy to manage and reference all images and icons from a single location.

## Files Structure

- **`appIcons.ts`** - Contains all SVG icon paths
- **`appImages.ts`** - Contains all image asset paths
- **`appColors.ts`** - Contains all color definitions and palettes
- **`assets.ts`** - Combined exports and utilities

## Basic Usage

### Import Options

```typescript
// Import everything
import { AppIcons, AppImages, AppColors, Assets } from '@/lib/assets'

// Import specific parts
import { AppIcons, getIcon } from '@/lib/assets'
import { AppImages, getBannerImage } from '@/lib/assets'
import { AppColors, getPrimaryColor } from '@/lib/assets'
```

### Using Icons

```tsx
import Image from 'next/image'
import { AppIcons, getIcon } from '@/lib/assets'

// Direct usage
<Image src={AppIcons.logo} alt="Logo" width={100} height={100} />

// With helper function
<Image src={getIcon('logo')} alt="Logo" width={100} height={100} />

// In components
const iconSrc = AppIcons.wallet
```

### Using Images

```tsx
import Image from 'next/image'
import { AppImages, getBannerImage, getTypeImage } from '@/lib/assets'

// Direct usage
<Image src={AppImages.banner} alt="Banner" width={800} height={200} />

// Responsive banner
<Image src={getBannerImage(isMobile)} alt="Banner" />

// Type images
<Image src={getTypeImage(1)} alt="Type 1" />
```

### Using Colors

```tsx
import { AppColors, getPrimaryColor, ColorCombinations } from '@/lib/assets'

// Direct usage
<div style={{ backgroundColor: AppColors.primary }}>Primary Background</div>
<div style={{ color: AppColors.success }}>Success Text</div>

// With helper functions
<div style={{ backgroundColor: getPrimaryColor('light') }}>Light Primary</div>

// Using color combinations
const buttonStyles = ColorCombinations.button.primary
<button style={{ backgroundColor: buttonStyles.background, color: buttonStyles.text }}>
  Primary Button
</button>

// In Tailwind CSS classes (after adding to tailwind.config.ts)
<div className="bg-primary text-white">Primary Background</div>
<div className="text-success">Success Text</div>
```

### Advanced Usage

```tsx
import { Assets, getAsset } from '@/lib/assets'

// Using combined assets object
const logoIcon = Assets.icons.logo
const bannerImage = Assets.images.banner
const primaryColor = Assets.colors.primary

// Dynamic asset loading
const assetPath = getAsset('icons.wallet') // Returns '/svg/wallet.svg'
const imagePath = getAsset('images.logo')  // Returns '/image/logo.png'
const colorValue = getAsset('colors.primary') // Returns '#02FEFE'
```

## Type Safety

All asset functions include TypeScript support:

```typescript
import type { AppIconKey, AppImageKey, AppColorKey } from '@/lib/assets'

// These will show autocomplete and type checking
const validIcon: AppIconKey = 'logo' // ✅
const validColor: AppColorKey = 'primary' // ✅
const invalidIcon: AppIconKey = 'nonexistent' // ❌ TypeScript error
```

## Available Assets

### Icons (SVG)
- Navigation: `logo`, `home`, `sidebarLeft`, `search`, etc.
- User: `user`, `addUser`, `gamer`
- Wallet: `wallet`, `addWallet`, `dollar`, `coins`
- Crypto: `eth`, `bnb`, `usdc`, `usdt`, `blockchain`
- Actions: `addCircle`, `checkmark`, `cancelCircle`
- And many more...

### Images (PNG/JPG)
- Banners: `banner`, `bannerMobile`, `banner2`, `banner4`
- General: `logo`, `img`, `img1`, `img2`  
- Types: `type`, `type1`, `type2`, `type3`, `type4`, `type5`

### Colors
- Primary: `primary` (#02FEFE), `primaryBackground` (#02FEFE0D), `primaryLight` (#22FEFE26)
- Success: `success` (#22C55E), `successLight` (#4ADE80)
- Error: `error` (#EF4444), `errorLight` (#F87171)
- Neutral: `white`, `black`, `transparent`
- Gray scale: `gray` (50-900 shades)

## Best Practices

1. **Always use the centralized assets** instead of hardcoded paths
2. **Use helper functions** for responsive or dynamic asset loading
3. **Leverage TypeScript** for autocomplete and error prevention
4. **Import only what you need** to optimize bundle size

## Examples in Components

```tsx
// Header component example
import { AppIcons } from '@/lib/assets'

export const Header = () => (
  <header>
    <img src={AppIcons.logo} alt="Logo" />
    <button>
      <img src={AppIcons.search} alt="Search" />
    </button>
  </header>
)
```

```tsx
// Responsive banner example
import { getBannerImage } from '@/lib/assets'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export const Banner = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <img 
      src={getBannerImage(isMobile)} 
      alt="Banner"
      className="w-full h-auto"
    />
  )
}
```
