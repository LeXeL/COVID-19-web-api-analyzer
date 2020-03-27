<template>
    <el-row>
        <loader v-if="isLoading"></loader>
        <div v-if="!isLoading">
            <el-select :span="24" v-model="selectedCountry" placeholder="Countrys">
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
                <el-collapse>
                    <el-collapse-item title="Table Data" name="2">
                        <el-table :data="fetchData" style="width: 100%">
                            <el-table-column prop="date" label="Date" width="180"></el-table-column>
                            <el-table-column prop="confirmed" label="Confirmed" width="180"></el-table-column>
                            <el-table-column prop="recovered" label="Recovered"></el-table-column>
                            <el-table-column prop="deaths" label="Deaths"></el-table-column>
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
        }
    },
    methods: {
        fetchSelectedCountry() {
            this.informationData[this.selectedCountry].forEach(
                ({date, confirmed, recovered, deaths}) =>
                    this.fetchData.push({
                        date,
                        confirmed,
                        recovered,
                        deaths,
                    })
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