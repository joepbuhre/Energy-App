<template>
    <div>
        <div class="gen-wrapper">
            <h4>Water</h4>
            <div class="kpi-wrapper">
                <div>
                    <p class="top">
                        {{ FromDate?.toLocaleDateString("nl-NL") }} -
                        {{ ToDate?.toLocaleDateString("nl-NL") }}
                    </p>
                    <p class="current">{{ curFormatter.format(NetLeft) }}</p>
                    <div class="sub">
                        <p>Paid: {{ curFormatter.format(PaidEuros) }}</p>
                        <p>Est. Cost {{ curFormatter.format(TotEstCosts) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AxiosResponse } from "axios";
import { onMounted, ref } from "vue";
import { api } from "../../../utils/frontend/api";

const FromDate = ref<Date | null>(null);
const ToDate = ref<Date | null>(null);

const PaidEuros = ref<number>(384);
const TotEstCosts = ref<number>(0);
const NetLeft = ref<number>(0);

const curFormatter = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
});

onMounted(() => {
    api.post("/query", {
        query: "select * from _iu_fn_calcNettCostWater(384)",
    }).then((res: AxiosResponse) => {
        const result = res.data?.[0]?.[0];
        FromDate.value = new Date(result.FromDate);
        ToDate.value = new Date(result.ToDate);
        PaidEuros.value = result.PaidEuros;
        TotEstCosts.value = result.TotEstCosts;
        NetLeft.value = result.NetLeft;
    });
});
</script>

<style lang="scss" scoped>
.gen-wrapper {
    width: 50%;
    h4 {
        font-size: 1rem;
        text-align: center;
        margin-bottom: 0px;
        color: gray
    }
    .kpi-wrapper {
        height: 100px;
        background: #fafafa;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        border: solid green thin;
        margin-bottom: 10px;
        text-align: center;
        p {
            margin: 0;
        }
        .current {
            color: green;
            font-weight: bold;
            font-size: 1.2rem;
            margin: 5px 0;
        }
        .top {
            font-size: 0.8rem;
        }
        .sub {
            display: flex;
            gap: 10px;
            font-size: 0.8rem;
        }
    }
}
</style>
