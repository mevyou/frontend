/**
 * IPFS utility functions for uploading and reading data
 */

export interface IPFSUploadResult {
  success: boolean;
  hash: string;
  url: string;
  pinataUrl: string;
}

export interface IPFSReadResult {
  success: boolean;
  data: string;
  url: string;
}

/**
 * Upload a file to IPFS via Pinata
 */
export async function uploadToIPFS(file: File): Promise<IPFSUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/ipfs/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to IPFS');
  }

  return response.json();
}

/**
 * Read data from IPFS via Pinata gateway
 */
export async function readFromIPFS(hash: string): Promise<IPFSReadResult> {
  const response = await fetch(`/api/ipfs/read?hash=${hash}`);

  if (!response.ok) {
    throw new Error('Failed to read data from IPFS');
  }

  return response.json();
}

/**
 * Convert a data URL to a File object
 */
export function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

/**
 * Get IPFS URL from hash
 */
export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}
