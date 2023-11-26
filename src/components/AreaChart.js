import React, { useState, useEffect } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Chart, registerables} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, useTheme } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { colors } from '@mui/material';

Chart.register(...registerables);

const AreaChart = () => {
  const theme = useTheme();
  const darkTheme=createTheme({
    palette:{
         mode:'dark'
        
    }
  })

  const isMd = useMediaQuery(
    theme.breakpoints.up('md'),
    { defaultMatches: true }
  );
  
  const [chartData, setChartData] = useState([]);
  
  const fetchTopCoins = () => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=250&page=1&sparkline=false', {
      headers: {
        'Accept': 'application/json',
      }
    })
    .then(response => {
      setChartData(response.data);
    })
    .catch(error => console.log(error));
  };
  
  useEffect(() => {
    fetchTopCoins();
  }, []);
  
  const numberFormat = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value);

  const data = {
    // copy data from the state to a new array,
    // sort it by ath in descending order,
    // take top 10 results using slice
    // and then map 
    labels: chartData.sort((a, b) => b.ath - a.ath).slice(0, 10).map(coin => coin.name),
    datasets: [{
      label: 'All-Time-High',
      fontColor: colors.common.white,
      data: chartData.sort((a, b) => b.ath - a.ath).slice(0, 10).map(coin => coin.ath),
      fill: true,
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
      borderColor: theme.palette.primary.main,
      tension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: colors.common.white,
      pointBorderColor: alpha(colors.common.white, 0.8),
      pointHoverRadius: 3,
      pointHoverBackgroundColor: colors.common.white,
      pointHitRadius: 50,
      pointBorderWidth: 2
    }],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: isMd ? true : false,
        // color: theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
        color: colors.common.white,
        align: 'top',
        labels: {
          title: {
            font: {
              weight: 'bold',
              size: 13,
            },
            padding: 10,
          },
        },
        formatter: (value) => numberFormat(value),
      },
    },
    scales: {
      x: {
        ticks: {
          // color: theme.palette.text.primary,
          color: colors.common.white,
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          // color: theme.palette.divider,
          color: colors.common.white,
        },
      },
      y: {
        ticks: {
          min: 0,
          max: 12000000000,
          stepSize: 1000000000,
          // color: theme.palette.text.primary,
          color: colors.common.white,
          padding: 5,
          callback: (value) => numberFormat(value)
        },
        display: true,
        borderDash: [5, 5],
        grid: {
          // color: theme.palette.divider,
          color: colors.common.white,
        },
      },
    },
  };
  
  return (
  <ThemeProvider theme={darkTheme}>
    <Card>
      <CardHeader  
        title='Top 10 Cryptocurrencies By All-Time-High' 
        subheader='Top 10 Cryptocurrencies Measured By Their All-Time-High (ATH)' 
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400, position: 'relative' }}>
          <Line
            data={data} 
            options={options} 
            plugins={[ChartDataLabels]} 
          />
        </Box>
      </CardContent>
    </Card>
    </ThemeProvider>
  );
};

export default AreaChart;