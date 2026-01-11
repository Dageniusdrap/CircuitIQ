'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Component {
    id: string;
    name: string;
    type: string;
    location: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

interface WirePath {
    from: string;
    to: string;
    color: string;
    gauge: string;
    points: { x: number; y: number }[];
}

interface DiagramOverlayProps {
    imageUrl: string;
    components?: Component[];
    activePath?: WirePath | null;
    onComponentClick?: (component: Component) => void;
    onPositionClick?: (x: number, y: number) => void;
}

export function DiagramOverlay({
    imageUrl,
    components = [],
    activePath = null,
    onComponentClick,
    onPositionClick,
}: DiagramOverlayProps) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Update dimensions when image loads
    useEffect(() => {
        const updateDimensions = () => {
            if (imageRef.current) {
                setDimensions({
                    width: imageRef.current.offsetWidth,
                    height: imageRef.current.offsetHeight,
                });
            }
        };

        const img = imageRef.current;
        if (img) {
            if (img.complete) {
                updateDimensions();
            } else {
                img.addEventListener('load', updateDimensions);
                return () => img.removeEventListener('load', updateDimensions);
            }
        }

        // Update on window resize
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [imageUrl]);

    // Handle SVG click
    const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!onPositionClick) return;

        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        onPositionClick(x, y);
    };

    // Handle component click
    const handleComponentClick = (component: Component, e: React.MouseEvent) => {
        e.stopPropagation();
        onComponentClick?.(component);
    };

    return (
        <div ref={containerRef} className="relative w-full h-full">
            {/* Diagram Image */}
            <img
                ref={imageRef}
                src={imageUrl}
                alt="Circuit Diagram"
                className="w-full h-full object-contain"
            />

            {/* SVG Overlay */}
            {dimensions.width > 0 && (
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-auto cursor-crosshair"
                    viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
                    onClick={handleSvgClick}
                    style={{ pointerEvents: 'all' }}
                >
                    {/* Wire Path Highlighting */}
                    <AnimatePresence>
                        {activePath && activePath.points.length > 1 && (
                            <motion.g
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Path line */}
                                <motion.path
                                    d={`M ${activePath.points.map(p => `${(p.x / 100) * dimensions.width},${(p.y / 100) * dimensions.height}`).join(' L ')}`}
                                    stroke={activePath.color || '#3b82f6'}
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray="5,5"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, ease: 'easeInOut' }}
                                />

                                {/* Path points */}
                                {activePath.points.map((point, idx) => (
                                    <motion.circle
                                        key={idx}
                                        cx={(point.x / 100) * dimensions.width}
                                        cy={(point.y / 100) * dimensions.height}
                                        r="6"
                                        fill={activePath.color || '#3b82f6'}
                                        stroke="white"
                                        strokeWidth="2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                    />
                                ))}
                            </motion.g>
                        )}
                    </AnimatePresence>

                    {/* Component Markers */}
                    {components.map((component) => {
                        if (!component.x || !component.y) return null;

                        const isHovered = hoveredComponent === component.id;
                        const cx = (component.x / 100) * dimensions.width;
                        const cy = (component.y / 100) * dimensions.height;

                        return (
                            <g
                                key={component.id}
                                onMouseEnter={() => setHoveredComponent(component.id)}
                                onMouseLeave={() => setHoveredComponent(null)}
                                onClick={(e) => handleComponentClick(component, e)}
                                className="cursor-pointer"
                                style={{ pointerEvents: 'all' }}
                            >
                                {/* Component marker */}
                                <motion.circle
                                    cx={cx}
                                    cy={cy}
                                    r={isHovered ? 12 : 8}
                                    fill={isHovered ? '#3b82f6' : '#10b981'}
                                    stroke="white"
                                    strokeWidth="2"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                    }}
                                    whileHover={{ scale: 1.3 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 17,
                                        delay: component.id ? parseInt(component.id.replace(/\D/g, '') || '0') * 0.05 : 0
                                    }}
                                />

                                {/* Pulse ring on hover */}
                                {isHovered && (
                                    <motion.circle
                                        cx={cx}
                                        cy={cy}
                                        r={16}
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="3"
                                        initial={{ scale: 0.8, opacity: 0.8 }}
                                        animate={{ scale: 1.5, opacity: 0 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                )}

                                {/* Component label (on hover) */}
                                {isHovered && (
                                    <motion.g
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <rect
                                            x={cx - 60}
                                            y={cy - 40}
                                            width="120"
                                            height="30"
                                            fill="rgba(0, 0, 0, 0.8)"
                                            rx="4"
                                        />
                                        <text
                                            x={cx}
                                            y={cy - 20}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="12"
                                            fontWeight="500"
                                        >
                                            {component.name}
                                        </text>
                                    </motion.g>
                                )}
                            </g>
                        );
                    })}
                </svg>
            )}
        </div>
    );
}
