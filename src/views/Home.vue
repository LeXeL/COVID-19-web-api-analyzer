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
                                :style="this.data[0].values[this.data[0].values.length - 1] > this.data[0].values[this.data[0].values.length - 2] ? 'color:green' : 'color:#ffa00a'"
                                :class="this.data[0].values[this.data[0].values.length - 1] > this.data[0].values[this.data[0].values.length - 2] ? 'el-icon-top' : 'el-icon-minus'"
                            ></i>
                        </h3>
                        <h3>
                            {{`Deaths: ${lastValues.Deaths ? lastValues.Deaths : 'None'}`}}
                            <i
                                v-if="lastValues.Deaths"
                                :style="this.data[1].values[this.data[1].values.length - 1] > this.data[1].values[this.data[1].values.length - 2] ? 'color:green' : 'color:#ffa00a'"
                                :class="this.data[1].values[this.data[1].values.length - 1] > this.data[1].values[this.data[1].values.length - 2] ? 'el-icon-top' : 'el-icon-minus'"
                            ></i>
                        </h3>
                        <h3>
                            {{`Recovered: ${lastValues.Recovered ? lastValues.Recovered : 'None'}`}}
                            <i
                                v-if="lastValues.Recovered"
                                :style="this.data[2].values[this.data[2].values.length - 1] > this.data[2].values[this.data[2].values.length - 2] ? 'color:green' : 'color:#ffa00a'"
                                :class="this.data[2].values[this.data[2].values.length - 1] > this.data[2].values[this.data[2].values.length - 2] ? 'el-icon-top' : 'el-icon-minus'"
                            ></i>
                        </h3>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card class="box-card" shadow="hover" :span="6">
                        <h3>{{`New Confirmed: ${lastValues.Confirmed ? lastValues.Confirmed - this.data[0].values[this.data[0].values.length - 2] : 'None'}`}}</h3>
                        <h3>{{`New Deaths: ${lastValues.Deaths ? lastValues.Deaths - this.data[1].values[this.data[1].values.length - 2] : 'None'}`}}</h3>
                        <h3>{{`New Recovered: ${lastValues.Recovered ? lastValues.Recovered - this.data[2].values[this.data[2].values.length - 2] : 'None'}`}}</h3>
                    </el-card>
                </el-col>
                <vue-frappe
                    id="test"
                    :labels="this.graphLabels"
                    title="COVID-19 Chart OverTime"
                    type="axis-mixed"
                    :height="300"
                    :colors="['#ffa00a', 'red', 'green']"
                    :dataSets="this.data"
                ></vue-frappe>
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

export default {
    name: 'home',
    components: {
        loader,
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
            data: [],
            lastValues: [],
        }
    },
    methods: {
        checkTrend() {},
        fetchSelectedCountry() {
            let lastConfirmed = 0
            this.data = [
                {
                    name: 'Confirmed',
                    chartType: 'line',
                    values: [],
                },
                {
                    name: 'Death',
                    chartType: 'line',
                    values: [],
                },
                {
                    name: 'Recovered',
                    chartType: 'line',
                    values: [],
                },
            ]
            this.graphLabels = []
            this.lastValues = []
            this.informationData[this.selectedCountry].forEach(
                ({date, confirmed, recovered, deaths}) => {
                    if (confirmed != 0) {
                        this.graphLabels.push(date)
                        this.data[0].values.push(confirmed)
                        this.data[1].values.push(deaths)
                        this.data[2].values.push(recovered)
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
            .then((this.isLoading = false))
    },
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>