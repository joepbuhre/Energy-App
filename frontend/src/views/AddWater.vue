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
                            <div class="form-group-2">
                                <button
                                    class="btn alter-number"
                                    type="button"
                                    @mousedown="alterGJ2(false, true)"
                                    @touchstart="alterGJ2(false)"
                                    @mouseup="incrementStop"        
                                    @touchend="incrementStop"        
                                >
                                    -
                                </button>
                                <div>
                                    <span
                                        class="number-try"
                                        v-for="number in GJString"
                                    >
                                        {{ number }}
                                    </span>
                                </div>
                                <button
                                    class="btn alter-number"
                                    type="button"
                                    @mousedown="alterGJ2(true, true)"
                                    @mouseup="incrementStop"        
                                    @touchstart="alterGJ2(true)"
                                    @touchend="incrementStop"       
                                >

                                    +
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="Volume">Volume</label>
                            <div class="form-group-2">
                                <button
                                    class="btn alter-number"
                                    type="button"
                                    @mousedown="alterVL2(false, true)"
                                    @touchstart="alterVL2(false)"
                                    @mouseup="incrementStop"                                
                                    @touchend="incrementStop"                                
                                >
                                    -
                                </button>
                                <div>
                                    <span
                                        :class="
                                            number === ',' || number === '.'
                                                ? ''
                                                : 'number-try'
                                        "
                                        v-for="number in VLString"
                                    >
                                        {{ number }}
                                    </span>
                                </div>
                                <button
                                    class="btn alter-number"
                                    type="button"
                                    @mousedown="alterVL2(true, true)"
                                    @touchstart="alterVL2(true)"
                                    @mouseup="incrementStop"
                                    @touchend="incrementStop"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="Comments">Comments</label>
                            <textarea
                                type="datetime-local"
                                v-model="ValueComments"
                                class="form-control"
                                :disabled="!MaySubmit"
                            ></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary submit">
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
import { api } from "../utils/api";
import { number } from "../utils/formatters";
import { useNotifications } from "../store/notification";

type AddWaterSubmit = {
    GigaJoule: number;
    Volume: number;
    CustomDate?: string;
};

const MaySubmit = ref<boolean>(false);

const not = useNotifications()
const submitForm = (e: any) => {
    if (
        ValueGJ.value === 0 ||
        ValueVL.value === 0 ||
        ValueGJ.value === undefined ||
        ValueVL.value === undefined
    ) {
        return false;
    }
    const PostData: AddWaterSubmit = {
        GigaJoule: ValueGJ.value,
        Volume: ValueVL.value,
    };
    if (ValueComments.value) {
        PostData["CustomDate"] = ValueComments.value;
    }

    api.post("/query/AddWater", PostData)
    .then((res: AxiosResponse) => {
        if ((res.status = 200)) {
            getMinima();
            ValueComments.value = "";
            not.Add({
                body: 'Succesvol opgeslagen!'
            })
        }
    })
    .catch(err => {
        not.Add({
            body: 'Iets ging er fout...'
        })
    })
    ;
};

const GJString = computed(() => number.format(ValueGJ.value) || []);

const VLString = computed(() => number.format(ValueVL.value) || []);
const step = 0.01;

const intervalVal = ref<number>(0)
const timeoutVal = ref<number>(0)

const alterVL2 = (up:boolean, isMobile = false, fastness = 200, timeout = 1000) => {
    if(isMobile === false) { 
        alterVL(up)
    }
    intervalVal.value = setInterval(() => alterVL(up), fastness);
    
    timeoutVal.value = setTimeout(() => {
        if(intervalVal.value > 0) {
            incrementStop()
            alterVL2(up,isMobile, fastness * 0.6, timeout * 1.2)
        }
    }, timeout);
}

const alterGJ2 = (up:boolean, isMobile = false, fastness = 200, timeout = 1000) => {
    if(isMobile === false) { 
        alterGJ(up)
    }
    intervalVal.value = setInterval(() => alterGJ(up), fastness);
    
    timeoutVal.value = setTimeout(() => {
        if(intervalVal.value > 0) {
            incrementStop()
            alterGJ2(up,isMobile, fastness * 0.6, timeout * 1.2)
        }
    }, timeout);
}


const alterVL = (up = true) => {
    if (ValueVL.value && ValueVL.value + step >= parseFloat(minVL.value)) {
        if(up === true) {
            ValueVL.value += step;
        } else {
            ValueVL.value -= step;
        }
    } else {
        ValueVL.value = parseFloat(minVL.value)
    }
};

const alterGJ = (up = true) => {
    if (ValueGJ.value && ValueGJ.value + step >= parseFloat(minGJ.value)) {
        if(up === true) {
            ValueGJ.value += step;
        } else {
            ValueGJ.value -= step;
        }
    } else {
        ValueGJ.value = parseFloat(minGJ.value)
    }
};

const incrementGJ2 = (fastness = 200, timeout = 1000) => {
    incrementGJ()

    intervalVal.value = setInterval(incrementGJ, fastness);
    
    timeoutVal.value = setTimeout(() => {
        if(intervalVal.value > 0) {
            incrementStop()
            incrementGJ2(fastness = fastness * 0.6, timeout = timeout * 1.2)
        }
    }, timeout);
}

const incrementStop = () => {
    clearInterval(intervalVal.value)
    clearTimeout(timeoutVal.value)
    intervalVal.value = 0
    timeoutVal.value = 0
}


const incrementGJ = () => {
    if (ValueGJ.value && ValueGJ.value + step > parseFloat(minGJ.value)) {
        ValueGJ.value += step;
    }
};

const decrementGJ = () => {
    if (ValueGJ.value && ValueGJ.value - step >= parseFloat(minGJ.value)) {
        ValueGJ.value -= step;
    }
};

const incrementVL = () => {
    if (ValueVL.value && ValueVL.value + step > parseFloat(minVL.value)) {
        ValueVL.value += step;
    }
};

const decrementVL = () => {
    if (ValueVL.value && ValueVL.value - step >= parseFloat(minVL.value)) {
        ValueVL.value -= step;
    }
};

const minGJ = ref<string>("0");
const minVL = ref<string>("0");

const getMinima = (_: void) => {
    api.post("/query", {
        query: "select * from _iu_vw_LastEntriesWater",
    }).then((res: AxiosResponse) => {
        minGJ.value = res.data?.[0]?.[0]?.GigaJoule || "0";
        minVL.value = res.data?.[0]?.[0]?.Volume || "0";
        MaySubmit.value = true;

        ValueVL.value = parseFloat(minVL.value);
        ValueGJ.value = parseFloat(minGJ.value);
    });
};

onMounted(() => {
    getMinima();
});

const getPlaceholderGJ = computed(() => `minimum: ${minGJ.value} GJ`);

const getPlaceholderVL = computed(() => `minimum: ${minVL.value} M3`);

const ValueGJ = ref<number>(0);
const ValueVL = ref<number>(0);
const ValueComments = ref<string>("");
</script>

<style lang="scss" scoped>
.number-try {
    border: thin gray solid;
    border-radius: 2px;
    font-size: 1.7rem;
    padding: 5px;
    margin: 2px;
}
.form-group-2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 14px;
    .alter-number {
        touch-action: manipulation;
        width: auto;
        flex-grow: 1;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently */
        &:first-of-type {
            text-align: left;
        }
        &:last-of-type {
            text-align: right;
        }
    }
}
.submit {
    margin-top: 1rem;
    width: 100%;
}
.container {
    margin-top: 20px;
}
.form-wrapper {
    max-width: 500px;
}
</style>
