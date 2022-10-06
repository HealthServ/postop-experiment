import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pose, POSE_CONNECTIONS, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import {} from '@mediapipe/control_utils';
import {
  drawConnectors,
  drawLandmarks,
} from '@mediapipe/drawing_utils';

export const App = () => {
  const [modelComplexity] = useState<any>(1);
  const [smoothLandmarks] = useState(true);
  const [enableSegmentation] = useState(true);
  const [smoothSegmentation] = useState(true);
  const [minDetectionConfidence] = useState(0.5);
  const [minTrackingConfidence] = useState(0.5);

  const [loading, setLoading] = useState(true);

  const pose = useMemo(
    () =>
      new Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      }),
    [],
  );

  pose.setOptions({
    modelComplexity,
    smoothLandmarks,
    enableSegmentation,
    smoothSegmentation,
    minDetectionConfidence,
    minTrackingConfidence,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasElement = canvasRef.current;
  const canvas = canvasRef.current;

  const onResults = (results: Results) => {
    setLoading(false);
    if (!canvas || !canvasElement) return;
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvasElement;
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    // results?.segmentationMask &&
    //   ctx.drawImage(
    //     results.segmentationMask,
    //     0,
    //     0,
    //     width,
    //     height,
    //   );

    // ctx.globalCompositeOperation = 'source-in';
    // ctx.fillStyle = '#000000';
    // ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(results.image, 0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: '#fff',
      lineWidth: 2,
    });
    drawLandmarks(ctx, results.poseLandmarks, {
      color: '#fff',
      lineWidth: 1,
    });
    ctx.restore();
    // console.log(results.poseWorldLandmarks);
  };
  pose.onResults(onResults);

  let cameraRef = useRef<Camera>(null!);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('effect');
    const videoElement = videoRef.current!;
    if (!videoElement) return;
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
    });

    const { width, height } = (camera as any)?.h;
    canvasElement?.setAttribute('width', width);
    canvasElement?.setAttribute('height', height);

    cameraRef.current = camera;
    cameraRef.current.start();
    return () => {
      cameraRef.current.stop();
    };
  }, [videoRef, pose]);

  useEffect(() => {
    console.log(loading ? 'loading' : 'loaded');
  }, [loading]);

  return (
    <div>
      <video id="input" ref={videoRef} hidden={!loading}></video>
      <canvas id="output" ref={canvasRef} hidden={loading}></canvas>
    </div>
  );
};
