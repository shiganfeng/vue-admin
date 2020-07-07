<template>
    <div>
        <LayoutHeader></LayoutHeader>
        <LayoutMain></LayoutMain>
        <LayoutNav></LayoutNav>
    </div>
</template>
<script>
import LayoutHeader from '../Console/Components/Header.vue'
import LayoutNav from '../Console/Components/Nav.vue'
import LayoutMain from '../Console/Components/Main.vue'
export default {
    name: 'layout',
    components: {LayoutHeader,LayoutNav,LayoutMain}
}
</script>
<style lang="scss" scoped>

</style>