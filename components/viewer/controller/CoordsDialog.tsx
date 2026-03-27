import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CoordsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  coordinates: string;
}

export const CoordsDialog = ({ open, setOpen, coordinates }: CoordsDialogProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Current Bone Coordinates</DialogTitle>
      </DialogHeader>
      <pre className="bg-slate-100 p-4 rounded-md overflow-auto max-h-[400px]">
        {coordinates}
      </pre>
      <Button 
        onClick={() => navigator.clipboard.writeText(coordinates)}
        className="mt-4"
      >
        Copy to Clipboard
      </Button>
    </DialogContent>
  </Dialog>
); 