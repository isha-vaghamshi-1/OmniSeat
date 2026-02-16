
import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group, Line } from 'react-konva';

const SeatingChart = ({
  config,
  activeStep,
  onSectionMove,
  onSeatClick,
  selectedSeatIds,
  bookedSeatIds,
  selectedSectionId
}) => {
  const containerRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const stageRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    const clampedScale = Math.max(0.05, Math.min(newScale, 5));

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    stage.scale({ x: clampedScale, y: clampedScale });
    stage.position({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
    setScale(clampedScale);
  };

  const getRowLabel = (prefix, index) => {
    if (prefix.length === 1 && /[A-Za-z]/.test(prefix)) {
      return String.fromCharCode(prefix.charCodeAt(0) + index);
    }
    return `${prefix}${index + 1}`;
  };

  const renderSection = (section) => {
    const seats = [];
    const { 
      rows, cols, seatSize, spacing, curveIntensity, color, 
      rowLabelPrefix, rowSettings, flipHorizontal, flipVertical, 
      flipSeatNumbers, flipRowLabels, flipLabelsHorizontal,
      startNumber = 1, numberingMode = 'RESET_PER_ROW'
    } = section;
    
    const isEditing = activeStep === 'SETUP' && selectedSectionId === section.id;
    const isDesigning = activeStep === 'DESIGN' && selectedSectionId === section.id;

    let maxRowWidth = 0;
    for (let r = 0; r < rows; r++) {
      const rowCols = rowSettings?.[r]?.cols ?? cols;
      const width = (rowCols - 1) * (seatSize + spacing);
      maxRowWidth = Math.max(maxRowWidth, width);
    }
    const maxSectionHeight = (rows - 1) * (seatSize + spacing);

    const rowNumberOffsets = [];
    let currentOffset = startNumber;

    for (let r = 0; r < rows; r++) {
      const rSetting = rowSettings?.[r];
      const rowStart = rSetting?.startNumber ?? (numberingMode === 'CONTINUOUS' ? currentOffset : startNumber);
      rowNumberOffsets[r] = rowStart;
      
      const rCols = rSetting?.cols ?? cols;
      if (numberingMode === 'CONTINUOUS') {
        currentOffset = rowStart + rCols;
      }
    }

    for (let r = 0; r < rows; r++) {
      const labelRowIndex = flipRowLabels ? (rows - 1 - r) : r;
      const rowSetting = rowSettings?.[labelRowIndex];
      const rowLabel = rowSetting?.label ?? getRowLabel(rowLabelPrefix, labelRowIndex);
      
      const rowCols = rowSetting?.cols ?? cols;
      const currentRowWidth = (rowCols - 1) * (seatSize + spacing);
      const rowNumberStart = rowNumberOffsets[labelRowIndex];

      for (let c = 0; c < rowCols; c++) {
        const seatId = `${section.id}-${labelRowIndex}-${c}`;
        
        let renderX = c * (seatSize + spacing);
        let renderY = r * (seatSize + spacing);

        if (flipHorizontal) renderX = maxRowWidth - renderX;
        if (flipVertical) renderY = maxSectionHeight - renderY;

        if (curveIntensity !== 0) {
          const mid = currentRowWidth / 2;
          const localX = flipHorizontal ? (maxRowWidth - renderX) : renderX;
          const distFromCenter = localX - mid;
          const k = curveIntensity / 50000;
          renderY += k * (distFromCenter * distFromCenter);
        }

        const isSelected = selectedSeatIds.has(seatId);
        const isBooked = bookedSeatIds.has(seatId);
        
        const seqNumber = rowNumberStart + c;
        const displayedSeatNumber = flipSeatNumbers ? (rowNumberStart + rowCols - 1 - c) : seqNumber;

        seats.push(
          <Group key={seatId}>
            <Rect
              x={renderX}
              y={renderY}
              width={seatSize}
              height={seatSize}
              cornerRadius={seatSize * 0.2}
              fill={isSelected ? '#3b82f6' : isBooked ? '#1e293b' : '#334155'}
              stroke={isEditing ? color : isBooked ? '#0f172a' : '#475569'}
              strokeWidth={1}
              onClick={() => onSeatClick(seatId)}
              onTap={() => onSeatClick(seatId)}
            />
            {isBooked && (
               <Line
                 points={[renderX + 4, renderY + 4, renderX + seatSize - 4, renderY + seatSize - 4]}
                 stroke="#475569"
                 strokeWidth={1.5}
                 lineCap="round"
                 opacity={0.5}
               />
            )}
            {seatSize > 14 && !isBooked && (
               <Text
                 x={renderX}
                 y={renderY + seatSize * 0.3}
                 width={seatSize}
                 text={displayedSeatNumber.toString()}
                 fontSize={Math.max(6, seatSize * 0.4)}
                 fontFamily="Inter"
                 fontStyle="bold"
                 fill={isSelected ? 'white' : '#94a3b8'}
                 align="center"
                 pointerEvents="none"
               />
            )}
          </Group>
        );
      }

      const labelSide = flipLabelsHorizontal; 
      const labelX = labelSide ? maxRowWidth + seatSize + 15 : -65;
      const labelYBase = r * (seatSize + spacing);
      let renderLabelY = flipVertical ? (maxSectionHeight - labelYBase) : labelYBase;

      seats.push(
        <Text
          key={`label-${r}`}
          x={labelX}
          y={renderLabelY + (seatSize / 4)}
          text={rowLabel}
          fontSize={14}
          fontFamily="Inter"
          fill={isEditing ? color : "#475569"}
          fontStyle="bold"
          align={labelSide ? "left" : "right"}
          width={55}
        />
      );
    }

    return (
      <Group
        key={section.id}
        id={section.id}
        x={section.x}
        y={section.y}
        rotation={section.rotation}
        draggable={activeStep === 'SETUP'}
        onDragEnd={(e) => onSectionMove(section.id, e.target.x(), e.target.y())}
      >
        {(isDesigning || isEditing) && (
           <Rect 
             x={-75} y={-45} 
             width={maxRowWidth + seatSize + 150} 
             height={maxSectionHeight + seatSize + 90}
             stroke={color}
             strokeWidth={1.5}
             dash={[8, 5]}
             cornerRadius={15}
             opacity={isEditing ? 1 : 0.3}
           />
        )}
        
        <Text
          x={0}
          y={-35}
          text={section.name.toUpperCase()}
          fontSize={12}
          fontFamily="Inter"
          fontStyle="900"
          fill={section.color}
          letterSpacing={2}
          opacity={0.9}
        />

        {seats}
      </Group>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden">
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        onWheel={handleWheel}
        draggable
      >
        <Layer>
          {config.screen.visible && (
            <Group x={config.screen.x} y={config.screen.y}>
              <Rect
                width={config.screen.width}
                height={config.screen.height}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: 0, y: config.screen.height }}
                fillLinearGradientColorStops={[0, '#1e293b', 1, '#334155']}
                stroke="#475569"
                strokeWidth={2}
                cornerRadius={[0, 0, 50, 50]}
              />
              <Text
                text={config.screen.label}
                width={config.screen.width}
                height={config.screen.height}
                align="center"
                verticalAlign="middle"
                fill="#94a3b8"
                fontSize={16}
                fontFamily="Inter"
                fontStyle="bold"
                letterSpacing={4}
              />
            </Group>
          )}

          {config.sections.map(renderSection)}
        </Layer>
      </Stage>

      <div className="absolute top-4 left-4 bg-slate-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2 pointer-events-none">
        <span className="text-blue-400">Scale</span>
        <span className="text-slate-300 font-mono">{(scale * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};

export default SeatingChart;
