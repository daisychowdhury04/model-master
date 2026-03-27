import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';

interface SignInputProps {
  text: string;
  setText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SignInput = ({ text, setText, onSubmit }: SignInputProps) => (
  <form onSubmit={onSubmit} className="flex gap-2">
    <Input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Type a word (e.g., HELLO)"
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    />
    <Button type="submit" size="sm">Sign</Button>
  </form>
); 