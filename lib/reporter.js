import events from 'events'

/**
 * Initialize a new `Concise` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class ConciseReporter extends events.EventEmitter {
  constructor (baseReporter, config, options = {}) {
    super()

    this.baseReporter = baseReporter
    this.config = config
    this.options = options

    const { epilogue } = this.baseReporter

    this.on('end', () => {
      for (let cid of Object.keys(this.baseReporter.stats.runners)) {
        const runnerInfo = this.baseReporter.stats.runners[cid]
        const start = this.baseReporter.stats.start
        const end = this.baseReporter.stats.end
        const json = this.prepareJson(start, end, runnerInfo)
        console.log('\x1b[33m', '========= Your concise report ==========', '\x1b[0m')
        console.log(this.prepareConsole(json))
      }
      epilogue.call(baseReporter)
    })
  }

  prepareConsole(jsonReport) {
    const version = jsonReport.capabilities.version || jsonReport.capabilities.browser_version
    const platform = jsonReport.capabilities.platform || `${jsonReport.capabilities.os}:${jsonReport.capabilities.os_version || 'latest'}`
    const resolution = jsonReport.capabilities.screenResolution || jsonReport.capabilities.resolution

    let mainMessage = ` ${jsonReport.capabilities.browserName || jsonReport.capabilities.deviceName}`

    if (version) {
      mainMessage += `:${version}`
    }

    if (platform) {
      mainMessage += `::${platform}`
    }

    if (jsonReport.capabilities.platformName) {
      mainMessage += `::${jsonReport.capabilities.platformName}:${jsonReport.capabilities.platformVersion}`
    }

    if (resolution) {
      mainMessage += `::${resolution}`
    }

    mainMessage += `\n`

    /**
     * in case the runner didn't even started and no event was catched
     */
    if (!jsonReport.state) {
      jsonReport.state = { failed: 1 }
      jsonReport.fails = [{
        suiteName: 'Launcher',
        name: `failed to spawn ${jsonReport.capabilities.browserName}`
      }]
    }

    if (jsonReport.state && jsonReport.state.failed === 0) {
      mainMessage += ' \x1b[32mAll went well !!\x1b[0m'
    } else {
      mainMessage += ` Test${jsonReport.state.failed > 1 ? 's' : ''} failed (${jsonReport.state.failed}): \n`

      jsonReport.fails.forEach(test => {
        mainMessage += `  Fail : \x1b[31m${test.suiteName} => ${test.name}\x1b[0m`

        if (test.errorType && test.error) {
          mainMessage += `\n     ${test.errorType} : \x1b[33m${test.error}\x1b[0m\n`
        }
      })
    }

    return mainMessage
  }

  prepareJson (start, end, runnerInfo) {
    var resultSet = {}
    var skippedCount = 0
    var passedCount = 0
    var failedCount = 0
    resultSet.start = start
    resultSet.end = end
    resultSet.capabilities = runnerInfo.capabilities
    resultSet.baseUrl = runnerInfo.config.baseUrl
    resultSet.suites = []
    resultSet.fails = []

    for (let specId of Object.keys(runnerInfo.specs)) {
      const spec = runnerInfo.specs[specId]

      for (let suiteName of Object.keys(spec.suites)) {
        const suite = spec.suites[suiteName]

        for (let testName of Object.keys(suite.tests)) {
          const test = suite.tests[testName]
          const testCase = {}

          testCase.name = testName
          testCase.start = suite.tests[testName].start
          testCase.end = suite.tests[testName].end
          testCase.duration = suite.tests[testName].duration

          if (test.state === 'pending') {
            skippedCount = skippedCount + 1
            testCase.state = 'skipped'
          } else if (test.state === 'pass') {
            passedCount = passedCount + 1
            testCase.state = test.state
          } else if (test.state === 'fail') {
            testCase.suiteName = suiteName
            failedCount = failedCount + 1
            testCase.state = test.state
            testCase.error = test.error.message
            testCase.errorType = test.error.type;
            resultSet.fails.push(testCase)
          }
          resultSet.state = {}
          resultSet.state.passed = passedCount
          resultSet.state.failed = failedCount
          resultSet.state.skipped = skippedCount
        }
      }
      return resultSet
    }
  }
}

ConciseReporter.reporterName = 'Concise'

export default ConciseReporter
