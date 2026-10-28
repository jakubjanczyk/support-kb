<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { groupByProblem, mergedInto } from '#lib/kb/problems';

  type Link = { label: string; href: string };
  // tickets: cause → the ticket that now owns it; oneDay: the ticket for the one-day move.
  let { ticket, tickets, oneDay }: { ticket: number; tickets: Record<string, Link>; oneDay?: Link } = $props();

  const merged = $derived(mergedInto(reports as Report[], ticket));
  const groups = $derived(groupByProblem(merged, tenantOf, notes.oneDayMove));
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'cause' : 'causes'}
</p>

<table>
  <thead>
    <tr><th>cause</th><th>reports</th><th>tenants</th><th>seen</th><th>intake tag wrong</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const t = tickets[g.cause]}
      <tr class:open={!t}>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{g.mistagged}</td>
        <td>{#if t}<a href={t.href}>{t.label}</a>{:else}no ticket yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.cause)}
  {#if g.oneDay}
    <p class="note">
      {g.oneDay} of the <code>{g.cause}</code> reports read as a one-day move, not a flipped date; counted under
      <code>{g.cause}</code> by tenant{#if oneDay}, tracked in <a href={oneDay.href}>{oneDay.label}</a>{/if}.
    </p>
  {/if}
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>
