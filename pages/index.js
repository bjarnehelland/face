import React from 'react'
import Head from 'next/head'
import Nav from '../components/nav'
import Camera from '../components/camera'

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Camera />

    <style jsx>{``}</style>
  </div>
)

export default Home
