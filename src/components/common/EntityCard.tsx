import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { Task, TaskList, PRIORITY_CONFIG, Priority } from '../../types/shared';
import { getThemeClasses } from '../../lib/theme';
import { cn } from '../../lib/utils';

type Entity = Task | TaskList;

interface EntityCardProps {
  entity: Entity;
  onClick?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle?: () => void;
  themeColor: string;
  draggable?: boolean;
  onDragStart?: (id: string, e: React.DragEvent) => void;
  onDragOver?: (id: string, e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (id: string, e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  draggedId?: string | null;
  targetId?: string | null;
  items: Entity[];
}

export const EntityCard: React.FC<EntityCardProps> = ({
  entity,
  onClick,
  onEdit,
  onDelete,
  onToggle,
  themeColor,
  draggable,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragging,
  draggedId,
  targetId,
  items,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [canDrag, setCanDrag] = useState(false);
  const { bg, hover, border } = getThemeClasses(themeColor);
  const isTask = 'completed' in entity;

  const getTaskStats = (list: TaskList) => {
    const completed = list.tasks.filter((t) => t.completed).length;
    const total = list.tasks.length;
    return { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 };
  };

  const formatDate = (date: Date) =>
    date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  const handleMouseDown = () => {
    if (draggable) {
      setCanDrag(true);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging && onClick && !canDrag) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

  const isTarget = targetId === entity.id;
  const isAboveTarget =
    targetId &&
    draggedId &&
    entity.id !== draggedId &&
    entity.id !== targetId &&
    items.indexOf(entity) === items.indexOf(items.find((i) => i.id === targetId)!) - 1;
  const isBelowTarget =
    targetId &&
    draggedId &&
    entity.id !== draggedId &&
    entity.id !== targetId &&
    items.indexOf(entity) === items.indexOf(items.find((i) => i.id === targetId)!) + 1;

  return (
    <div
      className={cn(
        `rounded-lg p-4 shadow-sm transition-all duration-200`,
        isTask && entity.completed ? 'bg-green-50 border-green-100' : `bg-white border ${border}`,
        isDragging && draggedId === entity.id && 'opacity-50 scale-95 cursor-move',
        isTarget && 'ring-2 ring-primary ring-opacity-50 scale-105',
        isAboveTarget && 'translate-y-4',
        isBelowTarget && 'translate-y-[-4]',
        !isDragging && !draggable && 'cursor-pointer hover:scale-105'
      )}
      onMouseDown={draggable ? handleMouseDown : undefined}
      draggable={draggable && canDrag}
      onDragStart={(e) => onDragStart?.(entity.id, e)}
      onDragOver={(e) => onDragOver?.(entity.id, e)}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        onDrop?.(entity.id, e);
        setCanDrag(false);
      }}
      onDragEnd={() => {
        onDragEnd?.();
        setCanDrag(false);
      }}
      onClick={handleClick}
    >
      {isTask && entity.priority !== Priority.None && (
        <div className={cn(`h-1 ${PRIORITY_CONFIG[entity.priority].color} rounded-t`)} />
      )}
      <div className="flex items-center gap-3">
        {isTask && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggle?.();
            }}
            className={cn(`p-1`, entity.completed ? 'text-green-500' : `text-gray-400 ${hover}`)}
          >
            {entity.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
          </button>
        )}
        <div className="flex-1">
          <h3
            className={cn(
              `font-medium`,
              isTask && entity.completed ? 'line-through text-gray-500' : 'text-gray-800'
            )}
          >
            {entity.title}
          </h3>
          {entity.description && (
            <p className="text-sm text-gray-500">{entity.description}</p>
          )}
          {isTask && entity.priority !== Priority.None && !entity.completed && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <span className={cn(`h-2 w-2 rounded-full ${PRIORITY_CONFIG[entity.priority].color}`)} />
              {PRIORITY_CONFIG[entity.priority].label}
            </span>
          )}
          {'tasks' in entity && (
            <div className={cn(`mt-2 pt-2 border-t ${border}`)}>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {getTaskStats(entity).completed}/{getTaskStats(entity).total} tasks
                </span>
                <span>{getTaskStats(entity).percentage}%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded mt-1">
                <div
                  className={cn(`h-full ${bg} rounded transition-all duration-300`)}
                  style={{ width: `${getTaskStats(entity).percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="relative flex items-center gap-2">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(entity.createdAt)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={cn(`p-1 ${hover} rounded`)}
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 w-full text-left"
                >
                  <Edit2 className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};