import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');
    
    if (!hash) {
      return NextResponse.json({ error: 'No hash provided' }, { status: 400 });
    }

    // Construct the IPFS URL
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;
    
    // Fetch the data from IPFS
    const response = await fetch(ipfsUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from IPFS' },
        { status: response.status }
      );
    }

    const data = await response.text();
    
    return NextResponse.json({
      success: true,
      data,
      url: ipfsUrl,
    });
  } catch (error) {
    console.error('IPFS read error:', error);
    return NextResponse.json(
      { error: 'Failed to read data from IPFS' },
      { status: 500 }
    );
  }
}
