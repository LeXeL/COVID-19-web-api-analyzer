<template>
    <el-row>
        <loader v-if="isLoading"></loader>
        <div v-if="!isLoading">
            <el-select filterable :span="24" v-model="selectedCountry" placeholder="Countrys">
                <el-option
                    v-for="item in countrys"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-button @click="fetchSelectedCountry()" type="primary" icon="el-icon-search">Search</el-button>
            <el-row>
                <div id="chart"></div>
            </el-row>
            <el-row v-if="fetchData.length">
                <el-col :span="12">
                    <el-card class="box-card" shadow="hover">
                        <h3>
                            {{`Confirmed: ${lastValues.Confirmed ? lastValues.Confirmed : 'None'}`}}
                            <i
                                v-if="lastValues.Confirmed"
                                :style="this.graphData[0].data[this.graphData[0].data.length - 1] > this.graphData[0].data[this.graphData[0].data.length - 2] ? 'color:green' : 'color:#ffa00a'"
                                :class="this.graphData[0].data[this.graphData[0].data.length - 1] > this.graphData[0].data[this.graphData[0].data.length - 2] ? 'el-icon-top' : 'el-icon-minus'"
                            ></i>
                        </h3>
                        <h3>
                            {{`Deaths: ${lastValues.Deaths ? lastValues.Deaths : 'None'}`}}
                            <i
                                v-if="lastValues.Deaths"
                                :style="this.graphData[1].data[this.graphData[1].data.length - 1] > this.graphData[1].data[this.graphData[1].data.length - 2] ? 'color:green' : 'color:#ffa00a'"
                                :class="this.graphData[1].data[this.graphData[1].data.length - 1] > this.graphData[1].data[this.graphData[1].data.length - 2] ? 'el-icon-top' : 'el-icon-minus'"
                            ></i>
                        </h3>
                        <h3>
                            {{`Recovered: ${lastValues.Recovered ? lastValues.Recovered : 'None'}`}}
                            <i
                                v-if="lastValues.Recovered"
                                :style="this.graphData[2].data[this.graphData[2].data.length - 1] > this.graphData[2].data[this.graphData[2].data.length - 2] ? 'color:green' : 'color:#ffa00a'"
                                :class="this.graphData[2].data[this.graphData[2].data.length - 1] > this.graphData[2].data[this.graphData[2].data.length - 2] ? 'el-icon-top' : 'el-icon-minus'"
                            ></i>
                        </h3>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="box-card" shadow="hover" :span="6">
                        <h3>{{`New Confirmed: ${lastValues.Confirmed ? lastValues.Confirmed - this.graphData[0].data[this.graphData[0].data.length - 2] : 'None'}`}}</h3>
                        <h3>{{`New Deaths: ${lastValues.Deaths ? lastValues.Deaths - this.graphData[1].data[this.graphData[1].data.length - 2] : 'None'}`}}</h3>
                        <h3>{{`New Recovered: ${lastValues.Recovered ? lastValues.Recovered - this.graphData[2].data[this.graphData[2].data.length - 2] : 'None'}`}}</h3>
                    </el-card>
                </el-col>
            </el-row>
            <el-row v-if="fetchData.length">
                <!-- <el-col :span="6">
                    <div>
                        <bar-chart
                            :chart-data="{labels:this.globalChartLabels,datasets:this.globalChart}"
                            :options="{responsive:true, maintainAspectRatio: false,legend:{position:'bottom'}, title:{text:'COVID-19 Chart OverTime',display:true}}"
                            :height="400"
                        ></bar-chart>
                    </div>
                </el-col>-->
                <el-col :span="24">
                    <div>
                        <line-chart
                            :chart-data="{labels:this.graphLabels,datasets:this.graphData}"
                            :options="{responsive:true, maintainAspectRatio: false,legend:{position:'bottom'}, title:{text:'COVID-19 Total Confirmed',display:true}}"
                            :height="400"
                        ></line-chart>
                    </div>
                </el-col>
            </el-row>
            <el-row v-if="fetchData.length">
                <el-collapse>
                    <el-collapse-item title="Table Data" name="2" type="info">
                        <el-table :data="fetchData" style="width: 100%" height="250">
                            <el-table-column prop="date" label="Date" width="180"></el-table-column>
                            <el-table-column prop="confirmed" label="Confirmed" width="180"></el-table-column>
                            <el-table-column prop="recovered" label="Recovered"></el-table-column>
                            <el-table-column prop="deaths" label="Deaths"></el-table-column>
                            <el-table-column prop="newConfirmed" label="New Cases"></el-table-column>
                        </el-table>
                    </el-collapse-item>
                </el-collapse>
            </el-row>
        </div>
    </el-row>
</template>

<script>
import loader from '@/components/loader'
import LineChart from '@/components/lineChart'
import BarChart from '@/components/barChart'

export default {
    name: 'home',
    components: {
        loader,
        LineChart,
        BarChart,
    },
    data() {
        return {
            countrys: [],
            informationData: [],
            selectedCountry: '',
            isCollapse: true,
            isLoading: false,
            fetchData: [],
            graphLabels: [],
            graphData: [],
            lastValues: [],
            globalChart: [
                {
                    label: 'Confirmed',
                    backgroundColor: '#2A7F62',
                    borderColor: '#538083',
                    data: [],
                    fill: false,
                },
            ],
            globalChartLabels: [],
        }
    },
    methods: {
        checkTrend() {},
        fetchSelectedCountry() {
            let lastConfirmed = 0
            this.graphData = [
                {
                    label: 'Confirmed',
                    backgroundColor: '#FCCA46',
                    borderColor: '#FCCA46',
                    data: [],
                    fill: false,
                },
                {
                    label: 'Death',
                    backgroundColor: '#DB162F',
                    borderColor: '#DB162F',
                    data: [],
                    fill: false,
                },
                {
                    label: 'Recovered',
                    backgroundColor: '#53DD6C',
                    borderColor: '#53DD6C',
                    data: [],
                    fill: false,
                },
            ]
            this.graphLabels = []
            this.lastValues = []
            this.informationData[this.selectedCountry].forEach(
                ({date, confirmed, recovered, deaths}) => {
                    if (confirmed != 0) {
                        this.graphLabels.push(date)
                        this.graphData[0].data.push(confirmed)
                        this.graphData[1].data.push(deaths)
                        this.graphData[2].data.push(recovered)
                        this.fetchData.push({
                            date,
                            confirmed,
                            recovered,
                            deaths,
                            newConfirmed: confirmed - lastConfirmed,
                        })
                        this.lastValues = {
                            Confirmed: confirmed,
                            Deaths: deaths,
                            Recovered: recovered,
                        }
                        lastConfirmed = confirmed
                    }
                }
            )
        },
    },
    beforeCreate() {
        this.isLoading = true
        fetch('https://pomber.github.io/covid19/timeseries.json')
            .then(response => response.json())
            .then(data => {
                this.informationData = data
                this.countrys = Object.keys(data).map(v => {
                    return {
                        value: v,
                        label: v,
                    }
                })
            })
            .then(() => {
                Object.keys(this.informationData).forEach((country, i) => {
                    // this.globalChart.push({
                    //     confirmed: this.informationData[country].slice(-1)
                    //         .confirmed,
                    // })
                    this.globalChartLabels.push(country)
                    this.globalChart[0].data.push(
                        this.informationData[country].slice(-1)[0].confirmed
                    )
                })
            })
            .then((this.isLoading = false))
    },
}
</script>

<style>
</style>