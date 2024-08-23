import { NextRequest, NextResponse } from 'next/server';
import Replicate from "replicate";

export const runtime = "edge";

// 确保环境变量已设置
if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN is not set");
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    const { model = 'sdxl', prompt, num_outputs = 1, aspect_ratio = '1:1', seed, output_format = 'webp', output_quality = 80 } = await request.json();

    let modelVersion;
    switch (model) {
      case 'sdxl':
        modelVersion = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
        break;
      case 'sd15':
        modelVersion = "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4";
        break;
      default:
        modelVersion = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";
    }

    console.log('modelVersion', modelVersion)
    console.log('prompt', prompt)
    console.log('num_outputs', num_outputs)
    console.log('aspect_ratio', aspect_ratio)
    console.log('seed', seed)
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt,
        num_outputs: num_outputs,
        aspect_ratio: aspect_ratio,
        seed: seed ? parseInt(seed) : undefined,
      },
    });
    console.log('output', output)

    return NextResponse.json(output);
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 });
  }
}