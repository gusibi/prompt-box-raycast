/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** API Key - API Key obtained from the web interface */
  "apiKey": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `search-prompts` command */
  export type SearchPrompts = ExtensionPreferences & {}
  /** Preferences accessible in the `add-prompt` command */
  export type AddPrompt = ExtensionPreferences & {}
  /** Preferences accessible in the `sync-prompts` command */
  export type SyncPrompts = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `search-prompts` command */
  export type SearchPrompts = {}
  /** Arguments passed to the `add-prompt` command */
  export type AddPrompt = {}
  /** Arguments passed to the `sync-prompts` command */
  export type SyncPrompts = {}
}

