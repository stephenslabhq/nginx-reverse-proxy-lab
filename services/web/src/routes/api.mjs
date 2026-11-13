//
// API routes, that return JSON
// ---------------------------------------------
// Ben C, Jan 2020
//

import express from 'express'
const router = express.Router()
import os from 'os'
import fs from 'fs'
import axios from 'axios'
import appInsights from 'applicationinsights'

// =======================================================================
// Get weather data as JSON
// =======================================================================
router.get('/api/weather/:lat/:long', async function (req, res, next) {
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '123456'
  const long = req.params.long
  const lat = req.params.lat

  try {
    // Call external OpenWeather API
    const weatherResp = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}`,
    )

    if (weatherResp.data) {
      // Send custom metric over to App Insights - 'weatherTemp' with the temperature
      if (appInsights.defaultClient && weatherResp.data.main) {
        console.log(`----- ${weatherResp.data.main.temp}`)
        appInsights.defaultClient.trackMetric({
          name: 'weatherTemp',
          value: weatherResp.data.main.temp,
          // Extra meta data
          properties: { city: weatherResp.data.name, country: weatherResp.data.sys.country },
        })
      }

      // Proxy the OpenWeather response through to the caller
      res.status(200).send(weatherResp.data)
    } else {
      throw new Error(`Current weather not available for: ${long},${lat}`)
    }
  } catch (e) {
    return res.status(500).send(`API error fetching weather: ${e.toString()}`)
  }
})

// =======================================================================
// API for live monitoring (CPU and memory) data
// =======================================================================
router.get('/api/monitoringdata', async function (req, res, next) {
  const data = {
    container: fs.existsSync('/.dockerenv'),
    memUsedBytes: 0,
    memTotalBytes: os.totalmem(),
    memAppUsedBytes: 0,
    memProcUsedBytes: process.memoryUsage().rss,
    cpuAppPercentage: 0,
  }

  try {
    // MEMORY: support both cgroup v1 and cgroup v2
    if (data.container) {
      const memoryFiles = [
        {
          usage: '/sys/fs/cgroup/memory.current',
          limit: '/sys/fs/cgroup/memory.max',
        },
        {
          usage: '/sys/fs/cgroup/memory/memory.usage_in_bytes',
          limit: '/sys/fs/cgroup/memory/memory.limit_in_bytes',
        },
      ]

      for (const files of memoryFiles) {
        if (fs.existsSync(files.usage) && fs.existsSync(files.limit)) {
          const usage = fs.readFileSync(files.usage, 'utf8').trim()
          const limit = fs.readFileSync(files.limit, 'utf8').trim()

          data.memUsedBytes = parseInt(usage, 10)

          // cgroup v2 uses "max" when no memory limit is configured
          data.memTotalBytes =
            limit === 'max' || parseInt(limit, 10) > 90000000000000
              ? os.totalmem()
              : parseInt(limit, 10)

          break
        }
      }
    } else {
      data.memUsedBytes = os.totalmem() - os.freemem()
    }

    // CPU usage over a one-second interval
    const startUsage = process.cpuUsage()
    const D_TIME = 1000

    await new Promise((resolve) => setTimeout(resolve, D_TIME))

    const cpuResult = process.cpuUsage(startUsage)
    data.cpuAppPercentage = (cpuResult.user / 1000 / D_TIME) * 100

    return res.status(200).send(data)
  } catch (e) {
    console.error('Monitoring API error:', e)
    return res.status(500).send({
      error: true,
      title: 'Monitoring API error',
      message: e.toString(),
    })
  }
})

export default router
