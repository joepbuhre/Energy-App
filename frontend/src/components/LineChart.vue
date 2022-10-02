<template>
  <Line :chart-data="chartData" :chart-options="chartOptions" />
</template>
  
<script lang="ts" setup>
import { Line } from 'vue-chartjs'

import { api } from '../../../utils/frontend/api'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Plugin
} from 'chart.js'
import { ref } from 'vue';


ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
)



const chartData = ref({
  labels: ['jan', 'feb', 'mar', 'aug', 'sep', 'Okt'],
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
})

api
  .post('/query', {
    query: "select * from _iu_vw_kWhUsage order by DateTime asc"
  })
  .then((res: any) => {
    const data: Array<any> = res.data[0]
    chartData.value = {
      labels: data.map(el => el.DateTime ),
      datasets: [{
        label: 'Total kWh',
        data: data.map(el => el.kwh),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
    // console.log(res)
  })


const chartOptions = {
  responsive: true
}

</script>