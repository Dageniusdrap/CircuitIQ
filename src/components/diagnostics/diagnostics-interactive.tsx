'use client';

import { useState } from 'react';
import { DiagramViewer } from '@/components/diagnostics/diagram-viewer';
import { WireTracing } from '@/components/diagnostics/wire-tracing';

interface Component {
    id: string;
    name: string;
    type: string;
    location?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

interface WirePath {
    from: { name: string };
    to: { name: string };
    path: string[];
    wireColor?: string;
    wireGauge?: string;
    points?: { x: number; y: number }[];
}

interface DiagnosticsInteractiveProps {
    diagramId: string;
    imageUrl: string;
}

export function DiagnosticsInteractive({ diagramId, imageUrl }: DiagnosticsInteractiveProps) {
    const [components, setComponents] = useState<Component[]>([]);
    const [activePath, setActivePath] = useState<WirePath | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);

    const handleComponentsExtracted = (extractedComponents: Component[]) => {
        console.log('Components extracted:', extractedComponents);
        setComponents(extractedComponents);
    };

    const handlePathTraced = (path: WirePath | null) => {
        console.log('Path traced:', path);
        setActivePath(path);
    };

    const handleComponentClick = (component: Component) => {
        console.log('Component clicked:', component);
        setSelectedComponent(component);
        // Could show details in a modal or sidebar
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Diagram Viewer */}
            <div className="lg:col-span-3">
                <DiagramViewer
                    imageUrl={imageUrl}
                    components={components}
                    activePath={activePath}
                    onComponentClick={handleComponentClick}
                />

                {/* Component Details (if selected) */}
                {selectedComponent && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <h3 className="font-semibold text-blue-400 mb-2">
                            Selected Component
                        </h3>
                        <div className="space-y-1 text-sm">
                            <div>
                                <span className="text-muted-foreground">ID: </span>
                                <span className="font-medium">{selectedComponent.id}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Name: </span>
                                <span className="font-medium">{selectedComponent.name}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Type: </span>
                                <span className="font-medium">{selectedComponent.type}</span>
                            </div>
                            {selectedComponent.location && (
                                <div>
                                    <span className="text-muted-foreground">Location: </span>
                                    <span className="font-medium">{selectedComponent.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar with Wire Tracing */}
            <div className="lg:col-span-1">
                <WireTracing
                    diagramId={diagramId}
                    onComponentsExtracted={handleComponentsExtracted}
                    onPathTraced={handlePathTraced}
                />
            </div>
        </div>
    );
}
