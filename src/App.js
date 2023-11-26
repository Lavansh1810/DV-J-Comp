import React, { Component } from 'react'
import CardSection from './components/CardSection';
import ChartSection from './components/ChartSection';
import DonutChart from './components/DonutChart';
import Header from './components/Header';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Grid';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import PolarAreaChart from './components/PolarAreaChart';
import AreaChart from './components/AreaChart';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      Id: "bitcoin",
      Data:{}
    }
  }
  
  curr = "inr"

  fetchData = async() => {
    let data = await fetch('https://api.coingecko.com/api/v3/coins/' + this.state.Id)
    let json_data = await data.json()
    this.setState({Id:this.state.Id, Data:json_data}) // must change all comp of state
  }

  handle_Submit = async(event) => {
    await this.setState({ Id: event.target.value, Data: this.state.Data })
    this.fetchData()
  }
  componentDidMount() {
    this.fetchData()
    this.interval = setInterval(() => this.fetchData(), 2000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <Header handle_Submit = {this.handle_Submit}/>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CardSection coinName={this.state.Data.name} 
              currentPrice={this.state.Data.market_data ? this.state.Data.market_data.current_price["inr"] : ""}
              mCap24={this.state.Data.market_data ? this.state.Data.market_data.market_cap_change_percentage_24h : ""}
              ath={this.state.Data.market_data ? this.state.Data.market_data.ath.inr : ""} 
              atl={this.state.Data.market_data ? this.state.Data.market_data.atl.inr : ""}
              sentiment={this.state.Data.sentiment_votes_up_percentage} 
              high24={this.state.Data.market_data ? this.state.Data.market_data.high_24h["inr"] : ""}
              low24={this.state.Data.market_data ? this.state.Data.market_data.low_24h["inr"] : ""} 
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <ChartSection Id={this.state.Id} priceChange24={this.state.Data.market_data ? this.state.Data.market_data.price_change_24h_in_currency.inr : ""} 
            MarketCap={this.state.Data.market_data ? this.state.Data.market_data.market_cap.inr  : ""}
            TotVol={this.state.Data.market_data ? this.state.Data.market_data.total_volume.inr  : ""}
            Circulating= {this.state.Data.market_data ? this.state.Data.market_data["circulating_supply"] : ""}
            twitterF = {this.state.Data.community_data ? this.state.Data.community_data.twitter_followers : ""}
            />  
          </Grid>
            <Grid item md={4} xs={8}>  
              <DonutChart />
            </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <BarChart/>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item md={6} xs={12}>
            <PieChart />
          </Grid>
          <Grid item md={6} xs={12}>
            <PolarAreaChart />
          </Grid>
          <Grid item xs={12}>
              <AreaChart />
            </Grid>
        </Grid>

    {/* <Grid container spacing={2}>

        <Grid item md={4} xs={8}>  
          <DonutChart />
        </Grid>
        <Grid item md={4} xs={4}>  
          <DonutChart />
        </Grid>
        <Grid item md={4} xs={4}>  
          <DonutChart />
        </Grid>
    </Grid> */}
        </div>
    )
  }
}
