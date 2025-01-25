<style lang="scss">
.drop-down-menu {
    background-color: #fff;
    user-select: none;
    position: fixed;
    z-index: 1003;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, .15);
}

.drop-down-menu__content {
    cursor: default;
    font-size: 13px;
    margin: 0;
    outline: none;
    padding: 7px 1px;
}
</style>

<template>
    <div id="drop-down-menu" class="drop-down-menu">
            <div class="drop-down-menu__content">
                <slot name="form">меню</slot>
            </div>
        </div>
</template>

<script lang="ts" setup>
</script>