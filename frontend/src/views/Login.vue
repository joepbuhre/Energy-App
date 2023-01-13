<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="login-wrapper">
                    <h1>Login</h1>
                <form @submit.prevent="login">
                    <div class="form-group">
                        <label for="UserName" class="form-label">Username</label>
                        <input type="text" class="form-control" id="UserName" UserName="UserName">
                    </div>
                    <div class="form-group">
                        <label for="Password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="Password" name="Password">
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../utils/api';
import { logger } from '../../../server/utils/logger';
import { useMain } from '../store/main';

const UserName = ref<String>('')
const Password = ref<String>('')
const store = useMain()
const router = useRouter()

const login = (e: any): void => {
    api.post('/auth/login')
        .then(res => {
            logger.log(res)
            store.setToken(res?.data?.token)
            router.push({
                name: "Home"
            })
        })
}

</script>

<style lang="scss" scoped>
button {
    width: 100%
}

.login-wrapper {
    border-radius: 4px;
    background-color: #fafafa;
    box-shadow: 0px 0px 13px 0px rgba(0,0,0,0.35);
    margin-top: 90px;
    padding: 10px

}

</style>