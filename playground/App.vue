<template>
  <div class="page">
    <h1>vue3-compare-json</h1>

    <section>
      <h2>Basic usage</h2>
      <VueJsonCompare :old-data="oldData" :new-data="newData" />
    </section>

    <section>
      <h2>Dark theme (forced)</h2>
      <VueJsonCompare
        :old-data="oldData"
        :new-data="newData"
        theme="dark"
      />
    </section>

    <section>
      <h2>No header, no line numbers</h2>
      <VueJsonCompare
        :old-data="oldData"
        :new-data="newData"
        :show-header="false"
        :show-line-numbers="false"
      />
    </section>

    <section>
      <h2>Equal objects</h2>
      <VueJsonCompare :old-data="oldData" :new-data="oldData" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { VueJsonCompare, type JsonValue } from '../src'

const oldData: JsonValue = {
  user: {
    id: 42,
    name: 'Lex',
    roles: ['admin', 'editor'],
    profile: {
      country: 'RU',
      verified: false,
    },
  },
  active: true,
  notes: null,
  tags: ['vue', 'json'],
}

const newData: JsonValue = {
  user: {
    id: 42,
    name: 'Aleksey',
    roles: ['admin', 'owner'],
    profile: {
      country: 'RU',
      verified: true,
      lastLogin: '2026-05-19T10:00:00Z',
    },
  },
  active: true,
  tags: ['vue', 'json', 'diff'],
}
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
  background: #fafbfc;
  color: #1f2328;
}
.page {
  max-width: 880px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}
.page h1 {
  margin: 0 0 24px;
}
.page section {
  margin-bottom: 32px;
}
.page h2 {
  font-size: 16px;
  margin: 0 0 12px;
  color: #57606a;
}
</style>
