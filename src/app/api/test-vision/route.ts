import { NextResponse } from 'next/server';
import { openai } from '@/lib/ai/openai';

export async function POST(request: Request) {
    try {
        const { imageUrl } = await request.json();

        console.log('Testing vision with URL:', imageUrl);

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "What do you see in this image? Describe it in detail.",
                        },
                        {
                            type: "image_url",
                            image_url: { url: imageUrl },
                        },
                    ],
                },
            ],
            max_tokens: 300,
        });

        const result = response.choices[0].message.content;

        return NextResponse.json({
            success: true,
            message: result,
            model: response.model,
            usage: response.usage,
        });
    } catch (error) {
        console.error('Vision test error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                details: error
            },
            { status: 500 }
        );
    }
}
