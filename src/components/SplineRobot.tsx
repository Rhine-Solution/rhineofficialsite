import { useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Application } from '@splinetool/runtime';

export default function SplineRobot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<Application | null>(null);

  const updatePointer = (clientX: number, clientY: number) => {
    if (!containerRef.current || !splineAppRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let relX = (clientX - rect.left) / rect.width;
    let relY = (clientY - rect.top) / rect.height;
    relX = Math.min(1, Math.max(0, relX)) - 0.5;
    relY = Math.min(1, Math.max(0, relY)) - 0.5;
    splineAppRef.current.setVariable('headRotX', -relY * 0.5);
    splineAppRef.current.setVariable('headRotY', relX * 0.5);
  };

  const handleMouseMove = (e: React.MouseEvent) => updatePointer(e.clientX, e.clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handlePointerLeave = () => {
    if (splineAppRef.current) {
      splineAppRef.current.setVariable('headRotX', 0);
      splineAppRef.current.setVariable('headRotY', 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handlePointerLeave}
    >
      <Spline
        scene="https://prod.spline.design/3c3rOBJxzYuK8lDA/scene.splinecode"
        className="w-full h-full"
        onLoad={(splineApp) => {
          splineAppRef.current = splineApp;
        }}
      />
      <img
        src="https://cdn.prod.website-files.com/6501f1891917bde75ab542ee/653e8be9ae6bc59344b62ff3_robot-phunk%201.webp"
        alt="Robot"
        className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none"
      />
    </div>
  );
}

// Note: nstall the required packages (once) bash /// npm install @splinetool/react-spline @splinetool/runtime  /// 
//  import SplineRobot from '../components/SplineRobot';  Inside your component's JSX: <div className="w-64 h-64 mx-auto"> <SplineRobot /> </div>//

