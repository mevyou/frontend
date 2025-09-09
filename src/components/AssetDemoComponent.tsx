/**
 * Example Component demonstrating the use of centralized assets
 * This shows how to use AppIcons, AppImages, and AppColors together
 */

import Image from "next/image";
import {
  AppIcons,
  AppImages,
  AppColors,
  getPrimaryColor,
  ColorCombinations,
} from "@/lib/assets";

export const AssetDemoComponent = () => {
  return (
    <div className="p-6 space-y-6">
      <h2
        className="text-2xl font-nunito-sans font-bold"
        style={{ color: AppColors.primary }}
      >
        Asset Management Demo
      </h2>

      {/* Icons Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Icons</h3>
        <div className="flex gap-4 items-center">
          <Image src={AppIcons.logo} alt="Logo" width={32} height={32} />
          <Image src={AppIcons.wallet} alt="Wallet" width={24} height={24} />
          <Image src={AppIcons.user} alt="User" width={24} height={24} />
          <Image src={AppIcons.search} alt="Search" width={24} height={24} />
        </div>
      </div>

      {/* Images Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Images</h3>
        <div className="flex gap-4">
          <Image
            src={AppImages.logo}
            alt="Logo"
            width={100}
            height={100}
            className="rounded"
          />
          <Image
            src={AppImages.type1}
            alt="Type 1"
            width={80}
            height={80}
            className="rounded"
          />
        </div>
      </div>

      {/* Colors Demo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Colors</h3>

        {/* Color Swatches */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded mx-auto mb-2"
              style={{ backgroundColor: AppColors.primary }}
            />
            <p className="text-sm">Primary</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded mx-auto mb-2"
              style={{ backgroundColor: AppColors.success }}
            />
            <p className="text-sm">Success</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded mx-auto mb-2"
              style={{ backgroundColor: AppColors.error }}
            />
            <p className="text-sm">Error</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded mx-auto mb-2 border"
              style={{ backgroundColor: getPrimaryColor("light") }}
            />
            <p className="text-sm">Primary Light</p>
          </div>
        </div>

        {/* Button Examples using ColorCombinations */}
        <div className="flex gap-4 flex-wrap">
          <button
            style={{
              backgroundColor: ColorCombinations.button.primary.background,
              color: ColorCombinations.button.primary.text,
            }}
            className="px-4 py-2 rounded font-nunito-sans font-medium hover:opacity-80 transition-opacity"
          >
            Primary Button
          </button>

          <button
            style={{
              backgroundColor: ColorCombinations.button.success.background,
              color: ColorCombinations.button.success.text,
            }}
            className="px-4 py-2 rounded font-nunito-sans font-medium hover:opacity-80 transition-opacity"
          >
            Success Button
          </button>

          <button
            style={{
              backgroundColor: ColorCombinations.button.error.background,
              color: ColorCombinations.button.error.text,
            }}
            className="px-4 py-2 rounded font-nunito-sans font-medium hover:opacity-80 transition-opacity"
          >
            Error Button
          </button>
        </div>

        {/* Badge Examples */}
        <div className="flex gap-4 flex-wrap">
          <span
            style={{
              backgroundColor: ColorCombinations.badge.primary.background,
              color: ColorCombinations.badge.primary.text,
            }}
            className="px-3 py-1 rounded-full text-sm font-nunito-sans font-medium"
          >
            Primary Badge
          </span>

          <span
            style={{
              backgroundColor: ColorCombinations.badge.success.background,
              color: ColorCombinations.badge.success.text,
            }}
            className="px-3 py-1 rounded-full text-sm font-nunito-sans font-medium"
          >
            Success Badge
          </span>

          <span
            style={{
              backgroundColor: ColorCombinations.badge.error.background,
              color: ColorCombinations.badge.error.text,
            }}
            className="px-3 py-1 rounded-full text-sm font-nunito-sans font-medium"
          >
            Error Badge
          </span>
        </div>
      </div>

      {/* Tailwind CSS Classes Demo (after updating tailwind.config.ts) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tailwind CSS Classes</h3>
        <div className="space-y-2">
          <div className="bg-primary text-white p-4 rounded font-nunito-sans">
            Primary background with white text
          </div>
          <div className="bg-success text-white p-4 rounded font-nunito-sans">
            Success background with white text
          </div>
          <div className="bg-error text-white p-4 rounded font-nunito-sans">
            Error background with white text
          </div>
          <div className="text-primary font-nunito-sans font-semibold">
            Primary colored text
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDemoComponent;
