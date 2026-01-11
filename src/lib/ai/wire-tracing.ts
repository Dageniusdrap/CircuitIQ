import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface Component {
    id: string;
    name: string;
    type: string;
    location?: string;
    connections?: string[];
    x?: number; // X position as percentage (0-100)
    y?: number; // Y position as percentage (0-100)
    width?: number; // Width as percentage
    height?: number; // Height as percentage
}

export interface WirePath {
    from: Component;
    to: Component;
    path: string[];
    wireColor?: string;
    wireGauge?: string;
    points?: { x: number; y: number }[]; // Path coordinate points
}

/**
 * Extract components from a circuit diagram using AI vision
 */
export async function extractComponents(imageUrl: string): Promise<Component[]> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analyze this circuit diagram and extract ALL components WITH their positions.

For each component, provide:
1. A unique identifier (e.g., "CB1", "RELAY_1", "SWITCH_A")
2. Component name/label from the diagram
3. Component type (circuit breaker, relay, switch, connector, fuse, etc.)
4. Location/position reference if visible
5. Connections to other components
6. **IMPORTANT**: X and Y coordinates as percentages (0-100) of image dimensions
   - x: horizontal position from left edge (0 = left, 100 = right)
   - y: vertical position from top edge (0 = top, 100 = bottom)
   - Estimate the center point of each component

Return ONLY a JSON array of components in this exact format:
[
  {
    "id": "CB1",
    "name": "Circuit Breaker 1",
    "type": "circuit_breaker",
    "location": "Panel A",
    "connections": ["RELAY_1", "BUS_1"],
    "x": 25.5,
    "y": 30.2
  }
]

Be thorough - extract every visible component with accurate positions.`,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content || '[]';

        // Extract JSON from response (might have markdown formatting)
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;

        const components = JSON.parse(jsonString);
        return components;
    } catch (error) {
        console.error('Error extracting components:', error);
        return [];
    }
}

/**
 * Trace wire path between two components
 */
export async function traceWirePath(
    imageUrl: string,
    startComponent: string,
    endComponent: string,
    allComponents: Component[]
): Promise<WirePath | null> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Trace the wire path from "${startComponent}" to "${endComponent}" in this circuit diagram.

Provide:
1. The complete path (list of components the wire passes through)
2. Wire color if visible
3. Wire gauge/size if visible
4. Any intermediate connection points
5. **IMPORTANT**: Key coordinate points along the wire path as percentages (0-100)
   - Include start point, turns/bends, and end point
   - x: horizontal position (0 = left, 100 = right)
   - y: vertical position (0 = top, 100 = bottom)

Known components in diagram:
${allComponents.map(c => `- ${c.id}: ${c.name} (${c.type})`).join('\n')}

Return ONLY JSON in this format:
{
  "from": "${startComponent}",
  "to": "${endComponent}",
  "path": ["component_id_1", "component_id_2", ...],
  "wireColor": "color or null",
  "wireGauge": "gauge or null",
  "points": [
    {"x": 25.5, "y": 30.2},
    {"x": 45.0, "y": 30.2},
    {"x": 45.0, "y": 55.8}
  ]
}`,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || '{}';

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;

        const pathData = JSON.parse(jsonString);

        // Convert to WirePath format
        const fromComponent = allComponents.find(c => c.id === startComponent);
        const toComponent = allComponents.find(c => c.id === endComponent);

        if (!fromComponent || !toComponent) return null;

        return {
            from: fromComponent,
            to: toComponent,
            path: pathData.path || [],
            wireColor: pathData.wireColor || undefined,
            wireGauge: pathData.wireGauge || undefined,
            points: pathData.points || [], // Include coordinate points
        };
    } catch (error) {
        console.error('Error tracing wire path:', error);
        return null;
    }
}

/**
 * Get detailed component information
 */
export async function analyzeComponent(
    imageUrl: string,
    componentId: string
): Promise<{
    description: string;
    specifications?: Record<string, string>;
    connections: string[];
    warnings?: string[];
}> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analyze component "${componentId}" in detail.

Provide:
1. Detailed description
2. Technical specifications (voltage, amperage, rating, etc.)
3. All connections to other components
4. Any warnings or special notes

Return JSON format:
{
  "description": "detailed description",
  "specifications": {"voltage": "value", "current": "value"},
  "connections": ["component1", "component2"],
  "warnings": ["warning1", "warning2"]
}`,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || '{}';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;

        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error analyzing component:', error);
        return {
            description: 'Analysis failed',
            connections: [],
        };
    }
}
