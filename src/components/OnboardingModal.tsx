"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const { saveProfile } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setUsername("");
      setDescription("");
      setImage("");
      setZoom(1);
      setRotation(0);
    }
  }, [open]);

  const onPickImage = () => fileInputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const img = image;
    saveProfile({ name, username, description, image: img });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
      <div className="relative w-full max-w-md mx-4 rounded-2xl border shadow-xl" style={{ backgroundColor: '#121214', borderColor: 'transparent' }}>
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-1">Welcome!</h2>
          <p className="text-gray-400 text-sm mb-4">Let's set up your profile.</p>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div
                className="relative h-28 w-28 rounded-full overflow-hidden bg-search-input border border-gray-700 cursor-pointer"
                onClick={onPickImage}
                title="Change image"
              >
                {image ? (
                  <Image
                    src={image}
                    alt="Avatar"
                    fill
                    style={{
                      objectFit: "cover",
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">
                    Click to upload
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />

              {/* Simple controls */}
              {image && (
                <div className="mt-3 flex items-center gap-3 w-full">
                  <label className="text-gray-400 text-xs">Zoom</label>
                  <input
                    type="range"
                    min={0.8}
                    max={2}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    className="px-2 py-1 text-xs rounded bg-search-input border border-gray-700 text-gray-300 hover:bg-gray-700"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                  >
                    Rotate
                  </button>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-search-input border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg bg-search-input border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g. degen42"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Bio</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg bg-search-input border border-gray-700 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Tell us something (optional)"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-white hover:bg-white/90 text-black font-semibold py-2.5"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


