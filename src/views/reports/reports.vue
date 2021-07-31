<template>
    <div>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item> 
        </el-breadcrumb>


        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 2 为ECharts准备一个具备大小（宽高）的Dom -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>


<script>
// 1 导入echarts
// import echarts from 'echarts' 会报错
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
    data(){
        return{
            // 需要合并的对象
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                    boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                    type: 'value'
                    }
                ]
            }
        }
    },
    created(){
        
    },
    // 此时页面上的元素已经渲染完毕 执行mounted
    async mounted(){
        // 3 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const {data:res} =await this.$require.get('reports/type/1');
        if(res.meta.status!=200){
            return this.$message.error('获取折线图数据失败')
        }else{
            
            console.log(res.data);
            //4 准备数据和配置项
            const data = _.merge(res.data ,this.options)
            // 5 展示数据 使用刚指定的配置项和数据显示图表。
            myChart.setOption(data);
        }
        //4 准备数据和配置项
         /*var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }; */
        

        
    },   
}
</script>

<style  scoped>
.el-card {
  margin-top: 20px;
}
</style>