/**
 * Centralized Image Assets Management
 * Similar to Flutter's AppImages, this file contains all image asset paths
 * Usage: import { AppImages } from '@/lib/appImages'
 * Example: <Image src={AppImages.logo} alt="Logo" />
 */

export const AppImages = {
  // Logos
  logo: "/image/logo.png",

  // Banner Images
  banner: "/image/banner.png",
  bannerMobile: "/image/banner-mobile.png",
  banner2: "/image/banner2.png",
  banner4: "/image/banner4.png",

  // General Images
  img: "/image/img.png",
  img1: "/image/img1.jpg",
  img2: "/image/img2.jpg",

  // Type/Category Images
  type: "/image/type.png",
  type1: "/image/type1.png",
  type2: "/image/type2.png",
  type3: "/image/type3.png",
  type4: "/image/type4.png",
  type5: "/image/type5.png",
} as const;

// Type for image keys to ensure type safety
export type AppImageKey = keyof typeof AppImages;

/**
 * Helper function to get image path with type safety
 * @param imageName - The name of the image
 * @returns The path to the image
 */
export const getImage = (imageName: AppImageKey): string => {
  return AppImages[imageName];
};

/**
 * Helper function to check if an image exists
 * @param imageName - The name of the image to check
 * @returns Boolean indicating if the image exists
 */
export const hasImage = (imageName: string): imageName is AppImageKey => {
  return imageName in AppImages;
};

/**
 * Helper function to get responsive banner image based on screen size
 * @param isMobile - Boolean indicating if the current screen is mobile
 * @returns The appropriate banner image path
 */
export const getBannerImage = (isMobile: boolean = false): string => {
  return isMobile ? AppImages.bannerMobile : AppImages.banner;
};

/**
 * Helper function to get type image by number
 * @param typeNumber - The type number (1-5)
 * @returns The path to the type image, defaults to base type image if invalid number
 */
export const getTypeImage = (typeNumber: number): string => {
  switch (typeNumber) {
    case 1:
      return AppImages.type1;
    case 2:
      return AppImages.type2;
    case 3:
      return AppImages.type3;
    case 4:
      return AppImages.type4;
    case 5:
      return AppImages.type5;
    default:
      return AppImages.type;
  }
};
