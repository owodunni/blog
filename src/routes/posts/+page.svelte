<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#each data.posts as { slug, title }}
  <a href={`/posts/${slug}`}>{title}</a>
{/each}
