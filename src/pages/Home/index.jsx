import BarChart from "./components/BarChart"

const Home = () => {

    return(
    <div>
      <BarChart title={'Satisfaction of Three Framworks'} xData={['Vue', 'React', 'Angular']} yData={[10, 40, 70]} />
      <BarChart title={'Utilization of Three Framworks'} xData={['Vue', 'React', 'Angular']} yData={[20, 60, 80]}/>
    </div>
    )
  }

export default Home
