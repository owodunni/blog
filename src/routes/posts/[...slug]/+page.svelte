<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<article>
  <SvelteMarkdown source={data.post.content} />
</article>
