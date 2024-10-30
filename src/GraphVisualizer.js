import React, { useState, useRef, useEffect } from 'react';
import { BarChart2, LineChart } from 'lucide-react';

const GraphVisualizer = ({ generationSteps, currentStep }) => {
  const canvasRef = useRef(null);
  const [showLineChart, setShowLineChart] = useState(false);

  useEffect(() => {
    if (!generationSteps.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const step = generationSteps[currentStep];
    
    canvas.width = 450;
    canvas.height = 450;
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (showLineChart) {
      drawLineChart();
    } else {
      drawStackVisualization();
    }

    

function drawLineChart() {
    const padding = 40;
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = 320;
    const startY = 60;
  
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Depth Over Time', canvas.width / 2, 30);
  
    
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, startY);
    ctx.lineTo(padding, startY + chartHeight);
    ctx.lineTo(padding + chartWidth, startY + chartHeight);
    ctx.stroke();
  
    
    const depths = generationSteps.slice(0, currentStep + 1).map(s => s.stack.length);
    const allDepths = generationSteps.map(s => s.stack.length); 
    const maxDepth = Math.max(...allDepths);
  
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
  
    
    for (let i = 0; i <= maxDepth; i += Math.ceil(maxDepth / 8)) {
      const y = startY + chartHeight - (i / maxDepth * chartHeight);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
      
      ctx.textAlign = 'right';
      ctx.fillText(i.toString(), padding - 5, y + 4);
    }
  
    
    const stepInterval = Math.ceil(generationSteps.length / 10);
    for (let i = 0; i < generationSteps.length; i += stepInterval) {
      const x = padding + (i / generationSteps.length * chartWidth);
      
      const isPassedStep = i <= currentStep;
      ctx.strokeStyle = `rgba(255, 255, 255, ${isPassedStep ? 0.1 : 0.05})`;
      ctx.beginPath();
      ctx.moveTo(x, startY + chartHeight);
      ctx.lineTo(x, startY);
      ctx.stroke();
      
      ctx.fillStyle = isPassedStep ? '#fff' : 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), x, startY + chartHeight + 20);
    }
  
    
    if (currentStep < generationSteps.length - 1) {
      ctx.beginPath();
      const futureDepths = generationSteps.map(s => s.stack.length);
      futureDepths.forEach((depth, index) => {
        const x = padding + (index / generationSteps.length * chartWidth);
        const y = startY + chartHeight - (depth / maxDepth * chartHeight);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = 'rgba(79, 172, 254, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  
    
    ctx.beginPath();
    ctx.moveTo(padding, startY + chartHeight);
    depths.forEach((depth, index) => {
      const x = padding + (index / generationSteps.length * chartWidth);
      const y = startY + chartHeight - (depth / maxDepth * chartHeight);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(padding + (currentStep / generationSteps.length * chartWidth), startY + chartHeight);
    ctx.closePath();
    ctx.fillStyle = 'rgba(79, 172, 254, 0.1)';
    ctx.fill();
  
    
    ctx.beginPath();
    depths.forEach((depth, index) => {
      const x = padding + (index / generationSteps.length * chartWidth);
      const y = startY + chartHeight - (depth / maxDepth * chartHeight);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 2;
    ctx.stroke();
  
    
    const currentX = padding + (currentStep / generationSteps.length * chartWidth);
    const currentY = startY + chartHeight - (depths[depths.length - 1] / maxDepth * chartHeight);
    
    
    const pulseRadius = 8 + Math.sin(Date.now() / 200) * 2;
    ctx.beginPath();
    ctx.arc(currentX, currentY, pulseRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 79, 79, 0.3)';
    ctx.fill();
    
    
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4f4f';
    ctx.fill();
  
    
    const currentDepth = depths[depths.length - 1];
    const maxReached = Math.max(...depths);
    drawStats([
      `Current Depth: ${currentDepth}`,
      `Max Depth Reached: ${maxReached}`,
      `Progress: ${Math.round((currentStep + 1) / generationSteps.length * 100)}%`
    ]);
  
    
    if (currentStep < generationSteps.length - 1) {
      const nextFewSteps = generationSteps.slice(currentStep + 1, currentStep + 5);
      if (nextFewSteps.length > 0) {
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(currentX, currentY);
        nextFewSteps.forEach((step, index) => {
          const x = padding + ((currentStep + index + 1) / generationSteps.length * chartWidth);
          const y = startY + chartHeight - (step.stack.length / maxDepth * chartHeight);
          ctx.lineTo(x, y);
        });
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

    

function drawStackVisualization() {
    
    drawProgressBar();
    
    
    drawMazeMetrics(80);       
    drawPathVisualizer(200);   
    drawDirectionIndicator(340); 
  }
  
  function drawMazeMetrics(startY) {
    const width = canvas.width - 40; 
    const height = 100;
    const spacing = 35;
  
   
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('Generation Metrics', 20, startY);
  
   
    const totalCells = 15 * 15; 
    const visitedCells = new Set(step.stack.map(pos => `${pos[0]},${pos[1]}`)).size;
    const backtrackCount = step.stack.filter((_, i) => 
      i > 0 && step.currentPath[step.stack[i][0]][step.stack[i][1]] === 1
    ).length;
  
    const metrics = [
      {
        label: 'Maze Coverage',
        value: Math.round((visitedCells / totalCells) * 100),
        color: '#4CAF50'
      },
      {
        label: 'Backtrack Rate',
        value: Math.round((backtrackCount / currentStep) * 100),
        color: '#ff4f4f'
      }
    ];
  
    metrics.forEach((metric, index) => {
      const y = startY + 20 + (index * spacing);
      
    
      ctx.font = '14px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.fillText(`${metric.label}: ${metric.value}%`, 20, y + 15);
  
      const barWidth = width - 150; 
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(170, y, barWidth, 20);
  
      const gradient = ctx.createLinearGradient(170, 0, 170 + barWidth, 0);
      gradient.addColorStop(0, metric.color);
      gradient.addColorStop(1, 'rgba(79, 172, 254, 0.1)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(170, y, barWidth * (metric.value / 100), 20);
    });
  }
  
  function drawPathVisualizer(startY) {
  
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText('Current Path Analysis', 20, startY);
  
    const recentSteps = Math.min(6, step.stack.length);
    const boxSize = 60;
    const spacing = 10;
    const startX = (canvas.width - (recentSteps * (boxSize + spacing))) / 2;
  
    
    for (let i = 0; i < recentSteps; i++) {
      const pos = step.stack[step.stack.length - recentSteps + i];
      const x = startX + i * (boxSize + spacing);
      const y = startY + 20;
  
      if (i > 0) {
        ctx.beginPath();
        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 2;
        ctx.moveTo(x - spacing/2, y + boxSize/2);
        ctx.lineTo(x, y + boxSize/2);
        ctx.stroke();
      }
  
      
      const gradient = ctx.createLinearGradient(x, y, x, y + boxSize);
      gradient.addColorStop(0, i === recentSteps - 1 ? '#4CAF50' : '#4facfe');
      gradient.addColorStop(1, 'rgba(79, 172, 254, 0.1)');
  
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, boxSize, boxSize, 8);
      ctx.fill();
  
     
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`(${pos[0]},${pos[1]})`, x + boxSize/2, y + boxSize/2);
    }
  }
  
  function drawDirectionIndicator(startY) {
    const centerX = canvas.width / 2;
    const centerY = startY + 50;
    const radius = 40;
  
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fill();
    ctx.strokeStyle = '#4facfe';
    ctx.lineWidth = 2;
    ctx.stroke();
  
    const [currentX, currentY] = step.stack[step.stack.length - 1] || [1, 1];
    const directions = [
      { angle: 0, name: '→', dx: 0, dy: 2 },
      { angle: Math.PI/2, name: '↓', dx: 2, dy: 0 },
      { angle: Math.PI, name: '←', dx: 0, dy: -2 },
      { angle: -Math.PI/2, name: '↑', dx: -2, dy: 0 }
    ];
  
    let availableCount = 0;
    directions.forEach(({ angle, name, dx, dy }) => {
      const x = centerX + Math.cos(angle) * radius * 0.7;
      const y = centerY + Math.sin(angle) * radius * 0.7;
      
      const newX = currentX + dx;
      const newY = currentY + dy;
      const isValid = newX > 0 && newX < 14 && newY > 0 && newY < 14;
  
      if (isValid) availableCount++;
  
      
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = isValid ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 79, 79, 0.2)';
      ctx.fill();
  
      ctx.fillStyle = isValid ? '#4CAF50' : '#ff4f4f';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, x, y);
    });
  
  
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Available Moves: ${availableCount}`, centerX, centerY - 60);
  }

    function drawProgressBar() {
      const barHeight = 30;
      const progress = (currentStep + 1) / generationSteps.length;
      const barWidth = canvas.width - 40;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(20, 20, barWidth, barHeight);
      
      const gradient = ctx.createLinearGradient(0, 0, barWidth * progress, 0);
      gradient.addColorStop(0, '#4facfe');
      gradient.addColorStop(1, '#4CAF50');
      ctx.fillStyle = gradient;
      ctx.fillRect(20, 20, barWidth * progress, barHeight);

      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Progress: ${Math.round(progress * 100)}%`, canvas.width / 2, 40);
    }

    function drawStackBars() {
      const stack = step.stack;
      const startY = 80;
      const barHeight = 25;
      const spacing = 35;
      const maxBars = 8;
      
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.fillText('Exploration Path', 20, 70);

      const recentStack = stack.slice(-maxBars);
      recentStack.forEach((pos, index) => {
        const y = startY + (index * spacing);
        const isCurrentPos = index === recentStack.length - 1;
        const width = 200 + (index * 20);

        const gradient = ctx.createLinearGradient(20, 0, width, 0);
        gradient.addColorStop(0, isCurrentPos ? '#4CAF50' : '#4facfe');
        gradient.addColorStop(1, 'rgba(79, 172, 254, 0.1)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(20, y, width, barHeight, 5);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`(${pos[0]}, ${pos[1]})`, 30, y + 17);
      });
    }

    function drawDirectionCompass() {
      
      const centerX = canvas.width / 2;
      const centerY = 350;
      const radius = 60;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#4facfe';
      ctx.lineWidth = 2;
      ctx.stroke();

      const directions = [
        { angle: 0, name: '→', dx: 0, dy: 2 },
        { angle: Math.PI / 2, name: '↓', dx: 2, dy: 0 },
        { angle: Math.PI, name: '←', dx: 0, dy: -2 },
        { angle: -Math.PI / 2, name: '↑', dx: -2, dy: 0 }
      ];

      const [currentX, currentY] = step.stack[step.stack.length - 1] || [1, 1];

      directions.forEach(({ angle, name, dx, dy }) => {
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        const newX = currentX + dx;
        const newY = currentY + dy;
        const isValid = newX > 0 && newX < 14 && newY > 0 && newY < 14;

        ctx.fillStyle = isValid ? '#4CAF50' : '#ff4f4f';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, x, y);
      });

      ctx.fillStyle = '#4facfe';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawStats(stats) {
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      
      stats.forEach((stat, index) => {
        ctx.fillText(stat, canvas.width / 2, 420 + (index * 20));
      });
    }

  }, [generationSteps, currentStep, showLineChart]);

  return (
    <div className="graph-container">
      <div className="visualization-controls">
        <button 
          className={`viz-toggle-button ${!showLineChart ? 'active' : ''}`}
          onClick={() => setShowLineChart(false)}
        >
          <BarChart2 className="w-5 h-5" />
          <span>Stack View</span>
        </button>
        <button 
          className={`viz-toggle-button ${showLineChart ? 'active' : ''}`}
          onClick={() => setShowLineChart(true)}
        >
          <LineChart className="w-5 h-5" />
          <span>Depth Chart</span>
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="graph-canvas"
      />
    </div>
  );
};

export default GraphVisualizer;