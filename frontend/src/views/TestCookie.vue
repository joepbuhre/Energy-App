<template>

    <button @click="CreateBiometrics" class="btn btn-primary">Create</button>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { api } from "../utils/api";


const challenge = ref<string>('')

api.get("/auth/device-id", {
    withCredentials: true,
}).then((res) => {
    challenge.value = res.data?.challenge
});

const user = {
    id: 'adfadfadfadfadfasdf',
    email: 'joep@joep.com',
    fullName: 'Joep Buhre'
}

const enc = new TextEncoder(); // always utf-8
const dec = new TextDecoder(); // always utf-8


const CreateBiometrics = async () => {
    const attestation = await navigator.credentials.create({
        publicKey: {
            authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required",
            },
            challenge: enc.encode(challenge.value),
            rp: { id: document.domain, name: "My Acme Inc" },
            user: {
                id: enc.encode(user.id),
                name: user.email,
                displayName: user.fullName,
            },
            pubKeyCredParams: [
                { type: "public-key", alg: -7 },
                { type: "public-key", alg: -257 },
            ],
        },
    }) as PublicKeyCredential

    navigator.credentials.preventSilentAccess();

function _arrayBufferToBase64( buffer:ArrayBuffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}


function publicKeyCredentialToJSON(pubKeyCred:any):Object {
    if (pubKeyCred instanceof ArrayBuffer) {
        return _arrayBufferToBase64(pubKeyCred);
    } else if (pubKeyCred instanceof Array) {
        return pubKeyCred.map(publicKeyCredentialToJSON);
    } else if (pubKeyCred instanceof Object) {
        const obj:any = {};
        for (let key in pubKeyCred) {
            obj[key] = publicKeyCredentialToJSON(pubKeyCred[key]);
        }
        return obj;
    } else return pubKeyCred;
}
console.log(attestation)

const webAuthnAttestation = publicKeyCredentialToJSON(attestation);

    api.post('/auth/validate', webAuthnAttestation, {
        withCredentials: true
    })
}

</script>
