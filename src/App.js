import { useState } from 'react'
import './App.css'
import './pages/Welcome'
import Counter from './pages/Counter'
import ChickenBanana from './pages/ChickenBanana'

function Welcome(props){
  return <h2>Welcome, {props.name}!</h2>
}

function App() {

  return (
    <>
      {/* <Welcome name="Kobe"/>
      <Welcome name="Lester"/>
      <Welcome name="Cruz"/> */}

      {/* <Counter/> */}

      <ChickenBanana/>
    </>
  )
}

export default App
