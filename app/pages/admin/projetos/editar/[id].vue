<script setup lang="ts">
const route = useRoute()
const id = route.params.id
await navigateTo(`/admin/portifolio/editar/${id}`, { redirectCode: 301 })
</script>
