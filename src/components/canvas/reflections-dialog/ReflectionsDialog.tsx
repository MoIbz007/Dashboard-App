import React from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, Trash } from 'lucide-react';
import { Button } from '../../ui/button';
import { Dialog } from '../../ui/dialog/Dialog';
import { Loading } from '../Primitives';
import { Reflections } from '../../../lib/types';

interface ReflectionsDialogProps {
  handleGetReflections: () => Promise<void>;
  handleDeleteReflections: () => Promise<boolean>;
  reflections?: Reflections;
  isLoadingReflections: boolean;
}

export function ReflectionsDialog({
  handleGetReflections,
  handleDeleteReflections,
  reflections,
  isLoadingReflections,
}: ReflectionsDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button variant="ghost" size="sm">
          Reflections
        </Button>
      }
    >
      <motion.div
        className="fixed inset-0 bg-black/50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="container flex items-center justify-center min-h-screen">
          <motion.div
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Reflections</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGetReflections}
                  disabled={isLoadingReflections}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteReflections}
                  disabled={isLoadingReflections}
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {isLoadingReflections ? (
                <Loading message="Loading reflections..." />
              ) : reflections ? (
                <>
                  {reflections.styleRules?.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Style Rules</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {reflections.styleRules.map((rule, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {reflections.content?.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Content Notes</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {reflections.content.map((note, index) => (
                          <li key={index} className="text-sm text-gray-700">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(!reflections.styleRules?.length && !reflections.content?.length) && (
                    <p className="text-gray-500 text-center">
                      No reflections available
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center">
                  No reflections available
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Dialog>
  );
}
