---
# try also 'default' to start simple
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
title: Intro

layout: main

class: bg-zinc-900 h-full text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
# duration of the presentation
duration: 35min
---

<div class="mt-10">
  <h4 class="font-semibold">Introduction</h4>
  <h1 class="mt-2"><strong>0xNext</strong>: Building the Open-Source <br/> Layer for Web3 Liquidity</h1>
  <button @click="$nav.nextSlide" class="btn-primary">next</button>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---

## transition: fade-out

# **0xList/core**

<div class="grid grid-cols-3 gap-4">

  <div>
    <h3>1. Start-up</h3>
    <p>Loads, parses and validates the configuration from specified file ( defaults to 0xlist.config.* ).</p>
  </div>

  <div>
    <h3>2. Setup</h3>
    <p>Verifies the integrity of the provided plugins and ensures that you have installed the bare minimum you need.</p>
  </div>

  <div>
    <h3>3. Runtime</h3>
    <p>Runs the lifecycle of plugins</p>
  </div>

</div>

```mermaid {theme: 'neutral', scale: 0.6}
flowchart >
    input["Input (Config)"]
    setup[Setup]

    runtime[Runtime]

    loadExternal[External]
    loadOwned[Owned]

    lifecycle["Lifecycle"]


    lifecycle0["Setup"]
    lifecycle1["load"]
    lifecycle2["Transformer"]
    lifecycle3["Output"]

    version[Bump]
    manifest[Manifest]

    input --> setup --> runtime --> lifecycle --> lifecycle0
                                    lifecycle --> lifecycle1 --> loadOwned
                                                  lifecycle1 --> loadExternal
                                    lifecycle --> lifecycle2
                                    lifecycle --> lifecycle3
                        runtime --> version
                        runtime --> manifest
```
