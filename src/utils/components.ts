import { Component, ComponentAttr, ComponentAttrValue, LanguageConfig } from '../types/index'

export const components: Component[] = require('../../res/components.json')

export function getComponent(tagName: string, lc: LanguageConfig) {
  const comp = [...lc.components, ...components].find((c) => c.name === tagName)
  return comp
}

export function getComponentMarkdown(c: Component) {
  const rows: string[] = c.desc ? [...c.desc] : [c.name]

  if (c.since) rows.push(since(c.since))
  if (c.authorize) rows.push(field('需要授权', link(c.authorize.name, c.authorize.link)))

  rows.push(...list('Bug', c.bugs))
  rows.push(...list('Tip', c.tips))
  rows.push(...list('Note', c.notices))

  if (c.relateApis) {
    rows.push(
      ...list(
        '相关接口',
        c.relateApis.map((l) => link(l.name, l.link))
      )
    )
  }
  if (c.docLink) rows.push(link('官方文档', c.docLink))

  return rows.join('\n\n')
}

export function getComponentAttrMarkdown(a: ComponentAttr) {
  const rows = a.desc ? [a.desc] : [a.name]
  if (a.type) rows.push(field('类型', a.type.name))
  if (a.since) rows.push(since(a.since))
  if (a.enum) rows.push(...list('可选值', a.enum.map(_formatAttrValue)))
  if (a.subAttrs && !a.enum) {
    rows.push(
      ...list(
        '可选值',
        a.subAttrs.map((s) => _formatAttrValue({ value: s.equal }))
      )
    )
  }
  if (a.extras)
    rows.push(...a.extras.filter((e) => e.key && e.value).map((e) => field(e.key, e.value)))

  return rows.join('\n\n')
}

export function getComponentAttrValueMarkdown(v: ComponentAttrValue) {
  const rows = [v.desc || v.value]
  if (v.since) rows.push(since(v.since))
  return rows.join('\n\n')
}

function list(title: string, items?: string[]) {
  if (!items || !items.length) return []
  if (items.length === 1) return [field(title, items[0])]
  return [field(title, items.map((it) => `\n* ${it}`).join(''))]
}

function since(val: string) {
  return field(
    'Since',
    link(val, 'https://mp.weixin.qq.com/debug/wxadoc/dev/framework/compatibility.html')
  )
}

function link(name: string, url: string) {
  return `[${name}](${url})`
}

function field(title: string, value: string) {
  return `**${title}:** ${value}`
}

function _formatAttrValue(av: { value: string; desc?: string; since?: string }) {
  const rows = [av.value]
  if (av.desc) rows.push(`**${av.desc}**`)
  if (av.since) rows.push(since(av.since))
  if (rows.length > 1) rows[0] += ':'
  return rows.join(' ')
}
