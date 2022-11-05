<template>
    <router-view />
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div
            v-for="noti in not.GetNots"
            id="liveToast"
            class="toast show"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div class="toast-header">
                <strong class="me-auto">Melding!</strong>
                <small></small>
                <!-- <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                ></button> -->
            </div>
            <div class="toast-body">{{noti.body}}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNotifications } from './store/notification';

const not = useNotifications()

</script>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
