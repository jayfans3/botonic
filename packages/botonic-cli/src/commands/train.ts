import { Command, flags } from '@oclif/command'
import colors from 'colors'
import { existsSync } from 'fs'
import { join } from 'path'

import { Telemetry } from '../analytics/telemetry'
import { BOTONIC_NPM_NAMESPACE, BOTONIC_PROJECT_PATH } from '../constants'
import { spawnNpmScript } from '../util/system'

class Task {
  constructor(readonly name: string) {}

  run(): void {
    if (this.isTaskPluginInstalled()) {
      spawnNpmScript(`train:${this.name}`, () => `Finished training `)
    } else {
      this.logTaskPluginNotInstalled()
    }
  }

  private isTaskPluginInstalled(): boolean {
    const path = join(
      BOTONIC_PROJECT_PATH,
      'node_modules',
      BOTONIC_NPM_NAMESPACE,
      `plugin-${this.name}`
    )
    return existsSync(path)
  }

  private logTaskPluginNotInstalled(): void {
    console.log(
      colors.red(
        `Training process has been stopped because you don't have @botonic/plugin-${this.name} installed.\nPlease, install it with the following command:`
      )
    )
    console.log(colors.bold(`$ npm install @botonic/plugin-${this.name}`))
  }
}

export class Tasks {
  static tasks = {
    ner: new Task('ner'),
    'text-classification': new Task('text-classification'),
  }

  static getAll(): Task[] {
    return Object.values(this.tasks)
  }

  static getByName(taskName: string): Task {
    if (!this.isValidTask(taskName)) {
      throw new Error(
        `Unsupported task '${taskName}'. Available tasks: '${Object.keys(
          this.tasks
        ).join("', '")}'.`
      )
    }
    return this.tasks[taskName]
  }

  private static isValidTask(taskName: string): boolean {
    return Object.keys(this.tasks).includes(taskName)
  }
}

export default class Run extends Command {
  static description = 'Train your bot with NLP'

  static examples = [
    `$ botonic train [--task=<${Object.keys(Tasks.tasks).join('|')}>]
    TRAINING MODEL...
    `,
  ]

  static flags = {
    task: flags.string(),
  }

  static args = []

  private telemetry = new Telemetry()

  async run(): Promise<void> {
    try {
      this.telemetry.trackTrain()
      const { flags } = this.parse(Run)
      const tasks = flags.task ? [Tasks.getByName(flags.task)] : Tasks.getAll()
      tasks.forEach(task => task.run())
    } catch (e) {
      console.error(e)
    }
  }
}
