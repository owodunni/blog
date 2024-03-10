<script>
  import { page } from '$app/stores';
</script>

<h1>{$page.error?.message || 'Some error!'}</h1>
