<template>
    <div class="container">
        <h1>Hi</h1>
        <KPI />
        <div class="links">
            <router-link v-for="link in links" :to="{ name: link.target }">
                <div class="link-wrapper">
                    <h3>{{ link.name }}</h3>
                    <p v-if="link.description">{{ link.description }}</p>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script lang="ts" setup>
import KPI from '../components/KPI.vue';

type linkObject = {
    name: string;
    target: string;
    description?: String;
};

const links: linkObject[] = [
    {
        target: "Add Water",
        name: "Voeg water meterstand toe",
    },
];
</script>

<style lang="scss" scoped>
.links {
    a {
        text-decoration-line: none;
        color: inherit;
    }
    .link-wrapper {
        background-color: #fafafa;
        border: #acacac thin solid;
        text-align: center;
        padding: 30px 0px;
    }
}
</style>
