import { historicalFigures, getFigureById, getRelatedFigures } from '../data/figures.js';
import type {
  HistoricalFigure,
  FigureFilters,
  FigureDynastyOption,
  FigureTagOption,
  FigureStatus,
  CreateFigurePayload,
  UpdateFigurePayload,
  UpdateFigureTaskPayload,
  UpdateEventPayload,
} from '../../shared/types.js';

export function getAllFigures(filters: FigureFilters = {}): HistoricalFigure[] {
  const { dynasty, status, tag } = filters;
  let result = [...historicalFigures];

  if (dynasty && dynasty !== 'all') {
    result = result.filter(f => f.dynasty === dynasty);
  }

  if (status) {
    result = result.filter(f => f.status === status);
  }

  if (tag) {
    result = result.filter(f => f.tags.includes(tag));
  }

  return result;
}

export function getFigure(id: string): HistoricalFigure | undefined {
  return getFigureById(id);
}

export function getRelated(id: string): HistoricalFigure[] {
  const figure = getFigureById(id);
  if (!figure) return [];
  return getRelatedFigures(figure);
}

export function getDynastyOptions(): FigureDynastyOption[] {
  const dynastyMap = new Map<string, number>();
  historicalFigures.forEach(f => {
    dynastyMap.set(f.dynasty, (dynastyMap.get(f.dynasty) || 0) + 1);
  });
  return Array.from(dynastyMap.entries()).map(([value, count]) => ({
    value,
    label: value,
    count,
  }));
}

export function getTagOptions(): FigureTagOption[] {
  const tagMap = new Map<string, number>();
  historicalFigures.forEach(f => {
    f.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries()).map(([value, count]) => ({
    value,
    label: value,
    count,
  }));
}

export function getStatusOptions(): { value: FigureStatus; label: string }[] {
  return [
    { value: 'locked', label: '未解锁' },
    { value: 'unlocked', label: '已解锁' },
    { value: 'completed', label: '已完成' },
  ];
}

export function getFilterOptions() {
  return {
    dynasties: getDynastyOptions(),
    tags: getTagOptions(),
    statuses: getStatusOptions(),
  };
}

export function updateFigureTask(payload: UpdateFigureTaskPayload): HistoricalFigure | undefined {
  const figure = getFigureById(payload.figureId);
  if (!figure) return undefined;

  const task = figure.tasks.find(t => t.id === payload.taskId);
  if (!task) return figure;

  task.completed = payload.completed;
  recalculateFigureProgress(figure);
  return figure;
}

export function updateFigureEvent(payload: UpdateEventPayload): HistoricalFigure | undefined {
  const figure = getFigureById(payload.figureId);
  if (!figure) return undefined;

  const event = figure.uniqueEvents.find(e => e.id === payload.eventId);
  if (!event) return figure;

  event.completed = payload.completed;
  recalculateFigureProgress(figure);
  return figure;
}

export function updateCollectionGoal(
  figureId: string,
  goalId: string,
  currentCount: number,
): HistoricalFigure | undefined {
  const figure = getFigureById(figureId);
  if (!figure) return undefined;

  const goal = figure.collectionGoals.find(g => g.id === goalId);
  if (!goal) return figure;

  goal.currentCount = Math.min(currentCount, goal.targetCount);
  goal.completed = goal.currentCount >= goal.targetCount;
  recalculateFigureProgress(figure);
  return figure;
}

export function unlockFigure(figureId: string): HistoricalFigure | undefined {
  const figure = getFigureById(figureId);
  if (!figure) return undefined;

  if (figure.status === 'locked') {
    figure.status = 'unlocked';
  }
  return figure;
}

function recalculateFigureProgress(figure: HistoricalFigure): void {
  const totalTasks = figure.tasks.length;
  const completedTasks = figure.tasks.filter(t => t.completed).length;
  const totalEvents = figure.uniqueEvents.length;
  const completedEvents = figure.uniqueEvents.filter(e => e.completed).length;
  const totalGoals = figure.collectionGoals.length;
  const completedGoals = figure.collectionGoals.filter(g => g.completed).length;

  const total = totalTasks + totalEvents + totalGoals;
  if (total === 0) {
    figure.progress = 0;
    return;
  }

  const completed = completedTasks + completedEvents + completedGoals;
  figure.progress = Math.round((completed / total) * 100);

  if (figure.progress >= 100 && figure.status === 'unlocked') {
    figure.status = 'completed';
  }
}

export function createFigure(payload: CreateFigurePayload): HistoricalFigure {
  const newFigure: HistoricalFigure = {
    id: `custom-${Date.now()}`,
    name: payload.name,
    courtesyName: payload.courtesyName,
    title: payload.title,
    dynasty: payload.dynasty,
    birthYear: payload.birthYear,
    deathYear: payload.deathYear,
    avatar: payload.avatar,
    shortBio: payload.shortBio,
    fullBiography: payload.fullBiography,
    status: 'locked',
    progress: 0,
    fanStories: payload.fanStories || [],
    uniqueEvents: payload.uniqueEvents || [],
    collectionGoals: payload.collectionGoals || [],
    tasks: payload.tasks || [],
    relations: payload.relations || [],
    tags: payload.tags || [],
    unlockCondition: payload.unlockCondition || '探索更多内容以解锁',
    signatureFanType: payload.signatureFanType,
    achievements: payload.achievements || [],
  };
  historicalFigures.push(newFigure);
  return newFigure;
}

export function updateFigure(payload: UpdateFigurePayload): HistoricalFigure | undefined {
  const index = historicalFigures.findIndex(f => f.id === payload.id);
  if (index === -1) return undefined;

  const current = historicalFigures[index];
  const updated: HistoricalFigure = {
    ...current,
    ...Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined)),
  } as HistoricalFigure;

  historicalFigures[index] = updated;
  return updated;
}

export function deleteFigure(id: string): boolean {
  const index = historicalFigures.findIndex(f => f.id === id);
  if (index === -1) return false;
  historicalFigures.splice(index, 1);
  return true;
}

export function addFanStory(
  figureId: string,
  story: HistoricalFigure['fanStories'][number],
): HistoricalFigure | undefined {
  const figure = getFigureById(figureId);
  if (!figure) return undefined;
  figure.fanStories.push(story);
  return figure;
}

export function addRelation(
  figureId: string,
  relation: HistoricalFigure['relations'][number],
): HistoricalFigure | undefined {
  const figure = getFigureById(figureId);
  if (!figure) return undefined;
  figure.relations.push(relation);
  return figure;
}
