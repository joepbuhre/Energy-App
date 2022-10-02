<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1>Voeg waterstand toe</h1>
                <div class="form-wrapper">
                    <form @submit.prevent="submitForm">
                        <div class="form-group">
                            <label for="GigaJoule" class="form-label"
                                >GigaJoule</label
                            >
                            <div class="input-group">
                                <input
                                    type="number"
                                    :min="minGJValue?.toString()"
                                    step="0.01"
                                    v-model="ValueGJ"
                                    required
                                    :placeholder="getPlaceholderGJ"
                                    class="form-control"
                                    name="GigaJoule"
                                    id="GigaJoule"
                                    :disabled="!MaySubmit"
                                />
                                <span class="input-group-text" id="basic-addon2"
                                    >GJ</span
                                >
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="Volume">Volume</label>
                            <div class="input-group">
                                <input
                                    type="number"
                                    :min="minVLValue?.toString()"
                                    v-model="ValueVL"
                                    class="form-control"
                                    :placeholder="getPlaceholderVL"
                                    name="Volume"
                                    id="Volume"
                                    step="0.01"
                                    :disabled="!MaySubmit"
                                />
                                <span class="input-group-text" id="basic-addon2"
                                    >M&sup3;</span
                                >
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="Waterdate">Datum</label>
                            <input
                                type="datetime-local"
                                v-model="ValueDate"
                                class="form-control"
                                step="1"
                                :disabled="!MaySubmit"
                            />
                        </div>
                        <button type="submit" class="btn btn-primary">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { AxiosResponse } from "axios";
import { onMounted, ref } from "vue";
import { api } from "../../../utils/frontend/api";

type AddWaterSubmit = {
    GigaJoule: number|null,
    Volume: number|null,
    CustomDate?: string
}

const MaySubmit = ref<boolean>(false)

const submitForm = (e: any) => {
    const PostData:AddWaterSubmit = {
        GigaJoule: ValueGJ.value,
        Volume: ValueVL.value
    }
    if(ValueDate.value) {
        PostData['CustomDate'] = ValueDate.value
    }

    api
        .post("/query/AddWater", PostData)
        .then((res: AxiosResponse) => {
            if(res.status = 200) {
                getMinima()
                ValueGJ.value = null
                ValueVL.value = null
                ValueDate.value = null
            }
        })
}

const minGJ = ref<string|null>(null)
const minVL = ref<string|null>(null)

const minGJValue = computed(() => {
    if(ValueDate.value !== null && ValueDate.value !== '') {
        return false
    } else {
        return minGJ.value
    }
})
const minVLValue = computed(() => {
    if(ValueDate.value !== null && ValueDate.value !== '') {
        return false
    } else {
        return minVL.value
    }
})

const getMinima = (_: void) => {
    api.post('/query', {
        query: 'select top 1 CAST(CreatedAt as smalldatetime) [CreatedAt],GigaJoule, Volume from _iu_vw_NormalizedDataWater order by CreatedAt desc'
    })
        .then((res: AxiosResponse) => {
            minGJ.value = res.data?.[0]?.[0]?.GigaJoule || '0'
            minVL.value = res.data?.[0]?.[0]?.Volume || '0'
            MaySubmit.value= true
        })
}

onMounted(() => {
    getMinima()
})

const getPlaceholderGJ = computed(() => {
    if(minGJ.value && (ValueDate.value === null || ValueDate.value === '')) {
        return `minimum: ${minGJ.value} GJ`
    } else {
        return ''
    }
})
const getPlaceholderVL = computed(() => {
    if(minVL.value && (ValueDate.value === null || ValueDate.value === '')) {
        return `minimum: ${minVL.value} M3`
    } else {
        return ''
    }
})

const ValueGJ = ref<number|null>(null);
const ValueVL = ref<number|null>(null);
const ValueDate = ref<string|null>(null);
</script>

<style lang="scss" scoped>
.container {
    margin-top: 20px;
}
.form-wrapper {
    max-width: 500px;
}
</style>
