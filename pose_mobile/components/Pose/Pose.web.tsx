import React, {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import {
  Pose as MpPose,
  POSE_CONNECTIONS,
  Results,
} from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import {
  drawConnectors,
  drawLandmarks,
} from '@mediapipe/drawing_utils';
import { defaultPoseProps, PoseProps } from './types';
import './Pose.web.scss';

export const Pose: FC<PoseProps> = (props = defaultPoseProps) => {
  const [loading, setLoading] = useState(true);

  const pose = useMemo(
    () =>
      new MpPose({
        locateFile: (file) => {
          console.log(file);
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      }),
    [],
  );

  useEffect(() => {
    pose.setOptions(props);
  }, [props]);

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
      lineWidth: 4,
    });
    drawLandmarks(ctx, results.poseLandmarks, {
      color: '#fff',
      lineWidth: 2,
    });
    ctx.restore();
    // console.log(results.poseWorldLandmarks);
  };
  pose.onResults(onResults);

  let cameraRef = useRef<Camera>(null!);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current!;
    if (!videoElement) return;
    cameraRef.current = new Camera(videoElement, {
      width: 1280,
      height: 720,
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
    });
    cameraRef.current.start();
    return () => {
      cameraRef.current.stop();
    };
  }, [videoRef, pose]);

  useEffect(() => {
    console.log(loading ? 'loading' : 'loaded');
  }, [loading]);

  return (
    <>
      <video
        id="input"
        ref={videoRef}
        hidden={!loading}
        style={styles.media}
      ></video>
      <canvas
        id="output"
        width="1280px"
        height="720px"
        ref={canvasRef}
        hidden={loading}
        style={styles.media}
      ></canvas>
    </>
  );
};

const styles = StyleSheet.create({
  media: {
    maxWidth: 1280,
    width: '100%',
  },
});
