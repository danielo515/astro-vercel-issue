<script lang="ts">
  import { tsToHoursDays } from "./tsToHoursDays";
  export let targetDate: Date;
  export let fullWidth: boolean;
  function pad(num: number) {
    return num.toString().padStart(2, "0");
  }
  $: time = targetDate.getTime();
  $: remaining = time - Date.now();
  $: ({ hours, days, minutes, seconds } = tsToHoursDays(remaining));
  $: setInterval(() => {
    remaining = time - Date.now();
  }, 1000);
</script>

{#if !fullWidth}
  <div class="font-gameBoy flex gap-2 items-center">
{days} D {pad(hours)}:{pad(
      minutes
    )}:{pad(seconds)}
  </div>
{:else}
  {days} Días {pad(hours)} Horas {pad(minutes)} minutos y {pad(seconds)} segundos
{/if}

<style>
  div {
    font-size: 0.8em;
    text-shadow: var(--mario-shadow);
  }
</style>
