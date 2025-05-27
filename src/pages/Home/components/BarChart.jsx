import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
//柱状图组件

//1. 把功能代码都放到这个组件中
//2. 把可变的部分抽象成prop参数

const BarChart = ({ title, xData = [], yData = [] }) => {
   //return <div>This is Home.</div>
   const chartRef = useRef(null)
   useEffect(() => {
    // 保证dom可用 才进行图表的渲染
    //1.获取渲染图表的dom节点
    //const chartDom = document.getElementById('main');
    //if(!chartDom) return
    const chartDom = chartRef.current
    //console.log(chartDom);
    //2. 图表初始化生产图标实例对象 把它存到myChart
    echarts.dispose(chartDom)
    const myChart = echarts.init(chartDom);
    //console.log(myChart);


    //3. 准备图表参数
    const option = {
      title: {
        text: title
      },
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: yData,
          type: 'bar'
        }
      ]
    };
    //4. 使用图表参数完成图表渲染
    option && myChart.setOption(option);

     // handle window resize
    // const resize = () => myChart.resize();
    // window.addEventListener('resize', resize);

    // // 👇 dispose ONLY when the component unmounts
    // return () => {
    //   window.removeEventListener('resize', resize);
    //   myChart.dispose();
    // };


  }, [title, xData, yData])
return <div><div ref={chartRef} style={{ width: '500px', height: '400px' }}></div></div>
  }

  export default BarChart
