'use client';

import { useRef, useState, useEffect } from 'react';
import AgoraRTC, { ICameraVideoTrack, IMicrophoneAudioTrack, ILocalTrack } from 'agora-rtc-sdk-ng';

const VideoCall = () => {
  const [joined, setJoined] = useState(false);
  const client = useRef(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })).current;
  const [localTracks, setLocalTracks] = useState<ILocalTrack[]>([]);
  const localVideoRef = useRef<HTMLDivElement>(null);

  const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
  const token = process.env.NEXT_PUBLIC_AGORA_TEMP_TOKEN!;
  const channel = 'test-channel';

  const joinChannel = async () => {
    try {
      // Join the Agora channel
      await client.join(appId, channel, token);

      // Create and initialize local tracks
      const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks([microphoneTrack, cameraTrack]);

      // Play the local video track
      if (localVideoRef.current) {
        cameraTrack.play(localVideoRef.current);
      }

      // Publish local tracks to the channel
      await client.publish([microphoneTrack, cameraTrack]);

      setJoined(true);
    } catch (error) {
      console.error('Error joining channel:', error);
    }
  };

  const leaveChannel = async () => {
    try {
      // Unpublish and close local tracks
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });

      // Leave the Agora channel
      await client.leave();

      setLocalTracks([]);
      setJoined(false);
    } catch (error) {
      console.error('Error leaving channel:', error);
    }
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (joined) {
        leaveChannel();
      }
    };
  }, [joined]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div ref={localVideoRef} className="w-64 h-48 bg-gray-200 rounded-lg"></div>
      <button
        onClick={joined ? leaveChannel : joinChannel}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {joined ? 'Leave Channel' : 'Join Channel'}
      </button>
    </div>
  );
};

export default VideoCall;
