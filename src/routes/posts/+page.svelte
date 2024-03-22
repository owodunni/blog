<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<main>
  <h1>Posts</h1>
  <article>
    <ul>
      {#each data.posts as { slug, title }}
        <li><p><a href={`/posts/${slug}`}>{title}</a></p></li>
      {/each}
    </ul>
  </article>
</main>
