import React, { FC, useRef } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { defaultPoseProps, PoseProps } from './types';

export const Pose: FC<PoseProps> = (props = defaultPoseProps) => {
  const webRef = useRef<WebView>(null!);

  return (
    <WebView
      style={styles.container}
      ref={webRef}
      source={{
        // webcam will not work without https
        uri: 'https://healthserv.github.io/postop-experiment/',
      }}
      allowsInlineMediaPlayback
      startInLoadingState
      javaScriptCanOpenWindowsAutomatically={true}
      mediaPlaybackRequiresUserAction={false}
      allowsFullscreenVideo={false}
      mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
