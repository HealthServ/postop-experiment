import React, { useState } from 'react';

import { Pose, PoseProps } from '../components/Pose';

export default function TabTwoScreen() {
  const [modelComplexity, setModelComplexity] = useState<any>(1);
  const [smoothLandmarks, setSmoothLandmarks] = useState(true);
  const [enableSegmentation, setEnableSegmentation] = useState(true);
  const [smoothSegmentation, setSmoothSegmentation] = useState(true);
  const [minDetectionConfidence, setMinDetectConf] = useState(0.5);
  const [minTrackingConfidence, setMinTrackConf] = useState(0.5);

  const options: PoseProps = {
    modelComplexity,
    smoothLandmarks,
    enableSegmentation,
    smoothSegmentation,
    minDetectionConfidence,
    minTrackingConfidence,
  };

  return <Pose {...options} />;
}
