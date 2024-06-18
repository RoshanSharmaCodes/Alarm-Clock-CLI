const readline = require("readline")
const moment = require("moment")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

class Alarm {
  constructor(time, day) {
    this.time = time
    this.day = day
    this.snoozeCount = 0
  }

  snooze() {
    if (this.snoozeCount < 3) {
      this.time = moment(this.time, "HH:mm").add(5, "minutes").format("HH:mm")
      this.snoozeCount++
      console.log(`Alarm snoozed. New time: ${this.time}`)
      return true
    } else {
      console.log("Maximum snoozes reached.")
      return false
    }
  }
}

class AlarmClock {
  constructor() {
    this.alarms = []
  }

  addAlarm(time, day) {
    const alarm = new Alarm(time, day)
    this.alarms.push(alarm)
    console.log(`Alarm set for ${day} at ${time}`)
    rl.question("Do you want to repeat Menu? 'yes' Or 'no'", (input) => {
      if (input == "yes") {
        this.mainMenu()
      }
    })
  }

  deleteAlarm(time, day) {
    const index = this.alarms.findIndex((alarm) => alarm.time === time && alarm.day.toLowerCase() === day.toLowerCase())
    if (index !== -1) {
      this.alarms.splice(index, 1)
      console.log(`Alarm for ${time} on ${day} deleted.`)
    } else {
      console.log("Alarm not found.")
    }
    this.mainMenu()
  }

  checkAlarms() {
    const now = moment()
    this.alarms.forEach((alarm) => {
      if (alarm.day.toLowerCase() === now.format("dddd").toLowerCase() && alarm.time === now.format("HH:mm")) {
        console.log(`Alarm ringing for ${alarm.day} at ${alarm.time}`)
        this.handleAlarm(alarm)
      }
    })
  }

  handleAlarm(alarm) {
    rl.question(`Want to "cancel" or "snooze"? `, (input) => {
      switch (input) {
        case "snooze":
          if (alarm.snooze()) {
            setTimeout(() => {
              console.log("Alarm Ringing Again")
              this.handleAlarm(alarm)
            }, 60 * 1000)
          } else {
            console.log("Cannot snooze anymore. Alarm will be cancelled.")
            this.mainMenu()
          }
          break
        case "cancel":
          console.log("Alarm cancelled.")
          this.mainMenu()
          break
        default:
          console.log("Invalid option. Alarm cancelled.")
          this.mainMenu()
      }
    })
  }

  displayTime() {
    console.log(`Current time: ${moment().format("HH:mm:ss")}`)
    this.mainMenu()
  }

  showAlarms() {
    if (this.alarms.length > 0) {
      this.alarms.forEach((alarm) => {
        console.log(`Alarm: ${alarm.time} ${alarm.day}`)
      })
    } else {
      console.log("No Alarms found")
    }
    this.mainMenu()
  }

  mainMenu() {
    displayMenu()
    rl.question("Choose an option: ", (option) => {
      switch (option) {
        case "1":
          this.displayTime()
          break
        case "2":
          var repeat = true
          rl.question("Enter alarm time (HH:mm): ", (time) => {
            rl.question("Enter day of the week: ", (day) => {
              this.addAlarm(time, day)
            })
          })

          break
        case "3":
          rl.question("Enter the time (HH:MM) in 24H Format: ", (time) => {
            rl.question(`Enter the day:`, (day) => {
              this.deleteAlarm(time, day)
            })
          })
          break
        case "4":
          console.log("All the active alarms:")
          this.showAlarms()
          break
        case "5":
          rl.close()
          process.exit(0)
          break
        default:
          console.log("Invalid option.")
          this.mainMenu()
      }
    })
  }
}

const alarmClock = new AlarmClock()

const displayMenu = () => {
  console.log(`
1. Display current time
2. Add an alarm
3. Delete an alarm
4. Show Alarms
5. Exit
`)
}

alarmClock.mainMenu()

setInterval(() => {
  alarmClock.checkAlarms()
}, 60000)
