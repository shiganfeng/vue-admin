<template>
    <div id="nav-wrap">
        <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" 
        :collapse="isCollapse"
        background-color="transparent"
        text-color="#fff"
        active-text-color="#fff"
        router>
        <template v-for="(item, index) in routers" >
            <el-submenu index="1" v-if="!item.hidden" :key="item.id" :index="index + ''">
                <!--一级菜单-->
                <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">{{item.meta.name}}</span>
                </template>
                <!--子菜单-->
                <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id">{{subItem.meta.name}}</el-menu-item>
            </el-submenu>
        </template>
        </el-menu>
    </div>
</template>
<script>
export default {
    name: 'navMenu',
    data(){
        return{
            isCollapse: false,
            routers: this.$router.options.routes
        }
    },
    methods:{
        handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
        handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    },
    created(){
        console.log(this.routers)
    }
    
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#nav-wrap{
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: $navMenu;
    background-color: #344a5f;
}
</style>