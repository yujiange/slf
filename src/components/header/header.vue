<template>
    <header id="header" class="mui-bar mui-bar-nav">
        <h1 class="mui-title mui-ellipsis">
            <slot></slot>
        </h1>
        <a v-if="back" class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
        <slot name="extend"></slot>
    </header>
</template>

<script>
export default {
    props: {
        back: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="scss" scoped>
.mui-bar{
    box-shadow:unset;
    .mui-icon{
        color:#666666;
    }
    .mui-btn-link{
        font-size:30px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(0,114,255,1);
    }
}
</style>