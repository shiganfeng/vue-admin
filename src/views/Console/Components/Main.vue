<template>
    <div id="main-wrap">
        <router-view></router-view>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap{
    position: fixed;
    left: $navMenu;
    top: 75px;
    bottom: 0;
    right: 0;
    border: 30px solid #f7f7f7;
    border-bottom: none;
    background-color: #fff;
    -webkit-box-sizing: border;
}
</style>