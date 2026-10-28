<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { groupByProblem, mergedInto, type Problem } from '#lib/kb/problems';

  // tickets: problem → the ticket that now owns it, e.g. { parser: { label: 'support-kb#1', href: '…' } }
  let { ticket, tickets }: { ticket: number; tickets: Partial<Record<Problem, { label: string; href: string }>> } =
    $props();

  const merged = $derived(mergedInto(reports as Report[], ticket));
  const groups = $derived(groupByProblem(merged, tenantOf, notes.oneDayMove));
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>intake tag wrong</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      {@const t = tickets[g.problem]}
      <tr class:open={!t}>
        <td><code>{g.problem}</code></td>
        <td>{g.count}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{g.mistagged}</td>
        <td>{#if t}<a href={t.href}>{t.label}</a>{:else}no ticket yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>
