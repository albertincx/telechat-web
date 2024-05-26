const request = new XMLHttpRequest()
const appUrl = 'https://cafechat.app/assets/'
const srcPost = '?&v=' + (new Date()).getTime()
request.open('GET', appUrl + 'index.html' + srcPost, true)
request.onload = function () {
  if (request.status >= 200 && request.status < 400) {
    let tag
    const resp = request.responseText
    const ch = document.createElement('div')
    ch.setAttribute('id', 'apppopupmax')
    document.body.appendChild(ch)
    const srcs = resp.match(/src="(.*?)"|href="(.*?)"/g)
    let cssFound = ''
    for (let i = 0; i < srcs.length; i++) {
      let src = srcs[i].replace(/src=|href=/, '').replace(/"/g, '')
      const isJs = /.js/.test(src)
      if (src[0] === '/') src = appUrl + src
      if (!src) continue
      if (isJs) {
        tag = document.createElement('script')
        tag.src = src + srcPost
        document.getElementsByTagName('head')[0].appendChild(tag)
      }
    }
    if (cssFound) {
      cssFound = appUrl + cssFound
      tag = document.createElement('link')
      tag.href = cssFound + srcPost
      tag.rel = 'stylesheet'
      document.getElementsByTagName('head')[0].appendChild(tag)
    }
  }
}
request.send()
