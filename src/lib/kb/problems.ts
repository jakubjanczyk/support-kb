// The problems inside a merged ticket, counted the way the desk counts (causes.ts): every report
// under the cause its tenant points to. Reports the desk read as a one-day move (desk-notes.json)
// stay counted where they are filed; they are a problem of their own, footnoted under that cause.
import { groupByCause, readAs, uniqueById, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type ProblemGroup = CauseGroup & {
  // Reports intake tagged with another cause.
  mistagged: number;
  // Of these, read by the desk as a one-day move.
  oneDay: number;
};

export function mergedInto(reports: Report[], ticket: number): Report[] {
  return uniqueById(reports).filter((r) => r.mergedInto === ticket);
}

export function groupByProblem(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemGroup[] {
  return groupByCause(reports, tenantOf).map((g) => ({
    ...g,
    mistagged: g.reports.filter((r) => r.meta.intakeTag !== g.cause).length,
    oneDay: readAs(g, oneDayMove),
  }));
}
