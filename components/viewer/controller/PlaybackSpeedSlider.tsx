import { Input } from '@/components/ui/input';
import React from 'react';

interface PlaybackSpeedSliderProps {
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
}

export const PlaybackSpeedSlider = ({ playbackSpeed, setPlaybackSpeed }: PlaybackSpeedSliderProps) => (
  <div className="mt-4">
    <label className="block mb-2">Playback Speed: {playbackSpeed}x</label>
    <Input
      type="range"
      min="0.1"
      max="3"
      step="0.1"
      value={playbackSpeed}
      onChange={e => setPlaybackSpeed(Number(e.target.value))}
      style={{ width: 200 }}
      title="Playback Speed"
    />
  </div>
); 