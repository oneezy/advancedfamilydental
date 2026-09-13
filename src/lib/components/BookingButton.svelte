<script>
  import { Button } from "@oneezy/ui";

  let { class: className = "" } = $props();
</script>

<Button
  class={className}
  href="https://schedule.jarvisanalytics.com/frame?eoid=15470&elid=15000000000661"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="BOOK ONLINE (opens in a new tab)"
  xl
  secondary
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="shrink-0"
  >
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 11h18m-13 5 2 2 5-5" />
  </svg>
  BOOK ONLINE
</Button>
