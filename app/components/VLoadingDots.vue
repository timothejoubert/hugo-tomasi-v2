<template>
    <div :class="$style.root">
        <div :class="$style.dot" />
    </div>
</template>

<style lang="scss" module>
$color-default: #ffffff20;
$color-highlight: #ffffff60;

@mixin dot {
    position: relative;
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 100vmax;
    animation: dot-flashing 1s infinite alternate;
    animation-play-state: var(--v-dots-loading-state, running);
    background-color: $color-default;
}

.root {
    position: relative;
    display: inline-flex;
    gap: 2px;

    &::before,
    &::after {
        @include dot;

        content: '';
    }

    &::before {
        animation-delay: 0s;
    }

    &::after {
        animation-delay: 1s;
    }
}

.dot {
    @include dot;

    animation-delay: 0.5s;
}

@keyframes dot-flashing {
    0% {
        background-color: $color-highlight;
    }

    50%,
    100% {
        background-color: $color-default;
    }
}
</style>
