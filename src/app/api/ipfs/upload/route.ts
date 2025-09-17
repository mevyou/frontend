import { NextRequest, NextResponse } from 'next/server';


// try {
//   // For now, we'll use a simple approach - store the file temporarily and return a placeholder
//   // In production, you would use a service like Pinata, Web3.Storage, or similar
//   const ipfsFormData = new FormData();
//   ipfsFormData.append('file', new Blob([uint8Array], { type: file.type }), file.name);

//   // Try using a public IPFS pinning service
//   const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
//     method: 'POST',
//     body: ipfsFormData,
//     headers: {
//       'pinata_api_key': process.env.PINATA_API_KEY || '',
//       'pinata_secret_api_key': process.env.PINATA_SECRET_KEY || ''
//     }
//   });

//   if (pinataResponse.ok) {
//     const pinataResult = await pinataResponse.json();
//     ipfsHash = pinataResult.IpfsHash;
//   } else {
//     // If Pinata fails, generate a mock hash for development
//     console.warn('Pinata upload failed, using mock hash for development');
//     ipfsHash = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//   }
// } catch (error) {
//   console.error('All IPFS upload methods failed:', error);
//   // For development, generate a mock hash
//   ipfsHash = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
// }

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create FormData for Pinata API
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);

    // Upload to Pinata using their API
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      body: pinataFormData,
      headers: {
        'pinata_api_key': process.env.PINATA_API_KEY || '',
        'pinata_secret_api_key': process.env.PINATA_SECRET_KEY || ''
      }
    });

    if (!pinataResponse.ok) {
      throw new Error(`Pinata API error: ${pinataResponse.status}`);
    }

    const pinataResult = await pinataResponse.json();
    const ipfsHash = pinataResult.IpfsHash;
    console.log("ipfhash", ipfsHash);
    return NextResponse.json({
      success: true,
      hash: ipfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
    });

  } catch (error) {
    console.error('IPFS upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file to IPFS' },
      { status: 500 }
    );
  }
}
