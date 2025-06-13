import { useState, useCallback } from 'react';

export const useDragAndDrop = <T extends { id: string }>(
  items: T[],
  onReorder: (orderedIds: string[]) => void
) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const handleDragStart = useCallback((id: string, e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((id: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setTargetId(id);
  }, []);

  const handleDragLeave = useCallback(() => {
    setTargetId(null);
  }, []);

  const handleDrop = useCallback(
    (targetId: string, e: React.DragEvent) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      if (draggedId && draggedId !== targetId) {
        const newItems = [...items];
        const draggedIndex = newItems.findIndex((item) => item.id === draggedId);
        const targetIndex = newItems.findIndex((item) => item.id === targetId);
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);
        onReorder(newItems.map((item) => item.id));
      }
      setDraggedId(null);
      setIsDragging(false);
      setTargetId(null);
    },
    [items, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setIsDragging(false);
    setTargetId(null);
  }, []);

  return {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    draggedId,
    isDragging,
    targetId,
  };
};