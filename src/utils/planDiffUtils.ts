import type { DatePlan, Activity, PlanActivityDiff, ActivityDiff, DiffField } from '../types';

const diffFields: DiffField[] = ['name', 'description', 'location', 'cost', 'duration', 'time', 'type'];

type ActivityDiffField = 'name' | 'description' | 'location' | 'cost' | 'duration' | 'time' | 'type';

const activityDiffFields: ActivityDiffField[] = ['name', 'description', 'location', 'cost', 'duration', 'time', 'type'];

function getActivityFieldValue(activity: Activity, field: ActivityDiffField): string | number | undefined {
  switch (field) {
    case 'name': return activity.name;
    case 'description': return activity.description;
    case 'location': return activity.location;
    case 'cost': return activity.cost;
    case 'duration': return activity.duration;
    case 'time': return activity.time;
    case 'type': return activity.type;
    default: return undefined;
  }
}

export function comparePlans(plans: DatePlan[]): {
  activityDiffs: PlanActivityDiff[];
  summaryDiffs: {
    totalCost: ActivityDiff;
    activityCount: ActivityDiff;
    hasDifference: boolean;
  };
} {
  if (plans.length < 2) {
    return {
      activityDiffs: [],
      summaryDiffs: {
        totalCost: { field: 'cost', isDifferent: false, values: [] },
        activityCount: { field: 'cost', isDifferent: false, values: [] },
        hasDifference: false,
      },
    };
  }

  const maxActivities = Math.max(...plans.map(p => p.activities.length));
  const activityDiffs: PlanActivityDiff[] = [];

  for (let i = 0; i < maxActivities; i++) {
    const activities = plans.map(p => p.activities[i]);
    const diffs: ActivityDiff[] = [];
    const activityExists = activities.map(a => a !== undefined);

    for (const field of activityDiffFields) {
      const values = activities.map(a => {
        if (!a) return undefined;
        return getActivityFieldValue(a, field);
      });

      const isDifferent = checkIfDifferent(values);
      diffs.push({ field: field as DiffField, isDifferent, values });
    }

    activityDiffs.push({
      activityIndex: i,
      diffs,
      hasDifference: diffs.some(d => d.isDifferent),
      activityExists,
    });
  }

  const totalCostValues = plans.map(p => p.estimatedCost);
  const activityCountValues = plans.map(p => p.activities.length);

  return {
    activityDiffs,
    summaryDiffs: {
      totalCost: {
        field: 'cost',
        isDifferent: checkIfDifferent(totalCostValues),
        values: totalCostValues,
      },
      activityCount: {
        field: 'cost',
        isDifferent: checkIfDifferent(activityCountValues),
        values: activityCountValues,
      },
      hasDifference: activityDiffs.some(d => d.hasDifference) || 
                     checkIfDifferent(totalCostValues) || 
                     checkIfDifferent(activityCountValues),
    },
  };
}

function checkIfDifferent(values: (string | number | undefined)[]): boolean {
  if (values.length <= 1) return false;
  const definedValues = values.filter(v => v !== undefined);
  if (definedValues.length <= 1) return true;
  const firstValue = definedValues[0];
  return definedValues.some(v => v !== firstValue);
}

export function getFieldLabel(field: DiffField): string {
  const labels: Record<DiffField, string> = {
    name: '活动名称',
    description: '活动描述',
    location: '地点',
    cost: '花费',
    duration: '时长',
    time: '时间',
    type: '类型',
  };
  return labels[field];
}

export function getDifferentFields(diff: PlanActivityDiff): DiffField[] {
  return diff.diffs.filter(d => d.isDifferent).map(d => d.field);
}

export function hasAnyDifference(diffs: PlanActivityDiff[]): boolean {
  return diffs.some(d => d.hasDifference);
}
