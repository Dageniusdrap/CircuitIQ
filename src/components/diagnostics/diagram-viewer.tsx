'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DiagramOverlay } from './diagram-overlay';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';

interface Component {
    id: string;
    name: string;
    type: string;
    location: string;
    x?: number;
    y?: number;
}

interface WirePath {
    from: string;
    to: string;
    color: string;
    gauge: string;
    points: { x: number; y: number }[];
}

interface DiagramViewerProps {
    imageUrl: string;
    components?: Component[];
    activePath?: WirePath | null;
    onComponentClick?: (component: Component) => void;
}

export function DiagramViewer({
    imageUrl,
    components = [],
    activePath = null,
    onComponentClick,
}: DiagramViewerProps) {
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
    const handleResetZoom = () => setZoom(1);

    return (
        <>
            <Card className="relative overflow-hidden bg-slate-900/50 border-slate-700">
                <CardContent className="p-0">
                    {/* Toolbar */}
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={handleZoomOut}
                            disabled={zoom <= 0.5}
                            className="bg-slate-800/80 backdrop-blur hover:bg-slate-700"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={handleResetZoom}
                            className="bg-slate-800/80 backdrop-blur hover:bg-slate-700"
                        >
                            {Math.round(zoom * 100)}%
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={handleZoomIn}
                            disabled={zoom >= 3}
                            className="bg-slate-800/80 backdrop-blur hover:bg-slate-700"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => setIsFullscreen(true)}
                            className="bg-slate-800/80 backdrop-blur hover:bg-slate-700"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Diagram with Overlay */}
                    <div
                        className="overflow-auto max-h-[600px]"
                        style={{
                            transform: `scale(${zoom})`,
                            transformOrigin: 'top left',
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        <DiagramOverlay
                            imageUrl={imageUrl}
                            components={components}
                            activePath={activePath}
                            onComponentClick={onComponentClick}
                        />
                    </div>

                    {/* Component count indicator */}
                    {components.length > 0 && (
                        <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur px-3 py-1 rounded-full text-sm">
                            {components.length} component{components.length !== 1 ? 's' : ''} detected
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 text-white hover:bg-white/10"
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    <div className="w-full h-full flex items-center justify-center">
                        <DiagramOverlay
                            imageUrl={imageUrl}
                            components={components}
                            activePath={activePath}
                            onComponentClick={onComponentClick}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
